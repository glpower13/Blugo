/**
 * Stufe 2 der Prüfkette (docs/gremium-content-pruefung.md): Rückübersetzung.
 *
 * WAS DIESES WERKZEUG BEWEIST
 *   Es baut aus den Birkenbihl-Glossen den Satz auf Deutsch zurück und hält das
 *   Ergebnis gegen die behauptete Bedeutung. Dabei fallen drei Dinge auf, die
 *   eine Häufigkeitsprüfung (Stufe 1) prinzipiell nicht sehen kann:
 *     A  Glossen-Lücken   — ein schwedisches Wort ohne Wort-für-Wort-Entsprechung
 *     B  Kontext-Bruch    — ein Segment behauptet eine Wendung, enthält sie aber nicht
 *     C  Glossen-Konflikt — dasselbe schwedische Wort, verschiedene deutsche Glossen
 *     D  Bedeutungsdrift  — der wörtliche Rückbau liegt weit von der Bedeutung weg
 *
 * WAS ES AUSDRÜCKLICH NICHT BEWEIST
 *   Ob die Übersetzung *richtig* ist. Ein Satz kann in sich vollständig
 *   widerspruchsfrei und trotzdem falsch übersetzt sein. A und B sind harte
 *   Fehler, C und D sind **Verdachtslisten für einen Menschen** — geordnet, nicht
 *   entschieden. Die menschliche Prüfung (Stufe 3) ersetzt das nicht.
 *
 * BENUTZUNG
 *   npm run check:backtranslation      # schreibt docs/content-rueckuebersetzung.md
 *
 * Diese Datei ist reine Logik (auch von `backtranslation.test.ts` importiert);
 * ausgeführt wird sie über `check-backtranslation.ts`.
 */

import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { seedChunks, seedSegments } from '../src/modules/content/seedSegments';
import { seedDialogs } from '../src/modules/content/seedDialogs';

export type Gloss = { sv: string; de: string };
/** Alles, was eine schwedische Zeile mit Bedeutung und Glossen ist. */
export type Line = { where: string; sv: string; de: string; decoding: Gloss[] };

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const REPORT = join(ROOT, 'docs/content-rueckuebersetzung.md');

/** Der Namens-Platzhalter ist kein schwedisches Wort. */
const stripPlaceholder = (s: string) => s.replace(/\{name\}/g, ' ');

export function tokens(s: string): string[] {
  return (stripPlaceholder(s).toLowerCase().match(/\p{L}+/gu) ?? []).filter((t) => t.length > 0);
}

/**
 * Deutsche Füllwörter, die für den Bedeutungs-Vergleich (D) nichts hergeben.
 * Bewusst kurz: nur Artikel/Kopula/Partikeln, keine Inhaltswörter.
 */
const DE_STOP = new Set([
  'der', 'die', 'das', 'den', 'dem', 'des', 'ein', 'eine', 'einen', 'einem', 'einer', 'eines',
  'ist', 'sind', 'bin', 'bist', 'war', 'es', 'ich', 'du', 'sie', 'er', 'wir', 'ihr', 'mir', 'mich',
  'dir', 'dich', 'und', 'oder', 'zu', 'zum', 'zur', 'in', 'im', 'an', 'am', 'auf', 'für', 'mit',
  'von', 'vom', 'bei', 'nicht', 'so', 'da', 'hier', 'wie', 'was', 'wo', 'sich', 'man', 'noch',
]);

/**
 * Zwei deutsche Wörter gelten als „dasselbe", wenn sie sich einen Stamm teilen.
 * Grob, aber nötig: die Glosse steht in einer anderen Beugung als die Bedeutung
 * („befindest" vs. „geht", aber „helfen" vs. „hilfst" soll zählen).
 */
function sameStem(a: string, b: string): boolean {
  if (a === b) return true;
  const n = Math.min(a.length, b.length);
  if (n < 4) return false;
  let shared = 0;
  while (shared < n && a[shared] === b[shared]) shared++;
  return shared >= 4;
}

function overlap(literal: string[], meaning: string[]): number {
  const content = meaning.filter((w) => !DE_STOP.has(w));
  if (content.length === 0) return 1; // rein aus Füllwörtern — nichts zu messen
  const hit = content.filter((w) => literal.some((l) => sameStem(l, w))).length;
  return hit / content.length;
}

