// Progress / Measurement — the honest numbers (docs/07-measurement.md).
// The one number that matters is STABLE chunks, not streaks or XP.

import type { ChunkState } from '../../domain/chunk';

export interface Metrics {
  active: number; // chunks currently in the loop
  maturing: number; // on the way to stable: production stage, interval grown, not yet proven
  stable: number; // chunks proven retained after a long gap
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
 * A chunk is "stable" only once it has been *proven* so (docs/07-measurement.md):
 * a successful production recall after the scheduled interval had already
 * reached the horizon — i.e. it really survived a long gap. Measured, not
 * estimated; a merely long scheduled interval does not count (anti-Goodhart).
 */
export function isStable(s: ChunkState): boolean {
  return s.provenStableAt != null;
}

/** On the way to stable: reliably in production with a grown interval, not yet proven. */
function isMaturing(s: ChunkState): boolean {
  return !isStable(s) && s.stage === 'production' && s.intervalDays >= 21;
}

export function computeMetrics(states: ChunkState[], now: number = Date.now()): Metrics {
  const activeStates = states.filter(isActive);
  const understood = activeStates.filter(lastWasGood).length;
  return {
    active: activeStates.length,
    maturing: states.filter(isMaturing).length,
    stable: states.filter(isStable).length,
    dueNow: states.filter((s) => s.dueAt <= now).length,
    // Verständnis-Abdeckung (docs/07-measurement.md), M1-Vereinfachung:
    // Anteil aktiver Chunks, deren letzter Abruf erfolgreich war.
    coverage: activeStates.length === 0 ? 0 : understood / activeStates.length,
  };
}
