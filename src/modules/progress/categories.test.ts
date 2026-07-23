// Tests der Themen-Abdeckung: ehrlich (bewiesen stabil), in Reihenfolge,
// unbekannte Kategorien zählen nicht.

import { describe, expect, it } from 'vitest';
import { categoryProgress } from './categories';
import { initialState } from '../memory/memoryEngine';
import type { Category, Chunk, ChunkState } from '../../domain/chunk';

const NOW = 1_700_000_000_000;

const categories: Category[] = [
  { id: 'b', title: 'B', blurb: '', order: 2 },
  { id: 'a', title: 'A', blurb: '', order: 1 },
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
        intervalDays: 50, // gewachsen, unbewiesen → reifend
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
