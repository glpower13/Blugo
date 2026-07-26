// Die allerersten Wörter — der Inhalt des Startpiloten.
//
// WARUM ES DIESE DATEI GIBT: Der bisherige Inhalt beginnt bei „hur mår du?" und
// „jag förstår inte" — für jemanden, der noch nie ein schwedisches Wort gesehen
// hat, ist das ein Sprung ins kalte Wasser. Es fehlte die erste Stufe.
//
// UND WARUM ES TROTZDEM KEIN VOKABEL-DRILL IST (CLAUDE.md, Anti-Ziel): Jedes
// Wort hier ist eine VOLLSTÄNDIGE ÄUSSERUNG. „tack" ist kein Vokabel-Eintrag,
// den man später in einen Satz einbauen muss — es ist ein Satz. Man kann damit
// sofort etwas tun. Die Lerneinheit bleibt der Chunk im Kontext; der Kontext ist
// hier nur so kurz wie die Sprache es zulässt.
//
// AUSWAHLREGEL: aufgenommen wird nur, was (a) allein stehen kann, (b) im Alltag
// wirklich fällt, und (c) höchstens zwei Wörter lang ist. Alles, was einen
// Trägersatz braucht („bord" = Tisch), gehört hier NICHT hin.

import type { Category, Chunk, Segment } from '../../domain/chunk';

export const categories: Category[] = [
  {
    id: 'cat-first-words',
    areaId: 'area-basics',
    title: 'Die ersten Wörter',
    blurb: 'Sechzehn kurze Wörter, die man wirklich sagt — der Anfang von allem.',
    // Vor „Begrüßen & Kennenlernen": Das hier ist die Stufe davor.
    order: 0,
    cefr: 'A1',
  },
];

const c = (id: string, sv: string, de: string, decoding: [string, string][]): Chunk => ({
  id,
  categoryId: 'cat-first-words',
  sv,
  de,
  decoding: decoding.map(([s, d]) => ({ sv: s, de: d })),
});

export const chunks: Chunk[] = [
  c('c-fw-hej', 'hej', 'hallo', [['hej', 'hallo']]),
  c('c-fw-tack', 'tack', 'danke', [['tack', 'danke']]),
  c('c-fw-ja', 'ja', 'ja', [['ja', 'ja']]),
  c('c-fw-nej', 'nej', 'nein', [['nej', 'nein']]),
  c('c-fw-hallo', 'hallå', 'hallo?', [['hallå', 'hallo']]),
  c('c-fw-godmorgon', 'god morgon', 'guten Morgen', [['god', 'guten'], ['morgon', 'Morgen']]),
  c('c-fw-godnatt', 'god natt', 'gute Nacht', [['god', 'gute'], ['natt', 'Nacht']]),
  c('c-fw-kanske', 'kanske', 'vielleicht', [['kanske', 'vielleicht']]),
  c('c-fw-garna', 'gärna', 'gern', [['gärna', 'gern']]),
  c('c-fw-tyvarr', 'tyvärr', 'leider', [['tyvärr', 'leider']]),
  c('c-fw-visst', 'visst', 'klar', [['visst', 'klar']]),
  c('c-fw-vanta', 'vänta', 'warte', [['vänta', 'warte']]),
  c('c-fw-titta', 'titta', 'schau', [['titta', 'schau']]),
  c('c-fw-kom', 'kom', 'komm', [['kom', 'komm']]),
  c('c-fw-snalla', 'snälla', 'bitte', [['snälla', 'bitte']]),
  c('c-fw-jattebra', 'jättebra', 'super', [['jättebra', 'super']]),
];

const s = (
  id: string,
  sv: string,
  de: string,
  decoding: [string, string][],
  chunkIds: string[],
): Segment => ({
  id,
  level: 1,
  sv,
  de,
  decoding: decoding.map(([a, b]) => ({ sv: a, de: b })),
  chunkIds,
});