/** Alle schwedischen Zeilen des Seeds an einem Ort. */
export function collectLines(): Line[] {
  const out: Line[] = [];
  for (const c of seedChunks) out.push({ where: `Wendung ${c.id}`, ...c });
  for (const s of seedSegments) out.push({ where: `Segment ${s.id}`, ...s });
  for (const d of seedDialogs) {
    for (const t of d.turns) {
      // „du"-Zeilen bleiben aussen vor: sie SIND wörtlich ihr Chunk (per Test in
      // seedContent.test.ts erzwungen), der oben schon geprüft wird — und ihre
      // Dekodierung liegt bewusst am Chunk, nicht an der Zeile.
      if (t.speaker !== 'partner') continue;
      // Fehlt einem Partner-Satz die Dekodierung ganz, ist er kein verständlicher
      // Input mehr — das soll als Lücke auffallen, nicht als Absturz.
      out.push({ where: `Gespräch ${d.id}/${t.id}`, sv: t.sv, de: t.de, decoding: t.decoding ?? [] });
    }
  }
  return out;
}

// ── A: Glossen-Lücken ────────────────────────────────────────────────────────
export type Gap = { where: string; sv: string; missing: string[] };

export function findGaps(lines: Line[]): Gap[] {
  const gaps: Gap[] = [];
  for (const line of lines) {
    const glossed = new Set(line.decoding.flatMap((g) => tokens(g.sv)));
    const missing = [...new Set(tokens(line.sv))].filter((t) => !glossed.has(t));
    if (missing.length) gaps.push({ where: line.where, sv: line.sv, missing });
  }
  return gaps;
}

// ── B: Kontext-Deckung ───────────────────────────────────────────────────────
export type Coverage = { segment: string; chunk: string; sv: string; missing: string[]; score: number };

/**
 * Ein Segment muss seine Wendung nicht wörtlich enthalten — **Kontextvariation
 * ist erwünscht** (Schritt 4 des Loops, `03-method.md`): „jag har ont här" darf
 * im zweiten Kontext als „det gör ont här" auftauchen. Unter dieser Deckung ist
 * die Wendung aber nicht mehr wiederzuerkennen, der Abruf ginge ins Leere.
 */
export const CONTEXT_FLOOR = 0.5;

/**
 * Toleriert schwedische Beugung und Zusammensetzung, damit normale Variation
 * nicht als Fehler gilt: buss/bussen, apotek/apoteket, gott/jättegott.
 * Mindestlänge 4, sonst matchen Kurzwörter versehentlich in längeren Wörtern.
 */
export function looseMatch(a: string, b: string): boolean {
  if (a === b) return true;
  const [short, long] = a.length <= b.length ? [a, b] : [b, a];
  return short.length >= 4 && long.includes(short);
}

export function findContextCoverage(): Coverage[] {
  const byId = new Map(seedChunks.map((c) => [c.id, c]));
  const out: Coverage[] = [];
  for (const s of seedSegments) {
    const inSegment = tokens(s.sv);
    for (const id of s.chunkIds) {
      const chunk = byId.get(id);
      if (!chunk) continue; // Referenz-Integrität prüft bereits seedContent.test.ts
      const want = [...new Set(tokens(chunk.sv))];
      if (!want.length) continue;
      const missing = want.filter((t) => !inSegment.some((h) => looseMatch(t, h)));
      out.push({
        segment: s.id,
        chunk: id,
        sv: s.sv,
        missing,
        score: (want.length - missing.length) / want.length,
      });
    }
  }
  return out.sort((a, b) => a.score - b.score || a.segment.localeCompare(b.segment));
}

/** Harte Funde: die Wendung ist im Segment nicht mehr wiederzuerkennen. */
export const findContextBreaks = (): Coverage[] =>
  findContextCoverage().filter((c) => c.score < CONTEXT_FLOOR);

// ── C: Glossen-Konflikte ─────────────────────────────────────────────────────
export type Conflict = { sv: string; glosses: { de: string; where: string }[] };

/**
 * Wörter, deren Glosse laut `content-review-schwedisch.md` bewusst vom Kontext
 * abhängt. Sie tauchen im Bericht auf, gelten aber nicht als Verdachtsfall.
 */
const KNOWN_CONTEXT_DEPENDENT = new Set(['till', 'om', 'med', 'få', 'tack']);

