// ISTQB-strukturierte Tests für die Memory-Engine (Modul-Meilenstein, Stufe F).
// Begleitet docs/ISTQB-Testbericht-Memory-Engine.md — Rückverfolgbarkeit über
// die Test-Namen (ST = Zustandsübergang, DT = Entscheidungstabelle, BVA =
// Grenzwertanalyse).

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

// Drive N successful reviews from a fresh chunk, advancing the clock each time.
function runGoods(n: number): ChunkState {
  let s = initialState('c', NOW);
  let t = NOW;
  for (let i = 0; i < n; i++) {
    s = schedule(s, 'good', `seg${i}`, t);
    t = s.dueAt;
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
      successStreak: 8,
    });
    const s = schedule(maint, 'again', 's', NOW);
    expect(s.status).toBe('learning');
    expect(s.intervalDays).toBe(0);
    expect(s.stage).toBe('recognition'); // demoted — kann nicht mehr produzieren
  });

  it('ST5 Weg bis maintenance ist erreichbar (reine Good-Kette)', () => {
    // dokumentierter Pfad: ~7 erfolgreiche Abrufe → maintenance, Intervall groß
    const s = runGoods(7);
    expect(s.status).toBe('maintenance');
    expect(s.stage).toBe('production');
    expect(s.intervalDays).toBeGreaterThanOrEqual(STABLE_INTERVAL_DAYS);
    // ...aber noch NICHT bewiesen stabil (kein Abruf nach dem langen Intervall)
    expect(s.provenStableAt).toBeNull();
  });

  it('ST6 stabil erst nach erfolgreichem Abruf bei Intervall ≥ Horizont', () => {
    const s = runGoods(8); // ein weiterer Good bei Intervall ≥ 90 → beweist Stabilität
    expect(s.provenStableAt).not.toBeNull();
  });
});

describe('DT · Entscheidungstabelle schedule(result × wasNew)', () => {
  const fresh = () => initialState('c', NOW); // wasNew = true (intervalDays 0)
  const seasoned = () => withState({ intervalDays: 10, ease: 2.0, successStreak: 3 });

  it('DT1 (neu, good) → Intervall 1', () => {
    expect(schedule(fresh(), 'good', 's', NOW).intervalDays).toBe(1);
  });
  it('DT2 (neu, hard) → Intervall 1', () => {
    expect(schedule(fresh(), 'hard', 's', NOW).intervalDays).toBe(1);
  });
  it('DT3 (neu, again) → Intervall 0', () => {
    expect(schedule(fresh(), 'again', 's', NOW).intervalDays).toBe(0);
  });
  it('DT4 (reif, good) → round(interval*ease), wächst', () => {
    const s = schedule(seasoned(), 'good', 's', NOW);
    expect(s.intervalDays).toBe(Math.round(10 * 2.05)); // ease 2.0→2.05
    expect(s.intervalDays).toBeGreaterThan(10);
  });
  it('DT5 (reif, hard) → round(interval*1.2), wächst langsamer', () => {
    expect(schedule(seasoned(), 'hard', 's', NOW).intervalDays).toBe(Math.round(10 * 1.2));
  });
  it('DT6 (reif, again) → Intervall 0 (Relearn)', () => {
    expect(schedule(seasoned(), 'again', 's', NOW).intervalDays).toBe(0);
  });
});

describe('BVA · Grenzwerte', () => {
  it('BVA1 Stabilitäts-Beweis am Horizont: preInterval 89 nein / 90 ja / 91 ja', () => {
    const prod = (interval: number) =>
      withState({ status: 'maintenance', stage: 'production', intervalDays: interval, successStreak: 5 });
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

  it('BVA3 ease-Klemme: floor 1.3 (viele again) / ceil 2.8 (viele good)', () => {
    let s = withState({ ease: 1.4 });
    for (let i = 0; i < 5; i++) s = schedule(s, 'again', 's', NOW);
    expect(s.ease).toBeGreaterThanOrEqual(1.3);
    expect(s.ease).toBeCloseTo(1.3);

    const up = runGoods(30);
    expect(up.ease).toBeLessThanOrEqual(2.8);
  });

  it('BVA4 getDue: genau fällig (=now) zählt, Zukunft nicht', () => {
    const onTime = withState({ chunkId: 'a', dueAt: NOW });
    const future = withState({ chunkId: 'b', dueAt: NOW + DAY_MS });
    expect(getDue([onTime, future], NOW).map((s) => s.chunkId)).toEqual(['a']);
  });
});
