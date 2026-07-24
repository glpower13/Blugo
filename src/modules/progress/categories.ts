// Per-category progress — the honest coverage of a theme (docs/gremium-struktur.md).
//
// A theme's numbers are the SAME honest measures as the global ones
// (docs/07-measurement.md, metrics.ts): "stabil" means PROVEN stable, never a
// mere "lesson done". A category is a lens on real retention, not a bar to fill
// for its own sake (anti-Goodhart, CLAUDE.md "die eine Design-Regel").

import type { Area, Category, Chunk, ChunkState } from '../../domain/chunk';
import { isMaturing, isStable } from './metrics';

export interface CategoryProgress {
  category: Category;
  total: number; // chunks that belong to this theme
  active: number; // already encountered at least once
  maturing: number; // in production with a grown interval, not yet proven
  stable: number; // PROVEN retained after a long gap
  dueNow: number; // due for retrieval right now
}

/** Aggregated honest coverage of a whole area (its subcategories summed). */
export interface AreaProgress {
  area: Area;
  categories: CategoryProgress[]; // its subcategories, in category.order
  total: number;
  active: number;
  maturing: number;
  stable: number;
  dueNow: number;
}

function isActive(s: ChunkState): boolean {
  return s.status !== 'new' || s.history.length > 0;
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

/**
 * Progress per AREA, in `area.order` — the top level of the tree. Sums the honest
 * per-category numbers of the area's subcategories (in `category.order`). Areas
 * without a subcategory are dropped (no phantom buckets — same honesty rule).
 */
export function areaProgress(areas: Area[], catProgress: CategoryProgress[]): AreaProgress[] {
  const byArea = new Map<string, CategoryProgress[]>();
  for (const cp of catProgress) {
    const list = byArea.get(cp.category.areaId) ?? [];
    list.push(cp);
    byArea.set(cp.category.areaId, list);
  }

  return [...areas]
    .sort((a, b) => a.order - b.order)
    .map((area) => {
      const categories = (byArea.get(area.id) ?? []).sort(
        (a, b) => a.category.order - b.category.order,
      );
      const sum = (pick: (c: CategoryProgress) => number) =>
        categories.reduce((n, c) => n + pick(c), 0);
      return {
        area,
        categories,
        total: sum((c) => c.total),
        active: sum((c) => c.active),
        maturing: sum((c) => c.maturing),
        stable: sum((c) => c.stable),
        dueNow: sum((c) => c.dueNow),
      };
    })
    .filter((ap) => ap.categories.length > 0);
}