export function findConflicts(lines: Line[]): Conflict[] {
  // Nur Ein-Wort-Glossen: Mehrwort-Einträge sind feste Formeln („smaklig måltid"),
  // die bewusst als Ganzes übersetzt werden.
  const seen = new Map<string, Map<string, string>>();
  for (const line of lines) {
    for (const g of line.decoding) {
      const sv = tokens(g.sv);
      if (sv.length !== 1) continue;
      const de = g.de.trim().toLowerCase();
      const bucket = seen.get(sv[0]) ?? new Map<string, string>();
      if (!bucket.has(de)) bucket.set(de, line.where);
      seen.set(sv[0], bucket);
    }
  }
  return [...seen.entries()]
    .filter(([, glosses]) => glosses.size > 1)
    .map(([sv, glosses]) => ({
      sv,
      glosses: [...glosses.entries()].map(([de, where]) => ({ de, where })),
    }))
    .sort((a, b) => b.glosses.length - a.glosses.length || a.sv.localeCompare(b.sv));
}

// ── D: Bedeutungsdrift ───────────────────────────────────────────────────────
export type Drift = { where: string; sv: string; literal: string; de: string; score: number };

/** Unter dieser Deckung lohnt sich ein menschlicher Blick. */
export const DRIFT_THRESHOLD = 0.34;

export function findDrift(lines: Line[]): Drift[] {
  return lines
    .map((line) => {
      const literal = line.decoding.map((g) => g.de).join(' ');
      return {
        where: line.where,
        sv: stripPlaceholder(line.sv).replace(/\s+/g, ' ').trim(),
        literal,
        de: stripPlaceholder(line.de).replace(/\s+/g, ' ').trim(),
        score: overlap(tokens(literal), tokens(line.de)),
      };
    })
    .filter((d) => d.score < DRIFT_THRESHOLD)
    .sort((a, b) => a.score - b.score || a.where.localeCompare(b.where));
}

// ── Bericht ──────────────────────────────────────────────────────────────────

