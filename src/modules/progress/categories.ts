// Per-category progress — the honest coverage of a theme (docs/gremium-struktur.md).
//
// A theme's numbers are the SAME honest measures as the global ones
// (docs/07-measurement.md, metrics.ts): "stabil" means PROVEN stable, never a
// mere "lesson done". A category is a lens on real retention, not a bar to fill
// for its own sake (anti-Goodhart, CLAUDE.md "die eine Design-Regel").

import type { Category, Chunk, ChunkState } from '../../domain/chunk';
import { isStable } from './metrics';

export interface CategoryProgress {
  category: Category;
  total: number; // chunks that belong to this theme
  active: number; // already encountered at least once
  maturing: number; // in production with a grown interval, not yet proven
  stable: number; // PROVEN retained after a long gap
  dueNow: number; // due for retrieval right now
}

function isActive(s: ChunkState): boolean {
  return s.status !== 'new' || s.history.length > 0;
}

function isMaturing(s: ChunkState): boolean {
  return !isStable(s) && s.stage === 'production' && s.intervalDays >= 21;
}

/**
 * Progress per category, in `category.order`. Chunks with an unknown category are
 * ignored (a category must exist to be counted — honest, no phantom buckets).
 */
export function categoryProgress(
  categories: Category[],
  chunks: Chunk[],
  states: Record<string, ChunkState>,
  now: number = Date.now(),
): CategoryProgress[] {
  const chunkIdsByCategory = new Map<string, string[]>();
  for (const c of chunks) {
    const list = chunkIdsByCategory.get(c.categoryId) ?? [];
    list.push(c.id);
    chunkIdsByCategory.set(c.categoryId, list);
  }

  return [...categories]
    .sort((a, b) => a.order - b.order)
    .map((category) => {
      const ids = chunkIdsByCategory.get(category.id) ?? [];
      let active = 0;
      let maturing = 0;
      let stable = 0;
      let dueNow = 0;
      for (const id of ids) {
        const s = states[id];
        if (!s) continue;
        if (isActive(s)) active++;
        if (isMaturing(s)) maturing++;
        if (isStable(s)) stable++;
        if (s.dueAt <= now) dueNow++;
      }
      return { category, total: ids.length, active, maturing, stable, dueNow };
    });
}
