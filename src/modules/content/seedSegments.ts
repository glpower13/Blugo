// SEED CONTENT — placeholder demo only.
//
// ⚠️ These segments are hand-written basics used purely to make the loop
// runnable and to give each chunk ≥2 contexts (so context variation actually
// fires — docs/03-method.md, step 4). They are NOT the "~20 handgeprüfte
// KI-generierte Segmente" of the M1 milestone (docs/09-roadmap.md) and still
// need native-speaker review before any real learner uses them
// (docs/08-content-pipeline.md: QS). The literal decodings are structural
// glosses (Birkenbihl), not idiomatic translations.

import type { Category, Chunk, Segment } from '../../domain/chunk';

// Thematic backbone (docs/gremium-struktur.md). Themes organize the content and
// give the learner an honest per-theme coverage view + a focus choice for NEW
// intake — NOT lessons to "complete" (the memory engine still drives the loop).
export const seedCategories: Category[] = [
  {
    id: 'cat-greet',
    title: 'Begrüßen & Kennenlernen',
    blurb: 'Hallo sagen, sich vorstellen, nach dem Befinden fragen.',
    order: 1,
  },
  {
    id: 'cat-understand',
    title: 'Sich verständigen',
    blurb: 'Nachfragen, wenn du etwas nicht verstehst.',
    order: 2,
  },
  {
    id: 'cat-cafe',
    title: 'Im Café & Einkaufen',
    blurb: 'Etwas bestellen, nach dem Preis fragen, danke sagen.',
    order: 3,
  },
  {
    id: 'cat-around',
    title: 'Unterwegs & Hilfe',
    blurb: 'Um Hilfe bitten, nach dem Weg fragen.',
    order: 4,
  },
];