export const segments: Segment[] = [
  // hej
  s('s-fw-hej1', 'Hej!', 'Hallo!', [['hej', 'hallo']], ['c-fw-hej']),
  s('s-fw-hej2', 'Hej, jag heter Anna.', 'Hallo, ich heiße Anna.', [['hej', 'hallo'], ['jag', 'ich'], ['heter', 'heiße'], ['anna', 'Anna']], ['c-fw-hej']),
  s('s-fw-hej3', 'Hej! Trevligt att träffas.', 'Hallo! Schön, dich kennenzulernen.', [['hej', 'hallo'], ['trevligt', 'nett'], ['att', 'zu'], ['träffas', 'treffen']], ['c-fw-hej']),
  // tack
  s('s-fw-tack1', 'Tack!', 'Danke!', [['tack', 'danke']], ['c-fw-tack']),
  s('s-fw-tack2', 'Tack, det var snällt.', 'Danke, das war nett.', [['tack', 'danke'], ['det', 'das'], ['var', 'war'], ['snällt', 'nett']], ['c-fw-tack']),
  s('s-fw-tack3', 'Tack så mycket för hjälpen.', 'Vielen Dank für die Hilfe.', [['tack', 'danke'], ['så', 'so'], ['mycket', 'viel'], ['för', 'für'], ['hjälpen', 'die Hilfe']], ['c-fw-tack']),
  // ja
  s('s-fw-ja1', 'Ja!', 'Ja!', [['ja', 'ja']], ['c-fw-ja']),
  s('s-fw-ja2', 'Ja, det stämmer.', 'Ja, das stimmt.', [['ja', 'ja'], ['det', 'das'], ['stämmer', 'stimmt']], ['c-fw-ja']),
  s('s-fw-ja3', 'Ja, gärna!', 'Ja, gern!', [['ja', 'ja'], ['gärna', 'gern']], ['c-fw-ja', 'c-fw-garna']),
  // nej
  s('s-fw-nej1', 'Nej.', 'Nein.', [['nej', 'nein']], ['c-fw-nej']),
  s('s-fw-nej2', 'Nej, inte idag.', 'Nein, heute nicht.', [['nej', 'nein'], ['inte', 'nicht'], ['idag', 'heute']], ['c-fw-nej']),
  s('s-fw-nej3', 'Nej, tyvärr inte.', 'Nein, leider nicht.', [['nej', 'nein'], ['tyvärr', 'leider'], ['inte', 'nicht']], ['c-fw-nej', 'c-fw-tyvarr']),
  // hallå
  s('s-fw-hallo1', 'Hallå?', 'Hallo?', [['hallå', 'hallo']], ['c-fw-hallo']),
  s('s-fw-hallo2', 'Hallå, hör du mig?', 'Hallo, hörst du mich?', [['hallå', 'hallo'], ['hör', 'hörst'], ['du', 'du'], ['mig', 'mich']], ['c-fw-hallo']),
  s('s-fw-hallo3', 'Hallå! Är någon hemma?', 'Hallo! Ist jemand zu Hause?', [['hallå', 'hallo'], ['är', 'ist'], ['någon', 'jemand'], ['hemma', 'daheim']], ['c-fw-hallo']),
  // god morgon
  s('s-fw-gm1', 'God morgon!', 'Guten Morgen!', [['god', 'guten'], ['morgon', 'Morgen']], ['c-fw-godmorgon']),
  s('s-fw-gm2', 'God morgon, sov du gott?', 'Guten Morgen, hast du gut geschlafen?', [['god', 'guten'], ['morgon', 'Morgen'], ['sov', 'schliefst'], ['du', 'du'], ['gott', 'gut']], ['c-fw-godmorgon']),
  s('s-fw-gm3', 'God morgon! Kaffe?', 'Guten Morgen! Kaffee?', [['god', 'guten'], ['morgon', 'Morgen'], ['kaffe', 'Kaffee']], ['c-fw-godmorgon']),
  // god natt
  s('s-fw-gn1', 'God natt!', 'Gute Nacht!', [['god', 'gute'], ['natt', 'Nacht']], ['c-fw-godnatt']),
  s('s-fw-gn2', 'God natt, sov gott.', 'Gute Nacht, schlaf gut.', [['god', 'gute'], ['natt', 'Nacht'], ['sov', 'schlaf'], ['gott', 'gut']], ['c-fw-godnatt']),
  s('s-fw-gn3', 'Nu är jag trött. God natt!', 'Jetzt bin ich müde. Gute Nacht!', [['nu', 'jetzt'], ['är', 'bin'], ['jag', 'ich'], ['trött', 'müde'], ['god', 'gute'], ['natt', 'Nacht']], ['c-fw-godnatt']),
  // kanske
  s('s-fw-kanske1', 'Kanske.', 'Vielleicht.', [['kanske', 'vielleicht']], ['c-fw-kanske']),
  s('s-fw-kanske2', 'Kanske i morgon?', 'Vielleicht morgen?', [['kanske', 'vielleicht'], ['i', 'am'], ['morgon', 'Morgen']], ['c-fw-kanske']),
  s('s-fw-kanske3', 'Kanske. Jag vet inte än.', 'Vielleicht. Ich weiß es noch nicht.', [['kanske', 'vielleicht'], ['jag', 'ich'], ['vet', 'weiß'], ['inte', 'nicht'], ['än', 'noch']], ['c-fw-kanske']),
  // gärna
  s('s-fw-garna1', 'Gärna!', 'Gern!', [['gärna', 'gern']], ['c-fw-garna']),
  s('s-fw-garna2', 'Gärna, tack!', 'Gern, danke!', [['gärna', 'gern'], ['tack', 'danke']], ['c-fw-garna', 'c-fw-tack']),
  // tyvärr
  s('s-fw-tyvarr1', 'Tyvärr.', 'Leider.', [['tyvärr', 'leider']], ['c-fw-tyvarr']),
  s('s-fw-tyvarr2', 'Tyvärr, jag kan inte.', 'Leider kann ich nicht.', [['tyvärr', 'leider'], ['jag', 'ich'], ['kan', 'kann'], ['inte', 'nicht']], ['c-fw-tyvarr']),
  // visst
  s('s-fw-visst1', 'Visst!', 'Klar!', [['visst', 'klar']], ['c-fw-visst']),
  s('s-fw-visst2', 'Visst, det går bra.', 'Klar, das geht.', [['visst', 'klar'], ['det', 'das'], ['går', 'geht'], ['bra', 'gut']], ['c-fw-visst']),
  s('s-fw-visst3', 'Visst! Kom in.', 'Klar! Komm rein.', [['visst', 'klar'], ['kom', 'komm'], ['in', 'rein']], ['c-fw-visst', 'c-fw-kom']),
  // vänta
  s('s-fw-vanta1', 'Vänta!', 'Warte!', [['vänta', 'warte']], ['c-fw-vanta']),
  s('s-fw-vanta2', 'Vänta, jag kommer.', 'Warte, ich komme.', [['vänta', 'warte'], ['jag', 'ich'], ['kommer', 'komme']], ['c-fw-vanta']),
  s('s-fw-vanta3', 'Vänta här, tack.', 'Warte hier, bitte.', [['vänta', 'warte'], ['här', 'hier'], ['tack', 'danke']], ['c-fw-vanta']),
  // titta
  s('s-fw-titta1', 'Titta!', 'Schau!', [['titta', 'schau']], ['c-fw-titta']),
  s('s-fw-titta2', 'Titta här!', 'Schau her!', [['titta', 'schau'], ['här', 'hier']], ['c-fw-titta']),
  s('s-fw-titta3', 'Titta, en älg!', 'Schau, ein Elch!', [['titta', 'schau'], ['en', 'ein'], ['älg', 'Elch']], ['c-fw-titta']),
  // kom
  s('s-fw-kom1', 'Kom!', 'Komm!', [['kom', 'komm']], ['c-fw-kom']),
  s('s-fw-kom2', 'Kom hit!', 'Komm her!', [['kom', 'komm'], ['hit', 'hierher']], ['c-fw-kom']),
  // snälla
  s('s-fw-snalla1', 'Snälla!', 'Bitte!', [['snälla', 'bitte']], ['c-fw-snalla']),
  s('s-fw-snalla2', 'Snälla, hjälp mig.', 'Bitte hilf mir.', [['snälla', 'bitte'], ['hjälp', 'hilf'], ['mig', 'mir']], ['c-fw-snalla']),
  s('s-fw-snalla3', 'Snälla, vänta lite.', 'Bitte warte kurz.', [['snälla', 'bitte'], ['vänta', 'warte'], ['lite', 'ein wenig']], ['c-fw-snalla', 'c-fw-vanta']),
  // jättebra
  s('s-fw-jb1', 'Jättebra!', 'Super!', [['jättebra', 'super']], ['c-fw-jattebra']),
  s('s-fw-jb2', 'Jättebra, tack!', 'Super, danke!', [['jättebra', 'super'], ['tack', 'danke']], ['c-fw-jattebra']),
  s('s-fw-jb3', 'Det låter jättebra.', 'Das klingt super.', [['det', 'das'], ['låter', 'klingt'], ['jättebra', 'super']], ['c-fw-jattebra']),
];
