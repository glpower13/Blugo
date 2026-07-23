// ISTQB-strukturierte Tests für die Memory-Engine (Modul-Meilenstein, Stufe F).
// Begleitet docs/ISTQB-Testbericht-Memory-Engine.md — Rückverfolgbarkeit über
// die Test-Namen (ST = Zustandsübergang, DT = Entscheidungstabelle, BVA =
// Grenzwertanalyse). Terminplaner-Kern seit Loop 7: FSRS (siehe ./fsrs.ts).

import { describe, expect, it } from 'vitest';
import {
  DAY_MS,
  STABLE_INTERVAL_DAYS,
  getDue,
  initialState,
  schedule,
} from './memoryEngine';
import { isStable } from '../progress/metrics';
import { buildQueue, MAX_NEW_PER_SESSION } from '../../session/buildQueue';
import type { ChunkState } from '../../domain/chunk';

const NOW = 1_700_000_000_000;

// Helper: force a chunk into an arbitrary state for boundary construction.
function withState(o: Partial<ChunkState>): ChunkState {
  return { ...initialState('x', NOW), ...o };
}

// Drive N successful reviews from a fresh chunk, advancing the clock to each due date.
function runGoods(n: number): ChunkState {
  let s = initialState('c', NOW);
  let t = NOW;
  for (let i = 0; i < n; i++) {
    s = schedule(s, 'good', `seg${i}`, t);
    t = s.dueAt;
  }
  return s;
}

// Drive good reviews until the scheduled interval reaches the stability horizon.
function runGoodsUntilHorizon(): ChunkState {
  let s = initialState('c', NOW);
  let t = NOW;
  let guard = 0;
  while (s.intervalDays < STABLE_INTERVAL_DAYS && guard < 50) {
    s = schedule(s, 'good', `seg${guard}`, t);
    t = s.dueAt;
    guard++;
  }
  return s;
}

describe('ST · Zustandsübergänge (status/stage)', () => {
  it('ST1 new --good--> learning', () => {
    const s = schedule(initialState('c', NOW), 'good', 's', NOW);
    expect(s.status).toBe('learning');
  });

  it('ST2 recognition --2×good--> production (Promotion ab Streak 2)', () => {
    let s = schedule(initialState('c', NOW), 'good', 's', NOW);
    expect(s.stage).toBe('recognition'); // nach 1× noch nicht
    s = schedule(s, 'good', 's2', s.dueAt);
    expect(s.stage).toBe('production'); // nach 2×
  });

  it('ST3 learning --again--> new (Intervall 0, Streak reset)', () => {
    let s = schedule(initialState('c', NOW), 'good', 's', NOW); // learning
    s = schedule(s, 'again', 's', s.dueAt);
    expect(s.status).toBe('new');
    expect(s.intervalDays).toBe(0);
    expect(s.successStreak).toBe(0);
  });

  it('ST4 maintenance --again--> learning + Stage-Demotion auf recognition (E-1)', () => {
    const maint = withState({
      status: 'maintenance',
      stage: 'production',
      intervalDays: 120,
      stability: 200,
      difficulty: 5,
      successStreak: 8,
      lastReviewedAt: NOW - 120 * DAY_MS,
    });
    const s = schedule(maint, 'again', 's', NOW);
    expect(s.status).toBe('learning');
    expect(s.intervalDays).toBe(0);
    expect(s.stage).toBe('recognition'); // demoted — kann nicht mehr produzieren
  });

  it('ST5 reine Good-Kette erreicht maintenance + Horizont, aber NICHT bewiesen stabil', () => {
    const s = runGoodsUntilHorizon();
    expect(s.status).toBe('maintenance');
    expect(s.stage).toBe('production');
    expect(s.intervalDays).toBeGreaterThanOrEqual(STABLE_INTERVAL_DAYS);
    // ...aber noch NICHT bewiesen stabil (kein Abruf NACH dem langen Intervall)
    expect(s.provenStableAt).toBeNull();
  });

  it('ST6 stabil erst nach erfolgreichem Abruf bei Intervall ≥ Horizont', () => {
    const atHorizon = runGoodsUntilHorizon();
    const proven = schedule(atHorizon, 'good', 'seg-final', atHorizon.dueAt);
    expect(proven.provenStableAt).not.toBeNull();
    expect(isStable(proven)).toBe(true); // Kopplung Beweis → Metrik
  });
});

