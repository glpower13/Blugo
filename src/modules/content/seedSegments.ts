// SEED CONTENT — deutlich erweitert 2026-07-23, aber weiterhin PROVISORISCH.
//
// ⚠️ EHRLICH: Dieser Inhalt ist von der KI/uns verfasst, **NICHT muttersprachlich
// geprüft**. Er macht den Loop erlebbar und gibt jedem Chunk ≥2 Kontexte (Kontext-
// variation — docs/03-method.md, Schritt 4), ist aber noch NICHT die geprüfte
// Produktions-Qualität. Vor echtem Einsatz: schwedische Muttersprache-QS
// (docs/content-review-schwedisch.md, docs/08-content-pipeline.md). Die
// Dekodierungen sind STRUKTURELLE Wort-für-Wort-Glossen (Birkenbihl), keine
// schönen Übersetzungen — deshalb wirken sie absichtlich holprig.
//
// Themen (cat-*) + ~40 Wendungen (c-*) über Alltag, Café, Weg, Zahlen/Zeit,
// Essen, Familie, Small Talk. Ausbau folgt über die KI-Content-Fabrik (der Moat).

import type { Area, Category, Chunk, Segment } from '../../domain/chunk';

// Erste Ebene des Baums: Lebens-BEREICHE (docs/gremium-struktur.md). Der Lerner
// browst flach: Bereich → Thema → Wendung, statt eine Endlosliste zu scrollen.
export const seedAreas: Area[] = [
  {
    id: 'area-basics',
    title: 'Erste Schritte',
    blurb: 'Die ersten Wörter: grüßen und sich verständigen.',
    order: 1,
  },
  {
    id: 'area-travel',
    title: 'Reisen & Unterwegs',
    blurb: 'Ankommen, den Weg finden, unterwegs klarkommen.',
    order: 2,
  },
  {
    id: 'area-food',
    title: 'Essen & Café',
    blurb: 'Bestellen, essen & trinken, zahlen, guten Appetit.',
    order: 3,
  },
  {
    id: 'area-people',
    title: 'Menschen & Alltag',
    blurb: 'Sich kennenlernen, Small Talk, Zeit & Zahlen.',
    order: 4,
  },
];

