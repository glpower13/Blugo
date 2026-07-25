// Prüft die Birkenbihl-Dekodierung auf VOLLSTÄNDIGKEIT.
//
// Die Dekodierung wird als interlineare Zeile gerendert: ein schwedisches Wort,
// darunter seine wörtliche Bedeutung, in der Reihenfolge des Satzes. Fehlt ein
// Wort, verschiebt sich die Zuordnung und der Lerner ordnet die deutsche
// Bedeutung dem falschen schwedischen Wort zu — genau das, was das Dekodieren
// verhindern soll. Wiederholungen zählen deshalb doppelt: „det är kallt ute men
// det är varmt inne" braucht zweimal `det` und zweimal `är`.
//
// Läuft über Segmente UND Gesprächszeilen. Fehlende Wörter sind ein harter
// Fehler (Exit 1); überzählige Einträge sind ein Hinweis.

import { seedSegments } from '../src/modules/content/seedSegments';
import { seedDialogs } from '../src/modules/content/seedDialogs';
import type { DecodingToken } from '../src/domain/chunk';

/** Wörter eines schwedischen Satzes — ohne Satzzeichen, ohne Platzhalter. */
function words(sv: string): string[] {
  return sv
    .replace(/\{[a-zA-Z]+\}/g, ' ') // {name} ist der Vorname des Lerners
    .toLowerCase()
    .split(/[^a-zà-öø-ÿ0-9']+/i)
    .filter(Boolean);
}

interface Gap {
  where: string;
  sv: string;
  missing: string[];
  extra: string[];
}

function compare(where: string, sv: string, decoding: DecodingToken[] | undefined): Gap | null {
  if (!decoding || decoding.length === 0) return null; // Zeile ohne Dekodierung: nicht Gegenstand dieser Prüfung
  const want = words(sv);
  const have = decoding.flatMap((t) => words(t.sv));
  const pool = [...have];
  const missing: string[] = [];
  for (const w of want) {
    const i = pool.indexOf(w);
    if (i === -1) missing.push(w);
    else pool.splice(i, 1);
  }
  if (missing.length === 0 && pool.length === 0) return null;
  return { where, sv, missing, extra: pool };
}

const gaps: Gap[] = [];
for (const s of seedSegments) {
  const g = compare(`Segment ${s.id}`, s.sv, s.decoding);
  if (g) gaps.push(g);
}
for (const d of seedDialogs) {
  for (const t of d.turns) {
    const g = compare(`Gespräch ${d.id}/${t.id}`, t.sv, t.decoding);
    if (g) gaps.push(g);
  }
}

const hard = gaps.filter((g) => g.missing.length > 0);
const soft = gaps.filter((g) => g.missing.length === 0);

for (const g of hard) {
  console.error(`FEHLT  ${g.where}: „${g.sv}" — ohne Glosse: ${g.missing.join(', ')}`);
}
for (const g of soft) {
  console.warn(`extra  ${g.where}: „${g.sv}" — nicht im Satz: ${g.extra.join(', ')}`);
}

const lines = seedSegments.length + seedDialogs.reduce((n, d) => n + d.turns.length, 0);
console.log(`  ${lines} Zeilen geprüft · Lücken: ${hard.length} · Überzählige: ${soft.length}`);
if (hard.length > 0) process.exit(1);
