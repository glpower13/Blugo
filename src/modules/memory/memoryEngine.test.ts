import { describe, expect, it } from 'vitest';
import { DAY_MS, getDue, initialState, schedule } from './memoryEngine';

const NOW = 1_700_000_000_000;

describe('memoryEngine', () => {
  it('creates a new chunk due immediately', () => {
    const s = initialState('c1', NOW);
    expect(s.status).toBe('new');
    expect(s.stage).toBe('recognition');
    expect(s.dueAt).toBe(NOW);
  });

  it('spacing: a good result grows the interval and pushes due into the future', () => {
    const s0 = initialState('c1', NOW);
    const s1 = schedule(s0, 'good', 'seg1', NOW);
    expect(s1.intervalDays).toBeGreaterThanOrEqual(1);
    expect(s1.dueAt).toBe(NOW + s1.intervalDays * DAY_MS);

    const s2 = schedule(s1, 'good', 'seg2', s1.dueAt);
    expect(s2.intervalDays).toBeGreaterThan(s1.intervalDays);
  });

  it('again resets the interval so the chunk relearns this session', () => {
    let s = initialState('c1', NOW);
    s = schedule(s, 'good', 'seg1', NOW);
    s = schedule(s, 'again', 'seg1', s.dueAt);
    expect(s.intervalDays).toBe(0);
    expect(s.successStreak).toBe(0);
  });

  it('promotes recognition → production after repeated success', () => {
    let s = initialState('c1', NOW);
    s = schedule(s, 'good', 'seg1', NOW);
    s = schedule(s, 'good', 'seg2', s.dueAt);
    expect(s.stage).toBe('production');
  });

  it('tracks seen segments for context variation', () => {
    let s = initialState('c1', NOW);
    s = schedule(s, 'good', 'seg1', NOW);
    s = schedule(s, 'good', 'seg1', s.dueAt); // same context again
    expect(s.seenSegmentIds).toEqual(['seg1']);
    s = schedule(s, 'good', 'seg2', s.dueAt);
    expect(s.seenSegmentIds).toEqual(['seg1', 'seg2']);
  });

  it('getDue returns only chunks whose dueAt has passed, most overdue first', () => {
    const a = { ...initialState('a', NOW), dueAt: NOW - 2 * DAY_MS };
    const b = { ...initialState('b', NOW), dueAt: NOW - 1 * DAY_MS };
    const c = { ...initialState('c', NOW), dueAt: NOW + 5 * DAY_MS };
    const due = getDue([c, b, a], NOW);
    expect(due.map((s) => s.chunkId)).toEqual(['a', 'b']);
  });
});
