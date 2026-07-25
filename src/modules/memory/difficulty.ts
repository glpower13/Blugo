// Adaptive difficulty — the anti-cliff (docs/04-product.md, docs/06-motivation.md).
// Holds the learner in a ~80–85 % success band by tuning how much NEW material
// enters a session: too hard → introduce less, consolidate first; too easy →
// introduce more. Pure functions; the session (App) wires it into buildQueue.

import type { ChunkState } from '../../domain/chunk';

/** Target success band. Below it = overwhelmed; above it = under-challenged. */
export const SUCCESS_BAND = { min: 0.8, max: 0.85 } as const;

export const NEW_MIN = 1; // too hard → barely any new material
export const NEW_BASE = 3; // in band → steady daily intake
export const NEW_MAX = 5; // too easy → push more

/** How many recent reviews to judge the band on, and the minimum to act at all. */
export const RECENT_WINDOW = 20;
const MIN_SAMPLE = 5;

/**
 * Share of recent reviews that were clean recalls ('good'), across all chunks,
 * most recent first. Returns null when there isn't enough history yet.
 */
export function recentSuccessRate(
  states: ChunkState[],
  window: number = RECENT_WINDOW,
): number | null {
  const events = states
    .flatMap((s) => s.history)
    .sort((a, b) => b.at - a.at)
    .slice(0, window);
  if (events.length < MIN_SAMPLE) return null;
  const good = events.filter((e) => e.result === 'good').length;
  return good / events.length;
}

/** Recommended number of new chunks for the next session, given the success rate. */
export function recommendedNewCount(rate: number | null): number {
  if (rate === null) return NEW_BASE; // not enough data → baseline
  if (rate > SUCCESS_BAND.max) return NEW_MAX; // too easy → challenge more
  if (rate < SUCCESS_BAND.min) return NEW_MIN; // too hard → consolidate
  return NEW_BASE; // inside the band → steady
}

/**
 * Wie viel NEUER Stoff diese Sitzung wirklich zulässt — Empfehlung der Engine,
 * gedeckelt durch die Einstellung des Lerners (docs/gremium-einstellungen.md).
 *
 * Bewusst nur ein DECKEL, keine Vorgabe: Die Einstellung kann bremsen, aber nie
 * über das Erfolgsband hinaus beschleunigen. Sonst wäre sie eine Abkürzung an
 * der Anti-Klippen-Logik vorbei — und die ist der Grund, warum es dieses Projekt
 * gibt. `null` = keine Obergrenze, die Engine entscheidet allein.
 */
export function newCountFor(rate: number | null, cap: number | null): number {
  const auto = recommendedNewCount(rate);
  return cap === null ? auto : Math.min(auto, Math.max(0, cap));
}

export type BandStatus = 'unknown' | 'zu leicht' | 'im Flow-Band' | 'zu fordernd';

/** Human-facing band status (docs/06-motivation.md: Flow-Band as a status signal). */
export function bandStatus(rate: number | null): BandStatus {
  if (rate === null) return 'unknown';
  if (rate > SUCCESS_BAND.max) return 'zu leicht';
  if (rate < SUCCESS_BAND.min) return 'zu fordernd';
  return 'im Flow-Band';
}
