// Das Tor: Was ein KI-erzeugter Satz bestehen muss, bevor ein Lerner ihn sieht.
//
// DER BURGGRABEN IN EINEM SATZ: Sätze erzeugen kann jeder. Erzeugte Sätze
// automatisch auf DENSELBEN Stand prüfen wie die handgeschriebenen — das ist der
// Unterschied. Bis 2026-07-26 lief KI-Inhalt durch keine einzige der vier
// Prüfungen, die der Seed bestehen muss; `parseSegment` prüfte nur, ob überhaupt
// Text zurückkam.
//
// ZWEI SORTEN BEFUND, und der Unterschied ist die ganze Ehrlichkeit:
//
//   HART   — der Satz ist als Lernmaterial kaputt. Er wird VERWORFEN, nicht
//            beschriftet. Ein Satz mit fehlender Glosse verschiebt die ganze
//            interlineare Zuordnung; ein Satz ohne die Ziel-Wendung übt sie
//            nicht; eine gedrehte Verneinung bringt dem Lerner das Gegenteil bei.
//            Nichts davon rettet ein Warnhinweis.
//
//   OFFEN  — der Satz ist brauchbar, aber die App kann etwas NICHT bestätigen:
//            ein Wort, das im geprüften Bestand nie vorkam. Das wird gesagt,
//            nicht versteckt und nicht als Fehler ausgegeben. Neue Wörter sind
//            der Sinn von neuem Stoff.
//
// Was das Tor NICHT kann und niemals behaupten wird: beurteilen, ob der Satz
// idiomatisch, natürlich oder stilistisch richtig ist. Dafür bräuchte es eine
// schwedischsprachige Person (`docs/content-review-schwedisch.md`).

import type { Chunk, Segment } from '../../../domain/chunk';
import { MEHRDEUTIGE_WOERTER } from '../polysemy';
import {
  DECKUNG_MINIMUM,
  deckung,
  glossenKonflikte,
  glossenLuecke,
  KONTEXTABHAENGIG,
  unbekannteWoerter,
  wortstellung,
  zahlUndVerneinung,
} from './checks';

/**
 * Wörter, bei denen eine abweichende Glosse kein Widerspruch ist: Funktionswörter,
 * deren Deutsch der Satz bildet — und die Wörter, deren zweite Bedeutung die App
 * dem Lerner selbst erklärt. Bei `kort` „kurz" statt „Karte" zu verwerfen hieße,
 * genau den Satz wegzuwerfen, an dem der Mehrdeutigkeits-Hinweis greift.
 */
const KEIN_WIDERSPRUCH = new Set([
  ...KONTEXTABHAENGIG,
  ...MEHRDEUTIGE_WOERTER.map((m) => m.sv),
]);

export type BefundArt = 'hart' | 'offen';

export interface Befund {
  art: BefundArt;
  /** Ein Satz, den ein Mensch versteht. */
  text: string;
}

export interface Pruefergebnis {
  angenommen: boolean;
  befunde: Befund[];
  /** Wörter, die der geprüfte Bestand nicht kennt (für die ehrliche Beschriftung). */
  unbekannt: string[];
}

/** Der geprüfte Bestand, gegen den geprüft wird (aus `wissen.generated.ts`). */
export interface Wissen {
  woerter: Set<string>;
  glossen: Record<string, string[]>;
  /** Sind zwei deutsche Glossen nur Beugungen desselben Wortes? */
  istBeugung: (a: string, b: string) => boolean;
}

/**
 * Prüft einen frisch erzeugten Satz gegen die Ziel-Wendung und den Bestand.
 * Rein — damit jede Regel einzeln testbar bleibt.
 */
