// Tests der Themen-Abdeckung: ehrlich (bewiesen stabil), in Reihenfolge,
// unbekannte Kategorien zählen nicht.

import { describe, expect, it } from 'vitest';
import { areaProgress, categoryProgress } from './categories';
import { initialState } from '../memory/memoryEngine';
import type { Area, Category, Chunk, ChunkState } from '../../domain/chunk';

const NOW = 1_700_000_000_000;

const categories: Category[] = [
  { id: 'b', areaId: 'area-2', title: 'B', blurb: '', order: 2 },
  { id: 'a', areaId: 'area-1', title: 'A', blurb: '', order: 1 },
];

const chunks: Chunk[] = [
  { id: 'c1', categoryId: 'a', sv: 's1', de: 'd1', decoding: [] },
  { id: 'c2', categoryId: 'a', sv: 's2', de: 'd2', decoding: [] },
  { id: 'c3', categoryId: 'b', sv: 's3', de: 'd3', decoding: [] },
  { id: 'c-orphan', categoryId: 'gibt-es-nicht', sv: 's4', de: 'd4', decoding: [] },
];

function make(id: string, o: Partial<ChunkState>): ChunkState {
  return { ...initialState(id, NOW), ...o };
}

describe('categoryProgress', () => {
  it('liefert die Themen in category.order', () => {
    const p = categoryProgress(categories, chunks, {}, NOW);
    expect(p.map((x) => x.category.id)).toEqual(['a', 'b']); // order 1 vor 2
  });

  it('zählt total pro Thema; unbekannte Kategorie erzeugt keinen Eimer', () => {
    const p = categoryProgress(categories, chunks, {}, NOW);
    expect(p.find((x) => x.category.id === 'a')!.total).toBe(2);
    expect(p.find((x) => x.category.id === 'b')!.total).toBe(1);
    // 'c-orphan' gehört zu keiner existierenden Kategorie → taucht nirgends auf
    expect(p).toHaveLength(2);
  });

  it('ist ehrlich: stabil nur bei bewiesener Stabilität (provenStableAt)', () => {
    const states: Record<string, ChunkState> = {
      // langes GEPLANTES Intervall allein ist NICHT stabil (anti-Goodhart)
      c1: make('c1', { status: 'maintenance', stage: 'production', intervalDays: 120 }),
      // erst ein echter Beweis zählt
      c2: make('c2', {
        status: 'maintenance',
        stage: 'production',
        intervalDays: 120,
        provenStableAt: NOW,
      }),
    };
    const a = categoryProgress(categories, chunks, states, NOW).find((x) => x.category.id === 'a')!;
    expect(a.stable).toBe(1); // nur c2
    expect(a.total).toBe(2);
  });

  it('zählt aktiv, reifend und fällig getrennt', () => {
    const states: Record<string, ChunkState> = {
      c1: make('c1', {
        status: 'learning',
        stage: 'production',
        intervalDays: 50,
        maturedAt: NOW, // eine ≥21-Tage-Pause ÜBERSTANDEN, unbewiesen → reifend
        dueAt: NOW - 1000, // fällig
        history: [{ at: NOW, result: 'good', segmentId: 's' }], // aktiv
      }),
      c2: make('c2', { status: 'new', dueAt: NOW + 10 * 24 * 3600 * 1000 }), // unberührt, nicht fällig
    };
    const a = categoryProgress(categories, chunks, states, NOW).find((x) => x.category.id === 'a')!;
    expect(a.active).toBe(1);
    expect(a.maturing).toBe(1);
    expect(a.dueNow).toBe(1);
  });
});

describe('die zwei Balken-Zonen (bewiesen / reift)', () => {
  // Der ehrliche Balken stapelt beide Zonen — sie dürfen sich NIE überschneiden,
  // sonst zählt eine Wendung doppelt und der Balken lügt.
  it('eine bewiesen stabile Wendung zählt nie zusätzlich als reifend', () => {
    const states: Record<string, ChunkState> = {
      c1: make('c1', {
        status: 'maintenance',
        stage: 'production',
        intervalDays: 120,
        maturedAt: NOW, // erfüllt auch die „reift"-Bedingung
        provenStableAt: NOW, // … ist aber BEWIESEN
      }),
    };
    const a = categoryProgress(categories, chunks, states, NOW).find((x) => x.category.id === 'a')!;
    expect(a.stable).toBe(1);
    expect(a.maturing).toBe(0);
    expect(a.stable + a.maturing).toBeLessThanOrEqual(a.total); // Balken bleibt ≤ 100 %
  });

  it('bewiesen + reift überschreitet nie die Gesamtzahl', () => {
    const states: Record<string, ChunkState> = {
      c1: make('c1', {
        status: 'maintenance',
        stage: 'production',
        intervalDays: 120,
        maturedAt: NOW,
        provenStableAt: NOW,
      }),
      c2: make('c2', { status: 'maintenance', stage: 'production', intervalDays: 40, maturedAt: NOW }), // reift
    };
    const a = categoryProgress(categories, chunks, states, NOW).find((x) => x.category.id === 'a')!;
    expect(a.stable).toBe(1);
    expect(a.maturing).toBe(1);
    expect(a.stable + a.maturing).toBeLessThanOrEqual(a.total);
  });
});

describe('areaProgress', () => {
  const areas: Area[] = [
    { id: 'area-2', title: 'Zwei', blurb: '', order: 2 },
    { id: 'area-1', title: 'Eins', blurb: '', order: 1 },
  ];

  it('gruppiert Themen unter ihren Bereich und summiert ehrlich', () => {
    const states: Record<string, ChunkState> = {
      c1: make('c1', { provenStableAt: NOW }), // Thema a (area-1)
      // Fällig heißt: schon begegnet UND wieder dran. Eine nie gesehene Wendung
      // ist Vorrat, keine Schuld (Ehrlichkeits-Audit 2026-07-25).
      c3: make('c3', {
        status: 'learning',
        dueAt: NOW - 1,
        history: [{ at: NOW - 2, result: 'good', segmentId: 's' }],
      }),
    };
    const cp = categoryProgress(categories, chunks, states, NOW);
    const ap = areaProgress(areas, cp);

    expect(ap.map((x) => x.area.id)).toEqual(['area-1', 'area-2']); // nach area.order
    const a1 = ap.find((x) => x.area.id === 'area-1')!;
    expect(a1.total).toBe(2); // c1 + c2 gehören zu Thema a
    expect(a1.stable).toBe(1); // nur c1 bewiesen
    expect(a1.categories.map((c) => c.category.id)).toEqual(['a']);

    const a2 = ap.find((x) => x.area.id === 'area-2')!;
    expect(a2.total).toBe(1); // c3
    expect(a2.dueNow).toBe(1);
  });

  it('lässt leere Bereiche weg (kein Phantom-Eimer)', () => {
    const areasWithEmpty: Area[] = [...areas, { id: 'area-leer', title: 'Leer', blurb: '', order: 3 }];
    const cp = categoryProgress(categories, chunks, {}, NOW);
    const ap = areaProgress(areasWithEmpty, cp);
    expect(ap.find((x) => x.area.id === 'area-leer')).toBeUndefined();
  });
});
