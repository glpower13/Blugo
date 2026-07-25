// Das Register der muttersprachlichen Gegenlesung — lesen und prüfen.
//
// WARUM ES DAS GIBT: Der Prüf-Stand kannte drei Stufen, aber `'native'` war
// unerreichbar — der Erzeuger schrieb fest `native: 0`. Selbst wenn morgen eine
// schwedischsprachige Person alle 179 Wendungen gegengelesen hätte, hätte die
// App es nicht zeigen können. Die ehrliche 0 war damit keine Messung, sondern
// eine Sackgasse.
//
// DIE REGEL, DIE DIESE ZAHL EHRLICH HÄLT: Ein Eintrag zählt nur, wenn er
// belegbar ist — bekannte prüfende Person, existierende Wendung, Datum, und bei
// einer Korrektur die alte Fassung. `npm run check:native` erzwingt das. Ohne
// diesen Wächter wäre „muttersprachlich geprüft" die am leichtesten zu
// fälschende Zahl der ganzen App.

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname ?? '.', '..');
const LEDGER = resolve(ROOT, 'content/muttersprachliche-pruefung.json');

/** Wer geprüft hat. Ein Name allein reicht nicht — die Herkunft gehört dazu. */
export interface Pruefende {
  id: string;
  name: string;
  /** Woher die Sprachkompetenz kommt (Muttersprache, Region, ggf. Beruf). */
  herkunft: string;
}

export interface Eintrag {
  chunkId: string;
  /** `id` aus `pruefende`. */
  pruefer: string;
  /** ISO-Datum, z. B. "2026-08-14". */
  am: string;
  /**
   * `ok` — unverändert richtig.
   * `korrigiert` — war falsch, ist im Inhalt bereits ausgebessert; `vorher`
   *   hält fest, was dastand (sonst ist die Korrektur nicht nachvollziehbar).
   */
  urteil: 'ok' | 'korrigiert';
  vorher?: string;
  anmerkung?: string;
}

export interface Register {
  pruefende: Pruefende[];
  eintraege: Eintrag[];
}

export function readRegister(): Register {
  const raw = JSON.parse(readFileSync(LEDGER, 'utf8')) as Partial<Register>;
  return {
    pruefende: Array.isArray(raw.pruefende) ? raw.pruefende : [],
    eintraege: Array.isArray(raw.eintraege) ? raw.eintraege : [],
  };
}

/**
 * Prüft das Register gegen die vorhandenen Wendungen (rein, testbar).
 * Gibt die Liste der Beanstandungen zurück — leer heißt sauber.
 */
export function validate(register: Register, bekannteChunkIds: Set<string>): string[] {
  const fehler: string[] = [];
  const ids = new Set<string>();

  for (const p of register.pruefende) {
    if (!p.id || !p.name || !p.herkunft) {
      fehler.push(`Prüfende Person unvollständig (id/name/herkunft): ${JSON.stringify(p)}`);
      continue;
    }
    if (ids.has(p.id)) fehler.push(`Doppelte Prüfer-Kennung: ${p.id}`);
    ids.add(p.id);
  }

  const gesehen = new Set<string>();
  for (const e of register.eintraege) {
    const wo = `Eintrag ${e.chunkId ?? '?'}`;
    if (!e.chunkId || !bekannteChunkIds.has(e.chunkId)) {
      fehler.push(`${wo}: diese Wendung gibt es nicht.`);
    }
    if (!ids.has(e.pruefer)) {
      fehler.push(`${wo}: unbekannte prüfende Person „${e.pruefer}".`);
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(e.am ?? '')) {
      fehler.push(`${wo}: Datum fehlt oder ist nicht ISO (JJJJ-MM-TT).`);
    }
    if (e.urteil !== 'ok' && e.urteil !== 'korrigiert') {
      fehler.push(`${wo}: Urteil muss „ok" oder „korrigiert" sein.`);
    }
    if (e.urteil === 'korrigiert' && !e.vorher) {
      fehler.push(`${wo}: „korrigiert" ohne Feld „vorher" — die Korrektur wäre nicht nachvollziehbar.`);
    }
    if (gesehen.has(e.chunkId)) fehler.push(`${wo}: doppelt geprüft.`);
    gesehen.add(e.chunkId);
  }
  return fehler;
}

/** Die Wendungen, die als muttersprachlich geprüft gelten dürfen. */
export function nativeChunkIds(register: Register): Set<string> {
  return new Set(register.eintraege.map((e) => e.chunkId));
}
