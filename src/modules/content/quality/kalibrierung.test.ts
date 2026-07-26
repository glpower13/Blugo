// DIE FRAGE, DIE DIESES TOR ENTSCHEIDET: Ist seine Latte dieselbe, die der
// handgeschriebene Inhalt überspringt — oder eine höhere?
//
// Eine zu hohe Latte ist kein „sicherheitshalber streng". Sie wirft gute Sätze
// weg, kostet den Lerner bei jedem Versuch Geld auf seinem eigenen Zugang und
// lässt die KI-Funktion kaputt aussehen, obwohl das Modell geliefert hat. Der
// einzige Maßstab, der nicht behauptet ist: der eigene geprüfte Bestand. Kommt
// er nicht durch sein eigenes Tor, ist das Tor falsch — nicht der Inhalt.

import { describe, expect, it } from 'vitest';
import { seedChunks, seedSegments } from '../seedSegments';
import { BEKANNTE_GLOSSEN, BEKANNTE_WOERTER } from './wissen.generated';
import { nurBeugung } from './checks';
import { pruefeSegment, type Wissen } from './gate';

const wissen: Wissen = {
  woerter: new Set(BEKANNTE_WOERTER),
  glossen: BEKANNTE_GLOSSEN as Record<string, string[]>,
  istBeugung: nurBeugung,
};

const chunkNach = new Map(seedChunks.map((c) => [c.id, c]));

describe('Kalibrierung: der eigene Inhalt kommt durch sein eigenes Tor', () => {
  it('nimmt jedes handgeschriebene Segment an', () => {
    const durchgefallen: string[] = [];
    for (const s of seedSegments) {
      for (const id of s.chunkIds) {
        const chunk = chunkNach.get(id);
        if (!chunk) continue; // Referenz-Integrität prüft seedContent.test.ts
        const r = pruefeSegment(s, chunk, wissen);
        if (r.angenommen) continue;
        const hart = r.befunde.filter((b) => b.art === 'hart').map((b) => b.text);
        durchgefallen.push(`${s.id} (${id}): ${hart.join(' · ')}`);
      }
    }
    // ALLE auf einmal melden: Eine Liste, die beim ersten Fund abbricht, macht
    // aus einem Befund fünf Läufe.
    expect(durchgefallen).toEqual([]);
  });

  it('kennt jedes Wort des eigenen Inhalts (sonst meldet das Tor Rauschen)', () => {
    const s = seedSegments[0];
    const chunk = chunkNach.get(s.chunkIds[0])!;
    expect(pruefeSegment(s, chunk, wissen).unbekannt).toEqual([]);
  });
});
