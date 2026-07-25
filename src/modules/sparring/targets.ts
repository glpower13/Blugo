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
