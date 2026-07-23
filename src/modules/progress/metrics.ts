// Progress / Measurement — the honest numbers (docs/07-measurement.md).
// The one number that matters is STABLE chunks, not streaks or XP.

import type { ChunkState } from '../../domain/chunk';
import { STABLE_INTERVAL_DAYS } from '../memory/memoryEngine';

export interface Metrics {
  active: number; // chunks currently in the loop
  stable: number; // maintenance chunks held past the stability horizon
  dueNow: number; // chunks due for retrieval right now
  coverage: number; // Verständnis-Abdeckung 0..1 (share of active chunks last understood)
}

/** A chunk is "active" once it has been encountered at least once. */
function isActive(s: ChunkState): boolean {
  return s.status !== 'new' || s.history.length > 0;
}

/** Last retrieval on this chunk was a success. */
function lastWasGood(s: ChunkState): boolean {
  return s.history[s.history.length - 1]?.result === 'good';
}

/**
 * A chunk is "stable" only under strict conditions (docs/07-measurement.md):
 * it must be in maintenance (production stage) AND carry an interval past the
 * stability horizon. We never count recognition-only or same-day repetition.
 */
export function isStable(s: ChunkState): boolean {
  return (
    s.status === 'maintenance' &&
    s.stage === 'production' &&
    s.intervalDays >= STABLE_INTERVAL_DAYS
  );
}

export function computeMetrics(states: ChunkState[], now: number = Date.now()): Metrics {
  const activeStates = states.filter(isActive);
  const understood = activeStates.filter(lastWasGood).length;
  return {
    active: activeStates.length,
    stable: states.filter(isStable).length,
    dueNow: states.filter((s) => s.dueAt <= now).length,
    // Verständnis-Abdeckung (docs/07-measurement.md), M1-Vereinfachung:
    // Anteil aktiver Chunks, deren letzter Abruf erfolgreich war.
    coverage: activeStates.length === 0 ? 0 : understood / activeStates.length,
  };
}
