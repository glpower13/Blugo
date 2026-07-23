// Standard-Adapter für die KI-Ports auf Basis des handgeschriebenen Seed-Inhalts.
// Sie „erzeugen" nichts Neues, sondern bedienen die vorhandenen Seed-Segmente —
// genau der Platzhalter, den ein echter Anbieter-Adapter später ersetzt (Schritt C).
// Bewusst ehrlich: was der Seed nicht kennt, kann er nicht liefern.

import type { DecodingToken, Segment } from '../../../domain/chunk';
import type { ContentGenerator, Decoder, GenerateSegmentRequest } from '../ports';
import { seedChunks, seedSegments } from '../seedSegments';

const norm = (t: string): string => t.trim().toLowerCase();

export const seedGenerator: ContentGenerator = {
  id: 'seed',
  async generate(req: GenerateSegmentRequest): Promise<Segment> {
    const avoid = new Set(req.avoidSegmentIds ?? []);
    const candidates = seedSegments.filter((s) => s.chunkIds.includes(req.chunkId));
    if (candidates.length === 0) {
      throw new Error(
        `seedGenerator: kein Seed-Segment enthält „${req.chunkId}" — ` +
          'echte Generierung braucht einen Anbieter-Adapter (Schritt C).',
      );
    }
    // Kontextvariation: einen noch ungesehenen Kontext bevorzugen.
    const unseen = candidates.find((s) => !avoid.has(s.id));
    return unseen ?? candidates[0];
  },
};

export const seedDecoder: Decoder = {
  id: 'seed',
  async decode(sv: string): Promise<DecodingToken[]> {
    const hit =
      seedSegments.find((s) => norm(s.sv) === norm(sv)) ??
      seedChunks.find((c) => norm(c.sv) === norm(sv));
    if (hit) return hit.decoding;
    // Ehrlich: der Seed-Dekoder kennt nur Seed-Inhalt. Fallback = Wort-für-Wort,
    // deutsche Seite offen („?"), statt etwas Falsches zu erfinden.
    return sv
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => ({ sv: w, de: '?' }));
  },
};
