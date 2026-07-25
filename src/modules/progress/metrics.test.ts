import { describe, expect, it } from 'vitest';
import { computeMetrics, isStable, directionSplit } from './metrics';
import { initialState } from '../memory/memoryEngine';
import type { ChunkState } from '../../domain/chunk';

const NOW = 1_700_000_000_000;

function make(overrides: Partial<ChunkState>): ChunkState {
  return { ...initialState('x', NOW), ...overrides };
}

describe('metrics', () => {
  it('counts a chunk stable only once proven (provenStableAt set), not by scheduled interval', () => {
    // A long *scheduled* interval alone is NOT stable (anti-Goodhart)...
    expect(
      isStable(make({ status: 'maintenance', stage: 'production', intervalDays: 120 })),
    ).toBe(false);
    // ...only an actual proven recall after a long gap counts.
    expect(
      isStable(make({ status: 'maintenance', stage: 'production', provenStableAt: NOW })),
    ).toBe(true);
  });

  it('computeMetrics reports active, stable and due counts', () => {
    const states: ChunkState[] = [
      make({ chunkId: 'new', status: 'new' }), // untouched → not active
      make({ chunkId: 'learn', status: 'learning', history: [{ at: NOW, result: 'good', segmentId: 's' }] }),
      make({ chunkId: 'stable', status: 'maintenance', stage: 'production', intervalDays: 100, provenStableAt: NOW }),
      make({ chunkId: 'due', status: 'learning', dueAt: NOW - 1000, history: [{ at: NOW, result: 'good', segmentId: 's' }] }),
    ];
    const m = computeMetrics(states, NOW);
    expect(m.active).toBe(3); // learn, stable, due (new untouched excluded)
    expect(m.stable).toBe(1);
    expect(m.dueNow).toBeGreaterThanOrEqual(1);
  });

  it('coverage weights production-good full, recognition-good half, failure zero', () => {
    const prodGood = make({ chunkId: 'p', stage: 'production', history: [{ at: NOW, result: 'good', segmentId: 's' }] });
    const recogGood = make({ chunkId: 'r', stage: 'recognition', history: [{ at: NOW, result: 'good', segmentId: 's' }] });
    const bad = make({ chunkId: 'b', history: [{ at: NOW, result: 'again', segmentId: 's' }] });
    const m = computeMetrics([prodGood, recogGood, bad], NOW);
    expect(m.active).toBe(3);
    expect(m.coverage).toBeCloseTo((1 + 0.5) / 3); // = 0.5
  });

  it('coverage is 0 when nothing is active', () => {
    expect(computeMetrics([make({ status: 'new' })], NOW).coverage).toBe(0);
  });

  it('maturing counts production chunks with a grown interval that are not yet proven stable', () => {
    const maturing = make({ chunkId: 'm', stage: 'production', intervalDays: 50 }); // grown, unproven
    const proven = make({ chunkId: 's', stage: 'production', intervalDays: 120, provenStableAt: NOW });
    const early = make({ chunkId: 'e', stage: 'recognition', intervalDays: 50 }); // not production
    const m = computeMetrics([maturing, proven, early], NOW);
    expect(m.maturing).toBe(1); // only the unproven production chunk
    expect(m.stable).toBe(1);
  });
});

describe('directionSplit — die Richtung ist gemessen, nicht gewählt', () => {
  it('zählt nie begegnete Wendungen NICHT als „du verstehst sie"', () => {
    // Eine frische Wendung steht per Voreinstellung auf `recognition`. Sie als
    // verstanden zu zählen wäre die Lüge, gegen die dieses Projekt gebaut ist.
    const d = directionSplit([initialState('a', NOW), initialState('b', NOW)]);
    expect(d.untouched).toBe(2);
    expect(d.recognition).toBe(0);
    expect(d.production).toBe(0);
  });

  it('trennt Verstehen und Selbst-Sagen anhand der Stufe', () => {
    const seen = (id: string, stage: 'recognition' | 'production') => ({
      ...initialState(id, NOW),
      stage,
      status: 'learning' as const,
      history: [{ at: NOW, result: 'good' as const, segmentId: 's' }],
    });
    const d = directionSplit([seen('a', 'recognition'), seen('b', 'production'), seen('c', 'production')]);
    expect(d).toEqual({ untouched: 0, recognition: 1, production: 2 });
  });

  it('die drei Eimer ergeben zusammen immer die Gesamtzahl', () => {
    const states = [
      initialState('a', NOW),
      { ...initialState('b', NOW), status: 'learning' as const, history: [{ at: NOW, result: 'good' as const, segmentId: 's' }] },
      { ...initialState('c', NOW), stage: 'production' as const, status: 'learning' as const, history: [{ at: NOW, result: 'good' as const, segmentId: 's' }] },
    ];
    const d = directionSplit(states);
    expect(d.untouched + d.recognition + d.production).toBe(states.length);
  });
});
