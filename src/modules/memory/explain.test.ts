// Tests der Selbstauskunft. Die Regel dahinter: Was hier steht, muss aus dem
// ECHTEN Zustand kommen und mit der echten Planung übereinstimmen — sonst wäre
// die Erklärung eine zweite, hübschere Wahrheit.

import { describe, expect, it } from 'vitest';
import { explainSchedule, whyNowSentence } from './explain';
import { DAY_MS, initialState, schedule, STABLE_INTERVAL_DAYS } from './memoryEngine';
import type { ChunkState } from '../../domain/chunk';

const NOW = 1_700_000_000_000;

function st(o: Partial<ChunkState> = {}): ChunkState {
  return { ...initialState('c1', NOW), ...o };
}

describe('explainSchedule', () => {
  it('nennt eine nie begegnete Wendung neu und erfindet keine Vergangenheit', () => {
    const e = explainSchedule(st(), NOW);
    expect(e.isNew).toBe(true);
    expect(e.sinceLastDays).toBeNull();
    expect(whyNowSentence(e)).toMatch(/zum ersten Mal/);
  });

  it('rechnet die Überfälligkeit aus, aber nie ins Negative', () => {
    const late = explainSchedule(
      st({ lastReviewedAt: NOW - 14 * DAY_MS, intervalDays: 10 }),
      NOW,
    );
    expect(late.sinceLastDays).toBe(14);
    expect(late.overdueDays).toBe(4);

    const early = explainSchedule(st({ lastReviewedAt: NOW - 2 * DAY_MS, intervalDays: 10 }), NOW);
    expect(early.overdueDays).toBe(0);
  });

  it('sagt dasselbe voraus, was die Planung dann wirklich tut', () => {
    const state = st({ lastReviewedAt: NOW - 12 * DAY_MS, intervalDays: 11, stability: 11 });
    const e = explainSchedule(state, NOW);
    const real = schedule(state, 'good', 'echt', NOW);
    expect(e.nextIfGoodDays).toBe(real.intervalDays);
  });

  it('berücksichtigt das Erhalt-Ziel in der Vorschau', () => {
    const state = st({ lastReviewedAt: NOW - 12 * DAY_MS, intervalDays: 11, stability: 11 });
    const relaxed = explainSchedule(state, NOW, 0.8);
    const strict = explainSchedule(state, NOW, 0.95);
    expect(relaxed.nextIfGoodDays).toBeGreaterThan(strict.nextIfGoodDays);
  });
});

describe('missingForProof — was zum Beweis noch fehlt', () => {
  it('nennt bei einer frischen Wendung beide Bedingungen', () => {
    const e = explainSchedule(st(), NOW);
    expect(e.missingForProof.join(' ')).toMatch(/du sagst sie selbst/);
    expect(e.missingForProof.join(' ')).toMatch(new RegExp(String(STABLE_INTERVAL_DAYS)));
  });

  it('sagt kurz vor dem Beweis, dass nur noch dieser Abruf fehlt', () => {
    const e = explainSchedule(st({ stage: 'production', intervalDays: 120 }), NOW);
    expect(e.missingForProof).toHaveLength(1);
    expect(e.missingForProof[0]).toMatch(/nur noch dieser eine Abruf/);
  });

  it('verlangt bei einer bewiesenen Wendung gar nichts mehr', () => {
    const e = explainSchedule(st({ provenStableAt: NOW, stage: 'production' }), NOW);
    expect(e.proven).toBe(true);
    expect(e.missingForProof).toEqual([]);
  });
});
