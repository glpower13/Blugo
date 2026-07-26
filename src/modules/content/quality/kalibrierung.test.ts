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

// ── Die Stufen-Latte kommt aus dem eigenen Inhalt ────────────────────────────
//
// `STUFE_MAX` behauptet: „Mehr als so viele neue Wörter verträgt verständlicher
// Input nicht." Das ist nur tragbar, wenn der handgeschriebene Bestand die Latte
// selbst einhält. Der Test spielt einen Lerner durch und misst bei JEDER
// Begegnung, wie viele Wörter er noch nicht kennt.
describe('Kalibrierung: die i+1-Latte gegen den eigenen Inhalt', () => {
  it('kein handgeschriebenes Segment überschreitet STUFE_MAX', async () => {
    const [{ seedSegments }, { initialState, schedule }, { buildQueue, pickSegmentForChunk }, { neueWoerter, STUFE_MAX, woerter }] =
      await Promise.all([
        import('../seedSegments'),
        import('../../memory/memoryEngine'),
        import('../../../session/buildQueue'),
        import('./checks'),
      ]);
    const TAG = 86_400_000;
    const START = Date.UTC(2026, 0, 1);
    const states: Record<string, import('../../../domain/chunk').ChunkState> = {};
    for (const c of seedChunks) states[c.id] = initialState(c.id, START);

    const bekannt = new Set<string>();
    let hoechste = 0;
    const ueber: string[] = [];

    for (let tag = 0; tag <= 120; tag++) {
      const jetzt = START + tag * TAG;
      for (const id of buildQueue(Object.values(states), jetzt, 5)) {
        const chunk = chunkNach.get(id)!;
        const seg = pickSegmentForChunk(chunk, states[id], seedSegments);
        if (seg) {
          const n = neueWoerter(seg.sv, chunk.sv, bekannt).length;
          hoechste = Math.max(hoechste, n);
          if (n > STUFE_MAX) ueber.push(`${seg.id}: ${n} neue Wörter`);
        }
        for (const w of woerter(chunk.sv)) bekannt.add(w);
        states[id] = schedule(states[id], 'good', 'seg', jetzt, { retention: 0.9 });
      }
    }

    expect(ueber).toEqual([]);
    // Und die Latte darf nicht ins Uferlose gesetzt sein: Sie liegt knapp über
    // dem, was der eigene Inhalt braucht — sonst prüfte sie nichts mehr.
    expect(hoechste).toBeGreaterThan(0);
    expect(STUFE_MAX - hoechste).toBeLessThanOrEqual(2);
  });
});