// Zweite Ebene: Themen (Unterpunkte) je Bereich (docs/gremium-struktur.md). Themen
// organisieren den Stoff und geben eine ehrliche Abdeckung + eine Fokus-Wahl für
// NEUEN Stoff — KEINE „Lektionen" zum Abschließen (die Memory-Engine treibt den Loop).
export const seedCategories: Category[] = [
  {
    id: 'cat-greet',
    areaId: 'area-basics',
    title: 'Begrüßen & Kennenlernen',
    blurb: 'Hallo sagen, sich vorstellen, nach dem Befinden fragen.',
    order: 1,
  },
  {
    id: 'cat-understand',
    areaId: 'area-basics',
    title: 'Sich verständigen',
    blurb: 'Nachfragen, wenn du etwas nicht verstehst.',
    order: 2,
  },
  {
    id: 'cat-around',
    areaId: 'area-travel',
    title: 'Nach dem Weg fragen',
    blurb: 'Um Hilfe bitten, nach dem Weg und der Toilette fragen.',
    order: 1,
  },
  {
    id: 'cat-cafe',
    areaId: 'area-food',
    title: 'Im Café',
    blurb: 'Etwas bestellen, nach dem Preis fragen, danke sagen.',
    order: 1,
  },
  {
    id: 'cat-food',
    areaId: 'area-food',
    title: 'Essen & Trinken',
    blurb: 'Hunger, Durst, bestellen, guten Appetit.',
    order: 2,
  },
  {
    id: 'cat-family',
    areaId: 'area-people',
    title: 'Familie & Herkunft',
    blurb: 'Woher du kommst, wo du wohnst, Familie.',
    order: 1,
  },
  {
    id: 'cat-daily',
    areaId: 'area-people',
    title: 'Alltag & Small Talk',
    blurb: 'Wetter, Beruf, Alter, sich verabschieden.',
    order: 2,
  },
  {
    id: 'cat-numbers',
    areaId: 'area-people',
    title: 'Zahlen & Zeit',
    blurb: 'Nach der Uhrzeit und dem Tag fragen.',
    order: 3,
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

  // ── Erweiterung 2026-07-23 (nicht muttersprachlich geprüft, siehe Header) ──

  // Begrüßen & Kennenlernen
  { id: 'c-hejda', categoryId: 'cat-greet', sv: 'hej då', de: 'tschüss', decoding: [{ sv: 'hej', de: 'tschüss' }, { sv: 'då', de: 'dann' }] },
  { id: 'c-vises', categoryId: 'cat-greet', sv: 'vi ses', de: 'wir sehen uns', decoding: [{ sv: 'vi', de: 'wir' }, { sv: 'ses', de: 'sehen uns' }] },
  { id: 'c-varifran', categoryId: 'cat-greet', sv: 'varifrån kommer du?', de: 'woher kommst du?', decoding: [{ sv: 'varifrån', de: 'woher' }, { sv: 'kommer', de: 'kommst' }, { sv: 'du', de: 'du' }] },

  // Sich verständigen
  { id: 'c-upprepa', categoryId: 'cat-understand', sv: 'kan du upprepa?', de: 'kannst du wiederholen?', decoding: [{ sv: 'kan', de: 'kannst' }, { sv: 'du', de: 'du' }, { sv: 'upprepa', de: 'wiederholen' }] },
  { id: 'c-betyder', categoryId: 'cat-understand', sv: 'vad betyder det?', de: 'was bedeutet das?', decoding: [{ sv: 'vad', de: 'was' }, { sv: 'betyder', de: 'bedeutet' }, { sv: 'det', de: 'das' }] },
  { id: 'c-pasvenska', categoryId: 'cat-understand', sv: 'hur säger man det på svenska?', de: 'wie sagt man das auf Schwedisch?', decoding: [{ sv: 'hur', de: 'wie' }, { sv: 'säger', de: 'sagt' }, { sv: 'man', de: 'man' }, { sv: 'det', de: 'das' }, { sv: 'på', de: 'auf' }, { sv: 'svenska', de: 'Schwedisch' }] },

  // Im Café & Einkaufen
  { id: 'c-notan', categoryId: 'cat-cafe', sv: 'kan jag få notan?', de: 'kann ich die Rechnung haben?', decoding: [{ sv: 'kan', de: 'kann' }, { sv: 'jag', de: 'ich' }, { sv: 'få', de: 'bekommen' }, { sv: 'notan', de: 'die Rechnung' }] },
  { id: 'c-entill', categoryId: 'cat-cafe', sv: 'en till, tack', de: 'noch eine(n), bitte', decoding: [{ sv: 'en', de: 'eine' }, { sv: 'till', de: 'noch' }, { sv: 'tack', de: 'bitte' }] },

  // Unterwegs & Hilfe
  { id: 'c-stationen', categoryId: 'cat-around', sv: 'var ligger stationen?', de: 'wo liegt der Bahnhof?', decoding: [{ sv: 'var', de: 'wo' }, { sv: 'ligger', de: 'liegt' }, { sv: 'stationen', de: 'der Bahnhof' }] },
  { id: 'c-centrum', categoryId: 'cat-around', sv: 'hur kommer jag till centrum?', de: 'wie komme ich ins Zentrum?', decoding: [{ sv: 'hur', de: 'wie' }, { sv: 'kommer', de: 'komme' }, { sv: 'jag', de: 'ich' }, { sv: 'till', de: 'zu' }, { sv: 'centrum', de: 'Zentrum' }] },
  { id: 'c-hoger', categoryId: 'cat-around', sv: 'till höger', de: 'nach rechts', decoding: [{ sv: 'till', de: 'nach' }, { sv: 'höger', de: 'rechts' }] },
  { id: 'c-vanster', categoryId: 'cat-around', sv: 'till vänster', de: 'nach links', decoding: [{ sv: 'till', de: 'nach' }, { sv: 'vänster', de: 'links' }] },
  { id: 'c-raktfram', categoryId: 'cat-around', sv: 'rakt fram', de: 'geradeaus', decoding: [{ sv: 'rakt', de: 'gerade' }, { sv: 'fram', de: 'voraus' }] },

  // Zahlen & Zeit
  { id: 'c-klockan', categoryId: 'cat-numbers', sv: 'vad är klockan?', de: 'wie spät ist es?', decoding: [{ sv: 'vad', de: 'was' }, { sv: 'är', de: 'ist' }, { sv: 'klockan', de: 'die Uhr' }] },
  { id: 'c-vilkendag', categoryId: 'cat-numbers', sv: 'vilken dag är det?', de: 'welcher Tag ist es?', decoding: [{ sv: 'vilken', de: 'welcher' }, { sv: 'dag', de: 'Tag' }, { sv: 'är', de: 'ist' }, { sv: 'det', de: 'es' }] },
  { id: 'c-entimme', categoryId: 'cat-numbers', sv: 'om en timme', de: 'in einer Stunde', decoding: [{ sv: 'om', de: 'in' }, { sv: 'en', de: 'einer' }, { sv: 'timme', de: 'Stunde' }] },

  // Essen & Trinken
  { id: 'c-hungrig', categoryId: 'cat-food', sv: 'jag är hungrig', de: 'ich bin hungrig', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'är', de: 'bin' }, { sv: 'hungrig', de: 'hungrig' }] },
  { id: 'c-torstig', categoryId: 'cat-food', sv: 'jag är törstig', de: 'ich bin durstig', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'är', de: 'bin' }, { sv: 'törstig', de: 'durstig' }] },
  { id: 'c-smaklig', categoryId: 'cat-food', sv: 'smaklig måltid', de: 'guten Appetit', decoding: [{ sv: 'smaklig', de: 'schmackhaft' }, { sv: 'måltid', de: 'Mahlzeit' }] },
  { id: 'c-gillar', categoryId: 'cat-food', sv: 'jag gillar kaffe', de: 'ich mag Kaffee', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'gillar', de: 'mag' }, { sv: 'kaffe', de: 'Kaffee' }] },
  { id: 'c-utanmjolk', categoryId: 'cat-food', sv: 'utan mjölk, tack', de: 'ohne Milch, bitte', decoding: [{ sv: 'utan', de: 'ohne' }, { sv: 'mjölk', de: 'Milch' }, { sv: 'tack', de: 'bitte' }] },

  // Familie & Herkunft
  { id: 'c-familj', categoryId: 'cat-family', sv: 'min familj', de: 'meine Familie', decoding: [{ sv: 'min', de: 'meine' }, { sv: 'familj', de: 'Familie' }] },
  { id: 'c-harbarn', categoryId: 'cat-family', sv: 'har du barn?', de: 'hast du Kinder?', decoding: [{ sv: 'har', de: 'hast' }, { sv: 'du', de: 'du' }, { sv: 'barn', de: 'Kinder' }] },
  { id: 'c-bror', categoryId: 'cat-family', sv: 'jag har en bror', de: 'ich habe einen Bruder', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'har', de: 'habe' }, { sv: 'en', de: 'einen' }, { sv: 'bror', de: 'Bruder' }] },
  { id: 'c-bordu', categoryId: 'cat-family', sv: 'var bor du?', de: 'wo wohnst du?', decoding: [{ sv: 'var', de: 'wo' }, { sv: 'bor', de: 'wohnst' }, { sv: 'du', de: 'du' }] },
  { id: 'c-frantyskland', categoryId: 'cat-family', sv: 'jag kommer från Tyskland', de: 'ich komme aus Deutschland', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'kommer', de: 'komme' }, { sv: 'från', de: 'aus' }, { sv: 'Tyskland', de: 'Deutschland' }] },

  // Alltag & Small Talk
  { id: 'c-gammal', categoryId: 'cat-daily', sv: 'hur gammal är du?', de: 'wie alt bist du?', decoding: [{ sv: 'hur', de: 'wie' }, { sv: 'gammal', de: 'alt' }, { sv: 'är', de: 'bist' }, { sv: 'du', de: 'du' }] },
  { id: 'c-jobbar', categoryId: 'cat-daily', sv: 'vad jobbar du med?', de: 'was machst du beruflich?', decoding: [{ sv: 'vad', de: 'was' }, { sv: 'jobbar', de: 'arbeitest' }, { sv: 'du', de: 'du' }, { sv: 'med', de: 'mit' }] },
  { id: 'c-vader', categoryId: 'cat-daily', sv: 'vilket vackert väder!', de: 'was für schönes Wetter!', decoding: [{ sv: 'vilket', de: 'welches' }, { sv: 'vackert', de: 'schönes' }, { sv: 'väder', de: 'Wetter' }] },
  { id: 'c-regnar', categoryId: 'cat-daily', sv: 'det regnar', de: 'es regnet', decoding: [{ sv: 'det', de: 'es' }, { sv: 'regnar', de: 'regnet' }] },
  { id: 'c-hadetbra', categoryId: 'cat-daily', sv: 'ha det bra', de: 'alles Gute', decoding: [{ sv: 'ha', de: 'hab' }, { sv: 'det', de: 'es' }, { sv: 'bra', de: 'gut' }] },
  { id: 'c-trevligt', categoryId: 'cat-daily', sv: 'trevligt att träffas', de: 'schön, dich kennenzulernen', decoding: [{ sv: 'trevligt', de: 'nett' }, { sv: 'att', de: 'zu' }, { sv: 'träffas', de: 'treffen' }] },
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

  // ── Erweiterung 2026-07-23 · je 2 Kontexte (nicht muttersprachlich geprüft) ──

  // c-hejda
  { id: 's-hejda1', level: 1, sv: 'Tack och hej då!', de: 'Danke und tschüss!', decoding: [{ sv: 'tack', de: 'danke' }, { sv: 'och', de: 'und' }, { sv: 'hej', de: 'tschüss' }, { sv: 'då', de: 'dann' }], chunkIds: ['c-hejda'] },
  { id: 's-hejda2', level: 1, sv: 'Hej då, vi ses!', de: 'Tschüss, wir sehen uns!', decoding: [{ sv: 'hej', de: 'tschüss' }, { sv: 'då', de: 'dann' }, { sv: 'vi', de: 'wir' }, { sv: 'ses', de: 'sehen uns' }], chunkIds: ['c-hejda', 'c-vises'] },
  // c-vises
  { id: 's-vises1', level: 1, sv: 'Vi ses imorgon.', de: 'Wir sehen uns morgen.', decoding: [{ sv: 'vi', de: 'wir' }, { sv: 'ses', de: 'sehen uns' }, { sv: 'imorgon', de: 'morgen' }], chunkIds: ['c-vises'] },
  { id: 's-vises2', level: 1, sv: 'Okej, vi ses snart!', de: 'Okay, wir sehen uns bald!', decoding: [{ sv: 'okej', de: 'okay' }, { sv: 'vi', de: 'wir' }, { sv: 'ses', de: 'sehen uns' }, { sv: 'snart', de: 'bald' }], chunkIds: ['c-vises'] },
  // c-varifran
  { id: 's-varifran1', level: 1, sv: 'Hej! Varifrån kommer du?', de: 'Hallo! Woher kommst du?', decoding: [{ sv: 'hej', de: 'hallo' }, { sv: 'varifrån', de: 'woher' }, { sv: 'kommer', de: 'kommst' }, { sv: 'du', de: 'du' }], chunkIds: ['c-varifran'] },
  { id: 's-varifran2', level: 1, sv: 'Och varifrån kommer du?', de: 'Und woher kommst du?', decoding: [{ sv: 'och', de: 'und' }, { sv: 'varifrån', de: 'woher' }, { sv: 'kommer', de: 'kommst' }, { sv: 'du', de: 'du' }], chunkIds: ['c-varifran'] },

  // c-upprepa
  { id: 's-upprepa1', level: 1, sv: 'Ursäkta, kan du upprepa?', de: 'Entschuldigung, kannst du wiederholen?', decoding: [{ sv: 'ursäkta', de: 'entschuldige' }, { sv: 'kan', de: 'kannst' }, { sv: 'du', de: 'du' }, { sv: 'upprepa', de: 'wiederholen' }], chunkIds: ['c-upprepa'] },
  { id: 's-upprepa2', level: 1, sv: 'Kan du upprepa långsamt?', de: 'Kannst du langsam wiederholen?', decoding: [{ sv: 'kan', de: 'kannst' }, { sv: 'du', de: 'du' }, { sv: 'upprepa', de: 'wiederholen' }, { sv: 'långsamt', de: 'langsam' }], chunkIds: ['c-upprepa'] },
  // c-betyder
  { id: 's-betyder1', level: 1, sv: 'Vad betyder det?', de: 'Was bedeutet das?', decoding: [{ sv: 'vad', de: 'was' }, { sv: 'betyder', de: 'bedeutet' }, { sv: 'det', de: 'das' }], chunkIds: ['c-betyder'] },
  { id: 's-betyder2', level: 1, sv: 'Ursäkta, vad betyder ordet?', de: 'Entschuldigung, was bedeutet das Wort?', decoding: [{ sv: 'ursäkta', de: 'entschuldige' }, { sv: 'vad', de: 'was' }, { sv: 'betyder', de: 'bedeutet' }, { sv: 'ordet', de: 'das Wort' }], chunkIds: ['c-betyder'] },
  // c-pasvenska
  { id: 's-pasvenska1', level: 1, sv: 'Hur säger man det på svenska?', de: 'Wie sagt man das auf Schwedisch?', decoding: [{ sv: 'hur', de: 'wie' }, { sv: 'säger', de: 'sagt' }, { sv: 'man', de: 'man' }, { sv: 'det', de: 'das' }, { sv: 'på', de: 'auf' }, { sv: 'svenska', de: 'Schwedisch' }], chunkIds: ['c-pasvenska'] },
  { id: 's-pasvenska2', level: 1, sv: 'Förlåt, hur säger man det på svenska?', de: 'Verzeihung, wie sagt man das auf Schwedisch?', decoding: [{ sv: 'förlåt', de: 'verzeih' }, { sv: 'hur', de: 'wie' }, { sv: 'säger', de: 'sagt' }, { sv: 'man', de: 'man' }, { sv: 'det', de: 'das' }, { sv: 'på', de: 'auf' }, { sv: 'svenska', de: 'Schwedisch' }], chunkIds: ['c-pasvenska'] },

  // c-notan
  { id: 's-notan1', level: 1, sv: 'Ursäkta, kan jag få notan?', de: 'Entschuldigung, kann ich die Rechnung haben?', decoding: [{ sv: 'ursäkta', de: 'entschuldige' }, { sv: 'kan', de: 'kann' }, { sv: 'jag', de: 'ich' }, { sv: 'få', de: 'bekommen' }, { sv: 'notan', de: 'die Rechnung' }], chunkIds: ['c-notan'] },
  { id: 's-notan2', level: 1, sv: 'Kan jag få notan, tack?', de: 'Kann ich die Rechnung haben, bitte?', decoding: [{ sv: 'kan', de: 'kann' }, { sv: 'jag', de: 'ich' }, { sv: 'få', de: 'bekommen' }, { sv: 'notan', de: 'die Rechnung' }, { sv: 'tack', de: 'bitte' }], chunkIds: ['c-notan'] },
  // c-entill
  { id: 's-entill1', level: 1, sv: 'En kaffe till, tack.', de: 'Noch einen Kaffee, bitte.', decoding: [{ sv: 'en', de: 'einen' }, { sv: 'kaffe', de: 'Kaffee' }, { sv: 'till', de: 'noch' }, { sv: 'tack', de: 'bitte' }], chunkIds: ['c-entill'] },
  { id: 's-entill2', level: 1, sv: 'En till, tack!', de: 'Noch eine(n), bitte!', decoding: [{ sv: 'en', de: 'eine' }, { sv: 'till', de: 'noch' }, { sv: 'tack', de: 'bitte' }], chunkIds: ['c-entill'] },

  // c-stationen
  { id: 's-stationen1', level: 1, sv: 'Ursäkta, var ligger stationen?', de: 'Entschuldigung, wo liegt der Bahnhof?', decoding: [{ sv: 'ursäkta', de: 'entschuldige' }, { sv: 'var', de: 'wo' }, { sv: 'ligger', de: 'liegt' }, { sv: 'stationen', de: 'der Bahnhof' }], chunkIds: ['c-stationen'] },
  { id: 's-stationen2', level: 1, sv: 'Var ligger stationen, tack?', de: 'Wo liegt der Bahnhof, bitte?', decoding: [{ sv: 'var', de: 'wo' }, { sv: 'ligger', de: 'liegt' }, { sv: 'stationen', de: 'der Bahnhof' }, { sv: 'tack', de: 'bitte' }], chunkIds: ['c-stationen'] },
  // c-centrum
  { id: 's-centrum1', level: 1, sv: 'Hur kommer jag till centrum?', de: 'Wie komme ich ins Zentrum?', decoding: [{ sv: 'hur', de: 'wie' }, { sv: 'kommer', de: 'komme' }, { sv: 'jag', de: 'ich' }, { sv: 'till', de: 'zu' }, { sv: 'centrum', de: 'Zentrum' }], chunkIds: ['c-centrum'] },
  { id: 's-centrum2', level: 1, sv: 'Ursäkta, hur kommer jag till centrum?', de: 'Entschuldigung, wie komme ich ins Zentrum?', decoding: [{ sv: 'ursäkta', de: 'entschuldige' }, { sv: 'hur', de: 'wie' }, { sv: 'kommer', de: 'komme' }, { sv: 'jag', de: 'ich' }, { sv: 'till', de: 'zu' }, { sv: 'centrum', de: 'Zentrum' }], chunkIds: ['c-centrum'] },
  // c-hoger
  { id: 's-hoger1', level: 1, sv: 'Sväng till höger.', de: 'Bieg nach rechts ab.', decoding: [{ sv: 'sväng', de: 'bieg ab' }, { sv: 'till', de: 'nach' }, { sv: 'höger', de: 'rechts' }], chunkIds: ['c-hoger'] },
  { id: 's-hoger2', level: 1, sv: 'Det är till höger.', de: 'Es ist rechts.', decoding: [{ sv: 'det', de: 'es' }, { sv: 'är', de: 'ist' }, { sv: 'till', de: 'nach' }, { sv: 'höger', de: 'rechts' }], chunkIds: ['c-hoger'] },
  // c-vanster
  { id: 's-vanster1', level: 1, sv: 'Sväng till vänster.', de: 'Bieg nach links ab.', decoding: [{ sv: 'sväng', de: 'bieg ab' }, { sv: 'till', de: 'nach' }, { sv: 'vänster', de: 'links' }], chunkIds: ['c-vanster'] },
  { id: 's-vanster2', level: 1, sv: 'Det är till vänster.', de: 'Es ist links.', decoding: [{ sv: 'det', de: 'es' }, { sv: 'är', de: 'ist' }, { sv: 'till', de: 'nach' }, { sv: 'vänster', de: 'links' }], chunkIds: ['c-vanster'] },
  // c-raktfram
  { id: 's-raktfram1', level: 1, sv: 'Gå rakt fram.', de: 'Geh geradeaus.', decoding: [{ sv: 'gå', de: 'geh' }, { sv: 'rakt', de: 'gerade' }, { sv: 'fram', de: 'voraus' }], chunkIds: ['c-raktfram'] },
  { id: 's-raktfram2', level: 1, sv: 'Kör rakt fram, tack.', de: 'Fahr geradeaus, bitte.', decoding: [{ sv: 'kör', de: 'fahr' }, { sv: 'rakt', de: 'gerade' }, { sv: 'fram', de: 'voraus' }, { sv: 'tack', de: 'bitte' }], chunkIds: ['c-raktfram'] },

  // c-klockan
  { id: 's-klockan1', level: 1, sv: 'Ursäkta, vad är klockan?', de: 'Entschuldigung, wie spät ist es?', decoding: [{ sv: 'ursäkta', de: 'entschuldige' }, { sv: 'vad', de: 'was' }, { sv: 'är', de: 'ist' }, { sv: 'klockan', de: 'die Uhr' }], chunkIds: ['c-klockan'] },
  { id: 's-klockan2', level: 1, sv: 'Vad är klockan nu?', de: 'Wie spät ist es jetzt?', decoding: [{ sv: 'vad', de: 'was' }, { sv: 'är', de: 'ist' }, { sv: 'klockan', de: 'die Uhr' }, { sv: 'nu', de: 'jetzt' }], chunkIds: ['c-klockan'] },
  // c-vilkendag
  { id: 's-vilkendag1', level: 1, sv: 'Vilken dag är det idag?', de: 'Welcher Tag ist heute?', decoding: [{ sv: 'vilken', de: 'welcher' }, { sv: 'dag', de: 'Tag' }, { sv: 'är', de: 'ist' }, { sv: 'det', de: 'es' }, { sv: 'idag', de: 'heute' }], chunkIds: ['c-vilkendag'] },
  { id: 's-vilkendag2', level: 1, sv: 'Förlåt, vilken dag är det?', de: 'Verzeihung, welcher Tag ist es?', decoding: [{ sv: 'förlåt', de: 'verzeih' }, { sv: 'vilken', de: 'welcher' }, { sv: 'dag', de: 'Tag' }, { sv: 'är', de: 'ist' }, { sv: 'det', de: 'es' }], chunkIds: ['c-vilkendag'] },
  // c-entimme
  { id: 's-entimme1', level: 1, sv: 'Vi ses om en timme.', de: 'Wir sehen uns in einer Stunde.', decoding: [{ sv: 'vi', de: 'wir' }, { sv: 'ses', de: 'sehen uns' }, { sv: 'om', de: 'in' }, { sv: 'en', de: 'einer' }, { sv: 'timme', de: 'Stunde' }], chunkIds: ['c-entimme'] },
  { id: 's-entimme2', level: 1, sv: 'Jag kommer om en timme.', de: 'Ich komme in einer Stunde.', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'kommer', de: 'komme' }, { sv: 'om', de: 'in' }, { sv: 'en', de: 'einer' }, { sv: 'timme', de: 'Stunde' }], chunkIds: ['c-entimme'] },

  // c-hungrig
  { id: 's-hungrig1', level: 1, sv: 'Jag är hungrig.', de: 'Ich bin hungrig.', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'är', de: 'bin' }, { sv: 'hungrig', de: 'hungrig' }], chunkIds: ['c-hungrig'] },
  { id: 's-hungrig2', level: 1, sv: 'Är du hungrig?', de: 'Bist du hungrig?', decoding: [{ sv: 'är', de: 'bist' }, { sv: 'du', de: 'du' }, { sv: 'hungrig', de: 'hungrig' }], chunkIds: ['c-hungrig'] },
  // c-torstig
  { id: 's-torstig1', level: 1, sv: 'Jag är törstig.', de: 'Ich bin durstig.', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'är', de: 'bin' }, { sv: 'törstig', de: 'durstig' }], chunkIds: ['c-torstig'] },
  { id: 's-torstig2', level: 1, sv: 'Är du törstig?', de: 'Bist du durstig?', decoding: [{ sv: 'är', de: 'bist' }, { sv: 'du', de: 'du' }, { sv: 'törstig', de: 'durstig' }], chunkIds: ['c-torstig'] },
  // c-smaklig
  { id: 's-smaklig1', level: 1, sv: 'Smaklig måltid!', de: 'Guten Appetit!', decoding: [{ sv: 'smaklig', de: 'schmackhaft' }, { sv: 'måltid', de: 'Mahlzeit' }], chunkIds: ['c-smaklig'] },
  { id: 's-smaklig2', level: 1, sv: 'Tack, smaklig måltid!', de: 'Danke, guten Appetit!', decoding: [{ sv: 'tack', de: 'danke' }, { sv: 'smaklig', de: 'schmackhaft' }, { sv: 'måltid', de: 'Mahlzeit' }], chunkIds: ['c-smaklig'] },
  // c-gillar
  { id: 's-gillar1', level: 1, sv: 'Jag gillar kaffe.', de: 'Ich mag Kaffee.', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'gillar', de: 'mag' }, { sv: 'kaffe', de: 'Kaffee' }], chunkIds: ['c-gillar'] },
  { id: 's-gillar2', level: 1, sv: 'Jag gillar kaffe med mjölk.', de: 'Ich mag Kaffee mit Milch.', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'gillar', de: 'mag' }, { sv: 'kaffe', de: 'Kaffee' }, { sv: 'med', de: 'mit' }, { sv: 'mjölk', de: 'Milch' }], chunkIds: ['c-gillar'] },
  // c-utanmjolk
  { id: 's-utanmjolk1', level: 1, sv: 'En kaffe utan mjölk, tack.', de: 'Einen Kaffee ohne Milch, bitte.', decoding: [{ sv: 'en', de: 'einen' }, { sv: 'kaffe', de: 'Kaffee' }, { sv: 'utan', de: 'ohne' }, { sv: 'mjölk', de: 'Milch' }, { sv: 'tack', de: 'bitte' }], chunkIds: ['c-utanmjolk'] },
  { id: 's-utanmjolk2', level: 1, sv: 'Utan mjölk, tack.', de: 'Ohne Milch, bitte.', decoding: [{ sv: 'utan', de: 'ohne' }, { sv: 'mjölk', de: 'Milch' }, { sv: 'tack', de: 'bitte' }], chunkIds: ['c-utanmjolk'] },

  // c-familj
  { id: 's-familj1', level: 1, sv: 'Det här är min familj.', de: 'Das hier ist meine Familie.', decoding: [{ sv: 'det', de: 'das' }, { sv: 'här', de: 'hier' }, { sv: 'är', de: 'ist' }, { sv: 'min', de: 'meine' }, { sv: 'familj', de: 'Familie' }], chunkIds: ['c-familj'] },
  { id: 's-familj2', level: 1, sv: 'Jag älskar min familj.', de: 'Ich liebe meine Familie.', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'älskar', de: 'liebe' }, { sv: 'min', de: 'meine' }, { sv: 'familj', de: 'Familie' }], chunkIds: ['c-familj'] },
  // c-harbarn
  { id: 's-harbarn1', level: 1, sv: 'Har du barn?', de: 'Hast du Kinder?', decoding: [{ sv: 'har', de: 'hast' }, { sv: 'du', de: 'du' }, { sv: 'barn', de: 'Kinder' }], chunkIds: ['c-harbarn'] },
  { id: 's-harbarn2', level: 1, sv: 'Har du barn också?', de: 'Hast du auch Kinder?', decoding: [{ sv: 'har', de: 'hast' }, { sv: 'du', de: 'du' }, { sv: 'barn', de: 'Kinder' }, { sv: 'också', de: 'auch' }], chunkIds: ['c-harbarn'] },
  // c-bror
  { id: 's-bror1', level: 1, sv: 'Jag har en bror.', de: 'Ich habe einen Bruder.', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'har', de: 'habe' }, { sv: 'en', de: 'einen' }, { sv: 'bror', de: 'Bruder' }], chunkIds: ['c-bror'] },
  { id: 's-bror2', level: 1, sv: 'Har du en bror?', de: 'Hast du einen Bruder?', decoding: [{ sv: 'har', de: 'hast' }, { sv: 'du', de: 'du' }, { sv: 'en', de: 'einen' }, { sv: 'bror', de: 'Bruder' }], chunkIds: ['c-bror'] },
  // c-bordu
  { id: 's-bordu1', level: 1, sv: 'Var bor du?', de: 'Wo wohnst du?', decoding: [{ sv: 'var', de: 'wo' }, { sv: 'bor', de: 'wohnst' }, { sv: 'du', de: 'du' }], chunkIds: ['c-bordu'] },
  { id: 's-bordu2', level: 1, sv: 'Var bor du nu?', de: 'Wo wohnst du jetzt?', decoding: [{ sv: 'var', de: 'wo' }, { sv: 'bor', de: 'wohnst' }, { sv: 'du', de: 'du' }, { sv: 'nu', de: 'jetzt' }], chunkIds: ['c-bordu'] },
  // c-frantyskland
  { id: 's-frantyskland1', level: 1, sv: 'Jag kommer från Tyskland.', de: 'Ich komme aus Deutschland.', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'kommer', de: 'komme' }, { sv: 'från', de: 'aus' }, { sv: 'Tyskland', de: 'Deutschland' }], chunkIds: ['c-frantyskland'] },
  { id: 's-frantyskland2', level: 1, sv: 'Hej, jag kommer från Tyskland.', de: 'Hallo, ich komme aus Deutschland.', decoding: [{ sv: 'hej', de: 'hallo' }, { sv: 'jag', de: 'ich' }, { sv: 'kommer', de: 'komme' }, { sv: 'från', de: 'aus' }, { sv: 'Tyskland', de: 'Deutschland' }], chunkIds: ['c-frantyskland'] },

  // c-gammal
  { id: 's-gammal1', level: 1, sv: 'Hur gammal är du?', de: 'Wie alt bist du?', decoding: [{ sv: 'hur', de: 'wie' }, { sv: 'gammal', de: 'alt' }, { sv: 'är', de: 'bist' }, { sv: 'du', de: 'du' }], chunkIds: ['c-gammal'] },
  { id: 's-gammal2', level: 1, sv: 'Förlåt, hur gammal är du?', de: 'Verzeihung, wie alt bist du?', decoding: [{ sv: 'förlåt', de: 'verzeih' }, { sv: 'hur', de: 'wie' }, { sv: 'gammal', de: 'alt' }, { sv: 'är', de: 'bist' }, { sv: 'du', de: 'du' }], chunkIds: ['c-gammal'] },
  // c-jobbar
  { id: 's-jobbar1', level: 1, sv: 'Vad jobbar du med?', de: 'Was machst du beruflich?', decoding: [{ sv: 'vad', de: 'was' }, { sv: 'jobbar', de: 'arbeitest' }, { sv: 'du', de: 'du' }, { sv: 'med', de: 'mit' }], chunkIds: ['c-jobbar'] },
  { id: 's-jobbar2', level: 1, sv: 'Och vad jobbar du med?', de: 'Und was machst du beruflich?', decoding: [{ sv: 'och', de: 'und' }, { sv: 'vad', de: 'was' }, { sv: 'jobbar', de: 'arbeitest' }, { sv: 'du', de: 'du' }, { sv: 'med', de: 'mit' }], chunkIds: ['c-jobbar'] },
  // c-vader
  { id: 's-vader1', level: 1, sv: 'Vilket vackert väder!', de: 'Was für schönes Wetter!', decoding: [{ sv: 'vilket', de: 'welches' }, { sv: 'vackert', de: 'schönes' }, { sv: 'väder', de: 'Wetter' }], chunkIds: ['c-vader'] },
  { id: 's-vader2', level: 1, sv: 'Idag är det vackert väder.', de: 'Heute ist schönes Wetter.', decoding: [{ sv: 'idag', de: 'heute' }, { sv: 'är', de: 'ist' }, { sv: 'det', de: 'es' }, { sv: 'vackert', de: 'schönes' }, { sv: 'väder', de: 'Wetter' }], chunkIds: ['c-vader'] },
  // c-regnar
  { id: 's-regnar1', level: 1, sv: 'Det regnar idag.', de: 'Es regnet heute.', decoding: [{ sv: 'det', de: 'es' }, { sv: 'regnar', de: 'regnet' }, { sv: 'idag', de: 'heute' }], chunkIds: ['c-regnar'] },
  { id: 's-regnar2', level: 1, sv: 'Åh nej, det regnar.', de: 'Oh nein, es regnet.', decoding: [{ sv: 'åh', de: 'oh' }, { sv: 'nej', de: 'nein' }, { sv: 'det', de: 'es' }, { sv: 'regnar', de: 'regnet' }], chunkIds: ['c-regnar'] },
  // c-hadetbra
  { id: 's-hadetbra1', level: 1, sv: 'Ha det bra!', de: 'Alles Gute!', decoding: [{ sv: 'ha', de: 'hab' }, { sv: 'det', de: 'es' }, { sv: 'bra', de: 'gut' }], chunkIds: ['c-hadetbra'] },
  { id: 's-hadetbra2', level: 1, sv: 'Tack, ha det bra!', de: 'Danke, alles Gute!', decoding: [{ sv: 'tack', de: 'danke' }, { sv: 'ha', de: 'hab' }, { sv: 'det', de: 'es' }, { sv: 'bra', de: 'gut' }], chunkIds: ['c-hadetbra'] },
  // c-trevligt
  { id: 's-trevligt1', level: 1, sv: 'Trevligt att träffas!', de: 'Schön, dich kennenzulernen!', decoding: [{ sv: 'trevligt', de: 'nett' }, { sv: 'att', de: 'zu' }, { sv: 'träffas', de: 'treffen' }], chunkIds: ['c-trevligt'] },
  { id: 's-trevligt2', level: 1, sv: 'Hej, trevligt att träffas!', de: 'Hallo, schön dich kennenzulernen!', decoding: [{ sv: 'hej', de: 'hallo' }, { sv: 'trevligt', de: 'nett' }, { sv: 'att', de: 'zu' }, { sv: 'träffas', de: 'treffen' }], chunkIds: ['c-trevligt'] },
];
