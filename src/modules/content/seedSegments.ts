// SEED CONTENT — placeholder demo only.
//
// ⚠️ These segments are hand-written basics used purely to make the loop
// runnable and to give each chunk ≥2 contexts (so context variation actually
// fires — docs/03-method.md, step 4). They are NOT the "~20 handgeprüfte
// KI-generierte Segmente" of the M1 milestone (docs/09-roadmap.md) and still
// need native-speaker review before any real learner uses them
// (docs/08-content-pipeline.md: QS). The literal decodings are structural
// glosses (Birkenbihl), not idiomatic translations.

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
  {
    id: 'c-forstar',
    sv: 'jag förstår inte',
    de: 'ich verstehe nicht',
    decoding: [
      { sv: 'jag', de: 'ich' },
      { sv: 'förstår', de: 'verstehe' },
      { sv: 'inte', de: 'nicht' },
    ],
  },
  {
    id: 'c-langsam',
    sv: 'kan du prata långsammare?',
    de: 'kannst du langsamer sprechen?',
    decoding: [
      { sv: 'kan', de: 'kann' },
      { sv: 'du', de: 'du' },
      { sv: 'prata', de: 'sprechen' },
      { sv: 'långsammare', de: 'langsamer' },
    ],
  },
];

export const seedSegments: Segment[] = [
  // c-hej in two contexts
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
    id: 's-morgon',
    level: 1,
    sv: 'God morgon! Hur mår du?',
    de: 'Guten Morgen! Wie geht es dir?',
    decoding: [
      { sv: 'god', de: 'guten' },
      { sv: 'morgon', de: 'morgen' },
      { sv: 'hur', de: 'wie' },
      { sv: 'mår', de: 'befindest' },
      { sv: 'du', de: 'du' },
    ],
    chunkIds: ['c-hej'],
  },
  // c-heter in two contexts
  {
    id: 's-namn1',
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
    id: 's-namn2',
    level: 1,
    sv: 'Hej, jag heter Erik.',
    de: 'Hallo, ich heiße Erik.',
    decoding: [
      { sv: 'hej', de: 'hallo' },
      { sv: 'jag', de: 'ich' },
      { sv: 'heter', de: 'heiße' },
      { sv: 'Erik', de: 'Erik' },
    ],
    chunkIds: ['c-heter'],
  },
  // c-hjalpa + c-kostar together, then each again separately
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
  {
    id: 's-hjalp2',
    level: 1,
    sv: 'Kan du hjälpa mig, tack?',
    de: 'Kannst du mir helfen, bitte?',
    decoding: [
      { sv: 'kan', de: 'kann' },
      { sv: 'du', de: 'du' },
      { sv: 'hjälpa', de: 'helfen' },
      { sv: 'mig', de: 'mir' },
      { sv: 'tack', de: 'bitte' },
    ],
    chunkIds: ['c-hjalpa'],
  },
  {
    id: 's-pris2',
    level: 1,
    sv: 'Ursäkta, vad kostar det?',
    de: 'Entschuldigung, was kostet das?',
    decoding: [
      { sv: 'ursäkta', de: 'entschuldige' },
      { sv: 'vad', de: 'was' },
      { sv: 'kostar', de: 'kostet' },
      { sv: 'det', de: 'das' },
    ],
    chunkIds: ['c-kostar'],
  },
  // c-forstar in two contexts
  {
    id: 's-forstar1',
    level: 1,
    sv: 'Förlåt, jag förstår inte.',
    de: 'Verzeihung, ich verstehe nicht.',
    decoding: [
      { sv: 'förlåt', de: 'verzeih' },
      { sv: 'jag', de: 'ich' },
      { sv: 'förstår', de: 'verstehe' },
      { sv: 'inte', de: 'nicht' },
    ],
    chunkIds: ['c-forstar'],
  },
  {
    id: 's-forstar2',
    level: 1,
    sv: 'Vänta, jag förstår inte riktigt.',
    de: 'Warte, ich verstehe nicht ganz.',
    decoding: [
      { sv: 'vänta', de: 'warte' },
      { sv: 'jag', de: 'ich' },
      { sv: 'förstår', de: 'verstehe' },
      { sv: 'inte', de: 'nicht' },
      { sv: 'riktigt', de: 'richtig' },
    ],
    chunkIds: ['c-forstar'],
  },
  // c-langsam in two contexts
  {
    id: 's-langsam1',
    level: 1,
    sv: 'Kan du prata långsammare, tack?',
    de: 'Kannst du langsamer sprechen, bitte?',
    decoding: [
      { sv: 'kan', de: 'kann' },
      { sv: 'du', de: 'du' },
      { sv: 'prata', de: 'sprechen' },
      { sv: 'långsammare', de: 'langsamer' },
      { sv: 'tack', de: 'bitte' },
    ],
    chunkIds: ['c-langsam'],
  },
  {
    id: 's-langsam2',
    level: 1,
    sv: 'Ursäkta, kan du prata långsammare?',
    de: 'Entschuldigung, kannst du langsamer sprechen?',
    decoding: [
      { sv: 'ursäkta', de: 'entschuldige' },
      { sv: 'kan', de: 'kann' },
      { sv: 'du', de: 'du' },
      { sv: 'prata', de: 'sprechen' },
      { sv: 'långsammare', de: 'langsamer' },
    ],
    chunkIds: ['c-langsam'],
  },
];
