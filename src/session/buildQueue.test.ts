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

  it('theme focus prefers new chunks of that category for the scarce slots', () => {
    // Two themes; without focus, insertion order decides. With focus on 'b',
    // 'b'-chunks should fill the one new slot.
    const states = [
      initialState('a1', NOW),
      initialState('a2', NOW),
      initialState('b1', NOW),
    ];
    const categoryByChunkId = { a1: 'a', a2: 'a', b1: 'b' };
    const q = buildQueue(states, NOW, 1, { categoryByChunkId, categoryId: 'b' });
    expect(q).toEqual(['b1']); // focused theme wins the slot
  });

  it('theme focus never biases due maintenance — only new intake', () => {
    const states = [
      reviewedDue('r-old'), // due maintenance, category 'a'
      initialState('b1', NOW), // new, category 'b' (focused)
    ];
    const categoryByChunkId = { 'r-old': 'a', b1: 'b' };
    const q = buildQueue(states, NOW, 3, { categoryByChunkId, categoryId: 'b' });
    // maintenance still comes first regardless of focus; the new one follows
    expect(q[0]).toBe('r-old');
    expect(q).toContain('b1');
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

// Anti-Klippe an der einzelnen Wendung: Nach einem „Nochmal" darf der Kontext
// nicht wechseln. Kontextvariation ist Schritt 4 und gehört hinter den Erfolg.
describe('Kontext beim Nachlernen', () => {
  const chunk = seedChunks[0];
  const kontexte = seedSegments.filter((s) => s.chunkIds.includes(chunk.id));

  const stand = (o: Partial<ChunkState>): ChunkState => ({ ...initialState(chunk.id, NOW), ...o });

  it('zeigt nach einem „Nochmal" DENSELBEN Satz noch einmal', () => {
    expect(kontexte.length, 'Testvoraussetzung: mehrere Kontexte').toBeGreaterThan(1);
    const gescheitert = stand({
      seenSegmentIds: [kontexte[0].id],
      history: [{ at: NOW, result: 'again', segmentId: kontexte[0].id }],
    });
    expect(pickSegmentForChunk(chunk, gescheitert, seedSegments)?.id).toBe(kontexte[0].id);
  });

  it('variiert nach einem Erfolg wieder', () => {
    const gelungen = stand({
      seenSegmentIds: [kontexte[0].id],
      history: [{ at: NOW, result: 'good', segmentId: kontexte[0].id }],
    });
    expect(pickSegmentForChunk(chunk, gelungen, seedSegments)?.id).toBe(kontexte[1].id);
  });

  it('fällt zurück, wenn der gescheiterte Satz nicht mehr existiert', () => {
    const weg = stand({
      seenSegmentIds: [],
      history: [{ at: NOW, result: 'again', segmentId: 's-gibt-es-nicht' }],
    });
    expect(pickSegmentForChunk(chunk, weg, seedSegments)?.id).toBe(kontexte[0].id);
  });
});
