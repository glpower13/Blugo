// Integritäts-Schutz für den (großen, handverfassten) Seed-Inhalt: fängt Tippfehler
// in IDs/Referenzen und verwaiste Chunks ab, bevor sie im Loop landen.

import { describe, expect, it } from 'vitest';
import { seedAreas, seedCategories, seedChunks, seedSegments } from './seedSegments';
import {
  VERIFICATION,
  VERIFICATION_META,
  VERIFICATION_REASON,
} from './verification.generated';
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

// Stufe 4 der Prüfkette: Der Prüf-Stand je Wendung wird ERZEUGT
// (`npm run verify:build`). Diese Tests sind der Wächter dagegen, dass neuer
// Inhalt dazukommt und die erzeugte Datei still veraltet — dann stünde an einer
// nie geprüften Wendung nichts oder etwas Falsches.
describe('Prüf-Stand (verification.generated.ts)', () => {
  it('kennt JEDE Wendung — sonst ist die Datei veraltet', () => {
    for (const c of seedChunks) {
      expect(VERIFICATION[c.id], `kein Prüf-Stand für ${c.id} — npm run verify:build`).toBeDefined();
    }
  });

  it('kennt keine Wendung, die es nicht mehr gibt', () => {
    const ids = new Set(seedChunks.map((c) => c.id));
    for (const id of Object.keys(VERIFICATION)) {
      expect(ids.has(id), `Prüf-Stand für entfernte Wendung ${id}`).toBe(true);
    }
  });

  it('kennt nur die zwei Stufen, die eine Maschine wirklich vergeben kann', () => {
    // Eine Stufe „muttersprachlich geprüft" gibt es bewusst nicht mehr
    // (Entscheidung 2026-07-25): Es liest niemand gegen, und eine Skala, auf der
    // man nie vorankommt, ist keine Auskunft. Der SATZ über die Grenze steht
    // weiterhin in der App — nur eben nicht als Zähler.
    expect(new Set(Object.values(VERIFICATION))).toEqual(new Set(['machine', 'unchecked']));
    expect(Object.keys(VERIFICATION_META)).not.toContain('native');
  });

  it('begründet jede ungeprüfte Wendung', () => {
    for (const [id, level] of Object.entries(VERIFICATION)) {
      if (level === 'unchecked') expect(VERIFICATION_REASON[id]).toBeTruthy();
    }
  });

  it('zählt in den Kennzahlen dasselbe wie in der Liste', () => {
    const levels = Object.values(VERIFICATION);
    expect(levels.filter((l) => l === 'machine')).toHaveLength(VERIFICATION_META.machine);
    expect(levels.filter((l) => l === 'unchecked')).toHaveLength(VERIFICATION_META.unchecked);
  });
});

// Kontextvariation ist Schritt 4 des Lern-Loops (docs/03-method.md). Über 90
// Tage trifft der Lerner eine Wendung fünf- bis siebenmal; bei zwei Kontexten
// liest er ab dem dritten Mal denselben Satz wieder. Gemessen lagen wir am
// 2026-07-25 bei 2,06 — dieser Wächter hält den erreichten Stand.
describe('Kontextvariation je Wendung', () => {
  const kontexteVon = new Map<string, number>();
  for (const s of seedSegments) {
    for (const id of s.chunkIds) kontexteVon.set(id, (kontexteVon.get(id) ?? 0) + 1);
  }

  it('jede Wendung steht in mindestens zwei verschiedenen Sätzen', () => {
    const zuDuenn = seedChunks.filter((c) => (kontexteVon.get(c.id) ?? 0) < 2);
    expect(zuDuenn.map((c) => c.id)).toEqual([]);
  });

  it('die Kontexte einer Wendung sind wirklich verschieden', () => {
    // Zwei identische Sätze wären zwei Einträge und ein Kontext.
    const saetzeVon = new Map<string, string[]>();
    for (const s of seedSegments) {
      for (const id of s.chunkIds) saetzeVon.set(id, [...(saetzeVon.get(id) ?? []), s.sv]);
    }
    for (const [id, saetze] of saetzeVon) {
      expect(new Set(saetze).size, `Wendung ${id} hat doppelte Kontexte`).toBe(saetze.length);
    }
  });

  it('der Schnitt bleibt bei mindestens 2,5 Kontexten je Wendung', () => {
    const summe = seedChunks.reduce((n, c) => n + (kontexteVon.get(c.id) ?? 0), 0);
    const schnitt = summe / seedChunks.length;
    // Kein Zielwert, sondern eine Sperrklinke: erreicht ist erreicht.
    expect(schnitt).toBeGreaterThanOrEqual(2.5);
  });
});

