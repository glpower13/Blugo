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
// Stand 2026-07-25: 8 Bereiche · 30 Themen · 179 Wendungen · 15 Gespräche.
// Zuletzt ergänzt: Wetter & Jahreszeiten, Wohnen & Zuhause, Arbeit & Beruf,
// Telefon & Nachrichten, Winter & Schnee. Weiterer Ausbau über die
// KI-Content-Fabrik (der Moat).
//
// Der maschinelle Prüf-Stand JE WENDUNG steht in `verification.generated.ts`
// (Stufe 4 der Prüfkette). Nach jeder Inhaltsänderung neu erzeugen:
//   npm run check:content && npm run verify:build

import type { Area, Category, Chunk, Segment } from '../../domain/chunk';

// Erste Ebene des Baums: Lebens-BEREICHE (docs/gremium-struktur.md). Der Lerner
// browst flach: Bereich → Thema → Wendung, statt eine Endlosliste zu scrollen.
export const seedAreas: Area[] = [
  {
    id: 'area-basics',
    title: 'Erste Schritte',
    blurb: 'Die ersten Wörter: grüßen, sich verständigen, kurz telefonieren.',
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
    blurb: 'Kennenlernen, Small Talk, Wetter, Wohnen, Arbeit.',
    order: 4,
  },
  {
    id: 'area-shopping',
    title: 'Einkaufen',
    blurb: 'Im Laden, Größen & Preise, an der Kasse zahlen.',
    order: 5,
  },
  {
    id: 'area-emergency',
    title: 'Notfall & Gesundheit',
    blurb: 'Wenn es wichtig wird: Arzt, Apotheke, Hilfe rufen.',
    order: 6,
  },
  {
    id: 'area-friends',
    title: 'Freunde & Freizeit',
    blurb: 'Abmachen, schrauben, zocken — Schwedisch, wie es heute geredet wird.',
    order: 7,
  },
  {
    id: 'area-outdoors',
    title: 'Sport & Draußen',
    blurb: 'Angeln, Fußball, Trainieren, Natur — und der Winter.',
    order: 8,
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

  // ── Erweiterung 2026-07-23 · neue Themen (nicht muttersprachlich geprüft) ──
  {
    id: 'cat-politeness',
    areaId: 'area-basics',
    title: 'Höflich & Basics',
    blurb: 'Ja, nein, danke, bitte, Entschuldigung.',
    order: 3,
  },
  {
    id: 'cat-transport',
    areaId: 'area-travel',
    title: 'Bus, Bahn & Taxi',
    blurb: 'Tickets, Abfahrt, Gleis, Haltestelle.',
    order: 2,
  },
  {
    id: 'cat-hotel',
    areaId: 'area-travel',
    title: 'Im Hotel',
    blurb: 'Zimmer, Preis, Frühstück, Schlüssel.',
    order: 3,
  },
  {
    id: 'cat-restaurant',
    areaId: 'area-food',
    title: 'Im Restaurant',
    blurb: 'Tisch, Karte, bestellen, satt & zahlen.',
    order: 3,
  },
  {
    id: 'cat-shop',
    areaId: 'area-shopping',
    title: 'Im Geschäft',
    blurb: 'Schauen, Größe, anprobieren, nehmen.',
    order: 1,
  },
  {
    id: 'cat-pay',
    areaId: 'area-shopping',
    title: 'Bezahlen',
    blurb: 'Karte oder bar, Beleg, zu teuer.',
    order: 2,
  },
  {
    id: 'cat-groceries',
    areaId: 'area-shopping',
    title: 'Im Supermarkt',
    blurb: 'Finden, fragen, Kilo & Tüte, Kasse.',
    order: 3,
  },
  {
    id: 'cat-health',
    areaId: 'area-emergency',
    title: 'Beim Arzt & Apotheke',
    blurb: 'Krank, Schmerzen, Arzt, Apotheke.',
    order: 1,
  },
  {
    id: 'cat-help-emergency',
    areaId: 'area-emergency',
    title: 'Notfall & Hilfe',
    blurb: 'Hilfe, Polizei, Krankenwagen, verlaufen.',
    order: 2,
  },
  {
    id: 'cat-hangout',
    areaId: 'area-friends',
    title: 'Abmachen & Treffen',
    blurb: 'Sich verabreden, absagen, „wir hören uns".',
    order: 1,
  },
  {
    id: 'cat-workshop',
    areaId: 'area-friends',
    title: 'In der Werkstatt',
    blurb: 'Schrauben, helfen, herausfinden was klappert.',
    order: 2,
  },
  {
    id: 'cat-motor',
    areaId: 'area-friends',
    title: 'Autos & Motorsport',
    blurb: 'Rennen schauen, mitfiebern, über Autos reden.',
    order: 3,
  },
  {
    id: 'cat-gaming',
    areaId: 'area-friends',
    title: 'Zocken & online',
    blurb: 'Zusammen spielen, im Sprachchat reden, kurz weg sein.',
    order: 4,
  },
  {
    id: 'cat-fishing',
    areaId: 'area-outdoors',
    title: 'Angeln',
    blurb: 'Am See: beißt was, was für ein Fisch, Petri Heil.',
    order: 1,
  },
  {
    id: 'cat-football',
    areaId: 'area-outdoors',
    title: 'Fußball & Zuschauen',
    blurb: 'Spielstand, Tore, mitfiebern, wer spielt.',
    order: 2,
  },
  {
    id: 'cat-training',
    areaId: 'area-outdoors',
    title: 'Trainieren',
    blurb: 'Laufen, Gym, verabreden zum Sport.',
    order: 3,
  },
  {
    id: 'cat-nature',
    areaId: 'area-outdoors',
    title: 'Raus in die Natur',
    blurb: 'Wandern, Wald, Wetter, Übernachten draußen.',
    order: 4,
  },
  {
    id: 'cat-weather',
    areaId: 'area-people',
    title: 'Wetter & Jahreszeiten',
    blurb: 'Der Klassiker im Small Talk: Sonne, Wind, Regen.',
    order: 4,
  },
  {
    id: 'cat-home',
    areaId: 'area-people',
    title: 'Wohnen & Zuhause',
    blurb: 'Wohnung, Zimmer, Miete — und jemanden hereinbitten.',
    order: 5,
  },
  {
    id: 'cat-work',
    areaId: 'area-people',
    title: 'Arbeit & Beruf',
    blurb: 'Was machst du beruflich, Termine, kurze Absprachen.',
    order: 6,
  },
  {
    id: 'cat-phone',
    areaId: 'area-basics',
    title: 'Telefon & Nachrichten',
    blurb: 'Anrufen, zurückrufen, kurz schreiben.',
    order: 4,
  },
  {
    id: 'cat-winter',
    areaId: 'area-outdoors',
    title: 'Winter & Schnee',
    blurb: 'Schnee, Glätte, früh dunkel — der schwedische Winter.',
    order: 5,
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
  { id: 'c-klockantre', categoryId: 'cat-numbers', sv: 'klockan är tre', de: 'es ist drei Uhr', decoding: [{ sv: 'klockan', de: 'die Uhr' }, { sv: 'är', de: 'ist' }, { sv: 'tre', de: 'drei' }] },
  { id: 'c-tiominuter', categoryId: 'cat-numbers', sv: 'det tar tio minuter', de: 'das dauert zehn Minuten', decoding: [{ sv: 'det', de: 'es' }, { sv: 'tar', de: 'nimmt' }, { sv: 'tio', de: 'zehn' }, { sv: 'minuter', de: 'Minuten' }] },
  { id: 'c-vaddatum', categoryId: 'cat-numbers', sv: 'vilket datum är det?', de: 'welches Datum ist es?', decoding: [{ sv: 'vilket', de: 'welches' }, { sv: 'datum', de: 'Datum' }, { sv: 'är', de: 'ist' }, { sv: 'det', de: 'es' }] },

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

  // ── Erweiterung 2026-07-23 · neue Wendungen (nicht muttersprachlich geprüft) ──

  // Höflich & Basics (cat-politeness)
  { id: 'c-jatack', categoryId: 'cat-politeness', sv: 'ja, tack', de: 'ja, bitte', decoding: [{ sv: 'ja', de: 'ja' }, { sv: 'tack', de: 'bitte' }] },
  { id: 'c-nejtack', categoryId: 'cat-politeness', sv: 'nej, tack', de: 'nein, danke', decoding: [{ sv: 'nej', de: 'nein' }, { sv: 'tack', de: 'danke' }] },
  { id: 'c-varsagod', categoryId: 'cat-politeness', sv: 'varsågod', de: 'bitte (hier)', decoding: [{ sv: 'varsågod', de: 'bitte' }] },
  { id: 'c-ingenfara', categoryId: 'cat-politeness', sv: 'ingen fara', de: 'kein Problem', decoding: [{ sv: 'ingen', de: 'keine' }, { sv: 'fara', de: 'Gefahr' }] },
  { id: 'c-forlat', categoryId: 'cat-politeness', sv: 'förlåt', de: 'Entschuldigung', decoding: [{ sv: 'förlåt', de: 'verzeih' }] },
  { id: 'c-ursaktamig', categoryId: 'cat-politeness', sv: 'ursäkta mig', de: 'Entschuldigung', decoding: [{ sv: 'ursäkta', de: 'entschuldige' }, { sv: 'mig', de: 'mich' }] },

  // Bus, Bahn & Taxi (cat-transport)
  { id: 'c-biljett', categoryId: 'cat-transport', sv: 'en biljett, tack', de: 'ein Ticket, bitte', decoding: [{ sv: 'en', de: 'ein' }, { sv: 'biljett', de: 'Ticket' }, { sv: 'tack', de: 'bitte' }] },
  { id: 'c-nartag', categoryId: 'cat-transport', sv: 'när går tåget?', de: 'wann fährt der Zug?', decoding: [{ sv: 'när', de: 'wann' }, { sv: 'går', de: 'fährt' }, { sv: 'tåget', de: 'der Zug' }] },
  { id: 'c-narbuss', categoryId: 'cat-transport', sv: 'när går bussen?', de: 'wann fährt der Bus?', decoding: [{ sv: 'när', de: 'wann' }, { sv: 'går', de: 'fährt' }, { sv: 'bussen', de: 'der Bus' }] },
  { id: 'c-spar', categoryId: 'cat-transport', sv: 'vilket spår?', de: 'welches Gleis?', decoding: [{ sv: 'vilket', de: 'welches' }, { sv: 'spår', de: 'Gleis' }] },
  { id: 'c-flygplatsen', categoryId: 'cat-transport', sv: 'till flygplatsen, tack', de: 'zum Flughafen, bitte', decoding: [{ sv: 'till', de: 'zu' }, { sv: 'flygplatsen', de: 'dem Flughafen' }, { sv: 'tack', de: 'bitte' }] },
  { id: 'c-hallplats', categoryId: 'cat-transport', sv: 'var är hållplatsen?', de: 'wo ist die Haltestelle?', decoding: [{ sv: 'var', de: 'wo' }, { sv: 'är', de: 'ist' }, { sv: 'hållplatsen', de: 'die Haltestelle' }] },

  // Im Hotel (cat-hotel)
  { id: 'c-bokatrum', categoryId: 'cat-hotel', sv: 'jag har bokat ett rum', de: 'ich habe ein Zimmer gebucht', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'har', de: 'habe' }, { sv: 'bokat', de: 'gebucht' }, { sv: 'ett', de: 'ein' }, { sv: 'rum', de: 'Zimmer' }] },
  { id: 'c-ledigtrum', categoryId: 'cat-hotel', sv: 'har ni ett ledigt rum?', de: 'haben Sie ein freies Zimmer?', decoding: [{ sv: 'har', de: 'haben' }, { sv: 'ni', de: 'ihr' }, { sv: 'ett', de: 'ein' }, { sv: 'ledigt', de: 'freies' }, { sv: 'rum', de: 'Zimmer' }] },
  { id: 'c-vadnatt', categoryId: 'cat-hotel', sv: 'vad kostar en natt?', de: 'was kostet eine Nacht?', decoding: [{ sv: 'vad', de: 'was' }, { sv: 'kostar', de: 'kostet' }, { sv: 'en', de: 'eine' }, { sv: 'natt', de: 'Nacht' }] },
  { id: 'c-narfrukost', categoryId: 'cat-hotel', sv: 'när är frukost?', de: 'wann gibt es Frühstück?', decoding: [{ sv: 'när', de: 'wann' }, { sv: 'är', de: 'ist' }, { sv: 'frukost', de: 'Frühstück' }] },
  { id: 'c-nyckeln', categoryId: 'cat-hotel', sv: 'kan jag få nyckeln?', de: 'kann ich den Schlüssel haben?', decoding: [{ sv: 'kan', de: 'kann' }, { sv: 'jag', de: 'ich' }, { sv: 'få', de: 'bekommen' }, { sv: 'nyckeln', de: 'der Schlüssel' }] },
  { id: 'c-varrummet', categoryId: 'cat-hotel', sv: 'var är rummet?', de: 'wo ist das Zimmer?', decoding: [{ sv: 'var', de: 'wo' }, { sv: 'är', de: 'ist' }, { sv: 'rummet', de: 'das Zimmer' }] },

  // Im Restaurant (cat-restaurant)
  { id: 'c-bordtva', categoryId: 'cat-restaurant', sv: 'ett bord för två', de: 'ein Tisch für zwei', decoding: [{ sv: 'ett', de: 'ein' }, { sv: 'bord', de: 'Tisch' }, { sv: 'för', de: 'für' }, { sv: 'två', de: 'zwei' }] },
  { id: 'c-menyn', categoryId: 'cat-restaurant', sv: 'kan jag få menyn?', de: 'kann ich die Karte haben?', decoding: [{ sv: 'kan', de: 'kann' }, { sv: 'jag', de: 'ich' }, { sv: 'få', de: 'bekommen' }, { sv: 'menyn', de: 'die Speisekarte' }] },
  { id: 'c-tardenhar', categoryId: 'cat-restaurant', sv: 'jag tar den här', de: 'ich nehme das hier', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'tar', de: 'nehme' }, { sv: 'den', de: 'das' }, { sv: 'här', de: 'hier' }] },
  { id: 'c-rekommenderar', categoryId: 'cat-restaurant', sv: 'vad rekommenderar du?', de: 'was empfiehlst du?', decoding: [{ sv: 'vad', de: 'was' }, { sv: 'rekommenderar', de: 'empfiehlst' }, { sv: 'du', de: 'du' }] },
  { id: 'c-vargott', categoryId: 'cat-restaurant', sv: 'det var gott', de: 'das war lecker', decoding: [{ sv: 'det', de: 'das' }, { sv: 'var', de: 'war' }, { sv: 'gott', de: 'lecker' }] },
  { id: 'c-matt', categoryId: 'cat-restaurant', sv: 'jag är mätt', de: 'ich bin satt', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'är', de: 'bin' }, { sv: 'mätt', de: 'satt' }] },

  // Im Geschäft (cat-shop)
  { id: 'c-tittarbara', categoryId: 'cat-shop', sv: 'jag tittar bara', de: 'ich schaue nur', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'tittar', de: 'schaue' }, { sv: 'bara', de: 'nur' }] },
  { id: 'c-iblatt', categoryId: 'cat-shop', sv: 'har ni den i blått?', de: 'haben Sie das in Blau?', decoding: [{ sv: 'har', de: 'haben' }, { sv: 'ni', de: 'ihr' }, { sv: 'den', de: 'das' }, { sv: 'i', de: 'in' }, { sv: 'blått', de: 'Blau' }] },
  { id: 'c-storlek', categoryId: 'cat-shop', sv: 'vilken storlek?', de: 'welche Größe?', decoding: [{ sv: 'vilken', de: 'welche' }, { sv: 'storlek', de: 'Größe' }] },
  { id: 'c-prova', categoryId: 'cat-shop', sv: 'kan jag prova?', de: 'kann ich anprobieren?', decoding: [{ sv: 'kan', de: 'kann' }, { sv: 'jag', de: 'ich' }, { sv: 'prova', de: 'probieren' }] },
  { id: 'c-provrum', categoryId: 'cat-shop', sv: 'var är provrummet?', de: 'wo ist die Umkleide?', decoding: [{ sv: 'var', de: 'wo' }, { sv: 'är', de: 'ist' }, { sv: 'provrummet', de: 'die Umkleidekabine' }] },
  { id: 'c-tarden', categoryId: 'cat-shop', sv: 'jag tar den', de: 'ich nehme es', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'tar', de: 'nehme' }, { sv: 'den', de: 'das' }] },

  // Bezahlen (cat-pay)
  { id: 'c-medkort', categoryId: 'cat-pay', sv: 'kan jag betala med kort?', de: 'kann ich mit Karte zahlen?', decoding: [{ sv: 'kan', de: 'kann' }, { sv: 'jag', de: 'ich' }, { sv: 'betala', de: 'zahlen' }, { sv: 'med', de: 'mit' }, { sv: 'kort', de: 'Karte' }] },
  { id: 'c-kontant', categoryId: 'cat-pay', sv: 'jag betalar kontant', de: 'ich zahle bar', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'betalar', de: 'zahle' }, { sv: 'kontant', de: 'bar' }] },
  { id: 'c-blirdet', categoryId: 'cat-pay', sv: 'hur mycket blir det?', de: 'wie viel macht das?', decoding: [{ sv: 'hur', de: 'wie' }, { sv: 'mycket', de: 'viel' }, { sv: 'blir', de: 'wird' }, { sv: 'det', de: 'es' }] },
  { id: 'c-kvitto', categoryId: 'cat-pay', sv: 'kan jag få kvittot?', de: 'kann ich den Beleg haben?', decoding: [{ sv: 'kan', de: 'kann' }, { sv: 'jag', de: 'ich' }, { sv: 'få', de: 'bekommen' }, { sv: 'kvittot', de: 'der Beleg' }] },
  { id: 'c-fordyrt', categoryId: 'cat-pay', sv: 'det är för dyrt', de: 'das ist zu teuer', decoding: [{ sv: 'det', de: 'das' }, { sv: 'är', de: 'ist' }, { sv: 'för', de: 'zu' }, { sv: 'dyrt', de: 'teuer' }] },

  // Im Supermarkt (cat-groceries)
  { id: 'c-finnsmjolk', categoryId: 'cat-groceries', sv: 'var finns mjölk?', de: 'wo gibt es Milch?', decoding: [{ sv: 'var', de: 'wo' }, { sv: 'finns', de: 'gibt es' }, { sv: 'mjölk', de: 'Milch' }] },
  { id: 'c-harbrod', categoryId: 'cat-groceries', sv: 'har ni bröd?', de: 'haben Sie Brot?', decoding: [{ sv: 'har', de: 'haben' }, { sv: 'ni', de: 'ihr' }, { sv: 'bröd', de: 'Brot' }] },
  { id: 'c-kiloapplen', categoryId: 'cat-groceries', sv: 'ett kilo äpplen, tack', de: 'ein Kilo Äpfel, bitte', decoding: [{ sv: 'ett', de: 'ein' }, { sv: 'kilo', de: 'Kilo' }, { sv: 'äpplen', de: 'Äpfel' }, { sv: 'tack', de: 'bitte' }] },
  { id: 'c-pase', categoryId: 'cat-groceries', sv: 'en påse, tack', de: 'eine Tüte, bitte', decoding: [{ sv: 'en', de: 'eine' }, { sv: 'påse', de: 'Tüte' }, { sv: 'tack', de: 'bitte' }] },
  { id: 'c-kassan', categoryId: 'cat-groceries', sv: 'var är kassan?', de: 'wo ist die Kasse?', decoding: [{ sv: 'var', de: 'wo' }, { sv: 'är', de: 'ist' }, { sv: 'kassan', de: 'die Kasse' }] },

  // Beim Arzt & Apotheke (cat-health)
  { id: 'c-sjuk', categoryId: 'cat-health', sv: 'jag är sjuk', de: 'ich bin krank', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'är', de: 'bin' }, { sv: 'sjuk', de: 'krank' }] },
  { id: 'c-onthär', categoryId: 'cat-health', sv: 'jag har ont här', de: 'mir tut es hier weh', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'har', de: 'habe' }, { sv: 'ont', de: 'Schmerz' }, { sv: 'här', de: 'hier' }] },
  { id: 'c-lakare', categoryId: 'cat-health', sv: 'jag behöver en läkare', de: 'ich brauche einen Arzt', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'behöver', de: 'brauche' }, { sv: 'en', de: 'einen' }, { sv: 'läkare', de: 'Arzt' }] },
  { id: 'c-apoteket', categoryId: 'cat-health', sv: 'var är apoteket?', de: 'wo ist die Apotheke?', decoding: [{ sv: 'var', de: 'wo' }, { sv: 'är', de: 'ist' }, { sv: 'apoteket', de: 'die Apotheke' }] },
  { id: 'c-huvudvark', categoryId: 'cat-health', sv: 'jag har huvudvärk', de: 'ich habe Kopfschmerzen', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'har', de: 'habe' }, { sv: 'huvudvärk', de: 'Kopfschmerzen' }] },
  { id: 'c-allergisk', categoryId: 'cat-health', sv: 'jag är allergisk', de: 'ich bin allergisch', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'är', de: 'bin' }, { sv: 'allergisk', de: 'allergisch' }] },

  // Notfall & Hilfe (cat-help-emergency)
  { id: 'c-hjalp', categoryId: 'cat-help-emergency', sv: 'hjälp!', de: 'Hilfe!', decoding: [{ sv: 'hjälp', de: 'Hilfe' }] },
  { id: 'c-ringpolis', categoryId: 'cat-help-emergency', sv: 'ring polisen!', de: 'ruf die Polizei!', decoding: [{ sv: 'ring', de: 'ruf an' }, { sv: 'polisen', de: 'die Polizei' }] },
  { id: 'c-ambulans', categoryId: 'cat-help-emergency', sv: 'ring en ambulans!', de: 'ruf einen Krankenwagen!', decoding: [{ sv: 'ring', de: 'ruf an' }, { sv: 'en', de: 'einen' }, { sv: 'ambulans', de: 'Krankenwagen' }] },
  { id: 'c-nodsituation', categoryId: 'cat-help-emergency', sv: 'det är en nödsituation', de: 'das ist ein Notfall', decoding: [{ sv: 'det', de: 'das' }, { sv: 'är', de: 'ist' }, { sv: 'en', de: 'ein' }, { sv: 'nödsituation', de: 'Notfall' }] },
  { id: 'c-vilse', categoryId: 'cat-help-emergency', sv: 'jag har gått vilse', de: 'ich habe mich verlaufen', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'har', de: 'habe' }, { sv: 'gått', de: 'gegangen' }, { sv: 'vilse', de: 'verirrt' }] },
  { id: 'c-tappatvaska', categoryId: 'cat-help-emergency', sv: 'jag hittar inte min väska', de: 'ich finde meine Tasche nicht', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'hittar', de: 'finde' }, { sv: 'inte', de: 'nicht' }, { sv: 'min', de: 'meine' }, { sv: 'väska', de: 'Tasche' }] },
  { id: 'c-sesses', categoryId: 'cat-hangout', sv: 'ska vi ses?', de: 'wollen wir uns treffen?', decoding: [{ sv: 'ska', de: 'sollen' }, { sv: 'vi', de: 'wir' }, { sv: 'ses', de: 'uns sehen' }] },
  { id: 'c-vihors', categoryId: 'cat-hangout', sv: 'vi hörs', de: 'wir hören uns', decoding: [{ sv: 'vi', de: 'wir' }, { sv: 'hörs', de: 'hören uns' }] },
  { id: 'c-pavag', categoryId: 'cat-hangout', sv: 'jag är på väg', de: 'ich bin unterwegs', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'är', de: 'bin' }, { sv: 'på', de: 'auf' }, { sv: 'väg', de: 'Weg' }] },
  { id: 'c-lateskul', categoryId: 'cat-hangout', sv: 'det låter kul', de: 'das klingt nach Spaß', decoding: [{ sv: 'det', de: 'das' }, { sv: 'låter', de: 'klingt' }, { sv: 'kul', de: 'Spaß' }] },
  { id: 'c-vadgordu', categoryId: 'cat-hangout', sv: 'vad gör du i helgen?', de: 'was machst du am Wochenende?', decoding: [{ sv: 'vad', de: 'was' }, { sv: 'gör', de: 'machst' }, { sv: 'du', de: 'du' }, { sv: 'i', de: 'in' }, { sv: 'helgen', de: 'dem Wochenende' }] },
  { id: 'c-ringerdig', categoryId: 'cat-hangout', sv: 'jag ringer dig sen', de: 'ich rufe dich später an', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'ringer', de: 'rufe an' }, { sv: 'dig', de: 'dich' }, { sv: 'sen', de: 'später' }] },
  { id: 'c-kanintekomma', categoryId: 'cat-hangout', sv: 'jag kan inte komma', de: 'ich kann nicht kommen', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'kan', de: 'kann' }, { sv: 'inte', de: 'nicht' }, { sv: 'komma', de: 'kommen' }] },
  { id: 'c-hallerpa', categoryId: 'cat-workshop', sv: 'vad håller du på med?', de: 'was machst du gerade?', decoding: [{ sv: 'vad', de: 'was' }, { sv: 'håller', de: 'hältst' }, { sv: 'du', de: 'du' }, { sv: 'på', de: 'an' }, { sv: 'med', de: 'mit' }] },
  { id: 'c-startarinte', categoryId: 'cat-workshop', sv: 'bilen startar inte', de: 'das Auto springt nicht an', decoding: [{ sv: 'bilen', de: 'das Auto' }, { sv: 'startar', de: 'startet' }, { sv: 'inte', de: 'nicht' }] },
  { id: 'c-hallden', categoryId: 'cat-workshop', sv: 'kan du hålla den här?', de: 'kannst du das hier halten?', decoding: [{ sv: 'kan', de: 'kannst' }, { sv: 'du', de: 'du' }, { sv: 'hålla', de: 'halten' }, { sv: 'den', de: 'das' }, { sv: 'här', de: 'hier' }] },
  { id: 'c-latarkonstigt', categoryId: 'cat-workshop', sv: 'det låter konstigt', de: 'das hört sich komisch an', decoding: [{ sv: 'det', de: 'das' }, { sv: 'låter', de: 'klingt' }, { sv: 'konstigt', de: 'komisch' }] },
  { id: 'c-motorn', categoryId: 'cat-workshop', sv: 'det är motorn', de: 'es ist der Motor', decoding: [{ sv: 'det', de: 'es' }, { sv: 'är', de: 'ist' }, { sv: 'motorn', de: 'der Motor' }] },
  { id: 'c-punkterat', categoryId: 'cat-workshop', sv: 'däcket är punkterat', de: 'der Reifen ist platt', decoding: [{ sv: 'däcket', de: 'der Reifen' }, { sv: 'är', de: 'ist' }, { sv: 'punkterat', de: 'durchstochen' }] },
  { id: 'c-fixardet', categoryId: 'cat-workshop', sv: 'jag fixar det', de: 'ich mache das', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'fixar', de: 'richte' }, { sv: 'det', de: 'das' }] },
  { id: 'c-verktyg', categoryId: 'cat-workshop', sv: 'har du ett verktyg?', de: 'hast du ein Werkzeug?', decoding: [{ sv: 'har', de: 'hast' }, { sv: 'du', de: 'du' }, { sv: 'ett', de: 'ein' }, { sv: 'verktyg', de: 'Werkzeug' }] },
  { id: 'c-vilkenbil', categoryId: 'cat-motor', sv: 'vilken bil!', de: 'was für ein Auto!', decoding: [{ sv: 'vilken', de: 'welch ein' }, { sv: 'bil', de: 'Auto' }] },
  { id: 'c-hurfort', categoryId: 'cat-motor', sv: 'hur fort går den?', de: 'wie schnell fährt es?', decoding: [{ sv: 'hur', de: 'wie' }, { sv: 'fort', de: 'schnell' }, { sv: 'går', de: 'geht' }, { sv: 'den', de: 'es' }] },
  { id: 'c-vemvann', categoryId: 'cat-motor', sv: 'vem vann?', de: 'wer hat gewonnen?', decoding: [{ sv: 'vem', de: 'wer' }, { sv: 'vann', de: 'gewann' }] },
  { id: 'c-loppet', categoryId: 'cat-motor', sv: 'loppet börjar snart', de: 'das Rennen fängt gleich an', decoding: [{ sv: 'loppet', de: 'das Rennen' }, { sv: 'börjar', de: 'beginnt' }, { sv: 'snart', de: 'bald' }] },
  { id: 'c-korderbra', categoryId: 'cat-motor', sv: 'han körde bra', de: 'er ist gut gefahren', decoding: [{ sv: 'han', de: 'er' }, { sv: 'körde', de: 'fuhr' }, { sv: 'bra', de: 'gut' }] },
  { id: 'c-nytt-rekord', categoryId: 'cat-motor', sv: 'det var nytt rekord', de: 'das war ein neuer Rekord', decoding: [{ sv: 'det', de: 'das' }, { sv: 'var', de: 'war' }, { sv: 'nytt', de: 'neuer' }, { sv: 'rekord', de: 'Rekord' }] },
  { id: 'c-horduemig', categoryId: 'cat-gaming', sv: 'hör du mig?', de: 'hörst du mich?', decoding: [{ sv: 'hör', de: 'hörst' }, { sv: 'du', de: 'du' }, { sv: 'mig', de: 'mich' }] },
  { id: 'c-strax', categoryId: 'cat-gaming', sv: 'jag är strax tillbaka', de: 'ich bin gleich zurück', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'är', de: 'bin' }, { sv: 'strax', de: 'gleich' }, { sv: 'tillbaka', de: 'zurück' }] },
  { id: 'c-enrundatill', categoryId: 'cat-gaming', sv: 'en runda till?', de: 'noch eine Runde?', decoding: [{ sv: 'en', de: 'eine' }, { sv: 'runda', de: 'Runde' }, { sv: 'till', de: 'noch' }] },
  { id: 'c-braspelat', categoryId: 'cat-gaming', sv: 'bra spelat!', de: 'gut gespielt!', decoding: [{ sv: 'bra', de: 'gut' }, { sv: 'spelat', de: 'gespielt' }] },
  { id: 'c-jagarmed', categoryId: 'cat-gaming', sv: 'jag är med', de: 'ich bin dabei', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'är', de: 'bin' }, { sv: 'med', de: 'mit' }] },
  { id: 'c-vantalite', categoryId: 'cat-gaming', sv: 'vänta lite', de: 'warte kurz', decoding: [{ sv: 'vänta', de: 'warte' }, { sv: 'lite', de: 'wenig' }] },
  { id: 'c-skickalank', categoryId: 'cat-gaming', sv: 'kan du skicka en länk?', de: 'kannst du einen Link schicken?', decoding: [{ sv: 'kan', de: 'kannst' }, { sv: 'du', de: 'du' }, { sv: 'skicka', de: 'schicken' }, { sv: 'en', de: 'einen' }, { sv: 'länk', de: 'Link' }] },
  { id: 'c-vilketspel', categoryId: 'cat-gaming', sv: 'vilket spel spelar du?', de: 'welches Spiel spielst du?', decoding: [{ sv: 'vilket', de: 'welches' }, { sv: 'spel', de: 'Spiel' }, { sv: 'spelar', de: 'spielst' }, { sv: 'du', de: 'du' }] },
  { id: 'c-fiskar', categoryId: 'cat-fishing', sv: 'jag fiskar', de: 'ich angle', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'fiskar', de: 'angle' }] },
  { id: 'c-nappar', categoryId: 'cat-fishing', sv: 'nappar det?', de: 'beißt was?', decoding: [{ sv: 'nappar', de: 'beißt' }, { sv: 'det', de: 'es' }] },
  { id: 'c-vilkenfisk', categoryId: 'cat-fishing', sv: 'vilken fisk är det?', de: 'was für ein Fisch ist das?', decoding: [{ sv: 'vilken', de: 'welcher' }, { sv: 'fisk', de: 'Fisch' }, { sv: 'är', de: 'ist' }, { sv: 'det', de: 'das' }] },
  { id: 'c-storfisk', categoryId: 'cat-fishing', sv: 'vilken stor fisk!', de: 'was für ein großer Fisch!', decoding: [{ sv: 'vilken', de: 'welcher' }, { sv: 'stor', de: 'großer' }, { sv: 'fisk', de: 'Fisch' }] },
  { id: 'c-lugntvatten', categoryId: 'cat-fishing', sv: 'vattnet är lugnt idag', de: 'das Wasser ist heute ruhig', decoding: [{ sv: 'vattnet', de: 'das Wasser' }, { sv: 'är', de: 'ist' }, { sv: 'lugnt', de: 'ruhig' }, { sv: 'idag', de: 'heute' }] },
  { id: 'c-lyckatill', categoryId: 'cat-fishing', sv: 'lycka till!', de: 'viel Erfolg!', decoding: [{ sv: 'lycka till', de: 'viel Erfolg' }] },
  { id: 'c-vemspelar', categoryId: 'cat-football', sv: 'vem spelar idag?', de: 'wer spielt heute?', decoding: [{ sv: 'vem', de: 'wer' }, { sv: 'spelar', de: 'spielt' }, { sv: 'idag', de: 'heute' }] },
  { id: 'c-mal', categoryId: 'cat-football', sv: 'vilket mål!', de: 'was für ein Tor!', decoding: [{ sv: 'vilket', de: 'welches' }, { sv: 'mål', de: 'Tor' }] },
  { id: 'c-hurstardet', categoryId: 'cat-football', sv: 'hur står det?', de: 'wie steht es?', decoding: [{ sv: 'hur', de: 'wie' }, { sv: 'står', de: 'steht' }, { sv: 'det', de: 'es' }] },
  { id: 'c-vihalleross', categoryId: 'cat-football', sv: 'vi ligger under', de: 'wir liegen zurück', decoding: [{ sv: 'vi', de: 'wir' }, { sv: 'ligger', de: 'liegen' }, { sv: 'under', de: 'unter' }] },
  { id: 'c-matchen', categoryId: 'cat-football', sv: 'matchen börjar klockan sju', de: 'das Spiel beginnt um sieben', decoding: [{ sv: 'matchen', de: 'das Spiel' }, { sv: 'börjar', de: 'beginnt' }, { sv: 'klockan', de: 'die Uhr' }, { sv: 'sju', de: 'sieben' }] },
  { id: 'c-heja', categoryId: 'cat-football', sv: 'heja!', de: 'los!', decoding: [{ sv: 'heja', de: 'los' }] },
  { id: 'c-jagtranar', categoryId: 'cat-training', sv: 'jag tränar tre gånger i veckan', de: 'ich trainiere dreimal die Woche', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'tränar', de: 'trainiere' }, { sv: 'tre', de: 'drei' }, { sv: 'gånger', de: 'Mal' }, { sv: 'i', de: 'in' }, { sv: 'veckan', de: 'der Woche' }] },
  { id: 'c-skavispringa', categoryId: 'cat-training', sv: 'ska vi springa?', de: 'wollen wir laufen gehen?', decoding: [{ sv: 'ska', de: 'sollen' }, { sv: 'vi', de: 'wir' }, { sv: 'springa', de: 'laufen' }] },
  { id: 'c-jagartrott', categoryId: 'cat-training', sv: 'jag är trött', de: 'ich bin müde', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'är', de: 'bin' }, { sv: 'trött', de: 'müde' }] },
  { id: 'c-braformad', categoryId: 'cat-training', sv: 'du är i bra form', de: 'du bist gut in Form', decoding: [{ sv: 'du', de: 'du' }, { sv: 'är', de: 'bist' }, { sv: 'i', de: 'in' }, { sv: 'bra', de: 'guter' }, { sv: 'form', de: 'Form' }] },
  { id: 'c-engangtill', categoryId: 'cat-training', sv: 'en gång till!', de: 'noch einmal!', decoding: [{ sv: 'en', de: 'ein' }, { sv: 'gång', de: 'Mal' }, { sv: 'till', de: 'noch' }] },
  { id: 'c-vandra', categoryId: 'cat-nature', sv: 'ska vi vandra i skogen?', de: 'wollen wir im Wald wandern?', decoding: [{ sv: 'ska', de: 'sollen' }, { sv: 'vi', de: 'wir' }, { sv: 'vandra', de: 'wandern' }, { sv: 'i', de: 'in' }, { sv: 'skogen', de: 'dem Wald' }] },
  { id: 'c-vackerutsikt', categoryId: 'cat-nature', sv: 'vilken vacker utsikt!', de: 'was für eine schöne Aussicht!', decoding: [{ sv: 'vilken', de: 'welche' }, { sv: 'vacker', de: 'schöne' }, { sv: 'utsikt', de: 'Aussicht' }] },
  { id: 'c-solenskiner', categoryId: 'cat-nature', sv: 'solen skiner', de: 'die Sonne scheint', decoding: [{ sv: 'solen', de: 'die Sonne' }, { sv: 'skiner', de: 'scheint' }] },
  { id: 'c-sovaute', categoryId: 'cat-nature', sv: 'vi sover ute i natt', de: 'wir schlafen heute Nacht draußen', decoding: [{ sv: 'vi', de: 'wir' }, { sv: 'sover', de: 'schlafen' }, { sv: 'ute', de: 'draußen' }, { sv: 'i', de: 'in' }, { sv: 'natt', de: 'Nacht' }] },
  { id: 'c-kallt', categoryId: 'cat-nature', sv: 'det är kallt ute', de: 'es ist kalt draußen', decoding: [{ sv: 'det', de: 'es' }, { sv: 'är', de: 'ist' }, { sv: 'kallt', de: 'kalt' }, { sv: 'ute', de: 'draußen' }] },

  // ── Ausbau 2026-07-25: Wetter · Wohnen · Arbeit · Telefon · Winter ──────
  { id: 'c-vilketvader', categoryId: 'cat-weather', sv: 'vilket väder!', de: 'was für ein Wetter!', decoding: [{ sv: 'vilket', de: 'welches' }, { sv: 'väder', de: 'Wetter' }] },
  { id: 'c-blasermycket', categoryId: 'cat-weather', sv: 'det blåser mycket', de: 'es ist sehr windig', decoding: [{ sv: 'det', de: 'es' }, { sv: 'blåser', de: 'weht' }, { sv: 'mycket', de: 'viel' }] },
  { id: 'c-blirsoligt', categoryId: 'cat-weather', sv: 'imorgon blir det soligt', de: 'morgen wird es sonnig', decoding: [{ sv: 'imorgon', de: 'morgen' }, { sv: 'blir', de: 'wird' }, { sv: 'det', de: 'es' }, { sv: 'soligt', de: 'sonnig' }] },
  { id: 'c-tamedparaply', categoryId: 'cat-weather', sv: 'ta med paraply', de: 'nimm einen Schirm mit', decoding: [{ sv: 'ta', de: 'nimm' }, { sv: 'med', de: 'mit' }, { sv: 'paraply', de: 'Regenschirm' }] },
  { id: 'c-molnigt', categoryId: 'cat-weather', sv: 'det är molnigt idag', de: 'es ist heute bewölkt', decoding: [{ sv: 'det', de: 'es' }, { sv: 'är', de: 'ist' }, { sv: 'molnigt', de: 'wolkig' }, { sv: 'idag', de: 'heute' }] },
  { id: 'c-varmtinne', categoryId: 'cat-weather', sv: 'det är varmt inne', de: 'drinnen ist es warm', decoding: [{ sv: 'det', de: 'es' }, { sv: 'är', de: 'ist' }, { sv: 'varmt', de: 'warm' }, { sv: 'inne', de: 'drinnen' }] },
  { id: 'c-borilagenhet', categoryId: 'cat-home', sv: 'jag bor i en lägenhet', de: 'ich wohne in einer Wohnung', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'bor', de: 'wohne' }, { sv: 'i', de: 'in' }, { sv: 'en', de: 'einer' }, { sv: 'lägenhet', de: 'Wohnung' }] },
  { id: 'c-hurmangarum', categoryId: 'cat-home', sv: 'hur många rum har du?', de: 'wie viele Zimmer hast du?', decoding: [{ sv: 'hur', de: 'wie' }, { sv: 'många', de: 'viele' }, { sv: 'rum', de: 'Zimmer' }, { sv: 'har', de: 'hast' }, { sv: 'du', de: 'du' }] },
  { id: 'c-koketlitet', categoryId: 'cat-home', sv: 'köket är litet', de: 'die Küche ist klein', decoding: [{ sv: 'köket', de: 'die Küche' }, { sv: 'är', de: 'ist' }, { sv: 'litet', de: 'klein' }] },
  { id: 'c-bormedkompis', categoryId: 'cat-home', sv: 'jag bor med en kompis', de: 'ich wohne mit einem Kumpel', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'bor', de: 'wohne' }, { sv: 'med', de: 'mit' }, { sv: 'en', de: 'einem' }, { sv: 'kompis', de: 'Kumpel' }] },
  { id: 'c-hyranhog', categoryId: 'cat-home', sv: 'hyran är hög', de: 'die Miete ist hoch', decoding: [{ sv: 'hyran', de: 'die Miete' }, { sv: 'är', de: 'ist' }, { sv: 'hög', de: 'hoch' }] },
  { id: 'c-valkommenin', categoryId: 'cat-home', sv: 'välkommen in', de: 'komm herein', decoding: [{ sv: 'välkommen', de: 'willkommen' }, { sv: 'in', de: 'herein' }] },
  { id: 'c-vadjobbardu', categoryId: 'cat-work', sv: 'jag har mycket att göra', de: 'ich habe viel zu tun', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'har', de: 'habe' }, { sv: 'mycket', de: 'viel' }, { sv: 'att', de: 'zu' }, { sv: 'göra', de: 'tun' }] },
  { id: 'c-jobbarpakontor', categoryId: 'cat-work', sv: 'jag jobbar på ett kontor', de: 'ich arbeite in einem Büro', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'jobbar', de: 'arbeite' }, { sv: 'på', de: 'auf' }, { sv: 'ett', de: 'einem' }, { sv: 'kontor', de: 'Büro' }] },
  { id: 'c-ledigidag', categoryId: 'cat-work', sv: 'jag är ledig idag', de: 'ich habe heute frei', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'är', de: 'bin' }, { sv: 'ledig', de: 'frei' }, { sv: 'idag', de: 'heute' }] },
  { id: 'c-motetborjar', categoryId: 'cat-work', sv: 'mötet börjar klockan nio', de: 'das Treffen beginnt um neun', decoding: [{ sv: 'mötet', de: 'das Treffen' }, { sv: 'börjar', de: 'beginnt' }, { sv: 'klockan', de: 'die Uhr' }, { sv: 'nio', de: 'neun' }] },
  { id: 'c-bokaettmote', categoryId: 'cat-work', sv: 'kan vi boka ett möte?', de: 'können wir einen Termin machen?', decoding: [{ sv: 'kan', de: 'können' }, { sv: 'vi', de: 'wir' }, { sv: 'boka', de: 'buchen' }, { sv: 'ett', de: 'ein' }, { sv: 'möte', de: 'Treffen' }] },
  { id: 'c-skickarmejl', categoryId: 'cat-work', sv: 'jag skickar ett mejl', de: 'ich schicke eine Mail', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'skickar', de: 'schicke' }, { sv: 'ett', de: 'eine' }, { sv: 'mejl', de: 'Mail' }] },
  { id: 'c-ringersenare', categoryId: 'cat-phone', sv: 'jag ringer dig senare', de: 'ich rufe dich später an', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'ringer', de: 'rufe an' }, { sv: 'dig', de: 'dich' }, { sv: 'senare', de: 'später' }] },
  { id: 'c-skickarmeddelande', categoryId: 'cat-phone', sv: 'jag skickar ett meddelande', de: 'ich schicke eine Nachricht', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'skickar', de: 'schicke' }, { sv: 'ett', de: 'eine' }, { sv: 'meddelande', de: 'Nachricht' }] },
  { id: 'c-hordumig', categoryId: 'cat-phone', sv: 'jag hör dig dåligt', de: 'ich höre dich schlecht', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'hör', de: 'höre' }, { sv: 'dig', de: 'dich' }, { sv: 'dåligt', de: 'schlecht' }] },
  { id: 'c-daligtackning', categoryId: 'cat-phone', sv: 'jag har dålig täckning', de: 'ich habe schlechten Empfang', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'har', de: 'habe' }, { sv: 'dålig', de: 'schlechte' }, { sv: 'täckning', de: 'Abdeckung' }] },
  { id: 'c-vemardet', categoryId: 'cat-phone', sv: 'vem är det?', de: 'wer ist da?', decoding: [{ sv: 'vem', de: 'wer' }, { sv: 'är', de: 'ist' }, { sv: 'det', de: 'das' }] },
  { id: 'c-maste-lagga-pa', categoryId: 'cat-phone', sv: 'jag måste lägga på', de: 'ich muss auflegen', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'måste', de: 'muss' }, { sv: 'lägga', de: 'legen' }, { sv: 'på', de: 'auf' }] },
  { id: 'c-detsnoar', categoryId: 'cat-winter', sv: 'det snöar', de: 'es schneit', decoding: [{ sv: 'det', de: 'es' }, { sv: 'snöar', de: 'schneit' }] },
  { id: 'c-haltpavagen', categoryId: 'cat-winter', sv: 'det är halt på vägen', de: 'es ist glatt auf der Straße', decoding: [{ sv: 'det', de: 'es' }, { sv: 'är', de: 'ist' }, { sv: 'halt', de: 'glatt' }, { sv: 'på', de: 'auf' }, { sv: 'vägen', de: 'dem Weg' }] },
  { id: 'c-jagfryser', categoryId: 'cat-winter', sv: 'jag fryser', de: 'mir ist kalt', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'fryser', de: 'friere' }] },
  { id: 'c-tapadigmossa', categoryId: 'cat-winter', sv: 'ta på dig mössa', de: 'setz eine Mütze auf', decoding: [{ sv: 'ta', de: 'nimm' }, { sv: 'på', de: 'auf' }, { sv: 'dig', de: 'dich' }, { sv: 'mössa', de: 'Mütze' }] },
  { id: 'c-akaskidor', categoryId: 'cat-winter', sv: 'ska vi åka skidor?', de: 'sollen wir Ski fahren?', decoding: [{ sv: 'ska', de: 'sollen' }, { sv: 'vi', de: 'wir' }, { sv: 'åka', de: 'fahren' }, { sv: 'skidor', de: 'Ski' }] },
  { id: 'c-morkttidigt', categoryId: 'cat-winter', sv: 'det blir mörkt tidigt', de: 'es wird früh dunkel', decoding: [{ sv: 'det', de: 'es' }, { sv: 'blir', de: 'wird' }, { sv: 'mörkt', de: 'dunkel' }, { sv: 'tidigt', de: 'früh' }] },
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
  { id: 's-klockantre1', level: 1, sv: 'Klockan är tre nu.', de: 'Es ist jetzt drei Uhr.', decoding: [{ sv: 'klockan', de: 'die Uhr' }, { sv: 'är', de: 'ist' }, { sv: 'tre', de: 'drei' }, { sv: 'nu', de: 'jetzt' }], chunkIds: ['c-klockantre'] },
  { id: 's-klockantre2', level: 1, sv: 'Titta, klockan är tre!', de: 'Schau, es ist drei Uhr!', decoding: [{ sv: 'titta', de: 'schau' }, { sv: 'klockan', de: 'die Uhr' }, { sv: 'är', de: 'ist' }, { sv: 'tre', de: 'drei' }], chunkIds: ['c-klockantre'] },
  { id: 's-tiominuter1', level: 1, sv: 'Det tar tio minuter.', de: 'Das dauert zehn Minuten.', decoding: [{ sv: 'det', de: 'es' }, { sv: 'tar', de: 'nimmt' }, { sv: 'tio', de: 'zehn' }, { sv: 'minuter', de: 'Minuten' }], chunkIds: ['c-tiominuter'] },
  { id: 's-tiominuter2', level: 1, sv: 'Bussen tar tio minuter.', de: 'Der Bus braucht zehn Minuten.', decoding: [{ sv: 'bussen', de: 'der Bus' }, { sv: 'tar', de: 'nimmt' }, { sv: 'tio', de: 'zehn' }, { sv: 'minuter', de: 'Minuten' }], chunkIds: ['c-tiominuter'] },
  { id: 's-vaddatum1', level: 1, sv: 'Ursäkta, vilket datum är det?', de: 'Entschuldigung, welches Datum ist es?', decoding: [{ sv: 'ursäkta', de: 'entschuldige' }, { sv: 'vilket', de: 'welches' }, { sv: 'datum', de: 'Datum' }, { sv: 'är', de: 'ist' }, { sv: 'det', de: 'es' }], chunkIds: ['c-vaddatum'] },
  { id: 's-vaddatum2', level: 1, sv: 'Vilket datum är det idag?', de: 'Welches Datum ist heute?', decoding: [{ sv: 'vilket', de: 'welches' }, { sv: 'datum', de: 'Datum' }, { sv: 'är', de: 'ist' }, { sv: 'det', de: 'es' }, { sv: 'idag', de: 'heute' }], chunkIds: ['c-vaddatum'] },

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

  // ── Erweiterung 2026-07-23 · je 2 Kontexte (nicht muttersprachlich geprüft) ──

  // Höflich & Basics
  { id: 's-jatack1', level: 1, sv: 'Ja, tack, gärna.', de: 'Ja, bitte, gern.', decoding: [{ sv: 'ja', de: 'ja' }, { sv: 'tack', de: 'bitte' }, { sv: 'gärna', de: 'gern' }], chunkIds: ['c-jatack'] },
  { id: 's-jatack2', level: 1, sv: 'Kaffe? Ja, tack!', de: 'Kaffee? Ja, bitte!', decoding: [{ sv: 'kaffe', de: 'Kaffee' }, { sv: 'ja', de: 'ja' }, { sv: 'tack', de: 'bitte' }], chunkIds: ['c-jatack'] },
  { id: 's-nejtack1', level: 1, sv: 'Nej, tack, jag är mätt.', de: 'Nein, danke, ich bin satt.', decoding: [{ sv: 'nej', de: 'nein' }, { sv: 'tack', de: 'danke' }, { sv: 'jag', de: 'ich' }, { sv: 'är', de: 'bin' }, { sv: 'mätt', de: 'satt' }], chunkIds: ['c-nejtack'] },
  { id: 's-nejtack2', level: 1, sv: 'Mer kaffe? Nej, tack.', de: 'Mehr Kaffee? Nein, danke.', decoding: [{ sv: 'mer', de: 'mehr' }, { sv: 'kaffe', de: 'Kaffee' }, { sv: 'nej', de: 'nein' }, { sv: 'tack', de: 'danke' }], chunkIds: ['c-nejtack'] },
  { id: 's-varsagod1', level: 1, sv: 'Varsågod, här är menyn.', de: 'Bitte, hier ist die Karte.', decoding: [{ sv: 'varsågod', de: 'bitte' }, { sv: 'här', de: 'hier' }, { sv: 'är', de: 'ist' }, { sv: 'menyn', de: 'die Speisekarte' }], chunkIds: ['c-varsagod'] },
  { id: 's-varsagod2', level: 1, sv: 'Tack! – Varsågod.', de: 'Danke! – Bitte.', decoding: [{ sv: 'tack', de: 'danke' }, { sv: 'varsågod', de: 'bitte' }], chunkIds: ['c-varsagod'] },
  { id: 's-ingenfara1', level: 1, sv: 'Ingen fara, det är okej.', de: 'Kein Problem, es ist okay.', decoding: [{ sv: 'ingen', de: 'keine' }, { sv: 'fara', de: 'Gefahr' }, { sv: 'det', de: 'es' }, { sv: 'är', de: 'ist' }, { sv: 'okej', de: 'okay' }], chunkIds: ['c-ingenfara'] },
  { id: 's-ingenfara2', level: 1, sv: 'Förlåt! – Ingen fara.', de: 'Entschuldigung! – Kein Problem.', decoding: [{ sv: 'förlåt', de: 'verzeih' }, { sv: 'ingen', de: 'keine' }, { sv: 'fara', de: 'Gefahr' }], chunkIds: ['c-ingenfara', 'c-forlat'] },
  { id: 's-forlat1', level: 1, sv: 'Förlåt, det var mitt fel.', de: 'Verzeihung, das war mein Fehler.', decoding: [{ sv: 'förlåt', de: 'verzeih' }, { sv: 'det', de: 'das' }, { sv: 'var', de: 'war' }, { sv: 'mitt', de: 'mein' }, { sv: 'fel', de: 'Fehler' }], chunkIds: ['c-forlat'] },
  { id: 's-forlat2', level: 1, sv: 'Förlåt att jag är sen.', de: 'Entschuldigung, dass ich spät bin.', decoding: [{ sv: 'förlåt', de: 'verzeih' }, { sv: 'att', de: 'dass' }, { sv: 'jag', de: 'ich' }, { sv: 'är', de: 'bin' }, { sv: 'sen', de: 'spät' }], chunkIds: ['c-forlat'] },
  { id: 's-ursaktamig1', level: 1, sv: 'Ursäkta mig, får jag komma förbi?', de: 'Entschuldigung, darf ich vorbei?', decoding: [{ sv: 'ursäkta', de: 'entschuldige' }, { sv: 'mig', de: 'mich' }, { sv: 'får', de: 'darf' }, { sv: 'jag', de: 'ich' }, { sv: 'komma', de: 'kommen' }, { sv: 'förbi', de: 'vorbei' }], chunkIds: ['c-ursaktamig'] },
  { id: 's-ursaktamig2', level: 1, sv: 'Ursäkta mig, har du en minut?', de: 'Entschuldige, hast du eine Minute?', decoding: [{ sv: 'ursäkta', de: 'entschuldige' }, { sv: 'mig', de: 'mich' }, { sv: 'har', de: 'hast' }, { sv: 'du', de: 'du' }, { sv: 'en', de: 'eine' }, { sv: 'minut', de: 'Minute' }], chunkIds: ['c-ursaktamig'] },

  // Bus, Bahn & Taxi
  { id: 's-biljett1', level: 1, sv: 'En biljett till Stockholm, tack.', de: 'Ein Ticket nach Stockholm, bitte.', decoding: [{ sv: 'en', de: 'ein' }, { sv: 'biljett', de: 'Ticket' }, { sv: 'till', de: 'nach' }, { sv: 'Stockholm', de: 'Stockholm' }, { sv: 'tack', de: 'bitte' }], chunkIds: ['c-biljett'] },
  { id: 's-biljett2', level: 1, sv: 'Hej, en biljett, tack.', de: 'Hallo, ein Ticket, bitte.', decoding: [{ sv: 'hej', de: 'hallo' }, { sv: 'en', de: 'ein' }, { sv: 'biljett', de: 'Ticket' }, { sv: 'tack', de: 'bitte' }], chunkIds: ['c-biljett'] },
  { id: 's-nartag1', level: 1, sv: 'Ursäkta, när går tåget?', de: 'Entschuldigung, wann fährt der Zug?', decoding: [{ sv: 'ursäkta', de: 'entschuldige' }, { sv: 'när', de: 'wann' }, { sv: 'går', de: 'fährt' }, { sv: 'tåget', de: 'der Zug' }], chunkIds: ['c-nartag'] },
  { id: 's-nartag2', level: 1, sv: 'När går tåget till Malmö?', de: 'Wann fährt der Zug nach Malmö?', decoding: [{ sv: 'när', de: 'wann' }, { sv: 'går', de: 'fährt' }, { sv: 'tåget', de: 'der Zug' }, { sv: 'till', de: 'nach' }, { sv: 'Malmö', de: 'Malmö' }], chunkIds: ['c-nartag'] },
  { id: 's-narbuss1', level: 1, sv: 'När går bussen till centrum?', de: 'Wann fährt der Bus ins Zentrum?', decoding: [{ sv: 'när', de: 'wann' }, { sv: 'går', de: 'fährt' }, { sv: 'bussen', de: 'der Bus' }, { sv: 'till', de: 'zu' }, { sv: 'centrum', de: 'Zentrum' }], chunkIds: ['c-narbuss'] },
  { id: 's-narbuss2', level: 1, sv: 'Ursäkta, när går nästa buss?', de: 'Entschuldigung, wann fährt der nächste Bus?', decoding: [{ sv: 'ursäkta', de: 'entschuldige' }, { sv: 'när', de: 'wann' }, { sv: 'går', de: 'fährt' }, { sv: 'nästa', de: 'nächste' }, { sv: 'buss', de: 'Bus' }], chunkIds: ['c-narbuss'] },
  { id: 's-spar1', level: 1, sv: 'Vilket spår går tåget från?', de: 'Von welchem Gleis fährt der Zug?', decoding: [{ sv: 'vilket', de: 'welchem' }, { sv: 'spår', de: 'Gleis' }, { sv: 'går', de: 'fährt' }, { sv: 'tåget', de: 'der Zug' }, { sv: 'från', de: 'von' }], chunkIds: ['c-spar'] },
  { id: 's-spar2', level: 1, sv: 'Ursäkta, vilket spår?', de: 'Entschuldigung, welches Gleis?', decoding: [{ sv: 'ursäkta', de: 'entschuldige' }, { sv: 'vilket', de: 'welches' }, { sv: 'spår', de: 'Gleis' }], chunkIds: ['c-spar'] },
  { id: 's-flygplatsen1', level: 1, sv: 'Till flygplatsen, tack.', de: 'Zum Flughafen, bitte.', decoding: [{ sv: 'till', de: 'zu' }, { sv: 'flygplatsen', de: 'dem Flughafen' }, { sv: 'tack', de: 'bitte' }], chunkIds: ['c-flygplatsen'] },
  { id: 's-flygplatsen2', level: 1, sv: 'Kör till flygplatsen, tack.', de: 'Fahr zum Flughafen, bitte.', decoding: [{ sv: 'kör', de: 'fahr' }, { sv: 'till', de: 'zu' }, { sv: 'flygplatsen', de: 'dem Flughafen' }, { sv: 'tack', de: 'bitte' }], chunkIds: ['c-flygplatsen'] },
  { id: 's-hallplats1', level: 1, sv: 'Ursäkta, var är hållplatsen?', de: 'Entschuldigung, wo ist die Haltestelle?', decoding: [{ sv: 'ursäkta', de: 'entschuldige' }, { sv: 'var', de: 'wo' }, { sv: 'är', de: 'ist' }, { sv: 'hållplatsen', de: 'die Haltestelle' }], chunkIds: ['c-hallplats'] },
  { id: 's-hallplats2', level: 1, sv: 'Var är närmaste hållplats?', de: 'Wo ist die nächste Haltestelle?', decoding: [{ sv: 'var', de: 'wo' }, { sv: 'är', de: 'ist' }, { sv: 'närmaste', de: 'nächste' }, { sv: 'hållplats', de: 'Haltestelle' }], chunkIds: ['c-hallplats'] },

  // Im Hotel
  { id: 's-bokatrum1', level: 1, sv: 'Hej, jag har bokat ett rum.', de: 'Hallo, ich habe ein Zimmer gebucht.', decoding: [{ sv: 'hej', de: 'hallo' }, { sv: 'jag', de: 'ich' }, { sv: 'har', de: 'habe' }, { sv: 'bokat', de: 'gebucht' }, { sv: 'ett', de: 'ein' }, { sv: 'rum', de: 'Zimmer' }], chunkIds: ['c-bokatrum'] },
  { id: 's-bokatrum2', level: 1, sv: 'Jag har bokat ett rum för två.', de: 'Ich habe ein Zimmer für zwei gebucht.', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'har', de: 'habe' }, { sv: 'bokat', de: 'gebucht' }, { sv: 'ett', de: 'ein' }, { sv: 'rum', de: 'Zimmer' }, { sv: 'för', de: 'für' }, { sv: 'två', de: 'zwei' }], chunkIds: ['c-bokatrum'] },
  { id: 's-ledigtrum1', level: 1, sv: 'Har ni ett ledigt rum?', de: 'Haben Sie ein freies Zimmer?', decoding: [{ sv: 'har', de: 'haben' }, { sv: 'ni', de: 'ihr' }, { sv: 'ett', de: 'ein' }, { sv: 'ledigt', de: 'freies' }, { sv: 'rum', de: 'Zimmer' }], chunkIds: ['c-ledigtrum'] },
  { id: 's-ledigtrum2', level: 1, sv: 'Ursäkta, har ni ett ledigt rum ikväll?', de: 'Entschuldigung, haben Sie heute Abend ein freies Zimmer?', decoding: [{ sv: 'ursäkta', de: 'entschuldige' }, { sv: 'har', de: 'haben' }, { sv: 'ni', de: 'ihr' }, { sv: 'ett', de: 'ein' }, { sv: 'ledigt', de: 'freies' }, { sv: 'rum', de: 'Zimmer' }, { sv: 'ikväll', de: 'heute Abend' }], chunkIds: ['c-ledigtrum'] },
  { id: 's-vadnatt1', level: 1, sv: 'Vad kostar en natt?', de: 'Was kostet eine Nacht?', decoding: [{ sv: 'vad', de: 'was' }, { sv: 'kostar', de: 'kostet' }, { sv: 'en', de: 'eine' }, { sv: 'natt', de: 'Nacht' }], chunkIds: ['c-vadnatt'] },
  { id: 's-vadnatt2', level: 1, sv: 'Vad kostar en natt för två?', de: 'Was kostet eine Nacht für zwei?', decoding: [{ sv: 'vad', de: 'was' }, { sv: 'kostar', de: 'kostet' }, { sv: 'en', de: 'eine' }, { sv: 'natt', de: 'Nacht' }, { sv: 'för', de: 'für' }, { sv: 'två', de: 'zwei' }], chunkIds: ['c-vadnatt'] },
  { id: 's-narfrukost1', level: 1, sv: 'När är frukost?', de: 'Wann gibt es Frühstück?', decoding: [{ sv: 'när', de: 'wann' }, { sv: 'är', de: 'ist' }, { sv: 'frukost', de: 'Frühstück' }], chunkIds: ['c-narfrukost'] },
  { id: 's-narfrukost2', level: 1, sv: 'Ursäkta, när är frukost?', de: 'Entschuldigung, wann gibt es Frühstück?', decoding: [{ sv: 'ursäkta', de: 'entschuldige' }, { sv: 'när', de: 'wann' }, { sv: 'är', de: 'ist' }, { sv: 'frukost', de: 'Frühstück' }], chunkIds: ['c-narfrukost'] },
  { id: 's-nyckeln1', level: 1, sv: 'Kan jag få nyckeln, tack?', de: 'Kann ich den Schlüssel haben, bitte?', decoding: [{ sv: 'kan', de: 'kann' }, { sv: 'jag', de: 'ich' }, { sv: 'få', de: 'bekommen' }, { sv: 'nyckeln', de: 'der Schlüssel' }, { sv: 'tack', de: 'bitte' }], chunkIds: ['c-nyckeln'] },
  { id: 's-nyckeln2', level: 1, sv: 'Hej, kan jag få nyckeln till rum tre?', de: 'Hallo, kann ich den Schlüssel für Zimmer drei haben?', decoding: [{ sv: 'hej', de: 'hallo' }, { sv: 'kan', de: 'kann' }, { sv: 'jag', de: 'ich' }, { sv: 'få', de: 'bekommen' }, { sv: 'nyckeln', de: 'der Schlüssel' }, { sv: 'till', de: 'zu' }, { sv: 'rum', de: 'Zimmer' }, { sv: 'tre', de: 'drei' }], chunkIds: ['c-nyckeln'] },
  { id: 's-varrummet1', level: 1, sv: 'Ursäkta, var är rummet?', de: 'Entschuldigung, wo ist das Zimmer?', decoding: [{ sv: 'ursäkta', de: 'entschuldige' }, { sv: 'var', de: 'wo' }, { sv: 'är', de: 'ist' }, { sv: 'rummet', de: 'das Zimmer' }], chunkIds: ['c-varrummet'] },
  { id: 's-varrummet2', level: 1, sv: 'Var är rummet, tack?', de: 'Wo ist das Zimmer, bitte?', decoding: [{ sv: 'var', de: 'wo' }, { sv: 'är', de: 'ist' }, { sv: 'rummet', de: 'das Zimmer' }, { sv: 'tack', de: 'bitte' }], chunkIds: ['c-varrummet'] },

  // Im Restaurant
  { id: 's-bordtva1', level: 1, sv: 'Hej, ett bord för två, tack.', de: 'Hallo, einen Tisch für zwei, bitte.', decoding: [{ sv: 'hej', de: 'hallo' }, { sv: 'ett', de: 'ein' }, { sv: 'bord', de: 'Tisch' }, { sv: 'för', de: 'für' }, { sv: 'två', de: 'zwei' }, { sv: 'tack', de: 'bitte' }], chunkIds: ['c-bordtva'] },
  { id: 's-bordtva2', level: 1, sv: 'Har ni ett bord för två?', de: 'Habt ihr einen Tisch für zwei?', decoding: [{ sv: 'har', de: 'haben' }, { sv: 'ni', de: 'ihr' }, { sv: 'ett', de: 'ein' }, { sv: 'bord', de: 'Tisch' }, { sv: 'för', de: 'für' }, { sv: 'två', de: 'zwei' }], chunkIds: ['c-bordtva'] },
  { id: 's-menyn1', level: 1, sv: 'Kan jag få menyn, tack?', de: 'Kann ich die Karte haben, bitte?', decoding: [{ sv: 'kan', de: 'kann' }, { sv: 'jag', de: 'ich' }, { sv: 'få', de: 'bekommen' }, { sv: 'menyn', de: 'die Speisekarte' }, { sv: 'tack', de: 'bitte' }], chunkIds: ['c-menyn'] },
  { id: 's-menyn2', level: 1, sv: 'Ursäkta, kan jag få menyn?', de: 'Entschuldigung, kann ich die Karte haben?', decoding: [{ sv: 'ursäkta', de: 'entschuldige' }, { sv: 'kan', de: 'kann' }, { sv: 'jag', de: 'ich' }, { sv: 'få', de: 'bekommen' }, { sv: 'menyn', de: 'die Speisekarte' }], chunkIds: ['c-menyn'] },
  { id: 's-tardenhar1', level: 1, sv: 'Jag tar den här, tack.', de: 'Ich nehme das hier, bitte.', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'tar', de: 'nehme' }, { sv: 'den', de: 'das' }, { sv: 'här', de: 'hier' }, { sv: 'tack', de: 'bitte' }], chunkIds: ['c-tardenhar'] },
  { id: 's-tardenhar2', level: 1, sv: 'Jag tar den här och en kaffe.', de: 'Ich nehme das hier und einen Kaffee.', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'tar', de: 'nehme' }, { sv: 'den', de: 'das' }, { sv: 'här', de: 'hier' }, { sv: 'och', de: 'und' }, { sv: 'en', de: 'einen' }, { sv: 'kaffe', de: 'Kaffee' }], chunkIds: ['c-tardenhar'] },
  { id: 's-rekommenderar1', level: 1, sv: 'Vad rekommenderar du?', de: 'Was empfiehlst du?', decoding: [{ sv: 'vad', de: 'was' }, { sv: 'rekommenderar', de: 'empfiehlst' }, { sv: 'du', de: 'du' }], chunkIds: ['c-rekommenderar'] },
  { id: 's-rekommenderar2', level: 1, sv: 'Vad rekommenderar du idag?', de: 'Was empfiehlst du heute?', decoding: [{ sv: 'vad', de: 'was' }, { sv: 'rekommenderar', de: 'empfiehlst' }, { sv: 'du', de: 'du' }, { sv: 'idag', de: 'heute' }], chunkIds: ['c-rekommenderar'] },
  { id: 's-vargott1', level: 1, sv: 'Tack, det var gott!', de: 'Danke, das war lecker!', decoding: [{ sv: 'tack', de: 'danke' }, { sv: 'det', de: 'das' }, { sv: 'var', de: 'war' }, { sv: 'gott', de: 'lecker' }], chunkIds: ['c-vargott'] },
  { id: 's-vargott2', level: 1, sv: 'Det var jättegott.', de: 'Das war sehr lecker.', decoding: [{ sv: 'det', de: 'das' }, { sv: 'var', de: 'war' }, { sv: 'jättegott', de: 'sehr lecker' }], chunkIds: ['c-vargott'] },
  { id: 's-matt1', level: 1, sv: 'Nej tack, jag är mätt.', de: 'Nein danke, ich bin satt.', decoding: [{ sv: 'nej', de: 'nein' }, { sv: 'tack', de: 'danke' }, { sv: 'jag', de: 'ich' }, { sv: 'är', de: 'bin' }, { sv: 'mätt', de: 'satt' }], chunkIds: ['c-matt'] },
  { id: 's-matt2', level: 1, sv: 'Tack, jag är mätt nu.', de: 'Danke, ich bin jetzt satt.', decoding: [{ sv: 'tack', de: 'danke' }, { sv: 'jag', de: 'ich' }, { sv: 'är', de: 'bin' }, { sv: 'mätt', de: 'satt' }, { sv: 'nu', de: 'jetzt' }], chunkIds: ['c-matt'] },

  // Im Geschäft
  { id: 's-tittarbara1', level: 1, sv: 'Tack, jag tittar bara.', de: 'Danke, ich schaue nur.', decoding: [{ sv: 'tack', de: 'danke' }, { sv: 'jag', de: 'ich' }, { sv: 'tittar', de: 'schaue' }, { sv: 'bara', de: 'nur' }], chunkIds: ['c-tittarbara'] },
  { id: 's-tittarbara2', level: 1, sv: 'Nej tack, jag tittar bara.', de: 'Nein danke, ich schaue nur.', decoding: [{ sv: 'nej', de: 'nein' }, { sv: 'tack', de: 'danke' }, { sv: 'jag', de: 'ich' }, { sv: 'tittar', de: 'schaue' }, { sv: 'bara', de: 'nur' }], chunkIds: ['c-tittarbara'] },
  { id: 's-iblatt1', level: 1, sv: 'Har ni den här i blått?', de: 'Haben Sie das hier in Blau?', decoding: [{ sv: 'har', de: 'haben' }, { sv: 'ni', de: 'ihr' }, { sv: 'den', de: 'das' }, { sv: 'här', de: 'hier' }, { sv: 'i', de: 'in' }, { sv: 'blått', de: 'Blau' }], chunkIds: ['c-iblatt'] },
  { id: 's-iblatt2', level: 1, sv: 'Ursäkta, har ni den i blått?', de: 'Entschuldigung, haben Sie das in Blau?', decoding: [{ sv: 'ursäkta', de: 'entschuldige' }, { sv: 'har', de: 'haben' }, { sv: 'ni', de: 'ihr' }, { sv: 'den', de: 'das' }, { sv: 'i', de: 'in' }, { sv: 'blått', de: 'Blau' }], chunkIds: ['c-iblatt'] },
  { id: 's-storlek1', level: 1, sv: 'Vilken storlek har du?', de: 'Welche Größe hast du?', decoding: [{ sv: 'vilken', de: 'welche' }, { sv: 'storlek', de: 'Größe' }, { sv: 'har', de: 'hast' }, { sv: 'du', de: 'du' }], chunkIds: ['c-storlek'] },
  { id: 's-storlek2', level: 1, sv: 'Ursäkta, vilken storlek är den?', de: 'Entschuldigung, welche Größe ist das?', decoding: [{ sv: 'ursäkta', de: 'entschuldige' }, { sv: 'vilken', de: 'welche' }, { sv: 'storlek', de: 'Größe' }, { sv: 'är', de: 'ist' }, { sv: 'den', de: 'das' }], chunkIds: ['c-storlek'] },
  { id: 's-prova1', level: 1, sv: 'Kan jag prova den?', de: 'Kann ich das anprobieren?', decoding: [{ sv: 'kan', de: 'kann' }, { sv: 'jag', de: 'ich' }, { sv: 'prova', de: 'probieren' }, { sv: 'den', de: 'das' }], chunkIds: ['c-prova'] },
  { id: 's-prova2', level: 1, sv: 'Ursäkta, kan jag prova?', de: 'Entschuldigung, kann ich anprobieren?', decoding: [{ sv: 'ursäkta', de: 'entschuldige' }, { sv: 'kan', de: 'kann' }, { sv: 'jag', de: 'ich' }, { sv: 'prova', de: 'probieren' }], chunkIds: ['c-prova'] },
  { id: 's-provrum1', level: 1, sv: 'Var är provrummet?', de: 'Wo ist die Umkleide?', decoding: [{ sv: 'var', de: 'wo' }, { sv: 'är', de: 'ist' }, { sv: 'provrummet', de: 'die Umkleidekabine' }], chunkIds: ['c-provrum'] },
  { id: 's-provrum2', level: 1, sv: 'Ursäkta, var är provrummet?', de: 'Entschuldigung, wo ist die Umkleide?', decoding: [{ sv: 'ursäkta', de: 'entschuldige' }, { sv: 'var', de: 'wo' }, { sv: 'är', de: 'ist' }, { sv: 'provrummet', de: 'die Umkleidekabine' }], chunkIds: ['c-provrum'] },
  { id: 's-tarden1', level: 1, sv: 'Tack, jag tar den.', de: 'Danke, ich nehme es.', decoding: [{ sv: 'tack', de: 'danke' }, { sv: 'jag', de: 'ich' }, { sv: 'tar', de: 'nehme' }, { sv: 'den', de: 'das' }], chunkIds: ['c-tarden'] },
  { id: 's-tarden2', level: 1, sv: 'Den är fin, jag tar den.', de: 'Das ist schön, ich nehme das.', decoding: [{ sv: 'den', de: 'das' }, { sv: 'är', de: 'ist' }, { sv: 'fin', de: 'schön' }, { sv: 'jag', de: 'ich' }, { sv: 'tar', de: 'nehme' }, { sv: 'den', de: 'das' }], chunkIds: ['c-tarden'] },

  // Bezahlen
  { id: 's-medkort1', level: 1, sv: 'Kan jag betala med kort?', de: 'Kann ich mit Karte zahlen?', decoding: [{ sv: 'kan', de: 'kann' }, { sv: 'jag', de: 'ich' }, { sv: 'betala', de: 'zahlen' }, { sv: 'med', de: 'mit' }, { sv: 'kort', de: 'Karte' }], chunkIds: ['c-medkort'] },
  { id: 's-medkort2', level: 1, sv: 'Ursäkta, kan jag betala med kort?', de: 'Entschuldigung, kann ich mit Karte zahlen?', decoding: [{ sv: 'ursäkta', de: 'entschuldige' }, { sv: 'kan', de: 'kann' }, { sv: 'jag', de: 'ich' }, { sv: 'betala', de: 'zahlen' }, { sv: 'med', de: 'mit' }, { sv: 'kort', de: 'Karte' }], chunkIds: ['c-medkort'] },
  { id: 's-kontant1', level: 1, sv: 'Jag betalar kontant, tack.', de: 'Ich zahle bar, bitte.', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'betalar', de: 'zahle' }, { sv: 'kontant', de: 'bar' }, { sv: 'tack', de: 'bitte' }], chunkIds: ['c-kontant'] },
  { id: 's-kontant2', level: 1, sv: 'Nej, jag betalar kontant.', de: 'Nein, ich zahle bar.', decoding: [{ sv: 'nej', de: 'nein' }, { sv: 'jag', de: 'ich' }, { sv: 'betalar', de: 'zahle' }, { sv: 'kontant', de: 'bar' }], chunkIds: ['c-kontant'] },
  { id: 's-blirdet1', level: 1, sv: 'Hur mycket blir det?', de: 'Wie viel macht das?', decoding: [{ sv: 'hur', de: 'wie' }, { sv: 'mycket', de: 'viel' }, { sv: 'blir', de: 'wird' }, { sv: 'det', de: 'es' }], chunkIds: ['c-blirdet'] },
  { id: 's-blirdet2', level: 1, sv: 'Ursäkta, hur mycket blir det?', de: 'Entschuldigung, wie viel macht das?', decoding: [{ sv: 'ursäkta', de: 'entschuldige' }, { sv: 'hur', de: 'wie' }, { sv: 'mycket', de: 'viel' }, { sv: 'blir', de: 'wird' }, { sv: 'det', de: 'es' }], chunkIds: ['c-blirdet'] },
  { id: 's-kvitto1', level: 1, sv: 'Kan jag få kvittot, tack?', de: 'Kann ich den Beleg haben, bitte?', decoding: [{ sv: 'kan', de: 'kann' }, { sv: 'jag', de: 'ich' }, { sv: 'få', de: 'bekommen' }, { sv: 'kvittot', de: 'der Beleg' }, { sv: 'tack', de: 'bitte' }], chunkIds: ['c-kvitto'] },
  { id: 's-kvitto2', level: 1, sv: 'Får jag kvittot, tack?', de: 'Bekomme ich den Beleg, bitte?', decoding: [{ sv: 'får', de: 'bekomme' }, { sv: 'jag', de: 'ich' }, { sv: 'kvittot', de: 'der Beleg' }, { sv: 'tack', de: 'bitte' }], chunkIds: ['c-kvitto'] },
  { id: 's-fordyrt1', level: 1, sv: 'Nej, det är för dyrt.', de: 'Nein, das ist zu teuer.', decoding: [{ sv: 'nej', de: 'nein' }, { sv: 'det', de: 'das' }, { sv: 'är', de: 'ist' }, { sv: 'för', de: 'zu' }, { sv: 'dyrt', de: 'teuer' }], chunkIds: ['c-fordyrt'] },
  { id: 's-fordyrt2', level: 1, sv: 'Oj, det är för dyrt.', de: 'Oh, das ist zu teuer.', decoding: [{ sv: 'oj', de: 'oh' }, { sv: 'det', de: 'das' }, { sv: 'är', de: 'ist' }, { sv: 'för', de: 'zu' }, { sv: 'dyrt', de: 'teuer' }], chunkIds: ['c-fordyrt'] },

  // Im Supermarkt
  { id: 's-finnsmjolk1', level: 1, sv: 'Ursäkta, var finns mjölk?', de: 'Entschuldigung, wo gibt es Milch?', decoding: [{ sv: 'ursäkta', de: 'entschuldige' }, { sv: 'var', de: 'wo' }, { sv: 'finns', de: 'gibt es' }, { sv: 'mjölk', de: 'Milch' }], chunkIds: ['c-finnsmjolk'] },
  { id: 's-finnsmjolk2', level: 1, sv: 'Var finns mjölk och bröd?', de: 'Wo gibt es Milch und Brot?', decoding: [{ sv: 'var', de: 'wo' }, { sv: 'finns', de: 'gibt es' }, { sv: 'mjölk', de: 'Milch' }, { sv: 'och', de: 'und' }, { sv: 'bröd', de: 'Brot' }], chunkIds: ['c-finnsmjolk'] },
  { id: 's-harbrod1', level: 1, sv: 'Har ni bröd?', de: 'Haben Sie Brot?', decoding: [{ sv: 'har', de: 'haben' }, { sv: 'ni', de: 'ihr' }, { sv: 'bröd', de: 'Brot' }], chunkIds: ['c-harbrod'] },
  { id: 's-harbrod2', level: 1, sv: 'Ursäkta, har ni färskt bröd?', de: 'Entschuldigung, haben Sie frisches Brot?', decoding: [{ sv: 'ursäkta', de: 'entschuldige' }, { sv: 'har', de: 'haben' }, { sv: 'ni', de: 'ihr' }, { sv: 'färskt', de: 'frisches' }, { sv: 'bröd', de: 'Brot' }], chunkIds: ['c-harbrod'] },
  { id: 's-kiloapplen1', level: 1, sv: 'Ett kilo äpplen, tack.', de: 'Ein Kilo Äpfel, bitte.', decoding: [{ sv: 'ett', de: 'ein' }, { sv: 'kilo', de: 'Kilo' }, { sv: 'äpplen', de: 'Äpfel' }, { sv: 'tack', de: 'bitte' }], chunkIds: ['c-kiloapplen'] },
  { id: 's-kiloapplen2', level: 1, sv: 'Jag vill ha ett kilo äpplen.', de: 'Ich möchte ein Kilo Äpfel.', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'vill', de: 'will' }, { sv: 'ha', de: 'haben' }, { sv: 'ett', de: 'ein' }, { sv: 'kilo', de: 'Kilo' }, { sv: 'äpplen', de: 'Äpfel' }], chunkIds: ['c-kiloapplen', 'c-vill-ha'] },
  { id: 's-pase1', level: 1, sv: 'En påse, tack.', de: 'Eine Tüte, bitte.', decoding: [{ sv: 'en', de: 'eine' }, { sv: 'påse', de: 'Tüte' }, { sv: 'tack', de: 'bitte' }], chunkIds: ['c-pase'] },
  { id: 's-pase2', level: 1, sv: 'Kan jag få en påse, tack?', de: 'Kann ich eine Tüte haben, bitte?', decoding: [{ sv: 'kan', de: 'kann' }, { sv: 'jag', de: 'ich' }, { sv: 'få', de: 'bekommen' }, { sv: 'en', de: 'eine' }, { sv: 'påse', de: 'Tüte' }, { sv: 'tack', de: 'bitte' }], chunkIds: ['c-pase'] },
  { id: 's-kassan1', level: 1, sv: 'Var är kassan?', de: 'Wo ist die Kasse?', decoding: [{ sv: 'var', de: 'wo' }, { sv: 'är', de: 'ist' }, { sv: 'kassan', de: 'die Kasse' }], chunkIds: ['c-kassan'] },
  { id: 's-kassan2', level: 1, sv: 'Ursäkta, var är kassan?', de: 'Entschuldigung, wo ist die Kasse?', decoding: [{ sv: 'ursäkta', de: 'entschuldige' }, { sv: 'var', de: 'wo' }, { sv: 'är', de: 'ist' }, { sv: 'kassan', de: 'die Kasse' }], chunkIds: ['c-kassan'] },

  // Beim Arzt & Apotheke
  { id: 's-sjuk1', level: 1, sv: 'Jag är sjuk idag.', de: 'Ich bin heute krank.', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'är', de: 'bin' }, { sv: 'sjuk', de: 'krank' }, { sv: 'idag', de: 'heute' }], chunkIds: ['c-sjuk'] },
  { id: 's-sjuk2', level: 1, sv: 'Hjälp, jag är sjuk.', de: 'Hilfe, ich bin krank.', decoding: [{ sv: 'hjälp', de: 'Hilfe' }, { sv: 'jag', de: 'ich' }, { sv: 'är', de: 'bin' }, { sv: 'sjuk', de: 'krank' }], chunkIds: ['c-sjuk'] },
  { id: 's-onthar1', level: 1, sv: 'Jag har ont här.', de: 'Mir tut es hier weh.', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'har', de: 'habe' }, { sv: 'ont', de: 'Schmerz' }, { sv: 'här', de: 'hier' }], chunkIds: ['c-onthär'] },
  { id: 's-onthar2', level: 1, sv: 'Det gör ont här.', de: 'Es tut hier weh.', decoding: [{ sv: 'det', de: 'es' }, { sv: 'gör', de: 'macht' }, { sv: 'ont', de: 'Schmerz' }, { sv: 'här', de: 'hier' }], chunkIds: ['c-onthär'] },
  { id: 's-lakare1', level: 1, sv: 'Jag behöver en läkare.', de: 'Ich brauche einen Arzt.', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'behöver', de: 'brauche' }, { sv: 'en', de: 'einen' }, { sv: 'läkare', de: 'Arzt' }], chunkIds: ['c-lakare'] },
  { id: 's-lakare2', level: 1, sv: 'Hjälp, jag behöver en läkare.', de: 'Hilfe, ich brauche einen Arzt.', decoding: [{ sv: 'hjälp', de: 'Hilfe' }, { sv: 'jag', de: 'ich' }, { sv: 'behöver', de: 'brauche' }, { sv: 'en', de: 'einen' }, { sv: 'läkare', de: 'Arzt' }], chunkIds: ['c-lakare'] },
  { id: 's-apoteket1', level: 1, sv: 'Ursäkta, var är apoteket?', de: 'Entschuldigung, wo ist die Apotheke?', decoding: [{ sv: 'ursäkta', de: 'entschuldige' }, { sv: 'var', de: 'wo' }, { sv: 'är', de: 'ist' }, { sv: 'apoteket', de: 'die Apotheke' }], chunkIds: ['c-apoteket'] },
  { id: 's-apoteket2', level: 1, sv: 'Var är närmaste apotek?', de: 'Wo ist die nächste Apotheke?', decoding: [{ sv: 'var', de: 'wo' }, { sv: 'är', de: 'ist' }, { sv: 'närmaste', de: 'nächste' }, { sv: 'apotek', de: 'Apotheke' }], chunkIds: ['c-apoteket'] },
  { id: 's-huvudvark1', level: 1, sv: 'Jag har huvudvärk.', de: 'Ich habe Kopfschmerzen.', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'har', de: 'habe' }, { sv: 'huvudvärk', de: 'Kopfschmerzen' }], chunkIds: ['c-huvudvark'] },
  { id: 's-huvudvark2', level: 1, sv: 'Jag har huvudvärk idag.', de: 'Ich habe heute Kopfschmerzen.', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'har', de: 'habe' }, { sv: 'huvudvärk', de: 'Kopfschmerzen' }, { sv: 'idag', de: 'heute' }], chunkIds: ['c-huvudvark'] },
  { id: 's-allergisk1', level: 1, sv: 'Jag är allergisk.', de: 'Ich bin allergisch.', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'är', de: 'bin' }, { sv: 'allergisk', de: 'allergisch' }], chunkIds: ['c-allergisk'] },
  { id: 's-allergisk2', level: 1, sv: 'Jag är allergisk mot mjölk.', de: 'Ich bin allergisch gegen Milch.', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'är', de: 'bin' }, { sv: 'allergisk', de: 'allergisch' }, { sv: 'mot', de: 'gegen' }, { sv: 'mjölk', de: 'Milch' }], chunkIds: ['c-allergisk'] },

  // Notfall & Hilfe
  { id: 's-hjalpe1', level: 1, sv: 'Hjälp! Ring polisen!', de: 'Hilfe! Ruf die Polizei!', decoding: [{ sv: 'hjälp', de: 'Hilfe' }, { sv: 'ring', de: 'ruf an' }, { sv: 'polisen', de: 'die Polizei' }], chunkIds: ['c-hjalp', 'c-ringpolis'] },
  { id: 's-hjalpe2', level: 1, sv: 'Snälla, hjälp mig!', de: 'Bitte, hilf mir!', decoding: [{ sv: 'snälla', de: 'bitte' }, { sv: 'hjälp', de: 'hilf' }, { sv: 'mig', de: 'mir' }], chunkIds: ['c-hjalp'] },
  { id: 's-ringpolis1', level: 1, sv: 'Ring polisen, snabbt!', de: 'Ruf die Polizei, schnell!', decoding: [{ sv: 'ring', de: 'ruf an' }, { sv: 'polisen', de: 'die Polizei' }, { sv: 'snabbt', de: 'schnell' }], chunkIds: ['c-ringpolis'] },
  { id: 's-ringpolis2', level: 1, sv: 'Ring polisen, det är en nödsituation!', de: 'Ruf die Polizei, das ist ein Notfall!', decoding: [{ sv: 'ring', de: 'ruf an' }, { sv: 'polisen', de: 'die Polizei' }, { sv: 'det', de: 'das' }, { sv: 'är', de: 'ist' }, { sv: 'en', de: 'ein' }, { sv: 'nödsituation', de: 'Notfall' }], chunkIds: ['c-ringpolis', 'c-nodsituation'] },
  { id: 's-ambulans1', level: 1, sv: 'Ring en ambulans!', de: 'Ruf einen Krankenwagen!', decoding: [{ sv: 'ring', de: 'ruf an' }, { sv: 'en', de: 'einen' }, { sv: 'ambulans', de: 'Krankenwagen' }], chunkIds: ['c-ambulans'] },
  { id: 's-ambulans2', level: 1, sv: 'Snälla, ring en ambulans!', de: 'Bitte, ruf einen Krankenwagen!', decoding: [{ sv: 'snälla', de: 'bitte' }, { sv: 'ring', de: 'ruf an' }, { sv: 'en', de: 'einen' }, { sv: 'ambulans', de: 'Krankenwagen' }], chunkIds: ['c-ambulans'] },
  { id: 's-nodsituation1', level: 1, sv: 'Det är en nödsituation!', de: 'Das ist ein Notfall!', decoding: [{ sv: 'det', de: 'das' }, { sv: 'är', de: 'ist' }, { sv: 'en', de: 'ein' }, { sv: 'nödsituation', de: 'Notfall' }], chunkIds: ['c-nodsituation'] },
  { id: 's-nodsituation2', level: 1, sv: 'Hjälp, det är en nödsituation!', de: 'Hilfe, das ist ein Notfall!', decoding: [{ sv: 'hjälp', de: 'Hilfe' }, { sv: 'det', de: 'das' }, { sv: 'är', de: 'ist' }, { sv: 'en', de: 'ein' }, { sv: 'nödsituation', de: 'Notfall' }], chunkIds: ['c-nodsituation'] },
  { id: 's-vilse1', level: 1, sv: 'Jag har gått vilse.', de: 'Ich habe mich verlaufen.', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'har', de: 'habe' }, { sv: 'gått', de: 'gegangen' }, { sv: 'vilse', de: 'verirrt' }], chunkIds: ['c-vilse'] },
  { id: 's-vilse2', level: 1, sv: 'Ursäkta, jag har gått vilse.', de: 'Entschuldigung, ich habe mich verlaufen.', decoding: [{ sv: 'ursäkta', de: 'entschuldige' }, { sv: 'jag', de: 'ich' }, { sv: 'har', de: 'habe' }, { sv: 'gått', de: 'gegangen' }, { sv: 'vilse', de: 'verirrt' }], chunkIds: ['c-vilse'] },
  { id: 's-tappatvaska1', level: 1, sv: 'Jag hittar inte min väska.', de: 'Ich finde meine Tasche nicht.', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'hittar', de: 'finde' }, { sv: 'inte', de: 'nicht' }, { sv: 'min', de: 'meine' }, { sv: 'väska', de: 'Tasche' }], chunkIds: ['c-tappatvaska'] },
  { id: 's-tappatvaska2', level: 1, sv: 'Hjälp, jag hittar inte min väska!', de: 'Hilfe, ich finde meine Tasche nicht!', decoding: [{ sv: 'hjälp', de: 'Hilfe' }, { sv: 'jag', de: 'ich' }, { sv: 'hittar', de: 'finde' }, { sv: 'inte', de: 'nicht' }, { sv: 'min', de: 'meine' }, { sv: 'väska', de: 'Tasche' }], chunkIds: ['c-tappatvaska'] },
  { id: 's-sesses1', level: 1, sv: 'Hej! Ska vi ses på lördag?', de: 'Hallo! Wollen wir uns am Samstag treffen?', decoding: [{ sv: 'hej', de: 'hallo' }, { sv: 'ska', de: 'sollen' }, { sv: 'vi', de: 'wir' }, { sv: 'ses', de: 'uns sehen' }, { sv: 'på', de: 'am' }, { sv: 'lördag', de: 'Samstag' }], chunkIds: ['c-sesses'] },
  { id: 's-sesses2', level: 1, sv: 'Ska vi ses efter jobbet?', de: 'Wollen wir uns nach der Arbeit treffen?', decoding: [{ sv: 'ska', de: 'sollen' }, { sv: 'vi', de: 'wir' }, { sv: 'ses', de: 'uns sehen' }, { sv: 'efter', de: 'nach' }, { sv: 'jobbet', de: 'der Arbeit' }], chunkIds: ['c-sesses'] },
  { id: 's-vihors1', level: 1, sv: 'Okej, vi hörs!', de: 'Okay, wir hören uns!', decoding: [{ sv: 'okej', de: 'okay' }, { sv: 'vi', de: 'wir' }, { sv: 'hörs', de: 'hören uns' }], chunkIds: ['c-vihors'] },
  { id: 's-vihors2', level: 1, sv: 'Tack för idag, vi hörs.', de: 'Danke für heute, wir hören uns.', decoding: [{ sv: 'tack', de: 'danke' }, { sv: 'för', de: 'für' }, { sv: 'idag', de: 'heute' }, { sv: 'vi', de: 'wir' }, { sv: 'hörs', de: 'hören uns' }], chunkIds: ['c-vihors'] },
  { id: 's-pavag1', level: 1, sv: 'Jag är på väg nu.', de: 'Ich bin jetzt unterwegs.', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'är', de: 'bin' }, { sv: 'på', de: 'auf' }, { sv: 'väg', de: 'Weg' }, { sv: 'nu', de: 'jetzt' }], chunkIds: ['c-pavag'] },
  { id: 's-pavag2', level: 1, sv: 'Vänta lite, jag är på väg.', de: 'Warte kurz, ich bin unterwegs.', decoding: [{ sv: 'vänta', de: 'warte' }, { sv: 'lite', de: 'wenig' }, { sv: 'jag', de: 'ich' }, { sv: 'är', de: 'bin' }, { sv: 'på', de: 'auf' }, { sv: 'väg', de: 'Weg' }], chunkIds: ['c-pavag', 'c-vantalite'] },
  { id: 's-lateskul1', level: 1, sv: 'Det låter kul!', de: 'Das klingt nach Spaß!', decoding: [{ sv: 'det', de: 'das' }, { sv: 'låter', de: 'klingt' }, { sv: 'kul', de: 'Spaß' }], chunkIds: ['c-lateskul'] },
  { id: 's-lateskul2', level: 1, sv: 'Ja, det låter kul. Jag är med.', de: 'Ja, das klingt nach Spaß. Ich bin dabei.', decoding: [{ sv: 'ja', de: 'ja' }, { sv: 'det', de: 'das' }, { sv: 'låter', de: 'klingt' }, { sv: 'kul', de: 'Spaß' }, { sv: 'jag', de: 'ich' }, { sv: 'är', de: 'bin' }, { sv: 'med', de: 'mit' }], chunkIds: ['c-lateskul', 'c-jagarmed'] },
  { id: 's-vadgordu1', level: 1, sv: 'Vad gör du i helgen?', de: 'Was machst du am Wochenende?', decoding: [{ sv: 'vad', de: 'was' }, { sv: 'gör', de: 'machst' }, { sv: 'du', de: 'du' }, { sv: 'i', de: 'in' }, { sv: 'helgen', de: 'dem Wochenende' }], chunkIds: ['c-vadgordu'] },
  { id: 's-vadgordu2', level: 1, sv: 'Hej! Vad gör du i helgen?', de: 'Hallo! Was machst du am Wochenende?', decoding: [{ sv: 'hej', de: 'hallo' }, { sv: 'vad', de: 'was' }, { sv: 'gör', de: 'machst' }, { sv: 'du', de: 'du' }, { sv: 'i', de: 'in' }, { sv: 'helgen', de: 'dem Wochenende' }], chunkIds: ['c-vadgordu'] },
  { id: 's-ringerdig1', level: 1, sv: 'Jag ringer dig sen.', de: 'Ich rufe dich später an.', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'ringer', de: 'rufe an' }, { sv: 'dig', de: 'dich' }, { sv: 'sen', de: 'später' }], chunkIds: ['c-ringerdig'] },
  { id: 's-ringerdig2', level: 1, sv: 'Okej, jag ringer dig sen. Vi hörs!', de: 'Okay, ich rufe dich später an. Wir hören uns!', decoding: [{ sv: 'okej', de: 'okay' }, { sv: 'jag', de: 'ich' }, { sv: 'ringer', de: 'rufe an' }, { sv: 'dig', de: 'dich' }, { sv: 'sen', de: 'später' }, { sv: 'vi', de: 'wir' }, { sv: 'hörs', de: 'hören uns' }], chunkIds: ['c-ringerdig', 'c-vihors'] },
  { id: 's-kanintekomma1', level: 1, sv: 'Tyvärr, jag kan inte komma.', de: 'Leider kann ich nicht kommen.', decoding: [{ sv: 'tyvärr', de: 'leider' }, { sv: 'jag', de: 'ich' }, { sv: 'kan', de: 'kann' }, { sv: 'inte', de: 'nicht' }, { sv: 'komma', de: 'kommen' }], chunkIds: ['c-kanintekomma'] },
  { id: 's-kanintekomma2', level: 1, sv: 'Jag kan inte komma idag.', de: 'Ich kann heute nicht kommen.', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'kan', de: 'kann' }, { sv: 'inte', de: 'nicht' }, { sv: 'komma', de: 'kommen' }, { sv: 'idag', de: 'heute' }], chunkIds: ['c-kanintekomma'] },
  { id: 's-hallerpa1', level: 1, sv: 'Hej! Vad håller du på med?', de: 'Hallo! Was machst du gerade?', decoding: [{ sv: 'hej', de: 'hallo' }, { sv: 'vad', de: 'was' }, { sv: 'håller', de: 'hältst' }, { sv: 'du', de: 'du' }, { sv: 'på', de: 'an' }, { sv: 'med', de: 'mit' }], chunkIds: ['c-hallerpa'] },
  { id: 's-hallerpa2', level: 1, sv: 'Vad håller du på med där?', de: 'Was machst du da gerade?', decoding: [{ sv: 'vad', de: 'was' }, { sv: 'håller', de: 'hältst' }, { sv: 'du', de: 'du' }, { sv: 'på', de: 'an' }, { sv: 'med', de: 'mit' }, { sv: 'där', de: 'dort' }], chunkIds: ['c-hallerpa'] },
  { id: 's-startarinte1', level: 1, sv: 'Bilen startar inte.', de: 'Das Auto springt nicht an.', decoding: [{ sv: 'bilen', de: 'das Auto' }, { sv: 'startar', de: 'startet' }, { sv: 'inte', de: 'nicht' }], chunkIds: ['c-startarinte'] },
  { id: 's-startarinte2', level: 1, sv: 'Problemet är att bilen inte startar.', de: 'Das Problem ist, dass das Auto nicht anspringt.', decoding: [{ sv: 'problemet', de: 'das Problem' }, { sv: 'är', de: 'ist' }, { sv: 'att', de: 'dass' }, { sv: 'bilen', de: 'das Auto' }, { sv: 'inte', de: 'nicht' }, { sv: 'startar', de: 'startet' }], chunkIds: ['c-startarinte'] },
  { id: 's-hallden1', level: 1, sv: 'Kan du hålla den här?', de: 'Kannst du das hier halten?', decoding: [{ sv: 'kan', de: 'kannst' }, { sv: 'du', de: 'du' }, { sv: 'hålla', de: 'halten' }, { sv: 'den', de: 'das' }, { sv: 'här', de: 'hier' }], chunkIds: ['c-hallden'] },
  { id: 's-hallden2', level: 1, sv: 'Kan du hålla den här, tack?', de: 'Kannst du das hier halten, bitte?', decoding: [{ sv: 'kan', de: 'kannst' }, { sv: 'du', de: 'du' }, { sv: 'hålla', de: 'halten' }, { sv: 'den', de: 'das' }, { sv: 'här', de: 'hier' }, { sv: 'tack', de: 'bitte' }], chunkIds: ['c-hallden'] },
  { id: 's-latarkonstigt1', level: 1, sv: 'Det låter konstigt.', de: 'Das hört sich komisch an.', decoding: [{ sv: 'det', de: 'das' }, { sv: 'låter', de: 'klingt' }, { sv: 'konstigt', de: 'komisch' }], chunkIds: ['c-latarkonstigt'] },
  { id: 's-latarkonstigt2', level: 1, sv: 'Lyssna, det låter konstigt.', de: 'Hör mal, das hört sich komisch an.', decoding: [{ sv: 'lyssna', de: 'hör' }, { sv: 'det', de: 'das' }, { sv: 'låter', de: 'klingt' }, { sv: 'konstigt', de: 'komisch' }], chunkIds: ['c-latarkonstigt'] },
  { id: 's-motorn1', level: 1, sv: 'Jag tror det är motorn.', de: 'Ich glaube, es ist der Motor.', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'tror', de: 'glaube' }, { sv: 'det', de: 'es' }, { sv: 'är', de: 'ist' }, { sv: 'motorn', de: 'der Motor' }], chunkIds: ['c-motorn'] },
  { id: 's-motorn2', level: 1, sv: 'Nej, det är motorn.', de: 'Nein, es ist der Motor.', decoding: [{ sv: 'nej', de: 'nein' }, { sv: 'det', de: 'es' }, { sv: 'är', de: 'ist' }, { sv: 'motorn', de: 'der Motor' }], chunkIds: ['c-motorn'] },
  { id: 's-punkterat1', level: 1, sv: 'Däcket är punkterat.', de: 'Der Reifen ist platt.', decoding: [{ sv: 'däcket', de: 'der Reifen' }, { sv: 'är', de: 'ist' }, { sv: 'punkterat', de: 'durchstochen' }], chunkIds: ['c-punkterat'] },
  { id: 's-punkterat2', level: 1, sv: 'Titta, däcket är punkterat!', de: 'Schau, der Reifen ist platt!', decoding: [{ sv: 'titta', de: 'schau' }, { sv: 'däcket', de: 'der Reifen' }, { sv: 'är', de: 'ist' }, { sv: 'punkterat', de: 'durchstochen' }], chunkIds: ['c-punkterat'] },
  { id: 's-fixardet1', level: 1, sv: 'Ingen fara, jag fixar det.', de: 'Kein Problem, ich mache das.', decoding: [{ sv: 'ingen', de: 'keine' }, { sv: 'fara', de: 'Gefahr' }, { sv: 'jag', de: 'ich' }, { sv: 'fixar', de: 'richte' }, { sv: 'det', de: 'das' }], chunkIds: ['c-fixardet'] },
  { id: 's-fixardet2', level: 1, sv: 'Vänta, jag fixar det.', de: 'Warte, ich mache das.', decoding: [{ sv: 'vänta', de: 'warte' }, { sv: 'jag', de: 'ich' }, { sv: 'fixar', de: 'richte' }, { sv: 'det', de: 'das' }], chunkIds: ['c-fixardet'] },
  { id: 's-verktyg1', level: 1, sv: 'Har du ett verktyg?', de: 'Hast du ein Werkzeug?', decoding: [{ sv: 'har', de: 'hast' }, { sv: 'du', de: 'du' }, { sv: 'ett', de: 'ein' }, { sv: 'verktyg', de: 'Werkzeug' }], chunkIds: ['c-verktyg'] },
  { id: 's-verktyg2', level: 1, sv: 'Ursäkta, har du ett verktyg?', de: 'Entschuldigung, hast du ein Werkzeug?', decoding: [{ sv: 'ursäkta', de: 'entschuldige' }, { sv: 'har', de: 'hast' }, { sv: 'du', de: 'du' }, { sv: 'ett', de: 'ein' }, { sv: 'verktyg', de: 'Werkzeug' }], chunkIds: ['c-verktyg'] },
  { id: 's-vilkenbil1', level: 1, sv: 'Wow, vilken bil!', de: 'Wow, was für ein Auto!', decoding: [{ sv: 'wow', de: 'wow' }, { sv: 'vilken', de: 'welch ein' }, { sv: 'bil', de: 'Auto' }], chunkIds: ['c-vilkenbil'] },
  { id: 's-vilkenbil2', level: 1, sv: 'Vilken bil! Är den din?', de: 'Was für ein Auto! Ist das deins?', decoding: [{ sv: 'vilken', de: 'welch ein' }, { sv: 'bil', de: 'Auto' }, { sv: 'är', de: 'ist' }, { sv: 'den', de: 'das' }, { sv: 'din', de: 'deins' }], chunkIds: ['c-vilkenbil'] },
  { id: 's-hurfort1', level: 1, sv: 'Hur fort går den?', de: 'Wie schnell fährt es?', decoding: [{ sv: 'hur', de: 'wie' }, { sv: 'fort', de: 'schnell' }, { sv: 'går', de: 'geht' }, { sv: 'den', de: 'es' }], chunkIds: ['c-hurfort'] },
  { id: 's-hurfort2', level: 1, sv: 'Snygg bil! Hur fort går den?', de: 'Schönes Auto! Wie schnell fährt es?', decoding: [{ sv: 'snygg', de: 'schön' }, { sv: 'bil', de: 'Auto' }, { sv: 'hur', de: 'wie' }, { sv: 'fort', de: 'schnell' }, { sv: 'går', de: 'geht' }, { sv: 'den', de: 'es' }], chunkIds: ['c-hurfort'] },
  { id: 's-vemvann1', level: 1, sv: 'Vem vann?', de: 'Wer hat gewonnen?', decoding: [{ sv: 'vem', de: 'wer' }, { sv: 'vann', de: 'gewann' }], chunkIds: ['c-vemvann'] },
  { id: 's-vemvann2', level: 1, sv: 'Ursäkta, vem vann?', de: 'Entschuldigung, wer hat gewonnen?', decoding: [{ sv: 'ursäkta', de: 'entschuldige' }, { sv: 'vem', de: 'wer' }, { sv: 'vann', de: 'gewann' }], chunkIds: ['c-vemvann'] },
  { id: 's-loppet1', level: 1, sv: 'Loppet börjar snart.', de: 'Das Rennen fängt gleich an.', decoding: [{ sv: 'loppet', de: 'das Rennen' }, { sv: 'börjar', de: 'beginnt' }, { sv: 'snart', de: 'bald' }], chunkIds: ['c-loppet'] },
  { id: 's-loppet2', level: 1, sv: 'Kom, loppet börjar snart!', de: 'Komm, das Rennen fängt gleich an!', decoding: [{ sv: 'kom', de: 'komm' }, { sv: 'loppet', de: 'das Rennen' }, { sv: 'börjar', de: 'beginnt' }, { sv: 'snart', de: 'bald' }], chunkIds: ['c-loppet'] },
  { id: 's-korderbra1', level: 1, sv: 'Han körde bra idag.', de: 'Er ist heute gut gefahren.', decoding: [{ sv: 'han', de: 'er' }, { sv: 'körde', de: 'fuhr' }, { sv: 'bra', de: 'gut' }, { sv: 'idag', de: 'heute' }], chunkIds: ['c-korderbra'] },
  { id: 's-korderbra2', level: 1, sv: 'Ja, han körde bra.', de: 'Ja, er ist gut gefahren.', decoding: [{ sv: 'ja', de: 'ja' }, { sv: 'han', de: 'er' }, { sv: 'körde', de: 'fuhr' }, { sv: 'bra', de: 'gut' }], chunkIds: ['c-korderbra'] },
  { id: 's-rekord1', level: 1, sv: 'Det var nytt rekord!', de: 'Das war ein neuer Rekord!', decoding: [{ sv: 'det', de: 'das' }, { sv: 'var', de: 'war' }, { sv: 'nytt', de: 'neuer' }, { sv: 'rekord', de: 'Rekord' }], chunkIds: ['c-nytt-rekord'] },
  { id: 's-rekord2', level: 1, sv: 'Otroligt, det var nytt rekord.', de: 'Unglaublich, das war ein neuer Rekord.', decoding: [{ sv: 'otroligt', de: 'unglaublich' }, { sv: 'det', de: 'das' }, { sv: 'var', de: 'war' }, { sv: 'nytt', de: 'neuer' }, { sv: 'rekord', de: 'Rekord' }], chunkIds: ['c-nytt-rekord'] },
  { id: 's-horduemig1', level: 1, sv: 'Hallå, hör du mig?', de: 'Hallo, hörst du mich?', decoding: [{ sv: 'hallå', de: 'hallo' }, { sv: 'hör', de: 'hörst' }, { sv: 'du', de: 'du' }, { sv: 'mig', de: 'mich' }], chunkIds: ['c-horduemig'] },
  { id: 's-horduemig2', level: 1, sv: 'Hör du mig nu?', de: 'Hörst du mich jetzt?', decoding: [{ sv: 'hör', de: 'hörst' }, { sv: 'du', de: 'du' }, { sv: 'mig', de: 'mich' }, { sv: 'nu', de: 'jetzt' }], chunkIds: ['c-horduemig'] },
  { id: 's-strax1', level: 1, sv: 'Jag är strax tillbaka.', de: 'Ich bin gleich zurück.', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'är', de: 'bin' }, { sv: 'strax', de: 'gleich' }, { sv: 'tillbaka', de: 'zurück' }], chunkIds: ['c-strax'] },
  { id: 's-strax2', level: 1, sv: 'Vänta lite, jag är strax tillbaka.', de: 'Warte kurz, ich bin gleich zurück.', decoding: [{ sv: 'vänta', de: 'warte' }, { sv: 'lite', de: 'wenig' }, { sv: 'jag', de: 'ich' }, { sv: 'är', de: 'bin' }, { sv: 'strax', de: 'gleich' }, { sv: 'tillbaka', de: 'zurück' }], chunkIds: ['c-strax', 'c-vantalite'] },
  { id: 's-enrundatill1', level: 1, sv: 'En runda till?', de: 'Noch eine Runde?', decoding: [{ sv: 'en', de: 'eine' }, { sv: 'runda', de: 'Runde' }, { sv: 'till', de: 'noch' }], chunkIds: ['c-enrundatill'] },
  { id: 's-enrundatill2', level: 1, sv: 'Bra spelat! En runda till?', de: 'Gut gespielt! Noch eine Runde?', decoding: [{ sv: 'bra', de: 'gut' }, { sv: 'spelat', de: 'gespielt' }, { sv: 'en', de: 'eine' }, { sv: 'runda', de: 'Runde' }, { sv: 'till', de: 'noch' }], chunkIds: ['c-enrundatill', 'c-braspelat'] },
  { id: 's-braspelat1', level: 1, sv: 'Bra spelat!', de: 'Gut gespielt!', decoding: [{ sv: 'bra', de: 'gut' }, { sv: 'spelat', de: 'gespielt' }], chunkIds: ['c-braspelat'] },
  { id: 's-braspelat2', level: 1, sv: 'Tack, bra spelat allihop.', de: 'Danke, gut gespielt zusammen.', decoding: [{ sv: 'tack', de: 'danke' }, { sv: 'bra', de: 'gut' }, { sv: 'spelat', de: 'gespielt' }, { sv: 'allihop', de: 'alle zusammen' }], chunkIds: ['c-braspelat'] },
  { id: 's-jagarmed1', level: 1, sv: 'Jag är med!', de: 'Ich bin dabei!', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'är', de: 'bin' }, { sv: 'med', de: 'mit' }], chunkIds: ['c-jagarmed'] },
  { id: 's-jagarmed2', level: 1, sv: 'Absolut, jag är med.', de: 'Auf jeden Fall, ich bin dabei.', decoding: [{ sv: 'absolut', de: 'absolut' }, { sv: 'jag', de: 'ich' }, { sv: 'är', de: 'bin' }, { sv: 'med', de: 'mit' }], chunkIds: ['c-jagarmed'] },
  { id: 's-vantalite1', level: 1, sv: 'Vänta lite!', de: 'Warte kurz!', decoding: [{ sv: 'vänta', de: 'warte' }, { sv: 'lite', de: 'wenig' }], chunkIds: ['c-vantalite'] },
  { id: 's-vantalite2', level: 1, sv: 'Vänta lite, jag kommer.', de: 'Warte kurz, ich komme.', decoding: [{ sv: 'vänta', de: 'warte' }, { sv: 'lite', de: 'wenig' }, { sv: 'jag', de: 'ich' }, { sv: 'kommer', de: 'komme' }], chunkIds: ['c-vantalite'] },
  { id: 's-skickalank1', level: 1, sv: 'Kan du skicka en länk?', de: 'Kannst du einen Link schicken?', decoding: [{ sv: 'kan', de: 'kannst' }, { sv: 'du', de: 'du' }, { sv: 'skicka', de: 'schicken' }, { sv: 'en', de: 'einen' }, { sv: 'länk', de: 'Link' }], chunkIds: ['c-skickalank'] },
  { id: 's-skickalank2', level: 1, sv: 'Kan du skicka en länk, tack?', de: 'Kannst du einen Link schicken, bitte?', decoding: [{ sv: 'kan', de: 'kannst' }, { sv: 'du', de: 'du' }, { sv: 'skicka', de: 'schicken' }, { sv: 'en', de: 'einen' }, { sv: 'länk', de: 'Link' }, { sv: 'tack', de: 'bitte' }], chunkIds: ['c-skickalank'] },
  { id: 's-vilketspel1', level: 1, sv: 'Vilket spel spelar du?', de: 'Welches Spiel spielst du?', decoding: [{ sv: 'vilket', de: 'welches' }, { sv: 'spel', de: 'Spiel' }, { sv: 'spelar', de: 'spielst' }, { sv: 'du', de: 'du' }], chunkIds: ['c-vilketspel'] },
  { id: 's-vilketspel2', level: 1, sv: 'Hej! Vilket spel spelar du?', de: 'Hallo! Welches Spiel spielst du?', decoding: [{ sv: 'hej', de: 'hallo' }, { sv: 'vilket', de: 'welches' }, { sv: 'spel', de: 'Spiel' }, { sv: 'spelar', de: 'spielst' }, { sv: 'du', de: 'du' }], chunkIds: ['c-vilketspel'] },
  { id: 's-fiskar1', level: 1, sv: 'Jag fiskar varje lördag.', de: 'Ich angle jeden Samstag.', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'fiskar', de: 'angle' }, { sv: 'varje', de: 'jeden' }, { sv: 'lördag', de: 'Samstag' }], chunkIds: ['c-fiskar'] },
  { id: 's-fiskar2', level: 1, sv: 'Hej! Jag fiskar här ofta.', de: 'Hallo! Ich angle hier oft.', decoding: [{ sv: 'hej', de: 'hallo' }, { sv: 'jag', de: 'ich' }, { sv: 'fiskar', de: 'angle' }, { sv: 'här', de: 'hier' }, { sv: 'ofta', de: 'oft' }], chunkIds: ['c-fiskar'] },
  { id: 's-nappar1', level: 1, sv: 'Nappar det?', de: 'Beißt was?', decoding: [{ sv: 'nappar', de: 'beißt' }, { sv: 'det', de: 'es' }], chunkIds: ['c-nappar'] },
  { id: 's-nappar2', level: 1, sv: 'Hej, nappar det idag?', de: 'Hallo, beißt heute was?', decoding: [{ sv: 'hej', de: 'hallo' }, { sv: 'nappar', de: 'beißt' }, { sv: 'det', de: 'es' }, { sv: 'idag', de: 'heute' }], chunkIds: ['c-nappar'] },
  { id: 's-vilkenfisk1', level: 1, sv: 'Vilken fisk är det?', de: 'Was für ein Fisch ist das?', decoding: [{ sv: 'vilken', de: 'welcher' }, { sv: 'fisk', de: 'Fisch' }, { sv: 'är', de: 'ist' }, { sv: 'det', de: 'das' }], chunkIds: ['c-vilkenfisk'] },
  { id: 's-vilkenfisk2', level: 1, sv: 'Titta! Vilken fisk är det?', de: 'Schau! Was für ein Fisch ist das?', decoding: [{ sv: 'titta', de: 'schau' }, { sv: 'vilken', de: 'welcher' }, { sv: 'fisk', de: 'Fisch' }, { sv: 'är', de: 'ist' }, { sv: 'det', de: 'das' }], chunkIds: ['c-vilkenfisk'] },
  { id: 's-storfisk1', level: 1, sv: 'Vilken stor fisk!', de: 'Was für ein großer Fisch!', decoding: [{ sv: 'vilken', de: 'welcher' }, { sv: 'stor', de: 'großer' }, { sv: 'fisk', de: 'Fisch' }], chunkIds: ['c-storfisk'] },
  { id: 's-storfisk2', level: 1, sv: 'Wow, vilken stor fisk!', de: 'Wow, was für ein großer Fisch!', decoding: [{ sv: 'wow', de: 'wow' }, { sv: 'vilken', de: 'welcher' }, { sv: 'stor', de: 'großer' }, { sv: 'fisk', de: 'Fisch' }], chunkIds: ['c-storfisk'] },
  { id: 's-lugnt1', level: 1, sv: 'Vattnet är lugnt idag.', de: 'Das Wasser ist heute ruhig.', decoding: [{ sv: 'vattnet', de: 'das Wasser' }, { sv: 'är', de: 'ist' }, { sv: 'lugnt', de: 'ruhig' }, { sv: 'idag', de: 'heute' }], chunkIds: ['c-lugntvatten'] },
  { id: 's-lugnt2', level: 1, sv: 'Bra, vattnet är lugnt idag.', de: 'Gut, das Wasser ist heute ruhig.', decoding: [{ sv: 'bra', de: 'gut' }, { sv: 'vattnet', de: 'das Wasser' }, { sv: 'är', de: 'ist' }, { sv: 'lugnt', de: 'ruhig' }, { sv: 'idag', de: 'heute' }], chunkIds: ['c-lugntvatten'] },
  { id: 's-lyckatill1', level: 1, sv: 'Lycka till!', de: 'Viel Erfolg!', decoding: [{ sv: 'lycka till', de: 'viel Erfolg' }], chunkIds: ['c-lyckatill'] },
  { id: 's-lyckatill2', level: 1, sv: 'Vi ses, lycka till!', de: 'Wir sehen uns, viel Erfolg!', decoding: [{ sv: 'vi', de: 'wir' }, { sv: 'ses', de: 'sehen uns' }, { sv: 'lycka till', de: 'viel Erfolg' }], chunkIds: ['c-lyckatill'] },
  { id: 's-vemspelar1', level: 1, sv: 'Vem spelar idag?', de: 'Wer spielt heute?', decoding: [{ sv: 'vem', de: 'wer' }, { sv: 'spelar', de: 'spielt' }, { sv: 'idag', de: 'heute' }], chunkIds: ['c-vemspelar'] },
  { id: 's-vemspelar2', level: 1, sv: 'Hej! Vem spelar idag?', de: 'Hallo! Wer spielt heute?', decoding: [{ sv: 'hej', de: 'hallo' }, { sv: 'vem', de: 'wer' }, { sv: 'spelar', de: 'spielt' }, { sv: 'idag', de: 'heute' }], chunkIds: ['c-vemspelar'] },
  { id: 's-mal1', level: 1, sv: 'Vilket mål!', de: 'Was für ein Tor!', decoding: [{ sv: 'vilket', de: 'welches' }, { sv: 'mål', de: 'Tor' }], chunkIds: ['c-mal'] },
  { id: 's-mal2', level: 1, sv: 'Ja! Vilket mål!', de: 'Ja! Was für ein Tor!', decoding: [{ sv: 'ja', de: 'ja' }, { sv: 'vilket', de: 'welches' }, { sv: 'mål', de: 'Tor' }], chunkIds: ['c-mal'] },
  { id: 's-hurstar1', level: 1, sv: 'Hur står det?', de: 'Wie steht es?', decoding: [{ sv: 'hur', de: 'wie' }, { sv: 'står', de: 'steht' }, { sv: 'det', de: 'es' }], chunkIds: ['c-hurstardet'] },
  { id: 's-hurstar2', level: 1, sv: 'Ursäkta, hur står det?', de: 'Entschuldigung, wie steht es?', decoding: [{ sv: 'ursäkta', de: 'entschuldige' }, { sv: 'hur', de: 'wie' }, { sv: 'står', de: 'steht' }, { sv: 'det', de: 'es' }], chunkIds: ['c-hurstardet'] },
  { id: 's-under1', level: 1, sv: 'Vi ligger under.', de: 'Wir liegen zurück.', decoding: [{ sv: 'vi', de: 'wir' }, { sv: 'ligger', de: 'liegen' }, { sv: 'under', de: 'unter' }], chunkIds: ['c-vihalleross'] },
  { id: 's-under2', level: 1, sv: 'Tyvärr, vi ligger under.', de: 'Leider liegen wir zurück.', decoding: [{ sv: 'tyvärr', de: 'leider' }, { sv: 'vi', de: 'wir' }, { sv: 'ligger', de: 'liegen' }, { sv: 'under', de: 'unter' }], chunkIds: ['c-vihalleross'] },
  { id: 's-matchen1', level: 1, sv: 'Matchen börjar klockan sju.', de: 'Das Spiel beginnt um sieben.', decoding: [{ sv: 'matchen', de: 'das Spiel' }, { sv: 'börjar', de: 'beginnt' }, { sv: 'klockan', de: 'die Uhr' }, { sv: 'sju', de: 'sieben' }], chunkIds: ['c-matchen'] },
  { id: 's-matchen2', level: 1, sv: 'Kom, matchen börjar klockan sju!', de: 'Komm, das Spiel beginnt um sieben!', decoding: [{ sv: 'kom', de: 'komm' }, { sv: 'matchen', de: 'das Spiel' }, { sv: 'börjar', de: 'beginnt' }, { sv: 'klockan', de: 'die Uhr' }, { sv: 'sju', de: 'sieben' }], chunkIds: ['c-matchen'] },
  { id: 's-heja1', level: 1, sv: 'Heja!', de: 'Los!', decoding: [{ sv: 'heja', de: 'los' }], chunkIds: ['c-heja'] },
  { id: 's-heja2', level: 1, sv: 'Heja, heja!', de: 'Los, los!', decoding: [{ sv: 'heja', de: 'los' }, { sv: 'heja', de: 'los' }], chunkIds: ['c-heja'] },
  { id: 's-tranar1', level: 1, sv: 'Jag tränar tre gånger i veckan.', de: 'Ich trainiere dreimal die Woche.', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'tränar', de: 'trainiere' }, { sv: 'tre', de: 'drei' }, { sv: 'gånger', de: 'Mal' }, { sv: 'i', de: 'in' }, { sv: 'veckan', de: 'der Woche' }], chunkIds: ['c-jagtranar'] },
  { id: 's-tranar2', level: 1, sv: 'Just nu tränar jag tre gånger i veckan.', de: 'Zurzeit trainiere ich dreimal die Woche.', decoding: [{ sv: 'just', de: 'gerade' }, { sv: 'nu', de: 'jetzt' }, { sv: 'tränar', de: 'trainiere' }, { sv: 'jag', de: 'ich' }, { sv: 'tre', de: 'drei' }, { sv: 'gånger', de: 'Mal' }, { sv: 'i', de: 'in' }, { sv: 'veckan', de: 'der Woche' }], chunkIds: ['c-jagtranar'] },
  { id: 's-springa1', level: 1, sv: 'Ska vi springa?', de: 'Wollen wir laufen gehen?', decoding: [{ sv: 'ska', de: 'sollen' }, { sv: 'vi', de: 'wir' }, { sv: 'springa', de: 'laufen' }], chunkIds: ['c-skavispringa'] },
  { id: 's-springa2', level: 1, sv: 'Ska vi springa imorgon?', de: 'Wollen wir morgen laufen gehen?', decoding: [{ sv: 'ska', de: 'sollen' }, { sv: 'vi', de: 'wir' }, { sv: 'springa', de: 'laufen' }, { sv: 'imorgon', de: 'morgen' }], chunkIds: ['c-skavispringa'] },
  { id: 's-trott1', level: 1, sv: 'Jag är trött.', de: 'Ich bin müde.', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'är', de: 'bin' }, { sv: 'trött', de: 'müde' }], chunkIds: ['c-jagartrott'] },
  { id: 's-trott2', level: 1, sv: 'Oj, jag är trött nu.', de: 'Oh, ich bin jetzt müde.', decoding: [{ sv: 'oj', de: 'oh' }, { sv: 'jag', de: 'ich' }, { sv: 'är', de: 'bin' }, { sv: 'trött', de: 'müde' }, { sv: 'nu', de: 'jetzt' }], chunkIds: ['c-jagartrott'] },
  { id: 's-form1', level: 1, sv: 'Du är i bra form!', de: 'Du bist gut in Form!', decoding: [{ sv: 'du', de: 'du' }, { sv: 'är', de: 'bist' }, { sv: 'i', de: 'in' }, { sv: 'bra', de: 'guter' }, { sv: 'form', de: 'Form' }], chunkIds: ['c-braformad'] },
  { id: 's-form2', level: 1, sv: 'Bra jobbat, du är i bra form.', de: 'Gut gemacht, du bist gut in Form.', decoding: [{ sv: 'bra', de: 'gut' }, { sv: 'jobbat', de: 'gearbeitet' }, { sv: 'du', de: 'du' }, { sv: 'är', de: 'bist' }, { sv: 'i', de: 'in' }, { sv: 'bra', de: 'guter' }, { sv: 'form', de: 'Form' }], chunkIds: ['c-braformad'] },
  { id: 's-engang1', level: 1, sv: 'En gång till!', de: 'Noch einmal!', decoding: [{ sv: 'en', de: 'ein' }, { sv: 'gång', de: 'Mal' }, { sv: 'till', de: 'noch' }], chunkIds: ['c-engangtill'] },
  { id: 's-engang2', level: 1, sv: 'Kom igen, en gång till!', de: 'Komm schon, noch einmal!', decoding: [{ sv: 'kom', de: 'komm' }, { sv: 'igen', de: 'wieder' }, { sv: 'en', de: 'ein' }, { sv: 'gång', de: 'Mal' }, { sv: 'till', de: 'noch' }], chunkIds: ['c-engangtill'] },
  { id: 's-vandra1', level: 1, sv: 'Ska vi vandra i skogen?', de: 'Wollen wir im Wald wandern?', decoding: [{ sv: 'ska', de: 'sollen' }, { sv: 'vi', de: 'wir' }, { sv: 'vandra', de: 'wandern' }, { sv: 'i', de: 'in' }, { sv: 'skogen', de: 'dem Wald' }], chunkIds: ['c-vandra'] },
  { id: 's-vandra2', level: 1, sv: 'Ska vi vandra i skogen i helgen?', de: 'Wollen wir am Wochenende im Wald wandern?', decoding: [{ sv: 'ska', de: 'sollen' }, { sv: 'vi', de: 'wir' }, { sv: 'vandra', de: 'wandern' }, { sv: 'i', de: 'in' }, { sv: 'skogen', de: 'dem Wald' }, { sv: 'i', de: 'in' }, { sv: 'helgen', de: 'dem Wochenende' }], chunkIds: ['c-vandra'] },
  { id: 's-utsikt1', level: 1, sv: 'Vilken vacker utsikt!', de: 'Was für eine schöne Aussicht!', decoding: [{ sv: 'vilken', de: 'welche' }, { sv: 'vacker', de: 'schöne' }, { sv: 'utsikt', de: 'Aussicht' }], chunkIds: ['c-vackerutsikt'] },
  { id: 's-utsikt2', level: 1, sv: 'Titta, vilken vacker utsikt!', de: 'Schau, was für eine schöne Aussicht!', decoding: [{ sv: 'titta', de: 'schau' }, { sv: 'vilken', de: 'welche' }, { sv: 'vacker', de: 'schöne' }, { sv: 'utsikt', de: 'Aussicht' }], chunkIds: ['c-vackerutsikt'] },
  { id: 's-solen1', level: 1, sv: 'Solen skiner.', de: 'Die Sonne scheint.', decoding: [{ sv: 'solen', de: 'die Sonne' }, { sv: 'skiner', de: 'scheint' }], chunkIds: ['c-solenskiner'] },
  { id: 's-solen2', level: 1, sv: 'Idag skiner solen.', de: 'Heute scheint die Sonne.', decoding: [{ sv: 'idag', de: 'heute' }, { sv: 'skiner', de: 'scheint' }, { sv: 'solen', de: 'die Sonne' }], chunkIds: ['c-solenskiner'] },
  { id: 's-sovaute1', level: 1, sv: 'Vi sover ute i natt.', de: 'Wir schlafen heute Nacht draußen.', decoding: [{ sv: 'vi', de: 'wir' }, { sv: 'sover', de: 'schlafen' }, { sv: 'ute', de: 'draußen' }, { sv: 'i', de: 'in' }, { sv: 'natt', de: 'Nacht' }], chunkIds: ['c-sovaute'] },
  { id: 's-sovaute2', level: 1, sv: 'Om det är fint väder sover vi ute i natt.', de: 'Wenn das Wetter schön ist, schlafen wir heute Nacht draußen.', decoding: [{ sv: 'om', de: 'wenn' }, { sv: 'det', de: 'es' }, { sv: 'är', de: 'ist' }, { sv: 'fint', de: 'schönes' }, { sv: 'väder', de: 'Wetter' }, { sv: 'sover', de: 'schlafen' }, { sv: 'vi', de: 'wir' }, { sv: 'ute', de: 'draußen' }, { sv: 'i', de: 'in' }, { sv: 'natt', de: 'Nacht' }], chunkIds: ['c-sovaute'] },
  { id: 's-kallt1', level: 1, sv: 'Det är kallt ute.', de: 'Es ist kalt draußen.', decoding: [{ sv: 'det', de: 'es' }, { sv: 'är', de: 'ist' }, { sv: 'kallt', de: 'kalt' }, { sv: 'ute', de: 'draußen' }], chunkIds: ['c-kallt'] },
  { id: 's-kallt2', level: 1, sv: 'Ta en jacka, det är kallt ute.', de: 'Nimm eine Jacke, es ist kalt draußen.', decoding: [{ sv: 'ta', de: 'nimm' }, { sv: 'en', de: 'eine' }, { sv: 'jacka', de: 'Jacke' }, { sv: 'det', de: 'es' }, { sv: 'är', de: 'ist' }, { sv: 'kallt', de: 'kalt' }, { sv: 'ute', de: 'draußen' }], chunkIds: ['c-kallt'] },

  // ── Ausbau 2026-07-25 ─────────────────────────────────────────────────
  // c-vilketvader
  { id: 's-vilketvader1', level: 1, sv: 'Vilket väder! Solen skiner hela dagen.', de: 'Was für ein Wetter! Die Sonne scheint den ganzen Tag.', decoding: [{ sv: 'vilket', de: 'welches' }, { sv: 'väder', de: 'Wetter' }, { sv: 'solen', de: 'die Sonne' }, { sv: 'skiner', de: 'scheint' }, { sv: 'hela', de: 'den ganzen' }, { sv: 'dagen', de: 'Tag' }], chunkIds: ['c-vilketvader'] },
  { id: 's-vilketvader2', level: 1, sv: 'Vilket väder! Det regnar igen.', de: 'Was für ein Wetter! Es regnet schon wieder.', decoding: [{ sv: 'vilket', de: 'welches' }, { sv: 'väder', de: 'Wetter' }, { sv: 'det', de: 'es' }, { sv: 'regnar', de: 'regnet' }, { sv: 'igen', de: 'wieder' }], chunkIds: ['c-vilketvader'] },
  // c-blasermycket
  { id: 's-blasermycket1', level: 1, sv: 'Det blåser mycket idag.', de: 'Es ist heute sehr windig.', decoding: [{ sv: 'det', de: 'es' }, { sv: 'blåser', de: 'weht' }, { sv: 'mycket', de: 'viel' }, { sv: 'idag', de: 'heute' }], chunkIds: ['c-blasermycket'] },
  { id: 's-blasermycket2', level: 1, sv: 'Ta en jacka, det blåser mycket.', de: 'Nimm eine Jacke, es ist sehr windig.', decoding: [{ sv: 'ta', de: 'nimm' }, { sv: 'en', de: 'eine' }, { sv: 'jacka', de: 'Jacke' }, { sv: 'det', de: 'es' }, { sv: 'blåser', de: 'weht' }, { sv: 'mycket', de: 'viel' }], chunkIds: ['c-blasermycket'] },
  // c-blirsoligt
  { id: 's-blirsoligt1', level: 1, sv: 'Imorgon blir det soligt igen.', de: 'Morgen wird es wieder sonnig.', decoding: [{ sv: 'imorgon', de: 'morgen' }, { sv: 'blir', de: 'wird' }, { sv: 'det', de: 'es' }, { sv: 'soligt', de: 'sonnig' }, { sv: 'igen', de: 'wieder' }], chunkIds: ['c-blirsoligt'] },
  { id: 's-blirsoligt2', level: 1, sv: 'Imorgon blir det soligt, säger de.', de: 'Morgen wird es sonnig, sagen sie.', decoding: [{ sv: 'imorgon', de: 'morgen' }, { sv: 'blir', de: 'wird' }, { sv: 'det', de: 'es' }, { sv: 'soligt', de: 'sonnig' }, { sv: 'säger', de: 'sagen' }, { sv: 'de', de: 'sie' }], chunkIds: ['c-blirsoligt'] },
  // c-tamedparaply
  { id: 's-tamedparaply1', level: 1, sv: 'Ta med paraply, det regnar snart.', de: 'Nimm einen Schirm mit, es regnet bald.', decoding: [{ sv: 'ta', de: 'nimm' }, { sv: 'med', de: 'mit' }, { sv: 'paraply', de: 'Regenschirm' }, { sv: 'det', de: 'es' }, { sv: 'regnar', de: 'regnet' }, { sv: 'snart', de: 'bald' }], chunkIds: ['c-tamedparaply'] },
  { id: 's-tamedparaply2', level: 1, sv: 'Ta med paraply idag.', de: 'Nimm heute einen Schirm mit.', decoding: [{ sv: 'ta', de: 'nimm' }, { sv: 'med', de: 'mit' }, { sv: 'paraply', de: 'Regenschirm' }, { sv: 'idag', de: 'heute' }], chunkIds: ['c-tamedparaply'] },
  // c-molnigt
  { id: 's-molnigt1', level: 1, sv: 'Det är molnigt idag, men varmt.', de: 'Es ist heute bewölkt, aber warm.', decoding: [{ sv: 'det', de: 'es' }, { sv: 'är', de: 'ist' }, { sv: 'molnigt', de: 'wolkig' }, { sv: 'idag', de: 'heute' }, { sv: 'men', de: 'aber' }, { sv: 'varmt', de: 'warm' }], chunkIds: ['c-molnigt'] },
  { id: 's-molnigt2', level: 1, sv: 'Det är molnigt idag igen.', de: 'Es ist heute schon wieder bewölkt.', decoding: [{ sv: 'det', de: 'es' }, { sv: 'är', de: 'ist' }, { sv: 'molnigt', de: 'wolkig' }, { sv: 'idag', de: 'heute' }, { sv: 'igen', de: 'wieder' }], chunkIds: ['c-molnigt'] },
  // c-varmtinne
  { id: 's-varmtinne1', level: 1, sv: 'Kom in, det är varmt inne.', de: 'Komm rein, drinnen ist es warm.', decoding: [{ sv: 'kom', de: 'komm' }, { sv: 'in', de: 'herein' }, { sv: 'det', de: 'es' }, { sv: 'är', de: 'ist' }, { sv: 'varmt', de: 'warm' }, { sv: 'inne', de: 'drinnen' }], chunkIds: ['c-varmtinne'] },
  { id: 's-varmtinne2', level: 1, sv: 'Det är kallt ute men det är varmt inne.', de: 'Draußen ist es kalt, aber drinnen ist es warm.', decoding: [{ sv: 'det', de: 'es' }, { sv: 'är', de: 'ist' }, { sv: 'kallt', de: 'kalt' }, { sv: 'ute', de: 'draußen' }, { sv: 'men', de: 'aber' }, { sv: 'det', de: 'es' }, { sv: 'är', de: 'ist' }, { sv: 'varmt', de: 'warm' }, { sv: 'inne', de: 'drinnen' }], chunkIds: ['c-varmtinne'] },
  // c-borilagenhet
  { id: 's-borilagenhet1', level: 1, sv: 'Jag bor i en lägenhet i stan.', de: 'Ich wohne in einer Wohnung in der Stadt.', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'bor', de: 'wohne' }, { sv: 'i', de: 'in' }, { sv: 'en', de: 'einer' }, { sv: 'lägenhet', de: 'Wohnung' }, { sv: 'i', de: 'in' }, { sv: 'stan', de: 'der Stadt' }], chunkIds: ['c-borilagenhet'] },
  { id: 's-borilagenhet2', level: 1, sv: 'Jag bor i en lägenhet med två rum.', de: 'Ich wohne in einer Wohnung mit zwei Zimmern.', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'bor', de: 'wohne' }, { sv: 'i', de: 'in' }, { sv: 'en', de: 'einer' }, { sv: 'lägenhet', de: 'Wohnung' }, { sv: 'med', de: 'mit' }, { sv: 'två', de: 'zwei' }, { sv: 'rum', de: 'Zimmer' }], chunkIds: ['c-borilagenhet'] },
  // c-hurmangarum
  { id: 's-hurmangarum1', level: 1, sv: 'Fin lägenhet! Hur många rum har du?', de: 'Schöne Wohnung! Wie viele Zimmer hast du?', decoding: [{ sv: 'fin', de: 'schöne' }, { sv: 'lägenhet', de: 'Wohnung' }, { sv: 'hur', de: 'wie' }, { sv: 'många', de: 'viele' }, { sv: 'rum', de: 'Zimmer' }, { sv: 'har', de: 'hast' }, { sv: 'du', de: 'du' }], chunkIds: ['c-hurmangarum'] },
  { id: 's-hurmangarum2', level: 1, sv: 'Hur många rum har du hemma?', de: 'Wie viele Zimmer hast du zu Hause?', decoding: [{ sv: 'hur', de: 'wie' }, { sv: 'många', de: 'viele' }, { sv: 'rum', de: 'Zimmer' }, { sv: 'har', de: 'hast' }, { sv: 'du', de: 'du' }, { sv: 'hemma', de: 'zu Hause' }], chunkIds: ['c-hurmangarum'] },
  // c-koketlitet
  { id: 's-koketlitet1', level: 1, sv: 'Köket är litet men fint.', de: 'Die Küche ist klein, aber schön.', decoding: [{ sv: 'köket', de: 'die Küche' }, { sv: 'är', de: 'ist' }, { sv: 'litet', de: 'klein' }, { sv: 'men', de: 'aber' }, { sv: 'fint', de: 'schön' }], chunkIds: ['c-koketlitet'] },
  { id: 's-koketlitet2', level: 1, sv: 'Köket är litet, men det räcker.', de: 'Die Küche ist klein, aber es reicht.', decoding: [{ sv: 'köket', de: 'die Küche' }, { sv: 'är', de: 'ist' }, { sv: 'litet', de: 'klein' }, { sv: 'men', de: 'aber' }, { sv: 'det', de: 'es' }, { sv: 'räcker', de: 'reicht' }], chunkIds: ['c-koketlitet'] },
  // c-bormedkompis
  { id: 's-bormedkompis1', level: 1, sv: 'Jag bor med en kompis från jobbet.', de: 'Ich wohne mit einem Kumpel von der Arbeit.', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'bor', de: 'wohne' }, { sv: 'med', de: 'mit' }, { sv: 'en', de: 'einem' }, { sv: 'kompis', de: 'Kumpel' }, { sv: 'från', de: 'von' }, { sv: 'jobbet', de: 'der Arbeit' }], chunkIds: ['c-bormedkompis'] },
  { id: 's-bormedkompis2', level: 1, sv: 'Jag bor med en kompis, det är billigare.', de: 'Ich wohne mit einem Kumpel, das ist billiger.', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'bor', de: 'wohne' }, { sv: 'med', de: 'mit' }, { sv: 'en', de: 'einem' }, { sv: 'kompis', de: 'Kumpel' }, { sv: 'det', de: 'das' }, { sv: 'är', de: 'ist' }, { sv: 'billigare', de: 'billiger' }], chunkIds: ['c-bormedkompis'] },
  // c-hyranhog
  { id: 's-hyranhog1', level: 1, sv: 'Hyran är hög i stan.', de: 'Die Miete ist hoch in der Stadt.', decoding: [{ sv: 'hyran', de: 'die Miete' }, { sv: 'är', de: 'ist' }, { sv: 'hög', de: 'hoch' }, { sv: 'i', de: 'in' }, { sv: 'stan', de: 'der Stadt' }], chunkIds: ['c-hyranhog'] },
  { id: 's-hyranhog2', level: 1, sv: 'Lägenheten är fin men hyran är hög.', de: 'Die Wohnung ist schön, aber die Miete ist hoch.', decoding: [{ sv: 'lägenheten', de: 'die Wohnung' }, { sv: 'är', de: 'ist' }, { sv: 'fin', de: 'schön' }, { sv: 'men', de: 'aber' }, { sv: 'hyran', de: 'die Miete' }, { sv: 'är', de: 'ist' }, { sv: 'hög', de: 'hoch' }], chunkIds: ['c-hyranhog'] },
  // c-valkommenin
  { id: 's-valkommenin1', level: 1, sv: 'Hej! Välkommen in.', de: 'Hallo! Komm herein.', decoding: [{ sv: 'hej', de: 'hallo' }, { sv: 'välkommen', de: 'willkommen' }, { sv: 'in', de: 'herein' }], chunkIds: ['c-valkommenin'] },
  { id: 's-valkommenin2', level: 1, sv: 'Välkommen in, ta av dig skorna.', de: 'Komm herein, zieh die Schuhe aus.', decoding: [{ sv: 'välkommen', de: 'willkommen' }, { sv: 'in', de: 'herein' }, { sv: 'ta', de: 'nimm' }, { sv: 'av', de: 'ab' }, { sv: 'dig', de: 'dich' }, { sv: 'skorna', de: 'die Schuhe' }], chunkIds: ['c-valkommenin'] },
  // c-vadjobbardu
  { id: 's-vadjobbardu1', level: 1, sv: 'Jag har mycket att göra idag.', de: 'Ich habe heute viel zu tun.', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'har', de: 'habe' }, { sv: 'mycket', de: 'viel' }, { sv: 'att', de: 'zu' }, { sv: 'göra', de: 'tun' }, { sv: 'idag', de: 'heute' }], chunkIds: ['c-vadjobbardu'] },
  { id: 's-vadjobbardu2', level: 1, sv: 'Förlåt, jag har mycket att göra.', de: 'Entschuldige, ich habe viel zu tun.', decoding: [{ sv: 'förlåt', de: 'verzeih' }, { sv: 'jag', de: 'ich' }, { sv: 'har', de: 'habe' }, { sv: 'mycket', de: 'viel' }, { sv: 'att', de: 'zu' }, { sv: 'göra', de: 'tun' }], chunkIds: ['c-vadjobbardu'] },
  // c-jobbarpakontor
  { id: 's-jobbarpakontor1', level: 1, sv: 'Jag jobbar på ett kontor i stan.', de: 'Ich arbeite in einem Büro in der Stadt.', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'jobbar', de: 'arbeite' }, { sv: 'på', de: 'auf' }, { sv: 'ett', de: 'einem' }, { sv: 'kontor', de: 'Büro' }, { sv: 'i', de: 'in' }, { sv: 'stan', de: 'der Stadt' }], chunkIds: ['c-jobbarpakontor'] },
  { id: 's-jobbarpakontor2', level: 1, sv: 'Jag jobbar på ett kontor, det är lugnt.', de: 'Ich arbeite in einem Büro, es ist ruhig.', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'jobbar', de: 'arbeite' }, { sv: 'på', de: 'auf' }, { sv: 'ett', de: 'einem' }, { sv: 'kontor', de: 'Büro' }, { sv: 'det', de: 'es' }, { sv: 'är', de: 'ist' }, { sv: 'lugnt', de: 'ruhig' }], chunkIds: ['c-jobbarpakontor'] },
  // c-ledigidag
  { id: 's-ledigidag1', level: 1, sv: 'Jag är ledig idag, vi kan ses.', de: 'Ich habe heute frei, wir können uns sehen.', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'är', de: 'bin' }, { sv: 'ledig', de: 'frei' }, { sv: 'idag', de: 'heute' }, { sv: 'vi', de: 'wir' }, { sv: 'kan', de: 'können' }, { sv: 'ses', de: 'sehen' }], chunkIds: ['c-ledigidag'] },
  { id: 's-ledigidag2', level: 1, sv: 'Jag är ledig idag och imorgon.', de: 'Ich habe heute und morgen frei.', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'är', de: 'bin' }, { sv: 'ledig', de: 'frei' }, { sv: 'idag', de: 'heute' }, { sv: 'och', de: 'und' }, { sv: 'imorgon', de: 'morgen' }], chunkIds: ['c-ledigidag'] },
  // c-motetborjar
  { id: 's-motetborjar1', level: 1, sv: 'Mötet börjar klockan nio imorgon.', de: 'Das Treffen beginnt morgen um neun.', decoding: [{ sv: 'mötet', de: 'das Treffen' }, { sv: 'börjar', de: 'beginnt' }, { sv: 'klockan', de: 'die Uhr' }, { sv: 'nio', de: 'neun' }, { sv: 'imorgon', de: 'morgen' }], chunkIds: ['c-motetborjar'] },
  { id: 's-motetborjar2', level: 1, sv: 'Kom i tid, mötet börjar klockan nio.', de: 'Komm pünktlich, das Treffen beginnt um neun.', decoding: [{ sv: 'kom', de: 'komm' }, { sv: 'i', de: 'in' }, { sv: 'tid', de: 'Zeit' }, { sv: 'mötet', de: 'das Treffen' }, { sv: 'börjar', de: 'beginnt' }, { sv: 'klockan', de: 'die Uhr' }, { sv: 'nio', de: 'neun' }], chunkIds: ['c-motetborjar'] },
  // c-bokaettmote
  { id: 's-bokaettmote1', level: 1, sv: 'Kan vi boka ett möte på fredag?', de: 'Können wir einen Termin am Freitag machen?', decoding: [{ sv: 'kan', de: 'können' }, { sv: 'vi', de: 'wir' }, { sv: 'boka', de: 'buchen' }, { sv: 'ett', de: 'ein' }, { sv: 'möte', de: 'Treffen' }, { sv: 'på', de: 'auf' }, { sv: 'fredag', de: 'Freitag' }], chunkIds: ['c-bokaettmote'] },
  { id: 's-bokaettmote2', level: 1, sv: 'Hej, kan vi boka ett möte?', de: 'Hallo, können wir einen Termin machen?', decoding: [{ sv: 'hej', de: 'hallo' }, { sv: 'kan', de: 'können' }, { sv: 'vi', de: 'wir' }, { sv: 'boka', de: 'buchen' }, { sv: 'ett', de: 'ein' }, { sv: 'möte', de: 'Treffen' }], chunkIds: ['c-bokaettmote'] },
  // c-skickarmejl
  { id: 's-skickarmejl1', level: 1, sv: 'Jag skickar ett mejl idag.', de: 'Ich schicke heute eine Mail.', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'skickar', de: 'schicke' }, { sv: 'ett', de: 'eine' }, { sv: 'mejl', de: 'Mail' }, { sv: 'idag', de: 'heute' }], chunkIds: ['c-skickarmejl'] },
  { id: 's-skickarmejl2', level: 1, sv: 'Jag skickar ett mejl med all information.', de: 'Ich schicke eine Mail mit allen Informationen.', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'skickar', de: 'schicke' }, { sv: 'ett', de: 'eine' }, { sv: 'mejl', de: 'Mail' }, { sv: 'med', de: 'mit' }, { sv: 'all', de: 'aller' }, { sv: 'information', de: 'Information' }], chunkIds: ['c-skickarmejl'] },
  // c-ringersenare
  { id: 's-ringersenare1', level: 1, sv: 'Jag ringer dig senare ikväll.', de: 'Ich rufe dich heute Abend später an.', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'ringer', de: 'rufe an' }, { sv: 'dig', de: 'dich' }, { sv: 'senare', de: 'später' }, { sv: 'ikväll', de: 'heute Abend' }], chunkIds: ['c-ringersenare'] },
  { id: 's-ringersenare2', level: 1, sv: 'Okej, jag ringer dig senare.', de: 'Okay, ich rufe dich später an.', decoding: [{ sv: 'okej', de: 'okay' }, { sv: 'jag', de: 'ich' }, { sv: 'ringer', de: 'rufe an' }, { sv: 'dig', de: 'dich' }, { sv: 'senare', de: 'später' }], chunkIds: ['c-ringersenare'] },
  // c-skickarmeddelande
  { id: 's-skickarmeddelande1', level: 1, sv: 'Jag skickar ett meddelande när jag är hemma.', de: 'Ich schicke eine Nachricht, wenn ich zu Hause bin.', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'skickar', de: 'schicke' }, { sv: 'ett', de: 'eine' }, { sv: 'meddelande', de: 'Nachricht' }, { sv: 'när', de: 'wenn' }, { sv: 'jag', de: 'ich' }, { sv: 'är', de: 'bin' }, { sv: 'hemma', de: 'zu Hause' }], chunkIds: ['c-skickarmeddelande'] },
  { id: 's-skickarmeddelande2', level: 1, sv: 'Jag skickar ett meddelande ikväll.', de: 'Ich schicke heute Abend eine Nachricht.', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'skickar', de: 'schicke' }, { sv: 'ett', de: 'eine' }, { sv: 'meddelande', de: 'Nachricht' }, { sv: 'ikväll', de: 'heute Abend' }], chunkIds: ['c-skickarmeddelande'] },
  // c-hordumig
  { id: 's-hordumig1', level: 1, sv: 'Hallå? Jag hör dig dåligt.', de: 'Hallo? Ich höre dich schlecht.', decoding: [{ sv: 'hallå', de: 'hallo' }, { sv: 'jag', de: 'ich' }, { sv: 'hör', de: 'höre' }, { sv: 'dig', de: 'dich' }, { sv: 'dåligt', de: 'schlecht' }], chunkIds: ['c-hordumig'] },
  { id: 's-hordumig2', level: 1, sv: 'Vänta, jag hör dig dåligt.', de: 'Warte, ich höre dich schlecht.', decoding: [{ sv: 'vänta', de: 'warte' }, { sv: 'jag', de: 'ich' }, { sv: 'hör', de: 'höre' }, { sv: 'dig', de: 'dich' }, { sv: 'dåligt', de: 'schlecht' }], chunkIds: ['c-hordumig'] },
  // c-daligtackning
  { id: 's-daligtackning1', level: 1, sv: 'Jag har dålig täckning här.', de: 'Ich habe hier schlechten Empfang.', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'har', de: 'habe' }, { sv: 'dålig', de: 'schlechte' }, { sv: 'täckning', de: 'Abdeckung' }, { sv: 'här', de: 'hier' }], chunkIds: ['c-daligtackning'] },
  { id: 's-daligtackning2', level: 1, sv: 'Vänta, jag har dålig täckning.', de: 'Warte, ich habe schlechten Empfang.', decoding: [{ sv: 'vänta', de: 'warte' }, { sv: 'jag', de: 'ich' }, { sv: 'har', de: 'habe' }, { sv: 'dålig', de: 'schlechte' }, { sv: 'täckning', de: 'Abdeckung' }], chunkIds: ['c-daligtackning'] },
  // c-vemardet
  { id: 's-vemardet1', level: 1, sv: 'Hej, vem är det?', de: 'Hallo, wer ist da?', decoding: [{ sv: 'hej', de: 'hallo' }, { sv: 'vem', de: 'wer' }, { sv: 'är', de: 'ist' }, { sv: 'det', de: 'das' }], chunkIds: ['c-vemardet'] },
  { id: 's-vemardet2', level: 1, sv: 'Vem är det som ringer?', de: 'Wer ruft da an?', decoding: [{ sv: 'vem', de: 'wer' }, { sv: 'är', de: 'ist' }, { sv: 'det', de: 'das' }, { sv: 'som', de: 'der' }, { sv: 'ringer', de: 'anruft' }], chunkIds: ['c-vemardet'] },
  // c-maste-lagga-pa
  { id: 's-maste-lagga-pa1', level: 1, sv: 'Jag måste lägga på nu, hej då.', de: 'Ich muss jetzt auflegen, tschüss.', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'måste', de: 'muss' }, { sv: 'lägga', de: 'legen' }, { sv: 'på', de: 'auf' }, { sv: 'nu', de: 'jetzt' }, { sv: 'hej', de: 'tschüss' }, { sv: 'då', de: 'dann' }], chunkIds: ['c-maste-lagga-pa'] },
  { id: 's-maste-lagga-pa2', level: 1, sv: 'Förlåt, jag måste lägga på.', de: 'Entschuldigung, ich muss auflegen.', decoding: [{ sv: 'förlåt', de: 'verzeih' }, { sv: 'jag', de: 'ich' }, { sv: 'måste', de: 'muss' }, { sv: 'lägga', de: 'legen' }, { sv: 'på', de: 'auf' }], chunkIds: ['c-maste-lagga-pa'] },
  // c-detsnoar
  { id: 's-detsnoar1', level: 1, sv: 'Titta, det snöar!', de: 'Schau, es schneit!', decoding: [{ sv: 'titta', de: 'schau' }, { sv: 'det', de: 'es' }, { sv: 'snöar', de: 'schneit' }], chunkIds: ['c-detsnoar'] },
  { id: 's-detsnoar2', level: 1, sv: 'Det snöar ute idag.', de: 'Es schneit heute draußen.', decoding: [{ sv: 'det', de: 'es' }, { sv: 'snöar', de: 'schneit' }, { sv: 'ute', de: 'draußen' }, { sv: 'idag', de: 'heute' }], chunkIds: ['c-detsnoar'] },
  // c-haltpavagen
  { id: 's-haltpavagen1', level: 1, sv: 'Kör försiktigt, det är halt på vägen.', de: 'Fahr vorsichtig, es ist glatt auf der Straße.', decoding: [{ sv: 'kör', de: 'fahr' }, { sv: 'försiktigt', de: 'vorsichtig' }, { sv: 'det', de: 'es' }, { sv: 'är', de: 'ist' }, { sv: 'halt', de: 'glatt' }, { sv: 'på', de: 'auf' }, { sv: 'vägen', de: 'dem Weg' }], chunkIds: ['c-haltpavagen'] },
  { id: 's-haltpavagen2', level: 1, sv: 'Det är halt på vägen idag.', de: 'Es ist heute glatt auf der Straße.', decoding: [{ sv: 'det', de: 'es' }, { sv: 'är', de: 'ist' }, { sv: 'halt', de: 'glatt' }, { sv: 'på', de: 'auf' }, { sv: 'vägen', de: 'dem Weg' }, { sv: 'idag', de: 'heute' }], chunkIds: ['c-haltpavagen'] },
  // c-jagfryser
  { id: 's-jagfryser1', level: 1, sv: 'Jag fryser, ska vi gå in?', de: 'Mir ist kalt, sollen wir reingehen?', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'fryser', de: 'friere' }, { sv: 'ska', de: 'sollen' }, { sv: 'vi', de: 'wir' }, { sv: 'gå', de: 'gehen' }, { sv: 'in', de: 'herein' }], chunkIds: ['c-jagfryser'] },
  { id: 's-jagfryser2', level: 1, sv: 'Jag fryser, det är kallt ute.', de: 'Mir ist kalt, es ist kalt draußen.', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'fryser', de: 'friere' }, { sv: 'det', de: 'es' }, { sv: 'är', de: 'ist' }, { sv: 'kallt', de: 'kalt' }, { sv: 'ute', de: 'draußen' }], chunkIds: ['c-jagfryser'] },
  // c-tapadigmossa
  { id: 's-tapadigmossa1', level: 1, sv: 'Ta på dig mössa, det är kallt.', de: 'Setz eine Mütze auf, es ist kalt.', decoding: [{ sv: 'ta', de: 'nimm' }, { sv: 'på', de: 'auf' }, { sv: 'dig', de: 'dich' }, { sv: 'mössa', de: 'Mütze' }, { sv: 'det', de: 'es' }, { sv: 'är', de: 'ist' }, { sv: 'kallt', de: 'kalt' }], chunkIds: ['c-tapadigmossa'] },
  { id: 's-tapadigmossa2', level: 1, sv: 'Ta på dig mössa innan vi går ut.', de: 'Setz eine Mütze auf, bevor wir rausgehen.', decoding: [{ sv: 'ta', de: 'nimm' }, { sv: 'på', de: 'auf' }, { sv: 'dig', de: 'dich' }, { sv: 'mössa', de: 'Mütze' }, { sv: 'innan', de: 'bevor' }, { sv: 'vi', de: 'wir' }, { sv: 'går', de: 'gehen' }, { sv: 'ut', de: 'hinaus' }], chunkIds: ['c-tapadigmossa'] },
  // c-akaskidor
  { id: 's-akaskidor1', level: 1, sv: 'Det är fin snö — ska vi åka skidor?', de: 'Es ist schöner Schnee — sollen wir Ski fahren?', decoding: [{ sv: 'det', de: 'es' }, { sv: 'är', de: 'ist' }, { sv: 'fin', de: 'schöner' }, { sv: 'snö', de: 'Schnee' }, { sv: 'ska', de: 'sollen' }, { sv: 'vi', de: 'wir' }, { sv: 'åka', de: 'fahren' }, { sv: 'skidor', de: 'Ski' }], chunkIds: ['c-akaskidor'] },
  { id: 's-akaskidor2', level: 1, sv: 'Ska vi åka skidor på lördag?', de: 'Sollen wir am Samstag Ski fahren?', decoding: [{ sv: 'ska', de: 'sollen' }, { sv: 'vi', de: 'wir' }, { sv: 'åka', de: 'fahren' }, { sv: 'skidor', de: 'Ski' }, { sv: 'på', de: 'auf' }, { sv: 'lördag', de: 'Samstag' }], chunkIds: ['c-akaskidor'] },
  // c-morkttidigt
  { id: 's-morkttidigt1', level: 1, sv: 'På vintern blir det mörkt tidigt.', de: 'Im Winter wird es früh dunkel.', decoding: [{ sv: 'på', de: 'auf' }, { sv: 'vintern', de: 'dem Winter' }, { sv: 'blir', de: 'wird' }, { sv: 'det', de: 'es' }, { sv: 'mörkt', de: 'dunkel' }, { sv: 'tidigt', de: 'früh' }], chunkIds: ['c-morkttidigt'] },
  { id: 's-morkttidigt2', level: 1, sv: 'Det blir mörkt tidigt nu.', de: 'Es wird jetzt früh dunkel.', decoding: [{ sv: 'det', de: 'es' }, { sv: 'blir', de: 'wird' }, { sv: 'mörkt', de: 'dunkel' }, { sv: 'tidigt', de: 'früh' }, { sv: 'nu', de: 'jetzt' }], chunkIds: ['c-morkttidigt'] },
];
