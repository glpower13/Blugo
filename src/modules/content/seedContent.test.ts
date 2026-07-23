// Integritäts-Schutz für den (großen, handverfassten) Seed-Inhalt: fängt Tippfehler
// in IDs/Referenzen und verwaiste Chunks ab, bevor sie im Loop landen.

import { describe, expect, it } from 'vitest';
import { seedAreas, seedCategories, seedChunks, seedSegments } from './seedSegments';

describe('seed content — Integrität', () => {
  it('IDs sind eindeutig (Bereiche, Kategorien, Chunks, Segmente)', () => {
    const area = seedAreas.map((a) => a.id);
    const cat = seedCategories.map((c) => c.id);
    const ch = seedChunks.map((c) => c.id);
    const seg = seedSegments.map((s) => s.id);
    expect(new Set(area).size).toBe(area.length);
    expect(new Set(cat).size).toBe(cat.length);
    expect(new Set(ch).size).toBe(ch.length);
    expect(new Set(seg).size).toBe(seg.length);
  });

  it('jede Kategorie gehört zu einem existierenden Bereich', () => {
    const areas = new Set(seedAreas.map((a) => a.id));
    for (const c of seedCategories) {
      expect(areas.has(c.areaId), `Kategorie ${c.id} → unbekannter Bereich ${c.areaId}`).toBe(true);
    }
  });

  it('jeder Bereich enthält mindestens eine Kategorie', () => {
    const used = new Set(seedCategories.map((c) => c.areaId));
    for (const a of seedAreas) {
      expect(used.has(a.id), `Leerer Bereich: ${a.id}`).toBe(true);
    }
  });

  it('jeder Chunk gehört zu einer existierenden Kategorie', () => {
    const cats = new Set(seedCategories.map((c) => c.id));
    for (const c of seedChunks) {
      expect(cats.has(c.categoryId), `Chunk ${c.id} → unbekannte Kategorie ${c.categoryId}`).toBe(
        true,
      );
    }
  });

  it('jeder Chunk hat mindestens einen Kontext (sonst nicht lernbar)', () => {
    for (const c of seedChunks) {
      const hasContext = seedSegments.some((s) => s.chunkIds.includes(c.id));
      expect(hasContext, `Chunk ohne Kontext-Segment: ${c.id}`).toBe(true);
    }
  });

  it('jede Segment-chunkId verweist auf einen existierenden Chunk', () => {
    const ids = new Set(seedChunks.map((c) => c.id));
    for (const s of seedSegments) {
      for (const id of s.chunkIds) {
        expect(ids.has(id), `Segment ${s.id} → unbekannter Chunk ${id}`).toBe(true);
      }
    }
  });

  it('jede Kategorie enthält mindestens einen Chunk', () => {
    const used = new Set(seedChunks.map((c) => c.categoryId));
    for (const cat of seedCategories) {
      expect(used.has(cat.id), `Leere Kategorie: ${cat.id}`).toBe(true);
    }
  });
});
