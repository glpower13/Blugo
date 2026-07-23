// Tests der „bekannt"-Ableitung: nur begegnete Chunks, Ziel ausgeschlossen, gedeckelt.

import { describe, expect, it } from 'vitest';
import { knownPhrases } from './knownChunks';
import { initialState } from '../modules/memory/memoryEngine';
import type { Chunk, ChunkState } from '../domain/chunk';

const NOW = 1_700_000_000_000;

const chunks: Chunk[] = [
  { id: 'a', categoryId: 'c', sv: 'sv-a', de: 'de-a', decoding: [] },
  { id: 'b', categoryId: 'c', sv: 'sv-b', de: 'de-b', decoding: [] },
  { id: 'target', categoryId: 'c', sv: 'sv-t', de: 'de-t', decoding: [] },
  { id: 'fresh', categoryId: 'c', sv: 'sv-f', de: 'de-f', decoding: [] },
];

function active(id: string): ChunkState {
  return { ...initialState(id, NOW), status: 'learning', history: [{ at: NOW, result: 'good', segmentId: 's' }] };
}

describe('knownPhrases', () => {
  it('liefert nur begegnete Chunks, ohne den Ziel-Chunk', () => {
    const states = { a: active('a'), b: active('b'), target: active('target'), fresh: initialState('fresh', NOW) };
    const got = knownPhrases(chunks, states, 'target');
    expect(got.map((k) => k.sv).sort()).toEqual(['sv-a', 'sv-b']); // fresh (new) + target raus
  });

  it('gibt sv und de zurück', () => {
    const got = knownPhrases(chunks, { a: active('a') }, 'target');
    expect(got[0]).toEqual({ sv: 'sv-a', de: 'de-a' });
  });

  it('deckelt die Liste', () => {
    const many: Chunk[] = Array.from({ length: 20 }, (_, i) => ({
      id: `k${i}`,
      categoryId: 'c',
      sv: `s${i}`,
      de: `d${i}`,
      decoding: [],
    }));
    const states: Record<string, ChunkState> = {};
    for (const c of many) states[c.id] = active(c.id);
    expect(knownPhrases(many, states, 'target', 5)).toHaveLength(5);
  });
});
