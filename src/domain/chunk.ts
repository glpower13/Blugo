// Central domain model. The Chunk — a meaningful phrase in context — is the
// unit of NEUROLANG, never an isolated word (see docs/03-method.md, CLAUDE.md).

/** One word-for-word decoding pair (Birkenbihl interlinear: SV word → literal DE). */
export interface DecodingToken {
  sv: string;
  de: string;
}

/**
 * A top-level life area (Reisen, Einkaufen, …) — the FIRST level of the content
 * tree (docs/gremium-struktur.md). An area groups several thematic subcategories
 * so the learner browses a shallow tree (Bereich → Thema → Wendung), never an
 * endless flat list. Like a category, it is an organizing + honest-coverage lens,
 * NOT a "course" to finish (anti-Goodhart, CLAUDE.md "die eine Design-Regel").
 */
export interface Area {
  id: string;
  title: string; // German, learner-facing, e.g. "Reisen & Unterwegs"
  blurb: string; // one short German line describing the area
  order: number; // display order (ascending)
}

/**
 * A thematic grouping of chunks (Begrüßen, Im Café, …) — the SECOND level of the
 * content tree, a subcategory of an Area (docs/gremium-struktur.md,
 * docs/08-content-pipeline.md).
 *
 * IMPORTANT (anti-Goodhart): a category is an ORGANIZING + honest-coverage lens
 * and an autonomy choice for what NEW material to draw next — it is NOT a "lesson"
 * to complete. The memory engine (FSRS) still drives the daily loop; per-category
 * "stable" is the same PROVEN measure as everywhere else (docs/07-measurement.md).
 */
export interface Category {
  id: string;
  areaId: string; // which top-level area this theme belongs to (Area.id)
  title: string; // German, learner-facing, e.g. "Im Café"
  blurb: string; // one short German line describing the theme
  order: number; // display order WITHIN its area (ascending)
}

/** A learnable chunk: a phrase, its idiomatic translation and its decoding. */
export interface Chunk {
  id: string;
  categoryId: string; // which theme this chunk belongs to (Category.id)
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
  helpUsed?: boolean; // did the learner reveal a hint before answering? (docs/04-product.md)
}

/**
 * Per-user, per-chunk memory state. These fields drive BOTH scheduling
 * (Memory-Engine) and measurement (Progress) — see docs/05-architecture.md.
 */
export interface ChunkState {
  chunkId: string;
  status: ChunkStatus;
  stage: RetrievalStage;
  intervalDays: number; // current spacing interval (derived from FSRS stability)
  // FSRS memory state (DSR model) — drives the scheduling (docs/gremium-weltklasse.md).
  stability: number; // FSRS stability S: days until recall probability decays to ~90 %
  difficulty: number; // FSRS difficulty D: 1 (easy) .. 10 (hard)
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