export function pruefeSegment(kandidat: Segment, chunk: Chunk, wissen: Wissen): Pruefergebnis {
  const befunde: Befund[] = [];

  // 1. Kommt überhaupt ein Satz?
  if (!kandidat.sv.trim()) {
    befunde.push({ art: 'hart', text: 'Es kam kein schwedischer Satz zurück.' });
  }
  if (!kandidat.de.trim()) {
    befunde.push({ art: 'hart', text: 'Es kam keine deutsche Bedeutung zurück.' });
  }

  // 2. Steckt die Wendung erkennbar im Satz? Sonst übt der Satz sie nicht.
  const d = deckung(chunk.sv, kandidat.sv);
  if (d < DECKUNG_MINIMUM) {
    befunde.push({
      art: 'hart',
      text: `Die Wendung „${chunk.sv}" ist im Satz nicht wiederzuerkennen.`,
    });
  }

  // 3. Ist die Dekodierung vollständig? Eine Lücke verschiebt die ganze Zeile.
  const luecke = glossenLuecke(kandidat.sv, kandidat.decoding);
  if (kandidat.decoding.length === 0) {
    befunde.push({ art: 'hart', text: 'Zum Satz kam keine Wort-für-Wort-Dekodierung.' });
  } else if (luecke.fehlend.length > 0) {
    befunde.push({
      art: 'hart',
      text: `Ohne Wort-für-Wort-Bedeutung: ${luecke.fehlend.join(', ')}.`,
    });
  } else if (luecke.ueberzaehlig.length > 0) {
    befunde.push({
      art: 'hart',
      text: `Die Dekodierung nennt Wörter, die im Satz nicht stehen: ${luecke.ueberzaehlig.join(', ')}.`,
    });
  }

  // 4. Zahlen und Verneinung müssen in beiden Sprachen dasselbe sein.
  for (const z of zahlUndVerneinung(kandidat.sv, kandidat.de)) {
    befunde.push({ art: 'hart', text: `Satz und Bedeutung passen nicht: ${z.was}.` });
  }

  // 5. Steht das Verb, wo es im Schwedischen stehen muss?
  //    Hart, weil es echtes Falsch-Lernen ist: Wer „jag inte förstår" liest,
  //    merkt sich die deutsche Wortfolge und sagt sie nachher.
  for (const s of wortstellung(kandidat.sv)) {
    befunde.push({ art: 'hart', text: `Schwedische Wortstellung: ${s.was}.` });
  }

  // 6. Widerspricht eine Glosse dem, was der Lerner schon gelernt hat?
  for (const k of glossenKonflikte(
    kandidat.decoding,
    wissen.glossen,
    wissen.istBeugung,
    KEIN_WIDERSPRUCH,
  )) {
    befunde.push({
      art: 'hart',
      text: `„${k.sv}" wird hier „${k.neu}" genannt, im geprüften Inhalt aber „${k.bekannt.join('/')}".`,
    });
  }

  // 7. Neue Wörter: kein Fehler, aber die Grenze dessen, was die App bestätigen kann.
  const unbekannt = unbekannteWoerter(kandidat.sv, wissen.woerter);
  if (unbekannt.length > 0) {
    befunde.push({
      art: 'offen',
      text: `Nicht im geprüften Bestand: ${unbekannt.join(', ')}.`,
    });
  }

  return {
    angenommen: !befunde.some((b) => b.art === 'hart'),
    befunde,
    unbekannt,
  };
}

/**
 * Der Satz, mit dem die App einen angenommenen Satz beschriftet.
 *
 * Bewusst aufzählend statt beruhigend: Er sagt, WAS geprüft wurde, und im selben
 * Atemzug, was NICHT geprüft ist. „Geprüft" allein wäre ein Siegel, das diese
 * Prüfung nicht deckt.
 */
export function beschriftung(ergebnis: Pruefergebnis): string {
  // „die zwei häufigsten" statt „die Wortstellung": Die Prüfung kennt genau zwei
  // Muster (Verb nach Vorfeld, Verneinung nach Verb). „Wortstellung geprüft" wäre
  // ein Siegel für eine Grammatikprüfung, die es hier nicht gibt.
  const basis =
    'Maschinell geprüft: jedes Wort hat eine Bedeutung, die Wendung steckt im Satz, ' +
    'Zahlen und Verneinung stimmen überein, die zwei häufigsten Wortstellungs-Fehler ' +
    'kommen nicht vor, keine Glosse widerspricht dem geprüften Inhalt.';
  const offen =
    ergebnis.unbekannt.length > 0
      ? ` Neu für die App: ${ergebnis.unbekannt.join(', ')} — diese Wörter stehen in keinem geprüften Satz.`
      : '';
  return basis + offen + ' Ob der Satz so gesagt wird, sagt niemand — dafür bräuchte es einen Muttersprachler.';
}
