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

  // P3 (docs/gremium-sprachpartner.md): Gesprochenes wird VERMERKT, aber der
  // Terminplan darf davon nicht abweichen — sonst wäre Sprechen ein zweiter,
  // leichterer Maßstab statt eines zweiten Weges.
  it('records a spoken retrieval in the history', () => {
    const s = schedule(initialState('c1', NOW), 'good', 'seg1', NOW, { spoken: true });
    expect(s.history[0].spoken).toBe(true);
  });

  it('leaves the flag off when nothing was spoken', () => {
    const s = schedule(initialState('c1', NOW), 'good', 'seg1', NOW);
    expect(s.history[0].spoken).toBeUndefined();
  });

  it('schedules a spoken retrieval EXACTLY like a typed one', () => {
    const typed = schedule(initialState('c1', NOW), 'good', 'seg1', NOW);
    const spoken = schedule(initialState('c1', NOW), 'good', 'seg1', NOW, { spoken: true });
    expect(spoken.dueAt).toBe(typed.dueAt);
    expect(spoken.intervalDays).toBe(typed.intervalDays);
    expect(spoken.stability).toBe(typed.stability);
    expect(spoken.difficulty).toBe(typed.difficulty);
    expect(spoken.stage).toBe(typed.stage);
    expect(spoken.provenStableAt).toBe(typed.provenStableAt);
  });

  // Die zwei GEMESSENEN Vermerke (Ehrlichkeits-Audit 2026-07-25). Beide halten
  // fest, was tatsächlich passiert ist — nicht, was geplant war.
  it('vermerkt „reift" erst nach einer ÜBERSTANDENEN 21-Tage-Pause in Produktion', () => {
    const kurz = { ...initialState('c1', NOW), stage: 'production' as const, intervalDays: 20 };
    expect(schedule(kurz, 'good', 'seg1', NOW).maturedAt).toBeNull();

    const lang = { ...initialState('c1', NOW), stage: 'production' as const, intervalDays: 21 };
    expect(schedule(lang, 'good', 'seg1', NOW).maturedAt).toBe(NOW);

    // Wiedererkennen zählt nicht — der Vermerk gilt nur für das Selbst-Sagen.
    const nurErkannt = { ...initialState('c1', NOW), intervalDays: 60 };
    expect(schedule(nurErkannt, 'good', 'seg1', NOW).maturedAt).toBeNull();
  });

  it('vermerkt jeden Fehlschlag — daran verfällt ein früherer Beweis', () => {
    const bewiesen = {
      ...initialState('c1', NOW),
      stage: 'production' as const,
      intervalDays: 120,
      provenStableAt: NOW,
      maturedAt: NOW,
    };
    const gefallen = schedule(bewiesen, 'again', 'seg1', NOW + DAY_MS);
    expect(gefallen.lapsedAt).toBe(NOW + DAY_MS);
    // Der historische Vermerk bleibt stehen — die Anzeige rechnet ihn heraus.
    expect(gefallen.provenStableAt).toBe(NOW);
  });

  it('getDue returns only chunks whose dueAt has passed, most overdue first', () => {
    const a = { ...initialState('a', NOW), dueAt: NOW - 2 * DAY_MS };
    const b = { ...initialState('b', NOW), dueAt: NOW - 1 * DAY_MS };
    const c = { ...initialState('c', NOW), dueAt: NOW + 5 * DAY_MS };
    const due = getDue([c, b, a], NOW);
    expect(due.map((s) => s.chunkId)).toEqual(['a', 'b']);
  });
});