function report(lines: Line[]): { text: string; hardFindings: number } {
  const gaps = findGaps(lines);
  const coverage = findContextCoverage();
  const breaks = coverage.filter((c) => c.score < CONTEXT_FLOOR);
  const varied = coverage.filter((c) => c.score >= CONTEXT_FLOOR && c.score < 1);
  const conflicts = findConflicts(lines);
  const drift = findDrift(lines);
  const suspicious = conflicts.filter((c) => !KNOWN_CONTEXT_DEPENDENT.has(c.sv));

  const out: string[] = [];
  const p = (s = '') => out.push(s);

  p('# Prüfbericht — Rückübersetzung (Stufe 2)');
  p();
  p(
    '> **Automatisch erzeugt** von `tools/backtranslation.ts` (`npm run check:backtranslation`). ' +
      'Nicht von Hand ändern — Werkzeug erneut laufen lassen.',
  );
  p();
  p('## Was dieser Bericht beweist — und was nicht');
  p();
  p(
    '**Geprüft:** Der Inhalt ist **in sich widerspruchsfrei** — jedes schwedische Wort hat eine ' +
      'Wort-für-Wort-Glosse, jedes Segment enthält die Wendung, die es zu üben behauptet, und ' +
      'dasselbe Wort wird nicht unbemerkt verschieden übersetzt.',
  );
  p();
  p(
    '**NICHT geprüft:** ob die Übersetzung **richtig** ist. Ein Satz kann vollständig ' +
      'widerspruchsfrei und trotzdem falsch sein. Die Abschnitte C und D sind ' +
      '**Verdachtslisten für einen Menschen** — geordnet, nicht entschieden ' +
      '(`content-review-schwedisch.md`).',
  );
  p();
  p('## Ergebnis');
  p();
  p(`- Geprüfte Zeilen (Wendungen · Segmente · Gesprächszeilen): **${lines.length}**`);
  p(`- ❌ **A** Glossen-Lücken (hart): **${gaps.length}**`);
  p(`- ❌ **B** Kontext-Brüche (hart, Deckung < ${CONTEXT_FLOOR}): **${breaks.length}**`);
  p(`- ℹ️ **B2** starke Kontextvariation (erwünscht): **${varied.length}**`);
  p(`- ⚠️ **C** Glossen-Konflikte: **${conflicts.length}** (davon bekannt kontextabhängig: ${conflicts.length - suspicious.length})`);
  p(`- ⚠️ **D** mögliche Bedeutungsdrift: **${drift.length}** (Deckung < ${DRIFT_THRESHOLD})`);
  p();

  p('## ❌ A — Glossen-Lücken');
  p();
  if (!gaps.length) {
    p('Keine. ✅ Jedes schwedische Wort im Inhalt hat eine Wort-für-Wort-Entsprechung.');
  } else {
    p('Diese Wörter erscheinen dem Lerner ohne Dekodierung — der Encoding-Schritt bricht dort ab.');
    p();
    p('| Wo | Schwedisch | ohne Glosse |');
    p('|---|---|---|');
    for (const g of gaps) p(`| ${g.where} | ${g.sv} | ${g.missing.join(', ')} |`);
  }
  p();

  p('## ❌ B — Kontext-Brüche');
  p();
  if (!breaks.length) {
    p('Keine. ✅ In jedem Segment ist die geübte Wendung wiederzuerkennen.');
  } else {
    p(
      'Das Segment behauptet eine Wendung, von der kaum etwas vorkommt — der Abruf ginge ins Leere. ' +
        'Entweder ist die `chunkIds`-Angabe falsch oder der Satz übt etwas anderes.',
    );
    p();
    p('| Deckung | Segment | behauptete Wendung | fehlende Wörter | Satz |');
    p('|---|---|---|---|---|');
    for (const b of breaks) {
      p(`| ${(b.score * 100).toFixed(0)} % | ${b.segment} | ${b.chunk} | ${b.missing.join(', ')} | ${b.sv} |`);
    }
  }
  p();

  p('## ℹ️ B2 — starke Kontextvariation');
  p();
  p(
    'Hier weicht der zweite Kontext deutlich von der Wendung ab. **Das soll so sein** — ' +
      'Kontextvariation ist Schritt 4 des Loops (`03-method.md`); dieselbe Wendung in anderer ' +
      'Verpackung ist genau der Punkt. Die Liste steht hier nur, damit sichtbar bleibt, wo die ' +
      'Wiedererkennung am dünnsten wird.',
  );
  p();
  if (!varied.length) {
    p('Keine — jedes Segment enthält seine Wendung wörtlich.');
  } else {
    p('| Deckung | Segment | Wendung | fehlt im Satz | Satz |');
    p('|---|---|---|---|---|');
    for (const v of varied) {
      p(`| ${(v.score * 100).toFixed(0)} % | ${v.segment} | ${v.chunk} | ${v.missing.join(', ')} | ${v.sv} |`);
    }
  }
  p();

  p('## ⚠️ C — Glossen-Konflikte');
  p();
  p(
    'Dasselbe schwedische Wort mit verschiedenen deutschen Glossen. **Vieles davon ist richtig** ' +
      '— deutsche Beugung („bist"/„bin") und kontextabhängige Partikeln. Verdächtig ist, wo sich ' +
      'die Bedeutungen wirklich unterscheiden.',
  );
  p();
  if (!conflicts.length) {
    p('Keine. ✅');
  } else {
    p('| Schwedisch | Glossen | bekannt kontextabhängig |');
    p('|---|---|---|');
    for (const c of conflicts) {
      const g = c.glosses.map((x) => `„${x.de}" (${x.where})`).join(' · ');
      p(`| **${c.sv}** | ${g} | ${KNOWN_CONTEXT_DEPENDENT.has(c.sv) ? 'ja' : '—'} |`);
    }
  }
  p();

  p('## ⚠️ D — mögliche Bedeutungsdrift');
  p();
  p(
    'Der wörtliche Rückbau aus den Glossen deckt die behauptete Bedeutung kaum. **Oft völlig in ' +
      'Ordnung** — genau das ist ja der Birkenbihl-Effekt („jag vill ha" = wörtlich „ich will ' +
      'haben", gemeint „ich möchte"). Aber hier würde sich ein echter Übersetzungsfehler ' +
      'verstecken, deshalb steht die Liste vollständig hier, schwächste Deckung zuerst.',
  );
  p();
  if (!drift.length) {
    p('Keine. ✅');
  } else {
    p('| Deckung | Schwedisch | wörtlich zurück | behauptete Bedeutung | Wo |');
    p('|---|---|---|---|---|');
    for (const d of drift) {
      p(`| ${(d.score * 100).toFixed(0)} % | ${d.sv} | ${d.literal} | ${d.de} | ${d.where} |`);
    }
  }
  p();

  return { text: out.join('\n') + '\n', hardFindings: gaps.length + breaks.length };
}

export function main(): number {
  const lines = collectLines();
  const { text, hardFindings } = report(lines);
  writeFileSync(REPORT, text, 'utf-8');
  const drift = findDrift(lines).length;
  const conflicts = findConflicts(lines).length;
  console.log('Bericht geschrieben: docs/content-rueckuebersetzung.md');
  console.log(`  ${lines.length} Zeilen geprüft`);
  console.log(`  hart: ${hardFindings} · Konflikte: ${conflicts} · Drift-Verdacht: ${drift}`);
  return hardFindings ? 1 : 0;
}

