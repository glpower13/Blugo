// Der geprüfte Bestand, wie ihn das Tor zur Laufzeit braucht.
//
// Trennung mit Absicht: `wissen.generated.ts` ist Daten (50 kB, aus dem Inhalt
// gebaut, nie von Hand angefasst), diese Datei ist die Sicht darauf. Damit kann
// ein Test dem Tor einen kleinen, erfundenen Bestand unterschieben, ohne den
// echten zu laden — sonst prüfte jeder Testfall gegen 1540 Wörter und niemand
// könnte sagen, warum er scheitert.
//
// GELADEN WIRD ERST BEIM ERSTEN KI-SATZ (`ladeWissen`): Die Daten sind so groß
// wie ein Viertel des restlichen Programms, und die allermeisten Lerner drücken
// den KI-Knopf nie. Sie in den Startpfad zu legen hieße, allen die Ladezeit für
// eine Prüfung zu berechnen, die die wenigsten auslösen.

import { nurBeugung } from './checks';
import type { Wissen } from './gate';

let gecacht: Wissen | null = null;

/** Der echte geprüfte Bestand — beim ersten Aufruf nachgeladen, dann gemerkt. */
export async function ladeWissen(): Promise<Wissen> {
  if (gecacht) return gecacht;
  const { BEKANNTE_WOERTER, BEKANNTE_GLOSSEN } = await import('./wissen.generated');
  gecacht = {
    woerter: new Set(BEKANNTE_WOERTER),
    glossen: BEKANNTE_GLOSSEN as Record<string, string[]>,
    istBeugung: nurBeugung,
  };
  return gecacht;
}

/** Ein kleiner Bestand für Tests — dieselbe Beugungsregel, andere Daten. */
export function wissenAus(
  woerter: string[],
  glossen: Record<string, string[]> = {},
): Wissen {
  return { woerter: new Set(woerter), glossen, istBeugung: nurBeugung };
}