// Der Lern-Loop übt eine Wendung ALLEIN. Ein Gespräch verlangt sie an der
// richtigen Stelle, mit einer Antwort davor und danach — das ist ein anderer,
// härterer Abruf. Am 2026-07-25 kam zum ersten Mal JEDE Wendung in mindestens
// einem Gespräch vor (379 von 379). Dieser Wächter hält den Stand.
describe('Gesprächs-Abdeckung', () => {
  const imGespraech = new Set<string>();
  for (const d of seedDialogs) {
    for (const t of d.turns) if (t.chunkId) imGespraech.add(t.chunkId);
  }

  it('jedes Thema hat mindestens ein Gespräch', () => {
    const mitSzene = new Set(seedDialogs.map((d) => d.categoryId));
    const ohne = seedCategories.filter((k) => !mitSzene.has(k.id));
    expect(ohne.map((k) => k.id)).toEqual([]);
  });

  it('mindestens 90 % der Wendungen kommen in einem Gespräch vor', () => {
    // Sperrklinke mit etwas Luft: Neuer Stoff darf zuerst im Loop landen und
    // sein Gespräch kurz danach bekommen — aber nie so viel, dass der
    // Gesprächs-Modus wieder zur halben Fläche wird.
    const anteil = seedChunks.filter((c) => imGespraech.has(c.id)).length / seedChunks.length;
    expect(anteil).toBeGreaterThanOrEqual(0.9);
  });
});

// Der Baum muss sich BENENNEN lassen, sonst navigiert niemand darin.
//
// BEFUND beim Ansehen 2026-07-26: „Menschen & Alltag" enthielt gleichzeitig ein
// Thema „Alltag & Small Talk" und ein Thema „Small Talk" — nebeneinander in
// derselben Liste und nicht auseinanderzuhalten. Und der Bereich war auf
// dreizehn Themen gewachsen: eine Liste, die alles enthält, ordnet nichts.
describe('Lesbarkeit des Baums', () => {
  it('kein Bereich trägt zwei Themen mit demselben Namen', () => {
    for (const a of seedAreas) {
      const titel = seedCategories.filter((c) => c.areaId === a.id).map((c) => c.title);
      expect(new Set(titel).size, `doppelter Themenname in ${a.title}`).toBe(titel.length);
    }
  });

  it('kein Themenname steckt vollständig in einem anderen desselben Bereichs', () => {
    // „Small Talk" in „Alltag & Small Talk" — technisch verschieden, im Blick
    // dasselbe. Genau daran ist die Navigation gescheitert.
    for (const a of seedAreas) {
      const titel = seedCategories.filter((c) => c.areaId === a.id).map((c) => c.title);
      for (const t of titel) {
        const drin = titel.filter((x) => x !== t && x.includes(t));
        expect(drin, `„${t}" steckt in „${drin[0]}" (${a.title})`).toEqual([]);
      }
    }
  });

  it('kein Bereich wird zur Endlosliste', () => {
    // Sperrklinke, kein Zielwert: Wächst ein Bereich über zehn Themen, gehört
    // er geteilt — sonst ist die Ebene „Bereich" keine Ordnung mehr.
    for (const a of seedAreas) {
      const n = seedCategories.filter((c) => c.areaId === a.id).length;
      expect(n, `${a.title} hat ${n} Themen — teilen`).toBeLessThanOrEqual(10);
    }
  });

  it('jeder Bereich hat eine eindeutige Sortierzahl', () => {
    const orders = seedAreas.map((a) => a.order);
    expect(new Set(orders).size, 'zwei Bereiche mit gleicher Reihenfolge').toBe(orders.length);
  });
});
