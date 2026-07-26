// Tests der Meilensteine. Der Kern jedes Falls ist derselbe: Ein Meilenstein
// darf sich NUR an bewiesenen Wendungen bewegen — nie an angefassten, nie an
// reifenden, nie an verstrichener Zeit.

import { describe, expect, it } from 'vitest';
import { milestoneProgress, currentMilestone, whatIsMissing, levelOf, MILESTONE_THRESHOLD } from './milestones';
import { initialState } from '../memory/memoryEngine';
import type { Category, CefrLevel, Chunk, ChunkState } from '../../domain/chunk';

const NOW = 1_700_000_000_000;

/** Ein Thema je Meilenstein — die Einstufung hängt am Thema, nicht an der Wendung. */
const themen: Category[] = (['A1', 'A2', 'B1', 'B2'] as CefrLevel[]).map((cefr, i) => ({
  id: `k-${cefr}`,
  areaId: 'a',
  title: cefr,
  blurb: cefr,
  order: i + 1,
  cefr,
}));

function chunk(id: string, cefr: CefrLevel = 'A1'): Chunk {
  return { id, categoryId: `k-${cefr}`, sv: id, de: id, decoding: [] };
}
const bewiesen = (id: string): ChunkState => ({
  ...initialState(id, NOW),
  stage: 'production',
  status: 'maintenance',
  provenStableAt: NOW,
  maturedAt: NOW,
  history: [{ at: NOW, result: 'good', segmentId: 's' }],
});
const reifend = (id: string): ChunkState => ({
  ...initialState(id, NOW),
  stage: 'production',
  maturedAt: NOW,
  history: [{ at: NOW, result: 'good', segmentId: 's' }],
});
const angefasst = (id: string): ChunkState => ({
  ...initialState(id, NOW),
  status: 'learning',
  history: [{ at: NOW, result: 'again', segmentId: 's' }],
});
const zustand = (...s: ChunkState[]) => Object.fromEntries(s.map((x) => [x.chunkId, x]));
const karte = new Map(themen.map((k) => [k.id, k.cefr]));

describe('Meilensteine', () => {
  it('die Einstufung kommt vom Thema; ohne bekanntes Thema zählt A1', () => {
    expect(levelOf(chunk('c', 'B1'), karte)).toBe('B1');
    expect(levelOf({ ...chunk('c'), categoryId: 'gibt-es-nicht' }, karte)).toBe('A1');
  });

  it('zählt nur BEWIESENE für „erreicht" — nicht angefasste, nicht reifende', () => {
    const chunks = Array.from({ length: 10 }, (_, i) => chunk(`c${i}`, 'A1'));
    // Neun reifend, eine angefasst: das ist viel Arbeit und trotzdem 0 %.
    const states = zustand(...chunks.slice(0, 9).map((c) => reifend(c.id)), angefasst('c9'));
    const a1 = milestoneProgress(chunks, themen, states)[0];
    expect(a1.proven).toBe(0);
    expect(a1.maturing).toBe(9);
    expect(a1.share).toBe(0);
    expect(a1.reached).toBe(false);
  });

  it('gilt ab der Schwelle als erreicht', () => {
    const chunks = Array.from({ length: 10 }, (_, i) => chunk(`c${i}`, 'A1'));
    const neun = zustand(...chunks.slice(0, 9).map((c) => bewiesen(c.id)));
    expect(milestoneProgress(chunks, themen, neun)[0].reached).toBe(true); // 90 %

    const acht = zustand(...chunks.slice(0, 8).map((c) => bewiesen(c.id)));
    expect(milestoneProgress(chunks, themen, acht)[0].reached).toBe(false); // 80 %
  });

  it('ein Meilenstein ohne Stoff gilt NIE als erreicht', () => {
    // Sonst stünde „B2 erreicht" da, weil es keinen B2-Inhalt gibt — dieselbe
    // Null-durch-Null-Behauptung wie einst bei der Trefferquote.
    const alle = milestoneProgress([chunk('c', 'A1')], themen, {});
    for (const m of alle.filter((x) => x.total === 0)) expect(m.reached).toBe(false);
  });

  it('genau ein Meilenstein ist der aktuelle', () => {
    const chunks = [chunk('a', 'A1'), chunk('b', 'A2'), chunk('c', 'B1')];
    // A1 ist mit 1 von 1 erreicht, A2 und B1 nicht — aktuell darf nur EINER sein,
    // sonst zeigte die Fläche zwei „hier bist du gerade".
    const alle = milestoneProgress(chunks, themen, zustand(bewiesen('a')));
    expect(alle.filter((m) => m.current)).toHaveLength(1);
    expect(currentMilestone(alle)!.level).toBe('A2');
  });

  it('der aktuelle ist der erste NICHT erreichte', () => {
    const chunks = [chunk('a', 'A1'), chunk('b', 'A2')];
    const alle = milestoneProgress(chunks, themen, zustand(bewiesen('a')));
    expect(alle[0].reached).toBe(true);
    expect(currentMilestone(alle)!.level).toBe('A2');
  });

  it('ein Fehlschlag nimmt den Meilenstein wieder weg', () => {
    // Dieselbe Regel wie bei der großen Zahl: Die Anzeige behauptet Gegenwart.
    const chunks = [chunk('a', 'A1')];
    const gefallen: ChunkState = { ...bewiesen('a'), lapsedAt: NOW + 1000 };
    expect(milestoneProgress(chunks, themen, zustand(gefallen))[0].reached).toBe(false);
  });

  it('sagt als Bedingung, was fehlt — nicht als Prozentzahl', () => {
    const chunks = Array.from({ length: 10 }, (_, i) => chunk(`c${i}`, 'A1'));
    const text = whatIsMissing(milestoneProgress(chunks, themen, zustand(bewiesen('c0')))[0]);
    expect(text).toMatch(/Noch \d+ bewiesene/);
    expect(text).not.toMatch(/%/);
  });

  it('die Schwelle liegt hoch genug, dass niemand hindurchrutscht', () => {
    expect(MILESTONE_THRESHOLD).toBeGreaterThanOrEqual(0.9);
  });
});
