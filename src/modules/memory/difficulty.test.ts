import { describe, expect, it } from 'vitest';
import {
  NEW_BASE,
  NEW_MAX,
  NEW_MIN,
  SUCCESS_BAND,
  bandStatus,
  recentSuccessRate,
  recommendedNewCount,
} from './difficulty';
import { initialState } from './memoryEngine';
import type { ChunkState, ReviewResult } from '../../domain/chunk';

const NOW = 1_700_000_000_000;

// Build a chunk whose history is the given results (oldest → newest).
function withHistory(results: ReviewResult[]): ChunkState {
  return {
    ...initialState('c', NOW),
    history: results.map((result, i) => ({ at: NOW + i, result, segmentId: 's' })),
  };
}

describe('difficulty — recentSuccessRate', () => {
  it('returns null below the minimum sample size', () => {
    expect(recentSuccessRate([withHistory(['good', 'good'])])).toBeNull();
  });

  it('computes the share of good recalls', () => {
    // 4 good / 5 = 0.8
    expect(recentSuccessRate([withHistory(['good', 'good', 'again', 'good', 'good'])])).toBeCloseTo(
      0.8,
    );
  });

  it('only considers the most recent window', () => {
    const many = withHistory(Array(30).fill('again') as ReviewResult[]);
    // newest 20 are all 'again' → 0
    expect(recentSuccessRate([many], 20)).toBe(0);
  });
});

describe('difficulty — recommendedNewCount (band control, BVA)', () => {
  it('no data → baseline', () => {
    expect(recommendedNewCount(null)).toBe(NEW_BASE);
  });
  it('above the band (too easy) → more new', () => {
    expect(recommendedNewCount(SUCCESS_BAND.max + 0.01)).toBe(NEW_MAX);
  });
  it('below the band (too hard) → fewer new', () => {
    expect(recommendedNewCount(SUCCESS_BAND.min - 0.01)).toBe(NEW_MIN);
  });
  it('exactly on the band edges → steady baseline', () => {
    expect(recommendedNewCount(SUCCESS_BAND.min)).toBe(NEW_BASE);
    expect(recommendedNewCount(SUCCESS_BAND.max)).toBe(NEW_BASE);
  });
});

describe('difficulty — bandStatus', () => {
  it('maps rate to a human status', () => {
    expect(bandStatus(null)).toBe('unknown');
    expect(bandStatus(0.95)).toBe('zu leicht');
    expect(bandStatus(0.5)).toBe('zu fordernd');
    expect(bandStatus(0.82)).toBe('im Flow-Band');
  });
});
