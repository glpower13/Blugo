import { describe, expect, it } from 'vitest';
import {
  NEW_BASE,
  NEW_MAX,
  NEW_MIN,
  SUCCESS_BAND,
  bandStatus,
  recentSuccessRate,
  newCountFor,
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
  // Alle vier Werte sind SICHTBARER deutscher Text — „unknown" stand vorher als
  // englisches Wort in einer deutschen Oberfläche, und „im Flow-Band" ergab
  // zusammen mit dem Label davor „Erfolgsband: im Flow-Band" (Copy-Audit).
  it('maps rate to a human status', () => {
    expect(bandStatus(null)).toBe('noch offen');
    expect(bandStatus(0.95)).toBe('zu leicht');
    expect(bandStatus(0.5)).toBe('zu fordernd');
    expect(bandStatus(0.82)).toBe('genau richtig');
  });
});

// Der Deckel aus den Einstellungen (docs/gremium-einstellungen.md). Ein Regler,
// der nichts tut, ist schlimmer als keiner — deshalb steht seine Wirkung hier.
describe('newCountFor — Empfehlung mit Deckel', () => {
  it('lässt die Engine allein entscheiden, wenn kein Deckel gesetzt ist', () => {
    expect(newCountFor(null, null)).toBe(recommendedNewCount(null));
    expect(newCountFor(0.95, null)).toBe(recommendedNewCount(0.95));
  });

  it('bremst, wenn der Deckel kleiner ist als die Empfehlung', () => {
    expect(newCountFor(0.95, 1)).toBe(1);
  });

  it('BESCHLEUNIGT NIE über die Empfehlung hinaus — sonst wäre er eine Abkürzung an der Anti-Klippe vorbei', () => {
    const auto = recommendedNewCount(0.5); // zu fordernd → Engine drosselt
    expect(newCountFor(0.5, 8)).toBe(auto);
    expect(newCountFor(0.5, 8)).toBeLessThan(8);
  });

  it('kommt mit einem unsinnigen Deckel klar', () => {
    expect(newCountFor(0.9, -3)).toBe(0);
  });
});
