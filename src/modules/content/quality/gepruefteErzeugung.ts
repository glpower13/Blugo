// Erzeugen UND prüfen — als eine Handlung, die man nicht halb ausführen kann.
//
// WARUM NICHT ZWEI SCHRITTE IM BILDSCHIRM: Solange „erzeugen" und „prüfen" zwei
// getrennte Aufrufe sind, kann eine spätere Stelle das Prüfen weglassen —
// versehentlich oder aus Eile. Dann ist das Tor genau das, was es nie sein darf:
// eine Behauptung. Deshalb gibt es hier nur diesen einen Weg zu einem
// KI-erzeugten Satz, und er gibt nie einen zurück, der hart durchgefallen ist.
//
// EIN ZWEITER VERSUCH, NICHT MEHR: Modelle liefern beim zweiten Anlauf oft
// etwas Brauchbares — eine vergessene Glosse ist ein Ausrutscher, kein Prinzip.
// Fünf Versuche wären trotzdem falsch: Jeder kostet den Lerner Geld auf seinem
// eigenen Zugang und Sekunden vor einem sich drehenden Rad. Zweimal scheitern
// heißt hier: dieses Modell schafft diesen Satz gerade nicht, und das wird
// gesagt statt still weiterprobiert.

import type { Chunk, Segment } from '../../../domain/chunk';
import type { ContentGenerator, GenerateSegmentRequest } from '../ports';
import { pruefeSegment, type Pruefergebnis, type Wissen } from './gate';

export interface GeprueftesSegment {
  segment: Segment;
  ergebnis: Pruefergebnis;
  /** Wie viele Anläufe es gebraucht hat — die Oberfläche darf das sagen. */
  versuche: number;
}

/** Der Fehler, wenn ein Satz die Prüfung nicht besteht: mit dem WARUM im Text. */
export class NichtBestanden extends Error {
  constructor(public readonly befunde: string[]) {
    super(
      'Die KI hat zweimal einen Satz geliefert, der die Prüfung nicht besteht: ' +
        // Die Befunde sind ganze Sätze und enden auf einen Punkt — ohne das
        // Abschneiden stünde hier „…Dekodierung.. Er wird…".
        befunde.map((b) => b.replace(/\.+$/, '')).join(' · ') +
        '. Er wird deshalb nicht gezeigt — der geprüfte Satz oben gilt weiter.',
    );
    this.name = 'NichtBestanden';
  }
}

export const MAX_VERSUCHE = 2;

/**
 * Holt einen neuen Kontext und lässt ihn durch das Tor. Gibt NUR angenommene
 * Sätze zurück; alles andere wirft `NichtBestanden` mit den echten Befunden.
 *
 * `avoidSegmentIds` wächst mit jedem Versuch um den abgelehnten Satz — sonst
 * liefert das Modell auf dieselbe Anfrage plausibel denselben Fehler nochmal.
 */
export async function erzeugeGeprueft(
  generator: ContentGenerator,
  req: GenerateSegmentRequest,
  chunk: Chunk,
  wissen: Wissen,
  maxVersuche: number = MAX_VERSUCHE,
): Promise<GeprueftesSegment> {
  let letzte: string[] = [];
  for (let versuch = 1; versuch <= maxVersuche; versuch++) {
    const segment = await generator.generate(req);
    const ergebnis = pruefeSegment(segment, chunk, wissen);
    if (ergebnis.angenommen) return { segment, ergebnis, versuche: versuch };
    letzte = ergebnis.befunde.filter((b) => b.art === 'hart').map((b) => b.text);
    req = { ...req, avoidSegmentIds: [...(req.avoidSegmentIds ?? []), segment.id] };
  }
  throw new NichtBestanden(letzte);
}
