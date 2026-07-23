// Which chunks the learner already knows — the "known ground" for true i+1
// generation (docs/08-content-pipeline.md). The AI is asked to build a new
// context out of these, so only the target phrase is new.
//
// "Known" here = encountered at least once (active). Deliberately generous: it
// feeds comprehensibility, it is NOT a progress claim (the honest "stable"
// measure stays in metrics.ts — anti-Goodhart, CLAUDE.md).

import type { Chunk, ChunkState } from '../domain/chunk';
import type { KnownPhrase } from '../modules/content/ports';

function isActive(s: ChunkState): boolean {
  return s.status !== 'new' || s.history.length > 0;
}

/**
 * Phrases the learner has already encountered, excluding the target chunk,
 * capped at `max` (keep the prompt small). Order follows `chunks`.
 */
export function knownPhrases(
  chunks: Chunk[],
  states: Record<string, ChunkState>,
  excludeChunkId: string,
  max = 12,
): KnownPhrase[] {
  const out: KnownPhrase[] = [];
  for (const c of chunks) {
    if (c.id === excludeChunkId) continue;
    const s = states[c.id];
    if (s && isActive(s)) out.push({ sv: c.sv, de: c.de });
    if (out.length >= max) break;
  }
  return out;
}
