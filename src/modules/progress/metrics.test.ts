import { describe, expect, it } from 'vitest';
import { computeMetrics, isStable } from './metrics';
import { initialState } from '../memory/memoryEngine';
import type { ChunkState } from '../../domain/chunk';

const NOW = 1_700_000_000_000;

function make(overrides: Partial<ChunkState>): ChunkState {
  return { ...initialState('x', NOW), ...overrides };
}

describe('metrics', () => {
  it('counts a chunk stable only in maintenance + production + interval ≥ 90d', () => {
    const stable = make({ status: 'maintenance', stage: 'production', intervalDays: 120 });
    expect(isStable(stable)).toBe(true);

    // recognition only → not stable, even at a long interval
    expect(isStable(make({ status: 'maintenance', stage: 'recognition', intervalDays: 120 }))).toBe(
      false,
    );
    // too short an interval → not stable
    expect(isStable(make({ status: 'maintenance', stage: 'production', intervalDays: 40 }))).toBe(
      false,
    );
  });

  it('computeMetrics reports active, stable and due counts', () => {
    const states: ChunkState[] = [
      make({ chunkId: 'new', status: 'new' }), // untouched → not active
      make({ chunkId: 'learn', status: 'learning', history: [{ at: NOW, result: 'good', segmentId: 's' }] }),
      make({ chunkId: 'stable', status: 'maintenance', stage: 'production', intervalDays: 100 }),
      make({ chunkId: 'due', status: 'learning', dueAt: NOW - 1000, history: [{ at: NOW, result: 'good', segmentId: 's' }] }),
    ];
    const m = computeMetrics(states, NOW);
    expect(m.active).toBe(3); // learn, stable, due (new untouched excluded)
    expect(m.stable).toBe(1);
    expect(m.dueNow).toBeGreaterThanOrEqual(1);
  });
});
