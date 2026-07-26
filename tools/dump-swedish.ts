/**
 * Alle schwedischen Zeichenketten des Inhalts als JSON — Futter für
 * `check-swedish.py`.
 *
 * WARUM ES DIESE DATEI GIBT (Befund 2026-07-26): Der Wortprüfer las den
 * QUELLTEXT mit dem Suchmuster `sv: '…'`. Neue Inhaltsdateien, die ihre Chunks
 * über eine Hilfsfunktion bauen — `c('c-ap-gate', 'cat-airport', 'vilken gate
 * är det?', …)` — haben kein `sv:` im Text. Ihre Sätze liefen damit still an
 * der Prüfung vorbei, und der Bericht meldete trotzdem „unbelegt 0".
 *
 * Eine Prüfung, die je nach SCHREIBWEISE der Datei greift oder nicht, ist keine
 * Prüfung. Deshalb kommt der Text jetzt aus den GELADENEN Daten: Was die App
 * anzeigt, wird geprüft — unabhängig davon, wie es im Quelltext notiert ist.
 */

import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { seedChunks, seedSegments } from '../src/modules/content/seedSegments';
import { seedDialogs } from '../src/modules/content/seedDialogs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'tools/swedish-strings.json');

export type Eintrag = { quelle: string; sv: string };

export function sammle(): Eintrag[] {
  const out: Eintrag[] = [];
  for (const c of seedChunks) {
    out.push({ quelle: `Wendung ${c.id}`, sv: c.sv });
    for (const g of c.decoding) out.push({ quelle: `Wendung ${c.id}`, sv: g.sv });
  }
  for (const s of seedSegments) {
    out.push({ quelle: `Segment ${s.id}`, sv: s.sv });
    for (const g of s.decoding) out.push({ quelle: `Segment ${s.id}`, sv: g.sv });
  }
  for (const d of seedDialogs) {
    for (const t of d.turns) {
      out.push({ quelle: `Gespräch ${d.id}/${t.id}`, sv: t.sv });
      for (const g of t.decoding ?? []) out.push({ quelle: `Gespräch ${d.id}/${t.id}`, sv: g.sv });
      for (const v of t.suggestions ?? []) out.push({ quelle: `Gespräch ${d.id}/${t.id}`, sv: v });
    }
  }
  return out;
}

/**
 * Schreibt die Datei. Bewusst NICHT beim Import ausgeführt — diese Datei ist
 * reine Logik und wird auch vom Test importiert (dieselbe Trennung wie bei
 * `backtranslation.ts`); ausgeführt wird sie über `run-dump-swedish.ts`.
 */
export function main(): number {
  const eintraege = sammle();
  writeFileSync(OUT, JSON.stringify(eintraege, null, 0) + '\n', 'utf-8');
  console.log(`  ${eintraege.length} schwedische Zeichenketten geschrieben`);
  return 0;
}
