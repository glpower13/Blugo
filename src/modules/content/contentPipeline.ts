// Content-Pipeline seam (the Moat, docs/08-content-pipeline.md).
//
// In M1 this only serves the hand-checked seed. The interface is intentionally
// the same shape the AI pipeline (LLM → Grading → Dekodierung → TTS) will later
// implement, so swapping the source in doesn't touch the rest of the app.

import type { Area, Category, Chunk, Segment } from '../../domain/chunk';
import type { Dialog } from '../../domain/dialog';
import { seedAreas, seedCategories, seedChunks, seedSegments } from './seedSegments';
import { seedDialogs } from './seedDialogs';

export interface ContentSource {
  getAreas(): Promise<Area[]>;
  getCategories(): Promise<Category[]>;
  getChunks(): Promise<Chunk[]>;
  getSegments(): Promise<Segment[]>;
  getDialogs(): Promise<Dialog[]>;
  /** Later: request a fresh i+1 segment that re-embeds given chunks in a NEW context. */
  requestSegment?(targetChunkIds: string[], level: number): Promise<Segment>;
}

export const seedContentSource: ContentSource = {
  async getAreas() {
    return seedAreas;
  },
  async getCategories() {
    return seedCategories;
  },
  async getChunks() {
    return seedChunks;
  },
  async getSegments() {
    return seedSegments;
  },
  async getDialogs() {
    return seedDialogs;
  },
};
