// SEED CONTENT — placeholder demo only.
//
// ⚠️ These few segments are hand-written basics used purely to make the loop
// runnable. They are NOT the "~20 handgeprüfte KI-generierte Segmente" of the
// M1 milestone (docs/09-roadmap.md) and still need native-speaker review before
// any real learner uses them (docs/08-content-pipeline.md: QS).

import type { Chunk, Segment } from '../../domain/chunk';

export const seedChunks: Chunk[] = [
  {
    id: 'c-hej',
    sv: 'hur mår du?',
    de: 'wie geht es dir?',
    decoding: [
      { sv: 'hur', de: 'wie' },
      { sv: 'mår', de: 'befindest' },
      { sv: 'du', de: 'du' },
    ],
  },
  {
    id: 'c-heter',
    sv: 'jag heter',
    de: 'ich heiße',
    decoding: [
      { sv: 'jag', de: 'ich' },
      { sv: 'heter', de: 'heiße' },
    ],
  },
  {
    id: 'c-hjalpa',
    sv: 'kan du hjälpa mig?',
    de: 'kannst du mir helfen?',
    decoding: [
      { sv: 'kan', de: 'kann' },
      { sv: 'du', de: 'du' },
      { sv: 'hjälpa', de: 'helfen' },
      { sv: 'mig', de: 'mir' },
    ],
  },
  {
    id: 'c-kostar',
    sv: 'vad kostar det?',
    de: 'was kostet das?',
    decoding: [
      { sv: 'vad', de: 'was' },
      { sv: 'kostar', de: 'kostet' },
      { sv: 'det', de: 'das' },
    ],
  },
];

export const seedSegments: Segment[] = [
  {
    id: 's-cafe',
    level: 1,
    sv: 'Hej! Hur mår du idag?',
    de: 'Hallo! Wie geht es dir heute?',
    decoding: [
      { sv: 'hej', de: 'hallo' },
      { sv: 'hur', de: 'wie' },
      { sv: 'mår', de: 'befindest' },
      { sv: 'du', de: 'du' },
      { sv: 'idag', de: 'heute' },
    ],
    chunkIds: ['c-hej'],
  },
  {
    id: 's-namn',
    level: 1,
    sv: 'Jag heter Anna. Vad heter du?',
    de: 'Ich heiße Anna. Wie heißt du?',
    decoding: [
      { sv: 'jag', de: 'ich' },
      { sv: 'heter', de: 'heiße' },
      { sv: 'Anna', de: 'Anna' },
      { sv: 'vad', de: 'was' },
      { sv: 'heter', de: 'heißt' },
      { sv: 'du', de: 'du' },
    ],
    chunkIds: ['c-heter'],
  },
  {
    id: 's-butik',
    level: 1,
    sv: 'Ursäkta, kan du hjälpa mig? Vad kostar det?',
    de: 'Entschuldigung, kannst du mir helfen? Was kostet das?',
    decoding: [
      { sv: 'ursäkta', de: 'entschuldige' },
      { sv: 'kan', de: 'kann' },
      { sv: 'du', de: 'du' },
      { sv: 'hjälpa', de: 'helfen' },
      { sv: 'mig', de: 'mir' },
      { sv: 'vad', de: 'was' },
      { sv: 'kostar', de: 'kostet' },
      { sv: 'det', de: 'das' },
    ],
    chunkIds: ['c-hjalpa', 'c-kostar'],
  },
];