describe('DT · Entscheidungstabelle schedule(result × wasNew) — FSRS-Intervalle', () => {
  const fresh = () => initialState('c', NOW); // wasNew = true (erste Bewertung)
  // "reifer" Chunk mit echtem FSRS-Zustand (schon einmal abgerufen, fällig).
  const seasoned = () =>
    withState({
      status: 'learning',
      stage: 'production',
      intervalDays: 10,
      stability: 10,
      difficulty: 5,
      successStreak: 3,
      lastReviewedAt: NOW - 10 * DAY_MS,
    });

  it('DT1 (neu, good) → FSRS-Anfangsintervall (~3 Tage)', () => {
    expect(schedule(fresh(), 'good', 's', NOW).intervalDays).toBe(3);
  });
  it('DT2 (neu, hard) → kürzeres Anfangsintervall als good, aber ≥ 1', () => {
    const hard = schedule(fresh(), 'hard', 's', NOW).intervalDays;
    const good = schedule(fresh(), 'good', 's', NOW).intervalDays;
    expect(hard).toBeGreaterThanOrEqual(1);
    expect(hard).toBeLessThan(good);
  });
  it('DT3 (neu, again) → Intervall 0', () => {
    expect(schedule(fresh(), 'again', 's', NOW).intervalDays).toBe(0);
  });
  it('DT4 (reif, good) → Intervall UND Stabilität wachsen', () => {
    const s = schedule(seasoned(), 'good', 's', NOW);
    expect(s.intervalDays).toBeGreaterThan(10);
    expect(s.stability).toBeGreaterThan(10);
  });
  it('DT5 (reif, hard) → wächst, aber langsamer als good', () => {
    const hard = schedule(seasoned(), 'hard', 's', NOW).intervalDays;
    const good = schedule(seasoned(), 'good', 's', NOW).intervalDays;
    expect(hard).toBeGreaterThan(10);
    expect(hard).toBeLessThan(good);
  });
  it('DT6 (reif, again) → Intervall 0 (Relearn)', () => {
    expect(schedule(seasoned(), 'again', 's', NOW).intervalDays).toBe(0);
  });
});

describe('BVA · Grenzwerte', () => {
  it('BVA1 Stabilitäts-Beweis am Horizont: preInterval 89 nein / 90 ja / 91 ja', () => {
    const prod = (interval: number) =>
      withState({
        status: 'maintenance',
        stage: 'production',
        intervalDays: interval,
        stability: 200,
        difficulty: 5,
        successStreak: 5,
        lastReviewedAt: NOW - interval * DAY_MS,
      });
    expect(schedule(prod(STABLE_INTERVAL_DAYS - 1), 'good', 's', NOW).provenStableAt).toBeNull();
    const proven = schedule(prod(STABLE_INTERVAL_DAYS), 'good', 's', NOW);
    expect(proven.provenStableAt).not.toBeNull();
    expect(isStable(proven)).toBe(true); // Kopplung Beweis → Metrik
    expect(schedule(prod(STABLE_INTERVAL_DAYS + 1), 'good', 's', NOW).provenStableAt).not.toBeNull();
  });

  it('BVA2 MAX_NEW_PER_SESSION: 2→2, 3→3, 4→3', () => {
    const mk = (n: number) => Array.from({ length: n }, (_, i) => initialState(`n${i}`, NOW));
    expect(buildQueue(mk(2), NOW)).toHaveLength(2);
    expect(buildQueue(mk(3), NOW)).toHaveLength(MAX_NEW_PER_SESSION);
    expect(buildQueue(mk(4), NOW)).toHaveLength(MAX_NEW_PER_SESSION);
  });

  it('BVA3 FSRS-Grenzen: Schwierigkeit in [1,10], Stabilität wächst bei Good-Kette', () => {
    // viele Fehlabrufe → Schwierigkeit steigt, bleibt aber ≤ 10
    let s = initialState('c', NOW);
    let t = NOW;
    for (let i = 0; i < 12; i++) {
      s = schedule(s, 'again', 's', t);
      t = s.dueAt + DAY_MS; // einen Tag weiter (keine identischen Zeitstempel)
    }
    expect(s.difficulty).toBeGreaterThanOrEqual(1);
    expect(s.difficulty).toBeLessThanOrEqual(10);

    // reine Good-Kette → Stabilität wächst deutlich über die Anfangsstabilität
    const up = runGoods(10);
    expect(up.difficulty).toBeGreaterThanOrEqual(1);
    expect(up.stability).toBeGreaterThan(3);
  });

  it('BVA4 getDue: genau fällig (=now) zählt, Zukunft nicht', () => {
    const onTime = withState({ chunkId: 'a', dueAt: NOW });
    const future = withState({ chunkId: 'b', dueAt: NOW + DAY_MS });
    expect(getDue([onTime, future], NOW).map((s) => s.chunkId)).toEqual(['a']);
  });
});
