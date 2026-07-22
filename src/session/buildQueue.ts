// Assembles a day's session (docs/04-product.md): "Wartung zuerst" — due chunks
// (maintenance/learning) before new encounters. Context variation: prefer a
// segment the chunk has NOT been seen in yet (docs/03-method.md, step 4).

import type { Chunk, ChunkState, Segment } from '../domain/chunk';
import { getDue } from '../modules/memory/memoryEngine';

export interface QueueItem {
  chunk: Chunk;
  segment: Segment;
}

/** Ordered chunkIds for this session: overdue first, brand-new last. */
export function buildQueue(states: ChunkState[], now: number = Date.now()): string[] {
  return getDue(states, now)
    .sort((a, b) => {
      const aNew = a.lastReviewedAt === null ? 1 : 0;
      const bNew = b.lastReviewedAt === null ? 1 : 0;
      if (aNew !== bNew) return aNew - bNew; // reviewed (maintenance) before new
      return a.dueAt - b.dueAt;
    })
    .map((s) => s.chunkId);
}

/** Choose a context segment for a chunk, favouring an unseen one. */
export function pickSegmentForChunk(
  chunk: Chunk,
  state: ChunkState,
  segments: Segment[],
): Segment | undefined {
  const containing = segments.filter((s) => s.chunkIds.includes(chunk.id));
  if (containing.length === 0) return undefined;
  const unseen = containing.find((s) => !state.seenSegmentIds.includes(s.id));
  return unseen ?? containing[0];
}
