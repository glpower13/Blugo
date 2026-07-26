// Der Vorrat auf der Platte. Getrennt von `vorrat.ts`, damit die Logik dort
// ohne IndexedDB testbar bleibt — und damit der Lern-Loop nicht die halbe
// Speicherschicht importieren muss, nur um einen Satz zu holen.

import { vorratAnzahl, vorratFuer, vorratHinzu, vorratWeg } from '../../storage/db';
import type { VorratSpeicher } from './vorrat';

export const vorratSpeicher: VorratSpeicher = {
  fuer: vorratFuer,
  anzahl: vorratAnzahl,
  hinzu: vorratHinzu,
  weg: vorratWeg,
};