export const seedChunks: Chunk[] = [
  {
    id: 'c-hej',
    categoryId: 'cat-greet',
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
    categoryId: 'cat-greet',
    sv: 'jag heter',
    de: 'ich heiße',
    decoding: [
      { sv: 'jag', de: 'ich' },
      { sv: 'heter', de: 'heiße' },
    ],
  },
  {
    id: 'c-hjalpa',
    categoryId: 'cat-around',
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
    categoryId: 'cat-cafe',
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
    categoryId: 'cat-understand',
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
    categoryId: 'cat-understand',
    sv: 'kan du prata långsammare?',
    de: 'kannst du langsamer sprechen?',
    decoding: [
      { sv: 'kan', de: 'kann' },
      { sv: 'du', de: 'du' },
      { sv: 'prata', de: 'sprechen' },
      { sv: 'långsammare', de: 'langsamer' },
    ],
  },
  {
    id: 'c-tack',
    categoryId: 'cat-cafe',
    sv: 'tack så mycket',
    de: 'danke vielmals',
    decoding: [
      { sv: 'tack', de: 'danke' },
      { sv: 'så', de: 'so' },
      { sv: 'mycket', de: 'viel' },
    ],
  },
  {
    id: 'c-marbra',
    categoryId: 'cat-greet',
    sv: 'jag mår bra',
    de: 'mir geht es gut',
    decoding: [
      { sv: 'jag', de: 'ich' },
      { sv: 'mår', de: 'befinde' },
      { sv: 'bra', de: 'gut' },
    ],
  },
  {
    id: 'c-var-toa',
    categoryId: 'cat-around',
    sv: 'var är toaletten?',
    de: 'wo ist die Toilette?',
    decoding: [
      { sv: 'var', de: 'wo' },
      { sv: 'är', de: 'ist' },
      { sv: 'toaletten', de: 'die Toilette' },
    ],
  },
  {
    id: 'c-vill-ha',
    categoryId: 'cat-cafe',
    sv: 'jag vill ha',
    de: 'ich möchte',
    decoding: [
      { sv: 'jag', de: 'ich' },
      { sv: 'vill', de: 'will' },
      { sv: 'ha', de: 'haben' },
    ],
  },
  {
    id: 'c-engelska',
    categoryId: 'cat-understand',
    sv: 'talar du engelska?',
    de: 'sprichst du Englisch?',
    decoding: [
      { sv: 'talar', de: 'sprichst' },
      { sv: 'du', de: 'du' },
      { sv: 'engelska', de: 'Englisch' },
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
  // c-tack in zwei Kontexten
  {
    id: 's-tack1',
    level: 1,
    sv: 'Tack så mycket för hjälpen!',
    de: 'Vielen Dank für die Hilfe!',
    decoding: [
      { sv: 'tack', de: 'danke' },
      { sv: 'så', de: 'so' },
      { sv: 'mycket', de: 'viel' },
      { sv: 'för', de: 'für' },
      { sv: 'hjälpen', de: 'die Hilfe' },
    ],
    chunkIds: ['c-tack'],
  },
  {
    id: 's-tack2',
    level: 1,
    sv: 'Tack så mycket, hej då!',
    de: 'Vielen Dank, tschüss!',
    decoding: [
      { sv: 'tack', de: 'danke' },
      { sv: 'så', de: 'so' },
      { sv: 'mycket', de: 'viel' },
      { sv: 'hej', de: 'tschüss' },
      { sv: 'då', de: 'dann' },
    ],
    chunkIds: ['c-tack'],
  },
  // c-marbra in zwei Kontexten
  {
    id: 's-marbra1',
    level: 1,
    sv: 'Tack, jag mår bra.',
    de: 'Danke, mir geht es gut.',
    decoding: [
      { sv: 'tack', de: 'danke' },
      { sv: 'jag', de: 'ich' },
      { sv: 'mår', de: 'befinde' },
      { sv: 'bra', de: 'gut' },
    ],
    chunkIds: ['c-marbra'],
  },
  {
    id: 's-marbra2',
    level: 1,
    sv: 'Jag mår bra idag.',
    de: 'Mir geht es heute gut.',
    decoding: [
      { sv: 'jag', de: 'ich' },
      { sv: 'mår', de: 'befinde' },
      { sv: 'bra', de: 'gut' },
      { sv: 'idag', de: 'heute' },
    ],
    chunkIds: ['c-marbra'],
  },
  // c-var-toa in zwei Kontexten
  {
    id: 's-toa1',
    level: 1,
    sv: 'Ursäkta, var är toaletten?',
    de: 'Entschuldigung, wo ist die Toilette?',
    decoding: [
      { sv: 'ursäkta', de: 'entschuldige' },
      { sv: 'var', de: 'wo' },
      { sv: 'är', de: 'ist' },
      { sv: 'toaletten', de: 'die Toilette' },
    ],
    chunkIds: ['c-var-toa'],
  },
  {
    id: 's-toa2',
    level: 1,
    sv: 'Var är toaletten, tack?',
    de: 'Wo ist die Toilette, bitte?',
    decoding: [
      { sv: 'var', de: 'wo' },
      { sv: 'är', de: 'ist' },
      { sv: 'toaletten', de: 'die Toilette' },
      { sv: 'tack', de: 'bitte' },
    ],
    chunkIds: ['c-var-toa'],
  },
  // c-vill-ha in zwei Kontexten
  {
    id: 's-vill1',
    level: 1,
    sv: 'Jag vill ha en kaffe, tack.',
    de: 'Ich möchte einen Kaffee, bitte.',
    decoding: [
      { sv: 'jag', de: 'ich' },
      { sv: 'vill', de: 'will' },
      { sv: 'ha', de: 'haben' },
      { sv: 'en', de: 'einen' },
      { sv: 'kaffe', de: 'Kaffee' },
      { sv: 'tack', de: 'bitte' },
    ],
    chunkIds: ['c-vill-ha'],
  },
  {
    id: 's-vill2',
    level: 1,
    sv: 'Jag vill ha vatten, tack.',
    de: 'Ich möchte Wasser, bitte.',
    decoding: [
      { sv: 'jag', de: 'ich' },
      { sv: 'vill', de: 'will' },
      { sv: 'ha', de: 'haben' },
      { sv: 'vatten', de: 'Wasser' },
      { sv: 'tack', de: 'bitte' },
    ],
    chunkIds: ['c-vill-ha'],
  },
  // c-engelska in zwei Kontexten
  {
    id: 's-eng1',
    level: 1,
    sv: 'Ursäkta, talar du engelska?',
    de: 'Entschuldigung, sprichst du Englisch?',
    decoding: [
      { sv: 'ursäkta', de: 'entschuldige' },
      { sv: 'talar', de: 'sprichst' },
      { sv: 'du', de: 'du' },
      { sv: 'engelska', de: 'Englisch' },
    ],
    chunkIds: ['c-engelska'],
  },
  {
    id: 's-eng2',
    level: 1,
    sv: 'Hej, talar du engelska?',
    de: 'Hallo, sprichst du Englisch?',
    decoding: [
      { sv: 'hej', de: 'hallo' },
      { sv: 'talar', de: 'sprichst' },
      { sv: 'du', de: 'du' },
      { sv: 'engelska', de: 'Englisch' },
    ],
    chunkIds: ['c-engelska'],
  },
];
