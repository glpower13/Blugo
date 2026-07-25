// Stufe 4 der Prüfkette: der PRÜF-STAND JE WENDUNG (docs/gremium-content-pruefung.md).
//
// Die Stufen 1–3 prüfen den Inhalt und schreiben Berichte für Menschen. Was
// bisher fehlte: dass die App dem Lerner sagen kann, wie geprüft die Wendung
// ist, die gerade vor ihm steht. Genau das erzeugt diese Datei.
//
// DREI STUFEN, KEINE VIERTE:
//   'native'    — von einer schwedischsprachigen Person gegengelesen.
//                 Vergibt dieses Werkzeug NIE. Es gibt heute keine einzige.
//   'machine'   — jedes Wort ist echtes Schwedisch (Wörterbuch + Korpus-
//                 häufigkeit).
//   'unchecked' — mindestens ein Wort ist selten oder unbelegt.
//
// WAS 'machine' NICHT HEISST: dass der Satz richtig ist. Wortstellung,
// Idiomatik und Register prüft keine dieser Stufen. Jede Anzeige in der App
// muss innerhalb dieser Grenze bleiben — sonst behauptet ein Indikator mehr,
// als er misst (die eine Design-Regel).
//
// Erzeugt aus demselben Lauf wie die Berichte: `npm run verify:build`.

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { seedChunks } from '../src/modules/content/seedSegments';
import { tokens } from './backtranslation';

const ROOT = resolve(import.meta.dirname ?? '.', '..');
const FLAGGED = resolve(ROOT, 'tools/flagged-words.json');
const OUT = resolve(ROOT, 'src/modules/content/verification.generated.ts');

interface FlaggedFile {
  dictionaryEntries: number;
  wordsChecked: number;
  stringsChecked: number;
  flagged: Record<string, { verdict: string; zipf: number; inDict: boolean }>;
}

function readFlagged(): FlaggedFile {
  try {
    return JSON.parse(readFileSync(FLAGGED, 'utf8')) as FlaggedFile;
  } catch {
    throw new Error(
      `Fehlt: ${FLAGGED}. Erst \`npm run check:content\` laufen lassen — die Prüfdaten ` +
        'entstehen dort, damit Bericht und App-Stand nie auseinanderlaufen können.',
    );
  }
}

export interface BuildResult {
  levels: Record<string, 'machine' | 'unchecked'>;
  reasons: Record<string, string>;
  meta: { machine: number; unchecked: number; dictionaryEntries: number };
}

/** Rechnet den Prüf-Stand je Chunk aus (rein, testbar). */
export function buildLevels(flagged: FlaggedFile): BuildResult {
  const flaggedWords = new Set(Object.keys(flagged.flagged));

  // BEWUSST NICHT als Kriterium: uneinheitliche Wort-für-Wort-Glossen. Ein
  // erster Entwurf zählte sie mit und stufte 128 von 149 Wendungen als
  // ungeprüft ein — obwohl der Inhalt gesund ist. Dasselbe schwedische Wort
  // hat je nach Satz eine andere wörtliche Entsprechung; genau das ist
  // Kontextvariation, kein Fehler. Ein Prüfwerkzeug, das bei gesundem Inhalt
  // Alarm schlägt, wird abgeschaltet — und dann prüft gar nichts mehr.
  const levels: Record<string, 'machine' | 'unchecked'> = {};
  const reasons: Record<string, string> = {};
  for (const c of seedChunks) {
    const bad = tokens(c.sv).filter((w) => flaggedWords.has(w));
    if (bad.length > 0) {
      levels[c.id] = 'unchecked';
      reasons[c.id] = `selten belegt: ${bad.join(', ')}`;
    } else {
      levels[c.id] = 'machine';
    }
  }
  const unchecked = Object.values(levels).filter((v) => v === 'unchecked').length;
  return {
    levels,
    reasons,
    meta: {
      machine: Object.keys(levels).length - unchecked,
      unchecked,
      dictionaryEntries: flagged.dictionaryEntries,
    },
  };
}

function render(r: BuildResult): string {
  const entries = Object.keys(r.levels)
    .sort()
    .map((id) => `  '${id}': '${r.levels[id]}',`)
    .join('\n');
  const reasons = Object.keys(r.reasons)
    .sort()
    .map((id) => `  '${id}': ${JSON.stringify(r.reasons[id])},`)
    .join('\n');
  return `// ERZEUGT — nicht von Hand ändern. Quelle: \`npm run verify:build\`
// (tools/build-verification.ts, gespeist aus tools/check-swedish.py).
// Ändert sich der Inhalt, muss diese Datei neu erzeugt werden; ein Test in
// seedContent.test.ts schlägt sonst fehl.
//
// 'machine'   = jedes Wort der Wendung ist belegtes Schwedisch (Wörterbuch +
//               Korpushäufigkeit). NICHT geprüft: Wortstellung, Idiomatik,
//               Register — dafür braucht es einen Menschen.
// 'unchecked' = mindestens ein Wort ist selten oder unbelegt.
// 'native'    = kommt hier nie vor. Es gibt bislang keine muttersprachliche
//               Gegenlesung — das zu behaupten wäre die Lüge, gegen die dieses
//               Projekt gebaut ist.

export type VerificationLevel = 'native' | 'machine' | 'unchecked';

export const VERIFICATION_META = {
  machine: ${r.meta.machine},
  unchecked: ${r.meta.unchecked},
  native: 0,
  dictionaryEntries: ${r.meta.dictionaryEntries},
} as const;

export const VERIFICATION: Record<string, VerificationLevel> = {
${entries}
};

/** Warum eine Wendung als ungeprüft geführt wird (nur für die auffälligen). */
export const VERIFICATION_REASON: Record<string, string> = {
${reasons}
};
`;
}

const result = buildLevels(readFlagged());
writeFileSync(OUT, render(result), 'utf8');
console.log(`Prüf-Stand geschrieben: src/modules/content/verification.generated.ts`);
console.log(
  `  maschinell vorgeprüft ${result.meta.machine} · ungeprüft ${result.meta.unchecked} · muttersprachlich 0`,
);
