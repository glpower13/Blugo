// Integritäts-Schutz für den (großen, handverfassten) Seed-Inhalt: fängt Tippfehler
// in IDs/Referenzen und verwaiste Chunks ab, bevor sie im Loop landen.

import { describe, expect, it } from 'vitest';
import { seedAreas, seedCategories, seedChunks, seedSegments } from './seedSegments';
import { seedDialogs } from './seedDialogs';

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

  it('keine Wendung steht zweimal im Baum (sonst zerfällt das Können auf zwei Zähler)', () => {
    // Ein exaktes Duplikat („det regnar" in zwei Themen) wäre schlimmer als ein
    // ID-Konflikt: dieselbe Kenntnis bekäme zwei Gedächtnis-Zustände, und die
    // ehrliche Messung würde denselben Beweis doppelt zählen bzw. nie erreichen.
    const norm = (t: string) => t.trim().toLowerCase().replace(/[.!?,;:]+$/g, '');
    const seen = new Map<string, string>();
    for (const c of seedChunks) {
      const key = norm(c.sv);
      const first = seen.get(key);
      expect(first, `„${c.sv}" steht doppelt: ${first} und ${c.id}`).toBeUndefined();
      seen.set(key, c.id);
    }
  });

  it('jede Kategorie enthält mindestens einen Chunk', () => {
    const used = new Set(seedChunks.map((c) => c.categoryId));
    for (const cat of seedCategories) {
      expect(used.has(cat.id), `Leere Kategorie: ${cat.id}`).toBe(true);
    }
  });
});

describe('seed dialogs — Integrität', () => {
  const catIds = new Set(seedCategories.map((c) => c.id));
  const chunkIds = new Set(seedChunks.map((c) => c.id));
  const chunkById = new Map(seedChunks.map((c) => [c.id, c]));

  it('Dialog- und Turn-IDs sind eindeutig', () => {
    const ids = seedDialogs.map((d) => d.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const d of seedDialogs) {
      const turnIds = d.turns.map((t) => t.id);
      expect(new Set(turnIds).size, `Doppelte Turn-ID in ${d.id}`).toBe(turnIds.length);
    }
  });

  it('jeder Dialog gehört zu einer existierenden Kategorie', () => {
    for (const d of seedDialogs) {
      expect(catIds.has(d.categoryId), `Dialog ${d.id} → unbekannte Kategorie ${d.categoryId}`).toBe(
        true,
      );
    }
  });

  it('jede „du"-Zeile referenziert einen existierenden Chunk (echter Abruf)', () => {
    for (const d of seedDialogs) {
      for (const t of d.turns) {
        if (t.speaker === 'you') {
          expect(t.chunkId, `„du"-Zeile ${d.id}/${t.id} ohne chunkId`).toBeTruthy();
          expect(chunkIds.has(t.chunkId!), `${d.id}/${t.id} → unbekannter Chunk ${t.chunkId}`).toBe(
            true,
          );
        }
      }
    }
  });

  it('das Ziel einer „du"-Zeile passt zum Chunk (Produktion prüfbar)', () => {
    const norm = (s: string) => s.trim().toLowerCase().replace(/[.!?,;:]+$/g, '');
    for (const d of seedDialogs) {
      for (const t of d.turns) {
        if (t.speaker === 'you' && t.chunkId) {
          const chunk = chunkById.get(t.chunkId)!;
          expect(norm(t.sv), `${d.id}/${t.id}: sv ≠ Chunk-sv`).toBe(norm(chunk.sv));
        }
      }
    }
  });

  it('jeder Dialog hat mindestens eine „du"-Zeile (sonst kein Abruf)', () => {
    for (const d of seedDialogs) {
      expect(d.turns.some((t) => t.speaker === 'you'), `Dialog ohne Produktion: ${d.id}`).toBe(true);
    }
  });

  it('der Namens-Platzhalter steht NUR in Partner-Zeilen (nie im Lernziel)', () => {
    for (const d of seedDialogs) {
      for (const t of d.turns) {
        if (t.speaker === 'you') {
          // Sonst wäre die geprüfte Antwort vom Namen abhängig — das darf nie sein.
          expect(t.sv.includes('{name}'), `„du"-Zeile mit Platzhalter: ${d.id}/${t.id}`).toBe(false);
          expect(t.de.includes('{name}'), `„du"-Zeile mit Platzhalter: ${d.id}/${t.id}`).toBe(false);
          for (const s of t.suggestions ?? []) {
            expect(s.includes('{name}'), `Vorschlag mit Platzhalter: ${d.id}/${t.id}`).toBe(false);
          }
        }
      }
    }
  });

  it('sv und de einer Partner-Zeile nutzen den Platzhalter konsistent', () => {
    for (const d of seedDialogs) {
      for (const t of d.turns) {
        if (t.speaker === 'partner') {
          expect(t.sv.includes('{name}'), `sv/de-Platzhalter uneinheitlich: ${d.id}/${t.id}`).toBe(
            t.de.includes('{name}'),
          );
        }
      }
    }
  });
});
