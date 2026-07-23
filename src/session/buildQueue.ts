// Assembles a day's session (docs/04-product.md): "Wartung zuerst" — due chunks
// (maintenance/learning) before new encounters. Context variation: prefer a
// segment the chunk has NOT been seen in yet (docs/03-method.md, step 4).

import type { Chunk, ChunkState, Segment } from '../domain/chunk';
import { getDue } from '../modules/memory/memoryEngine';

export interface QueueItem {
  chunk: Chunk;
  segment: Segment;
}

/** Daily dosing of NEW chunks (docs/04-product.md: "1–3 neue Chunks"). */
export const MAX_NEW_PER_SESSION = 3;

/**
 * Ordered chunkIds for a session: due maintenance/learning first ("Wartung
 * zuerst"), then at most `maxNew` brand-new chunks. Maintenance is never
 * capped — forgetting waits for no one; only the intake of new material is.
 */
export function buildQueue(
  states: ChunkState[],
  now: number = Date.now(),
  maxNew: number = MAX_NEW_PER_SESSION,
): string[] {
  const due = getDue(states, now);
  const reviewed = due
    .filter((s) => s.lastReviewedAt !== null)
    .sort((a, b) => a.dueAt - b.dueAt);
  const fresh = due.filter((s) => s.lastReviewedAt === null).slice(0, maxNew);
  return [...reviewed, ...fresh].map((s) => s.chunkId);
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
