// SEED-DIALOGE (Dialog-Modus) — PROVISORISCH, wie der übrige Seed.
//
// ⚠️ EHRLICH: von uns/der KI verfasst, NICHT muttersprachlich geprüft
// (docs/content-review-schwedisch.md). Jede „du"-Zeile referenziert einen
// vorhandenen Chunk (c-*), damit das Gespräch echtes Können übt und in die
// Memory-Engine zurückfließt — kein separater Schein-Fortschritt.
//
// Partner-Zeilen sind verständlicher Input (i+1): ein paar neue Wörter sind ok,
// solange die Wort-für-Wort-Dekodierung (Birkenbihl) sie sofort verständlich macht.

import type { Dialog } from '../../domain/dialog';

export const seedDialogs: Dialog[] = [
  // ── Im Restaurant (cat-restaurant) ───────────────────────────────────────────
  {
    id: 'dlg-restaurant',
    categoryId: 'cat-restaurant',
    title: 'Im Restaurant: Tisch, bestellen, zahlen',
    blurb: 'Ein ganzes Essen auf Schwedisch — vom Tisch bis zur Rechnung.',
    scene: 'cafe',
    partnerName: 'Kellner',
    turns: [
      {
        id: 'r1',
        speaker: 'partner',
        sv: 'Hej och välkommen!',
        de: 'Hallo und willkommen!',
        listenFirst: true,
        decoding: [
          { sv: 'hej', de: 'hallo' },
          { sv: 'och', de: 'und' },
          { sv: 'välkommen', de: 'willkommen' },
        ],
      },
      {
        id: 'r2',
        speaker: 'partner',
        sv: 'Ett bord för två?',
        de: 'Ein Tisch für zwei?',
        decoding: [
          { sv: 'ett', de: 'ein' },
          { sv: 'bord', de: 'Tisch' },
          { sv: 'för', de: 'für' },
          { sv: 'två', de: 'zwei' },
        ],
      },
      {
        id: 'r3',
        speaker: 'you',
        sv: 'ja, tack',
        de: 'ja, bitte',
        chunkId: 'c-jatack',
        suggestions: ['Ja, tack.', 'Nej, tack.'],
      },
      {
        id: 'r4',
        speaker: 'partner',
        sv: 'Varsågod. Här är menyn.',
        de: 'Bitte. Hier ist die Karte.',
        decoding: [
          { sv: 'varsågod', de: 'bitte' },
          { sv: 'här', de: 'hier' },
          { sv: 'är', de: 'ist' },
          { sv: 'menyn', de: 'die Speisekarte' },
        ],
      },
      {
        id: 'r5',
        speaker: 'you',
        sv: 'vad rekommenderar du?',
        de: 'was empfiehlst du?',
        chunkId: 'c-rekommenderar',
        suggestions: ['Vad rekommenderar du?', 'Vad kostar det?'],
      },
      {
        id: 'r6',
        speaker: 'partner',
        sv: 'Jag rekommenderar köttbullar.',
        de: 'Ich empfehle Fleischbällchen.',
        decoding: [
          { sv: 'jag', de: 'ich' },
          { sv: 'rekommenderar', de: 'empfehle' },
          { sv: 'köttbullar', de: 'Fleischbällchen' },
        ],
      },
      {
        id: 'r7',
        speaker: 'you',
        sv: 'jag tar den här',
        de: 'ich nehme das hier',
        chunkId: 'c-tardenhar',
        suggestions: ['Jag tar den här.', 'Jag tar den.'],
      },
      {
        id: 'r8',
        speaker: 'partner',
        sv: 'Utmärkt! Smaklig måltid.',
        de: 'Ausgezeichnet! Guten Appetit.',
        decoding: [
          { sv: 'utmärkt', de: 'ausgezeichnet' },
          { sv: 'smaklig', de: 'schmackhaft' },
          { sv: 'måltid', de: 'Mahlzeit' },
        ],
      },
      {
        id: 'r9',
        speaker: 'you',
        sv: 'kan jag få notan?',
        de: 'kann ich die Rechnung haben?',
        chunkId: 'c-notan',
        suggestions: ['Kan jag få notan?', 'Kan jag få menyn?'],
      },
      {
        id: 'r10',
        speaker: 'partner',
        sv: 'Javisst. Ha en trevlig kväll!',
        de: 'Aber sicher. Einen schönen Abend!',
        decoding: [
          { sv: 'javisst', de: 'aber sicher' },
          { sv: 'ha', de: 'hab' },
          { sv: 'en', de: 'einen' },
          { sv: 'trevlig', de: 'schönen' },
          { sv: 'kväll', de: 'Abend' },
        ],
      },
    ],
  },

  // ── Im Hotel (cat-hotel) ─────────────────────────────────────────────────────
  {
    id: 'dlg-hotel',
    categoryId: 'cat-hotel',
    title: 'Im Hotel: einchecken',
    blurb: 'Ankommen, Zimmer, Preis, Schlüssel — an der Rezeption.',
    scene: 'hotel',
    partnerName: 'Rezeption',
    turns: [
      {
        id: 'h1',
        speaker: 'partner',
        sv: 'God kväll! Välkommen.',
        de: 'Guten Abend! Willkommen.',
        listenFirst: true,
        decoding: [
          { sv: 'god', de: 'guten' },
          { sv: 'kväll', de: 'Abend' },
          { sv: 'välkommen', de: 'willkommen' },
        ],
      },
      {
        id: 'h2',
        speaker: 'you',
        sv: 'jag har bokat ett rum',
        de: 'ich habe ein Zimmer gebucht',
        chunkId: 'c-bokatrum',
        suggestions: ['Jag har bokat ett rum.', 'Har ni ett ledigt rum?'],
      },
      {
        id: 'h3',
        speaker: 'partner',
        sv: 'Perfekt. För hur många nätter?',
        de: 'Perfekt. Für wie viele Nächte?',
        decoding: [
          { sv: 'perfekt', de: 'perfekt' },
          { sv: 'för', de: 'für' },
          { sv: 'hur', de: 'wie' },
          { sv: 'många', de: 'viele' },
          { sv: 'nätter', de: 'Nächte' },
        ],
      },
      {
        id: 'h4',
        speaker: 'you',
        sv: 'vad kostar en natt?',
        de: 'was kostet eine Nacht?',
        chunkId: 'c-vadnatt',
        suggestions: ['Vad kostar en natt?', 'Vad kostar det?'],
      },
      {
        id: 'h5',
        speaker: 'partner',
        sv: 'Tusen kronor per natt.',
        de: 'Tausend Kronen pro Nacht.',
        decoding: [
          { sv: 'tusen', de: 'tausend' },
          { sv: 'kronor', de: 'Kronen' },
          { sv: 'per', de: 'pro' },
          { sv: 'natt', de: 'Nacht' },
        ],
      },
      {
        id: 'h6',
        speaker: 'you',
        sv: 'kan jag få nyckeln?',
        de: 'kann ich den Schlüssel haben?',
        chunkId: 'c-nyckeln',
        suggestions: ['Kan jag få nyckeln?', 'Kan jag få notan?'],
      },
      {
        id: 'h7',
        speaker: 'partner',
        sv: 'Varsågod. Frukost är klockan åtta.',
        de: 'Bitte. Frühstück ist um acht Uhr.',
        decoding: [
          { sv: 'varsågod', de: 'bitte' },
          { sv: 'frukost', de: 'Frühstück' },
          { sv: 'är', de: 'ist' },
          { sv: 'klockan', de: 'die Uhr' },
          { sv: 'åtta', de: 'acht' },
        ],
      },
      {
        id: 'h8',
        speaker: 'you',
        sv: 'tack så mycket',
        de: 'danke vielmals',
        chunkId: 'c-tack',
        suggestions: ['Tack så mycket.', 'Ha det bra.'],
      },
      {
        id: 'h9',
        speaker: 'partner',
        sv: 'Tack själv. Ha det bra!',
        de: 'Danke gleichfalls. Machen Sie es gut!',
        decoding: [
          { sv: 'tack', de: 'danke' },
          { sv: 'själv', de: 'selbst' },
          { sv: 'ha', de: 'hab' },
          { sv: 'det', de: 'es' },
          { sv: 'bra', de: 'gut' },
        ],
      },
    ],
  },

  // ── Nach dem Weg fragen (cat-around) ─────────────────────────────────────────
  {
    id: 'dlg-weg',
    categoryId: 'cat-around',
    title: 'Nach dem Weg fragen',
    blurb: 'Jemanden ansprechen, den Weg erfragen, danke sagen.',
    scene: 'station',
    partnerName: 'Passant',
    turns: [
      {
        id: 'w1',
        speaker: 'you',
        sv: 'kan du hjälpa mig?',
        de: 'kannst du mir helfen?',
        chunkId: 'c-hjalpa',
        suggestions: ['Kan du hjälpa mig?', 'Kan du prata långsammare?'],
      },
      {
        id: 'w2',
        speaker: 'partner',
        sv: 'Javisst! Vad söker du?',
        de: 'Aber sicher! Was suchst du?',
        decoding: [
          { sv: 'javisst', de: 'aber sicher' },
          { sv: 'vad', de: 'was' },
          { sv: 'söker', de: 'suchst' },
          { sv: 'du', de: 'du' },
        ],
      },
      {
        id: 'w3',
        speaker: 'you',
        sv: 'var ligger stationen?',
        de: 'wo liegt der Bahnhof?',
        chunkId: 'c-stationen',
        suggestions: ['Var ligger stationen?', 'Var är toaletten?'],
      },
      {
        id: 'w4',
        speaker: 'partner',
        sv: 'Gå rakt fram, sen till höger.',
        de: 'Geh geradeaus, dann nach rechts.',
        decoding: [
          { sv: 'gå', de: 'geh' },
          { sv: 'rakt', de: 'gerade' },
          { sv: 'fram', de: 'voraus' },
          { sv: 'sen', de: 'dann' },
          { sv: 'till', de: 'nach' },
          { sv: 'höger', de: 'rechts' },
        ],
      },
      {
        id: 'w5',
        speaker: 'you',
        sv: 'hur kommer jag till centrum?',
        de: 'wie komme ich ins Zentrum?',
        chunkId: 'c-centrum',
        suggestions: ['Hur kommer jag till centrum?', 'Hur mår du?'],
      },
      {
        id: 'w6',
        speaker: 'partner',
        sv: 'Ta bussen. Hållplatsen är där.',
        de: 'Nimm den Bus. Die Haltestelle ist dort.',
        decoding: [
          { sv: 'ta', de: 'nimm' },
          { sv: 'bussen', de: 'der Bus' },
          { sv: 'hållplatsen', de: 'die Haltestelle' },
          { sv: 'är', de: 'ist' },
          { sv: 'där', de: 'dort' },
        ],
      },
      {
        id: 'w7',
        speaker: 'you',
        sv: 'tack så mycket',
        de: 'danke vielmals',
        chunkId: 'c-tack',
        suggestions: ['Tack så mycket!', 'Förlåt.'],
      },
      {
        id: 'w8',
        speaker: 'partner',
        sv: 'Ingen orsak. Lycka till!',
        de: 'Keine Ursache. Viel Glück!',
        decoding: [
          { sv: 'ingen', de: 'keine' },
          { sv: 'orsak', de: 'Ursache' },
          { sv: 'lycka', de: 'Glück' },
          { sv: 'till', de: 'zu' },
        ],
      },
    ],
  },
];
