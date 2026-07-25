// Wächter für die Kulissen-Liste. Sie wird wachsen, und genau dann passieren
// diese Fehler: zweimal dieselbe Kulisse, ein Kürzel ohne Bild, ein leerer
// Auftragssatz (der Partner bekäme dann keine Szene und würde sich eine
// ausdenken).

import { describe, expect, it } from 'vitest';
import { SETTINGS } from './settings';

const SCENES = [
  'cafe',
  'hotel',
  'station',
  'shop',
  'clinic',
  'garage',
  'gaming',
  'track',
  'lake',
  'stadium',
  'generic',
];

describe('SETTINGS — die Kulissen des Sparrings', () => {
  it('hat keine doppelte Kulisse', () => {
    const ids = SETTINGS.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('nutzt nur Kulissen, für die es auch ein Bild gibt', () => {
    for (const s of SETTINGS) expect(SCENES).toContain(s.id);
  });

  it('gibt jedem Ort einen Titel, eine Person und einen Auftragssatz', () => {
    for (const s of SETTINGS) {
      expect(s.title.trim().length).toBeGreaterThan(2);
      expect(s.partner.trim().length).toBeGreaterThan(2);
      // Der Auftragssatz geht wörtlich in den Prompt — zu kurz heißt: der
      // Partner denkt sich die Szene selbst aus.
      expect(s.brief.trim().length).toBeGreaterThan(40);
    }
  });

  it('deckt den Alltag breit ab, nicht nur Reisen', () => {
    expect(SETTINGS.length).toBeGreaterThanOrEqual(8);
  });
});
