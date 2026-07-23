import { describe, expect, it } from 'vitest';
import { buildQueue, MAX_NEW_PER_SESSION, pickSegmentForChunk } from './buildQueue';
import { DAY_MS, initialState } from '../modules/memory/memoryEngine';
import type { Chunk, ChunkState } from '../domain/chunk';
import { seedChunks, seedSegments } from '../modules/content/seedSegments';

const NOW = 1_700_000_000_000;

function reviewedDue(id: string): ChunkState {
  return {
    ...initialState(id, NOW),
    status: 'learning',
    lastReviewedAt: NOW - 2 * DAY_MS,
    dueAt: NOW - DAY_MS,
    history: [{ at: NOW - 2 * DAY_MS, result: 'good', segmentId: 's' }],
  };
}

describe('buildQueue', () => {
  it('caps brand-new chunks per session but never caps due maintenance', () => {
    const states: ChunkState[] = [
      reviewedDue('r1'),
      reviewedDue('r2'),
      ...Array.from({ length: 6 }, (_, i) => initialState(`n${i}`, NOW)), // all new, due now
    ];
    const q = buildQueue(states, NOW);
    const newInQueue = q.filter((id) => id.startsWith('n')).length;
    expect(newInQueue).toBe(MAX_NEW_PER_SESSION);
    // both reviewed maintenance chunks are present and come first
    expect(q.slice(0, 2).sort()).toEqual(['r1', 'r2']);
  });

  it('respects a custom maxNew', () => {
    const states = Array.from({ length: 5 }, (_, i) => initialState(`n${i}`, NOW));
    expect(buildQueue(states, NOW, 1)).toHaveLength(1);
  });
});

describe('pickSegmentForChunk (context variation)', () => {
  it('prefers a segment the chunk has not been seen in yet', () => {
    const chunk = seedChunks.find((c) => c.id === 'c-hej') as Chunk;
    const contexts = seedSegments.filter((s) => s.chunkIds.includes('c-hej'));
    expect(contexts.length).toBeGreaterThanOrEqual(2); // seed gives ≥2 contexts

    const state = { ...initialState('c-hej', NOW), seenSegmentIds: [contexts[0].id] };
    const picked = pickSegmentForChunk(chunk, state, seedSegments);
    expect(picked?.id).toBe(contexts[1].id); // the unseen one
  });
});
