// Wächter über dem Register der muttersprachlichen Gegenlesung.
//
// „Muttersprachlich geprüft" ist die am leichtesten zu fälschende Zahl der
// ganzen App: Sie steht in einer JSON-Datei, und niemand sieht ihr an, ob
// dahinter ein Mensch stand. Genau deshalb prüft dieser Lauf jeden Eintrag auf
// Belegbarkeit — bekannte prüfende Person, existierende Wendung, Datum, und bei
// einer Korrektur die alte Fassung.
//
// Läuft in `npm run verify` und damit in CI.

import { seedChunks } from '../src/modules/content/seedSegments';
import { readRegister, validate } from './native-review';

const register = readRegister();
const bekannt = new Set(seedChunks.map((c) => c.id));
const fehler = validate(register, bekannt);

for (const f of fehler) console.error(`  ✗ ${f}`);

const geprueft = register.eintraege.length;
const anteil = seedChunks.length === 0 ? 0 : Math.round((geprueft / seedChunks.length) * 100);
console.log(
  `  ${geprueft} von ${seedChunks.length} Wendungen muttersprachlich geprüft (${anteil} %) · ` +
    `${register.pruefende.length} prüfende Person(en) · Beanstandungen: ${fehler.length}`,
);

if (fehler.length > 0) {
  console.error(
    '\nDas Register ist nicht belegbar. Lieber gar keine Zahl als eine erfundene.',
  );
  process.exit(1);
}
