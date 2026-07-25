// Zielwendungen und Abgleich für den Sparringspartner (P4,
// `docs/gremium-sprachpartner.md` §9). Reine Funktionen — hier liegt die
// Ehrlichkeit des ganzen Modus, deshalb ist sie ohne Browser prüfbar.
//
// DIE ENTSCHEIDENDE REGEL — NACHPLAPPERN ZÄHLT NICHT:
// Wenn der Partner „tack så mycket" gerade selbst gesagt hat und der Lerner es
// wiederholt, war das kein Abruf aus dem Gedächtnis, sondern ein Echo. Der Prompt
// verbietet dem Partner zwar, Zielwendungen auszusprechen, aber ein Modell hält
// sich nicht immer daran — und eine Messung, die sich auf ein Versprechen
// verlässt, ist keine Messung. Deshalb wird hier zusätzlich HART gefiltert.

import type { Chunk, ChunkState } from '../../domain/chunk';
import type { KnownPhrase } from '../content/ports';
import { levenshtein } from '../comprehension/answerCheck';

/** Vergleichsform: klein, ohne Satzzeichen, einfache Leerzeichen. Rein. */
export function normalizePhrase(s: string): string {
  return s
    .toLowerCase()
    .replace(/[.,!?;:"„“”()[\]…]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Steht `phrase` als zusammenhängende Wortfolge in `text`? Rein.
 * Wortgrenzen zählen: „ha" darf nicht in „hallå" treffen.
 */
export function containsPhrase(text: string, phrase: string): boolean {
  const t = normalizePhrase(text);
  const p = normalizePhrase(phrase);
  if (!p) return false;
  return ` ${t} `.includes(` ${p} `);
}

/**
 * Welche Zielwendungen hat der Lerner WIRKLICH selbst produziert? Rein.
 *
 * `partnerLine` ist die letzte Zeile des Partners. Alles, was dort schon stand,
 * fällt heraus — siehe die Regel oben. Lieber eine echte Leistung übersehen als
 * eine erfundene zählen (die eine Design-Regel).
 */
export function matchedTargets(
  utterance: string,
  targets: KnownPhrase[],
  partnerLine = '',
): KnownPhrase[] {
  return targets.filter(
    (t) => containsPhrase(utterance, t.sv) && !containsPhrase(partnerLine, t.sv),
  );
}

/**
 * Welche Wendungen soll der Partner heute hervorlocken? Rein.
 *
 * Auswahl: fällige Wendungen, die der Lerner schon einmal begegnet ist —
 * Sprechen ist ein ABRUF, kein Erstkontakt. Eine nie gesehene Wendung im Gespräch
 * zu verlangen wäre die Klippe, gegen die dieses Projekt gebaut ist.
 * Produktions-Stufe zuerst, dann die am längsten überfälligen.
 */
export function pickTargets(
  chunks: Chunk[],
  states: Record<string, ChunkState>,
  now: number,
  max = 4,
): Chunk[] {
  const seen = (s: ChunkState | undefined): boolean =>
    !!s && (s.history.length > 0 || s.status !== 'new');
  return chunks
    .filter((c) => {
      const s = states[c.id];
      return seen(s) && s!.dueAt <= now;
    })
    .sort((a, b) => {
      const sa = states[a.id]!;
      const sb = states[b.id]!;
      const stage = Number(sb.stage === 'production') - Number(sa.stage === 'production');
      return stage !== 0 ? stage : sa.dueAt - sb.dueAt;
    })
    .slice(0, max);
}

// --- Fast-Treffer ---------------------------------------------------------------
//
// WARUM ES DAS GIBT: Wer „jag skulle vilja har" sagt statt „…vilja ha", hat die
// Wendung erkennbar abgerufen und nur die Endung verfehlt. Bisher passierte in
// diesem Fall NICHTS — und keine Rückmeldung ist die schlechteste Rückmeldung.
//
// WARUM ES TROTZDEM NICHT ZÄHLT: „fast" ist nicht „gesagt". Der Fast-Treffer ist
// ein Hinweis an den Menschen, kein Eintrag in der Messung. Diese Trennung ist
// der ganze Punkt (die eine Design-Regel).

/** Ab welcher Abweichung es kein Fast-Treffer mehr ist (Zeichen). */
const NEAR_MAX_EDITS = 2;

export interface NearMiss {
  target: KnownPhrase;
  /** Das Stück der Äußerung, das gemeint war. */
  said: string;
}

/**
 * Wortweise über die Äußerung schieben und das ähnlichste Stück je Ziel suchen.
 * Rein. Liefert nur Ziele, die NICHT schon exakt getroffen wurden.
 */
export function nearMisses(utterance: string, targets: KnownPhrase[]): NearMiss[] {
  const words = normalizePhrase(utterance).split(' ').filter(Boolean);
  const out: NearMiss[] = [];
  for (const t of targets) {
    if (containsPhrase(utterance, t.sv)) continue; // schon echt getroffen
    const p = normalizePhrase(t.sv);
    if (!p) continue;
    const n = p.split(' ').length;
    let best: { said: string; dist: number } | null = null;
    // Auch ein Wort mehr oder weniger darf als Fenster gelten — genau dort
    // liegen die typischen Fehler (ein Wort vergessen, eins zu viel).
    for (const size of [n - 1, n, n + 1]) {
      if (size < 1) continue;
      for (let i = 0; i + size <= words.length; i++) {
        const said = words.slice(i, i + size).join(' ');
        const dist = levenshtein(said, p);
        if (!best || dist < best.dist) best = { said, dist };
      }
    }
    if (best && best.dist > 0 && best.dist <= NEAR_MAX_EDITS) {
      out.push({ target: t, said: best.said });
    }
  }
  return out;
}
