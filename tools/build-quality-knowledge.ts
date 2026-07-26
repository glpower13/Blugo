/**
 * Erzeugt `src/modules/content/quality/wissen.generated.ts` — das, wogegen ein
 * frisch erzeugter Satz zur LAUFZEIT geprüft wird.
 *
 * Zwei Dinge stehen darin, beide aus dem GEPRÜFTEN Bestand gewonnen:
 *   1. Jedes schwedische Wort, das im Inhalt vorkommt (also die Wörter, die
 *      `check-swedish.py` gegen Wörterbuch und Korpus hat durchgehen lassen).
 *   2. Für jedes einzelne Wort die deutschen Glossen, die dort dafür stehen.
 *
 * WOZU: Ein KI-erzeugter Satz kann damit im Browser gegen denselben Maßstab
 * geprüft werden wie der handgeschriebene — ohne Netz, ohne Wörterbuch-Download.
 * Was er NICHT kann: neue, korrekte Wörter bestätigen. Genau das sagt die App
 * dann auch, statt es zu verschweigen.
 */

import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { seedChunks, seedSegments } from '../src/modules/content/seedSegments';
import { seedDialogs } from '../src/modules/content/seedDialogs';
import { woerter } from '../src/modules/content/quality/checks';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'src/modules/content/quality/wissen.generated.ts');

export interface Wissen {
  woerter: string[];
  glossen: Record<string, string[]>;
}

export function sammleWissen(): Wissen {
  const alleWoerter = new Set<string>();
  const glossen = new Map<string, Set<string>>();

  const satz = (sv: string) => woerter(sv).forEach((w) => alleWoerter.add(w));
  const gloss = (d: { sv: string; de: string }[] | undefined) => {
    for (const t of d ?? []) {
      woerter(t.sv).forEach((w) => alleWoerter.add(w));
      const w = woerter(t.sv);
      if (w.length !== 1) continue; // Mehrwort-Glossen sind feste Formeln
      const key = w[0];
      if (!glossen.has(key)) glossen.set(key, new Set());
      glossen.get(key)!.add(t.de.trim().toLowerCase());
    }
  };

  for (const c of seedChunks) {
    satz(c.sv);
    gloss(c.decoding);
  }
  for (const s of seedSegments) {
    satz(s.sv);
    gloss(s.decoding);
  }
  for (const d of seedDialogs) {
    for (const t of d.turns) {
      satz(t.sv);
      gloss(t.decoding);
    }
  }

  return {
    woerter: [...alleWoerter].sort(),
    glossen: Object.fromEntries(
      [...glossen.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => [k, [...v].sort()]),
    ),
  };
}

function datei(w: Wissen): string {
  return `// ERZEUGT von tools/build-quality-knowledge.ts — nicht von Hand ändern.
//
// Der geprüfte Bestand als Nachschlagewerk für die LAUFZEIT-Prüfung erzeugter
// Sätze: jedes vorkommende schwedische Wort und die deutschen Glossen, die im
// Inhalt dafür stehen. Neu erzeugen mit: npm run build:wissen

/** Jedes schwedische Wort, das im geprüften Inhalt vorkommt. */
export const BEKANNTE_WOERTER: readonly string[] = ${JSON.stringify(w.woerter)};

/** Wort → die deutschen Glossen, die der geprüfte Inhalt dafür verwendet. */
export const BEKANNTE_GLOSSEN: Readonly<Record<string, readonly string[]>> = ${JSON.stringify(w.glossen)};

export const WISSEN_META = {
  woerter: ${w.woerter.length},
  glossierteWoerter: ${Object.keys(w.glossen).length},
} as const;
`;
}

export function main(): number {
  const w = sammleWissen();
  writeFileSync(OUT, datei(w), 'utf-8');
  console.log(
    `  Wissen geschrieben: ${w.woerter.length} Wörter · ${Object.keys(w.glossen).length} mit Glosse`,
  );
  return 0;
}
