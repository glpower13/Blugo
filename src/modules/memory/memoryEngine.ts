// Memory-Engine — spacing, retrieval scheduling, maintenance, stage promotion.
// Der Terminplaner-Kern ist FSRS (siehe ./fsrs.ts) — best-belegtes, offenes
// Spacing-Verfahren (docs/gremium-weltklasse.md §5–§6). DARÜBER sitzt weiterhin
// die pädagogische/ehrliche Schicht: Stufen (Wiedererkennen→Produktion),
// Kurzzeit-Relearn in der Sitzung und der strenge, GEMESSENE Stabilitätsbeweis
// (`provenStableAt`) — nicht vom Algorithmus geschätzt (docs/07-measurement.md).

import type { ChunkState, ReviewResult, RetrievalStage } from '../../domain/chunk';
import {
  DEFAULT_REQUEST_RETENTION,
  initialDifficulty,
  initialStability,
  intervalForRetention,
  nextDifficulty,
  nextForgetStability,
  nextRecallStability,
  retrievability,
  type FsrsGrade,
} from './fsrs';

export const DAY_MS = 24 * 60 * 60 * 1000;

/** Interval (days) at/after which a maintenance chunk counts as "stable". */
export const STABLE_INTERVAL_DAYS = 90;

/** Überstandene Pause (Tage), ab der eine Wendung als „reift" gilt. */
export const MATURING_INTERVAL_DAYS = 21;

/** Successful retrievals needed to promote recognition → production. */
const PROMOTE_TO_PRODUCTION_AT = 2;

/** Unsere 3 Bewertungsknöpfe auf die FSRS-Skala abbilden (Easy bleibt für später frei). */
const GRADE: Record<ReviewResult, FsrsGrade> = { again: 1, hard: 2, good: 3 };

export function initialState(chunkId: string, now: number = Date.now()): ChunkState {
  return {
    chunkId,
    status: 'new',
    stage: 'recognition',
    intervalDays: 0,
    stability: 0, // noch nicht initialisiert — wird bei der ersten Bewertung gesetzt
    difficulty: 0,
    dueAt: now, // new chunks are due immediately
    lastReviewedAt: null,
    successStreak: 0,
    provenStableAt: null,
    lapsedAt: null,
    maturedAt: null,
    history: [],
    seenSegmentIds: [],
  };
}

/**
 * Zusatz-Angaben zu einem Abruf, die den TERMIN NICHT beeinflussen dürfen.
 * `spoken` ist bewusst nur ein Vermerk in der Historie: Sprechen ist ein zweiter
 * Weg zum selben Beweis, kein leichterer und kein schwererer — die Engine darf
 * es deshalb nicht belohnen (docs/gremium-sprachpartner.md §3).
 */
export interface ReviewMeta {
  spoken?: boolean;
  /**
   * Erhalt-Ziel des Lerners (FSRS „desired retention"). Steuert NUR die Länge
   * des nächsten Intervalls — also den Aufwand. Der Beweis „bewiesen stabil"
   * bleibt unberührt: Er verlangt einen gelungenen Produktions-Abruf nach einer
   * TATSÄCHLICH vergangenen langen Pause, egal wie geplant wurde
   * (docs/gremium-einstellungen.md §2.2).
   */
  retention?: number;
}

/**
 * Apply a graded retrieval result and return the next state.
 * FSRS treibt Stabilität/Schwierigkeit und damit das Intervall; die Stufen-,
 * Kurzzeit- und Beweis-Logik bleibt bewusst darüber (docs/03-method.md).
 */
export function schedule(
  state: ChunkState,
  result: ReviewResult,
  segmentId: string,
  now: number = Date.now(),
  meta: ReviewMeta = {},
): ChunkState {
  const preInterval = state.intervalDays; // interval the chunk had survived so far
  const preStage = state.stage;
  const g = GRADE[result];

  // --- FSRS-Kern: Gedächtniszustand (S, D) fortschreiben ---
  const firstReview = state.lastReviewedAt === null || state.stability <= 0;
  let stability: number;
  let difficulty: number;
  if (firstReview) {
    stability = initialStability(g);
    difficulty = initialDifficulty(g);
  } else {
    const elapsedDays = Math.max(0, (now - state.lastReviewedAt!) / DAY_MS);
    const r = retrievability(elapsedDays, state.stability);
    // Reihenfolge wie in der FSRS-Referenz: erst neue Schwierigkeit, dann Stabilität.
    difficulty = nextDifficulty(state.difficulty, g);
    stability =
      g === 1
        ? nextForgetStability(difficulty, state.stability, r)
        : nextRecallStability(difficulty, state.stability, r, g);
  }

  // --- Pädagogische/Session-Schicht ÜBER FSRS ---
  let { stage, status, successStreak } = state;
  let intervalDays: number;

  if (result === 'again') {
    successStreak = 0;
    intervalDays = 0; // Relearn: in DIESER Sitzung erneut fällig (Kurzzeit-Schritt)
    // Demote a failed production chunk back to recognition — it clearly cannot
    // be produced yet, so retrieval difficulty is stepped back down (ISTQB E-1).
    stage = 'recognition';
  } else {
    successStreak += 1;
    // Intervall = Zeit, bis die Abrufwahrscheinlichkeit auf die Ziel-Retention fällt.
    intervalDays = Math.max(
      1,
      Math.round(intervalForRetention(stability, meta.retention ?? DEFAULT_REQUEST_RETENTION)),
    );
  }

  // Stage promotion: recognition → production once retrieval is reliable.
  if (stage === 'recognition' && successStreak >= PROMOTE_TO_PRODUCTION_AT) {
    stage = 'production';
  }

  // Proof of stability: a successful PRODUCTION recall AFTER the scheduled
  // interval had already reached the horizon. Measured, not estimated — the
  // chunk really survived a long gap (docs/07-measurement.md, anti-Goodhart).
  const provenStableAt =
    result === 'good' && preStage === 'production' && preInterval >= STABLE_INTERVAL_DAYS
      ? now
      : state.provenStableAt;

  // Zweiter, kürzerer Horizont — nach genau demselben Muster GEMESSEN und nicht
  // geschätzt: eine tatsächlich überstandene Pause von ≥ 21 Tagen in der
  // Produktions-Stufe. Vorher hing „reift" am neu GEPLANTEN Intervall.
  const maturedAt =
    result === 'good' && preStage === 'production' && preInterval >= MATURING_INTERVAL_DAYS
      ? (state.maturedAt ?? now)
      : (state.maturedAt ?? null);

  // Ein Fehlschlag ist eine Messung wie jede andere — und die einzige, die einem
  // erbrachten Beweis widersprechen kann. Sie wird deshalb festgehalten, statt
  // den Beweis stillschweigend weiterlaufen zu lassen.
  const lapsedAt = result === 'again' ? now : (state.lapsedAt ?? null);

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
    stability,
    difficulty,
    intervalDays,
    successStreak,
    provenStableAt,
    lapsedAt,
    maturedAt,
    dueAt,
    lastReviewedAt: now,
    seenSegmentIds,
    history: [
      ...state.history,
      meta.spoken ? { at: now, result, segmentId, spoken: true } : { at: now, result, segmentId },
    ],
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
