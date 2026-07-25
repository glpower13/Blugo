// Erzeugt den Prüfbogen für die muttersprachliche Gegenlesung.
//
// Was eine schwedischsprachige Person braucht, um in vertretbarer Zeit durch
// 179 Wendungen zu kommen: den Satz, seinen Kontext, die deutsche Fassung und
// die Wort-für-Wort-Zeile — alles nebeneinander, thematisch sortiert, ohne
// Klickerei. Genau das steht hier drin.
//
// Bewusst Markdown und keine Tabelle mit Häkchen-Feldern: Der Bogen wird
// gelesen und kommentiert, nicht ausgefüllt. Die Urteile wandern anschließend
// nach `content/muttersprachliche-pruefung.json` — dorthin, wo ein Wächter sie
// prüfen kann.

import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  seedAreas,
  seedCategories,
  seedChunks,
  seedSegments,
} from '../src/modules/content/seedSegments';
import { VERIFICATION, VERIFICATION_REASON } from '../src/modules/content/verification.generated';
import { readRegister, nativeChunkIds } from './native-review';

const ROOT = resolve(import.meta.dirname ?? '.', '..');
const OUT = resolve(ROOT, 'docs/pruefbogen-schwedisch.md');

const bereits = nativeChunkIds(readRegister());

const kontexteVon = new Map<string, string[]>();
for (const s of seedSegments) {
  for (const id of s.chunkIds) {
    const liste = kontexteVon.get(id) ?? [];
    liste.push(s.sv);
    kontexteVon.set(id, liste);
  }
}

const zeilen: string[] = [
  '# Prüfbogen Schwedisch — für die muttersprachliche Gegenlesung',
  '',
  '> **ERZEUGT** von `npm run review:sheet`. Nicht von Hand ändern — Urteile',
  '> gehören nach `content/muttersprachliche-pruefung.json`.',
  '',
  '## Worum wir bitten',
  '',
  'Dieser Inhalt wurde **maschinell** geprüft: Jedes einzelne Wort ist belegtes',
  'Schwedisch (Wörterbuch + Korpushäufigkeit). Was eine Maschine **nicht** prüfen',
  'kann und worum es hier geht:',
  '',
  '1. **Wortstellung** — ist der Satz so gebaut, wie man ihn wirklich sagt?',
  '2. **Idiomatik** — sagt man das so, oder ist es übersetztes Deutsch?',
  '3. **Register** — passt der Ton zur Situation (Laden, Arzt, Freunde)?',
  '4. **Die deutsche Zeile** — trifft sie die Bedeutung?',
  '5. **Die Wort-für-Wort-Zeile** — sie soll den Satzbau sichtbar machen, nicht',
  '   schönes Deutsch sein. Führt sie in die Irre?',
  '',
  'Ein knappes „geht" reicht. Wo etwas nicht stimmt: **wie es richtig heißt** und,',
  'wenn möglich, ein Wort warum. Lieber zehn ehrliche Urteile als 179 flüchtige —',
  'wir tragen nur ein, was wirklich gelesen wurde.',
  '',
  '## Stand',
  '',
  `- Wendungen insgesamt: **${seedChunks.length}**`,
  `- davon bereits muttersprachlich geprüft: **${bereits.size}**`,
  `- noch offen: **${seedChunks.length - bereits.size}**`,
  '',
  '---',
  '',
];

for (const area of [...seedAreas].sort((a, b) => a.order - b.order)) {
  const kategorien = seedCategories
    .filter((c) => c.areaId === area.id)
    .sort((a, b) => a.order - b.order);
  if (kategorien.length === 0) continue;
  zeilen.push(`## ${area.title}`, '');

  for (const kat of kategorien) {
    const chunks = seedChunks.filter((c) => c.categoryId === kat.id);
    if (chunks.length === 0) continue;
    zeilen.push(`### ${kat.title}`, '');

    for (const c of chunks) {
      const stand = bereits.has(c.id)
        ? '✅ bereits geprüft'
        : VERIFICATION[c.id] === 'unchecked'
          ? `⚠️ maschinell auffällig — ${VERIFICATION_REASON[c.id] ?? 'seltenes Wort'}`
          : 'offen';
      zeilen.push(`#### \`${c.id}\` · ${stand}`, '');
      zeilen.push(`- **Schwedisch:** ${c.sv}`);
      zeilen.push(`- **Deutsch:** ${c.de}`);
      zeilen.push(`- **Wort für Wort:** ${c.decoding.map((t) => `${t.sv} = ${t.de}`).join(' · ')}`);
      const ktx = (kontexteVon.get(c.id) ?? []).filter((s) => s !== c.sv);
      if (ktx.length > 0) {
        zeilen.push(`- **Im Satz:** ${ktx.map((s) => `„${s}"`).join(' / ')}`);
      }
      zeilen.push('');
    }
  }
}

zeilen.push(
  '---',
  '',
  '## So kommen die Urteile in die App',
  '',
  'In `content/muttersprachliche-pruefung.json`:',
  '',
  '```json',
  '{',
  '  "pruefende": [',
  '    { "id": "elin", "name": "Elin", "herkunft": "Muttersprachlerin, Göteborg" }',
  '  ],',
  '  "eintraege": [',
  '    { "chunkId": "c-hejda", "pruefer": "elin", "am": "2026-08-14", "urteil": "ok" },',
  '    { "chunkId": "c-onthär", "pruefer": "elin", "am": "2026-08-14",',
  '      "urteil": "korrigiert", "vorher": "jag har ont här",',
  '      "anmerkung": "so sagt man es nicht am Telefon" }',
  '  ]',
  '}',
  '```',
  '',
  'Danach `npm run verify` — der Wächter prüft jeden Eintrag auf Belegbarkeit,',
  'und die Zahl in der App bewegt sich. Ohne Eintrag bleibt sie bei 0. Das ist',
  'gewollt: Eine Prüfung zu behaupten, die nicht stattgefunden hat, wäre genau',
  'der Fehler, gegen den diese App gebaut ist.',
  '',
);

writeFileSync(OUT, zeilen.join('\n'), 'utf8');
console.log(`Prüfbogen geschrieben: docs/pruefbogen-schwedisch.md`);
console.log(`  ${seedChunks.length} Wendungen · ${bereits.size} bereits geprüft`);
