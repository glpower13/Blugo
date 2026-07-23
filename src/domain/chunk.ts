// Central domain model. The Chunk — a meaningful phrase in context — is the
// unit of NEUROLANG, never an isolated word (see docs/03-method.md, CLAUDE.md).

/** One word-for-word decoding pair (Birkenbihl interlinear: SV word → literal DE). */
export interface DecodingToken {
  sv: string;
  de: string;
}

/** A learnable chunk: a phrase, its idiomatic translation and its decoding. */
export interface Chunk {
  id: string;
  sv: string; // Swedish phrase, e.g. "kan du hjälpa mig?"
  de: string; // idiomatic German, e.g. "kannst du mir helfen?"
  decoding: DecodingToken[]; // literal word-for-word (structure made visible)
}

/**
 * A comprehensible-input segment on level i+1 that embeds one or more chunks.
 * The Content-Pipeline produces these (seed for now, AI-generated later).
 */
export interface Segment {
  id: string;
  level: number; // i+1 grading (coarse placeholder until operationalised)
  sv: string;
  de: string;
  decoding: DecodingToken[];
  chunkIds: string[];
}

/** Retrieval stage — recognition first, production later (production decays faster). */
export type RetrievalStage = 'recognition' | 'production';

/** Lifecycle of a chunk in the memory system. */
export type ChunkStatus = 'new' | 'learning' | 'maintenance';

/** A single graded retrieval outcome. */
export type ReviewResult = 'again' | 'hard' | 'good';

export interface ReviewEvent {
  at: number; // epoch ms
  result: ReviewResult;
  segmentId: string; // which context it was retrieved in (for variation tracking)
}

/**
 * Per-user, per-chunk memory state. These fields drive BOTH scheduling
 * (Memory-Engine) and measurement (Progress) — see docs/05-architecture.md.
 */
export interface ChunkState {
  chunkId: string;
  status: ChunkStatus;
  stage: RetrievalStage;
  intervalDays: number; // current spacing interval
  ease: number; // multiplier growth factor
  dueAt: number; // epoch ms of next due
  lastReviewedAt: number | null;
  successStreak: number; // consecutive 'good' — used to promote stage/status
  // Set the moment a chunk is *proven* stable: a successful PRODUCTION recall
  // whose scheduled interval had already reached the stability horizon. Null
  // until then. This is the honest measure — retained after a real long gap,
  // not merely scheduled that far (docs/07-measurement.md; anti-Goodhart).
  provenStableAt: number | null;
  history: ReviewEvent[];
  seenSegmentIds: string[]; // contexts already used → drive context variation
}
