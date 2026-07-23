// Unit-Tests für den FSRS-Formelkern. Zweck: sicherstellen, dass die Formeln
// kalibriert und monoton sind (adversarialer Faktencheck, Stufe E) — der Motor
// darüber (memoryEngine) verlässt sich darauf.

import { describe, expect, it } from 'vitest';
import {
  DEFAULT_W,
  initialDifficulty,
  initialStability,
  intervalForRetention,
  nextDifficulty,
  nextForgetStability,
  nextRecallStability,
  retrievability,
} from './fsrs';

describe('fsrs — Vergessenskurve & Intervall', () => {
  it('R(S,S) = 0.9 (Kurve auf Ziel-Retention geeicht)', () => {
    for (const s of [1, 3.173, 20, 200]) {
      expect(retrievability(s, s)).toBeCloseTo(0.9, 6);
    }
  });

  it('Retrievability fällt streng monoton mit der Zeit', () => {
    const s = 10;
    expect(retrievability(1, s)).toBeGreaterThan(retrievability(5, s));
    expect(retrievability(5, s)).toBeGreaterThan(retrievability(20, s));
  });

  it('Intervall bei Ziel-Retention 0.9 entspricht der Stabilität', () => {
    for (const s of [1, 10, 90, 365]) {
      expect(intervalForRetention(s, 0.9)).toBeCloseTo(s, 6);
    }
  });

  it('niedrigere geforderte Retention → längeres Intervall', () => {
    expect(intervalForRetention(10, 0.8)).toBeGreaterThan(intervalForRetention(10, 0.9));
    expect(intervalForRetention(10, 0.95)).toBeLessThan(intervalForRetention(10, 0.9));
  });
});

describe('fsrs — Anfangszustand', () => {
  it('Anfangsstabilität = w[grade-1]', () => {
    expect(initialStability(1)).toBeCloseTo(DEFAULT_W[0]);
    expect(initialStability(3)).toBeCloseTo(DEFAULT_W[2]);
  });

  it('Anfangsschwierigkeit fällt mit besserer Bewertung und bleibt in [1,10]', () => {
    const d1 = initialDifficulty(1);
    const d3 = initialDifficulty(3);
    const d4 = initialDifficulty(4);
    expect(d1).toBeGreaterThan(d3);
    expect(d3).toBeGreaterThan(d4);
    for (const d of [d1, d3, d4]) {
      expect(d).toBeGreaterThanOrEqual(1);
      expect(d).toBeLessThanOrEqual(10);
    }
  });
});

describe('fsrs — Fortschreibung', () => {
  it('good senkt die Schwierigkeit nicht, again/hard erhöhen sie (in [1,10])', () => {
    const d = 5;
    expect(nextDifficulty(d, 3)).toBeLessThanOrEqual(d + 0.01); // good ~ neutral
    expect(nextDifficulty(d, 1)).toBeGreaterThan(d); // again → schwerer
    expect(nextDifficulty(d, 2)).toBeGreaterThan(nextDifficulty(d, 3)); // hard > good
    expect(nextDifficulty(9.9, 1)).toBeLessThanOrEqual(10); // Klemme oben
  });

  it('erfolgreicher Abruf erhöht die Stabilität; Easy > Good > Hard', () => {
    const S = 10;
    const D = 5;
    const R = 0.9;
    const hard = nextRecallStability(D, S, R, 2);
    const good = nextRecallStability(D, S, R, 3);
    const easy = nextRecallStability(D, S, R, 4);
    expect(hard).toBeGreaterThan(S);
    expect(good).toBeGreaterThan(hard);
    expect(easy).toBeGreaterThan(good);
  });

  it('Fehlabruf erhöht die Stabilität nie (S_forget ≤ S)', () => {
    const S = 50;
    expect(nextForgetStability(5, S, 0.4)).toBeLessThanOrEqual(S);
    expect(nextForgetStability(9, S, 0.9)).toBeLessThanOrEqual(S);
  });
});
