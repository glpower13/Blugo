// Memory-Engine — spacing, retrieval scheduling, maintenance, stage promotion.
// Deliberately SIMPLE in M1 (docs/09-roadmap.md: "Memory-Engine minimal: echtes
// Spacing + Wartung"). The concrete SRS algorithm (SM-2/FSRS/eigen) stays an
// open question — see docs/10-open-questions.md.

import type { ChunkState, ReviewResult, RetrievalStage } from '../../domain/chunk';

export const DAY_MS = 24 * 60 * 60 * 1000;

/** Interval (days) at/after which a maintenance chunk counts as "stable". */
export const STABLE_INTERVAL_DAYS = 90;

/** Successful retrievals needed to promote recognition → production. */
const PROMOTE_TO_PRODUCTION_AT = 2;

export function initialState(chunkId: string, now: number = Date.now()): ChunkState {
  return {
    chunkId,
    status: 'new',
    stage: 'recognition',
    intervalDays: 0,
    ease: 2.0,
    dueAt: now, // new chunks are due immediately
    lastReviewedAt: null,
    successStreak: 0,
    history: [],
    seenSegmentIds: [],
  };
}

/**
 * Apply a graded retrieval result and return the next state.
 * Spacing: success dehnt das Intervall, Fehlabruf staucht es (docs/03-method.md).
 */
export function schedule(
  state: ChunkState,
  result: ReviewResult,
  segmentId: string,
  now: number = Date.now(),
): ChunkState {
  let { intervalDays, ease, successStreak, stage, status } = state;

  if (result === 'again') {
    successStreak = 0;
    intervalDays = 0; // relearn — due again this session
    ease = Math.max(1.3, ease - 0.2);
  } else {
    successStreak += 1;
    const wasNew = intervalDays === 0;
    if (result === 'hard') {
      ease = Math.max(1.3, ease - 0.05);
      intervalDays = wasNew ? 1 : Math.max(1, Math.round(intervalDays * 1.2));
    } else {
      // 'good'
      ease = Math.min(2.8, ease + 0.05);
      intervalDays = wasNew ? 1 : Math.max(1, Math.round(intervalDays * ease));
    }
  }

  // Stage promotion: recognition → production once retrieval is reliable.
  if (stage === 'recognition' && successStreak >= PROMOTE_TO_PRODUCTION_AT) {
    stage = 'production';
  }

  // Status lifecycle: new → learning → maintenance.
  status = deriveStatus(status, intervalDays, stage, successStreak);

  const dueAt = now + intervalDays * DAY_MS;
  const seenSegmentIds = state.seenSegmentIds.includes(segmentId)
    ? state.seenSegmentIds
    : [...state.seenSegmentIds, segmentId];

  return {
    ...state,
    status,
    stage,
    ease,
    intervalDays,
    successStreak,
    dueAt,
    lastReviewedAt: now,
    seenSegmentIds,
    history: [...state.history, { at: now, result, segmentId }],
  };
}

function deriveStatus(
  current: ChunkState['status'],
  intervalDays: number,
  stage: RetrievalStage,
  successStreak: number,
): ChunkState['status'] {
  if (intervalDays === 0) return current === 'maintenance' ? 'learning' : 'new';
  if (stage === 'production' && intervalDays >= 21 && successStreak >= 3) {
    return 'maintenance';
  }
  return 'learning';
}

/** Chunks whose review is due, most overdue first. */
export function getDue(states: ChunkState[], now: number = Date.now()): ChunkState[] {
  return states.filter((s) => s.dueAt <= now).sort((a, b) => a.dueAt - b.dueAt);
}
