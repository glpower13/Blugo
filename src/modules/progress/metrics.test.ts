import { describe, expect, it } from 'vitest';
import { computeMetrics, isStable } from './metrics';
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

  it('coverage is the share of active chunks whose last retrieval was good', () => {
    const good = make({ chunkId: 'g', status: 'learning', history: [{ at: NOW, result: 'good', segmentId: 's' }] });
    const bad = make({ chunkId: 'b', status: 'learning', history: [{ at: NOW, result: 'again', segmentId: 's' }] });
    const untouched = make({ chunkId: 'u', status: 'new' }); // excluded from coverage
    const m = computeMetrics([good, bad, untouched], NOW);
    expect(m.active).toBe(2);
    expect(m.coverage).toBeCloseTo(0.5); // 1 of 2 active understood
  });

  it('coverage is 0 when nothing is active', () => {
    expect(computeMetrics([make({ status: 'new' })], NOW).coverage).toBe(0);
  });
});
