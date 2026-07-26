// Ausbau 3 (2026-07-26): Zahnarzt, Studium, Umzug, Schwimmhalle & Sauna.

import type { Category, Chunk, Segment } from '../../domain/chunk';

export const categories: Category[] = [
  { id: 'cat-dentist', areaId: 'area-emergency', title: 'Beim Zahnarzt', blurb: 'Zahnschmerzen erklären, Betäubung bekommen, Termin ausmachen.', order: 4, cefr: 'B1' },
  { id: 'cat-studies', areaId: 'area-society', title: 'Studium & Kurse', blurb: 'Vorlesung, Prüfung, Abgabe — der Sprachgebrauch im Kursraum.', order: 5, cefr: 'B1' },
  { id: 'cat-moving', areaId: 'area-home', title: 'Umzug & Wohnungssuche', blurb: 'Wohnung finden, Kisten packen, Vertrag unterschreiben.', order: 13, cefr: 'B1' },
  { id: 'cat-swim', areaId: 'area-outdoors', title: 'Schwimmhalle & Sauna', blurb: 'Duschen, Bahnen ziehen, saubastu — sehr schwedisch.', order: 7, cefr: 'A2' },
];

const c = (id: string, categoryId: string, sv: string, de: string, d: [string, string][]): Chunk => ({
  id, categoryId, sv, de, decoding: d.map(([a, b]) => ({ sv: a, de: b })),
});
const s = (id: string, sv: string, de: string, d: [string, string][], chunkIds: string[]): Segment => ({
  id, level: 2, sv, de, decoding: d.map(([a, b]) => ({ sv: a, de: b })), chunkIds,
});

export const chunks: Chunk[] = [
  // ── Beim Zahnarzt ─────────────────────────────────────────────────────────
  c('c-ta-tandvark', 'cat-dentist', 'jag har tandvärk', 'ich habe Zahnschmerzen', [['jag', 'ich'], ['har', 'habe'], ['tandvärk', 'Zahnschmerzen']]),
  c('c-ta-varmed', 'cat-dentist', 'det gör ont här nere', 'es tut hier unten weh', [['det', 'es'], ['gör', 'macht'], ['ont', 'Schmerz'], ['här', 'hier'], ['nere', 'unten']]),
  c('c-ta-bedovning', 'cat-dentist', 'kan jag få bedövning?', 'kann ich eine Betäubung bekommen?', [['kan', 'kann'], ['jag', 'ich'], ['få', 'bekommen'], ['bedövning', 'Betäubung']]),
  c('c-ta-hal', 'cat-dentist', 'jag har ett hål', 'ich habe ein Loch', [['jag', 'ich'], ['har', 'habe'], ['ett', 'ein'], ['hål', 'Loch']]),
  c('c-ta-kansligt', 'cat-dentist', 'tanden är känslig för kallt', 'der Zahn ist kälteempfindlich', [['tanden', 'der Zahn'], ['är', 'ist'], ['känslig', 'empfindlich'], ['för', 'für'], ['kallt', 'Kaltes']]),
  c('c-ta-borsta', 'cat-dentist', 'jag borstar två gånger om dagen', 'ich putze zweimal am Tag', [['jag', 'ich'], ['borstar', 'bürste'], ['två', 'zwei'], ['gånger', 'Mal'], ['om', 'am'], ['dagen', 'Tag']]),
  c('c-ta-nybesok', 'cat-dentist', 'när kan jag komma tillbaka?', 'wann kann ich wiederkommen?', [['när', 'wann'], ['kan', 'kann'], ['jag', 'ich'], ['komma', 'kommen'], ['tillbaka', 'zurück']]),

  // ── Studium & Kurse ───────────────────────────────────────────────────────
  c('c-st-kurs', 'cat-studies', 'jag går en kurs i svenska', 'ich mache einen Schwedischkurs', [['jag', 'ich'], ['går', 'gehe'], ['en', 'einen'], ['kurs', 'Kurs'], ['i', 'in'], ['svenska', 'Schwedisch']]),
  c('c-st-forelasning', 'cat-studies', 'föreläsningen börjar nio', 'die Vorlesung beginnt um neun', [['föreläsningen', 'die Vorlesung'], ['börjar', 'beginnt'], ['nio', 'neun']]),
  c('c-st-tenta', 'cat-studies', 'jag har tenta på fredag', 'ich habe Freitag Prüfung', [['jag', 'ich'], ['har', 'habe'], ['tenta', 'Prüfung'], ['på', 'am'], ['fredag', 'Freitag']]),
  c('c-st-inlamning', 'cat-studies', 'uppgiften ska lämnas in i morgon', 'die Aufgabe muss morgen abgegeben werden', [['uppgiften', 'die Aufgabe'], ['ska', 'soll'], ['lämnas', 'gelassen'], ['in', 'ein'], ['i', 'am'], ['morgon', 'Morgen']]),
  c('c-st-hinner', 'cat-studies', 'jag hinner inte med allt', 'ich schaffe nicht alles', [['jag', 'ich'], ['hinner', 'schaffe'], ['inte', 'nicht'], ['med', 'mit'], ['allt', 'alles']]),
  c('c-st-grupp', 'cat-studies', 'vi jobbar i grupp', 'wir arbeiten in der Gruppe', [['vi', 'wir'], ['jobbar', 'arbeiten'], ['i', 'in'], ['grupp', 'Gruppe']]),
  c('c-st-fraga', 'cat-studies', 'får jag ställa en fråga?', 'darf ich eine Frage stellen?', [['får', 'darf'], ['jag', 'ich'], ['ställa', 'stellen'], ['en', 'eine'], ['fråga', 'Frage']]),

  // ── Umzug & Wohnungssuche ─────────────────────────────────────────────────
  c('c-um-soker', 'cat-moving', 'jag söker en lägenhet', 'ich suche eine Wohnung', [['jag', 'ich'], ['söker', 'suche'], ['en', 'eine'], ['lägenhet', 'Wohnung']]),
  c('c-um-hyra', 'cat-moving', 'vad kostar hyran?', 'wie hoch ist die Miete?', [['vad', 'was'], ['kostar', 'kostet'], ['hyran', 'die Miete']]),
  c('c-um-rum', 'cat-moving', 'hur många rum finns det?', 'wie viele Zimmer gibt es?', [['hur', 'wie'], ['många', 'viele'], ['rum', 'Zimmer'], ['finns', 'gibt es'], ['det', 'es']]),
  c('c-um-visning', 'cat-moving', 'när är visningen?', 'wann ist die Besichtigung?', [['när', 'wann'], ['är', 'ist'], ['visningen', 'die Besichtigung']]),
  c('c-um-kontrakt', 'cat-moving', 'jag skriver på kontraktet', 'ich unterschreibe den Vertrag', [['jag', 'ich'], ['skriver', 'schreibe'], ['på', 'auf'], ['kontraktet', 'den Vertrag']]),
  c('c-um-lador', 'cat-moving', 'vi packar lådorna ikväll', 'wir packen heute Abend die Kisten', [['vi', 'wir'], ['packar', 'packen'], ['lådorna', 'die Kisten'], ['ikväll', 'heute Abend']]),
  c('c-um-flyttar', 'cat-moving', 'vi flyttar in på lördag', 'wir ziehen am Samstag ein', [['vi', 'wir'], ['flyttar', 'ziehen'], ['in', 'ein'], ['på', 'am'], ['lördag', 'Samstag']]),

  // ── Schwimmhalle & Sauna ──────────────────────────────────────────────────
  c('c-si-simhall', 'cat-swim', 'vi går till simhallen', 'wir gehen ins Schwimmbad', [['vi', 'wir'], ['går', 'gehen'], ['till', 'zu'], ['simhallen', 'der Schwimmhalle']]),
  c('c-si-duscha', 'cat-swim', 'man måste duscha först', 'man muss zuerst duschen', [['man', 'man'], ['måste', 'muss'], ['duscha', 'duschen'], ['först', 'erst']]),
  c('c-si-bana', 'cat-swim', 'jag simmar tjugo banor', 'ich schwimme zwanzig Bahnen', [['jag', 'ich'], ['simmar', 'schwimme'], ['tjugo', 'zwanzig'], ['banor', 'Bahnen']]),
  c('c-si-bastu', 'cat-swim', 'ska vi bada bastu?', 'wollen wir in die Sauna?', [['ska', 'sollen'], ['vi', 'wir'], ['bada', 'baden'], ['bastu', 'Sauna']]),
  c('c-si-varmt', 'cat-swim', 'det är för varmt för mig', 'es ist mir zu heiß', [['det', 'es'], ['är', 'ist'], ['för', 'zu'], ['varmt', 'warm'], ['för', 'für'], ['mig', 'mich']]),
  c('c-si-handduk', 'cat-swim', 'har du en handduk?', 'hast du ein Handtuch?', [['har', 'hast'], ['du', 'du'], ['en', 'ein'], ['handduk', 'Handtuch']]),
  c('c-si-djupt', 'cat-swim', 'hur djupt är det?', 'wie tief ist es?', [['hur', 'wie'], ['djupt', 'tief'], ['är', 'ist'], ['det', 'es']]),
];

export const segments: Segment[] = [
  // Zahnarzt
  s('s-ta-tv1', 'Jag har tandvärk.', 'Ich habe Zahnschmerzen.', [['jag', 'ich'], ['har', 'habe'], ['tandvärk', 'Zahnschmerzen']], ['c-ta-tandvark']),
  s('s-ta-tv2', 'Jag har tandvärk sedan i går.', 'Ich habe seit gestern Zahnschmerzen.', [['jag', 'ich'], ['har', 'habe'], ['tandvärk', 'Zahnschmerzen'], ['sedan', 'seit'], ['i', 'am'], ['går', 'gestern']], ['c-ta-tandvark']),
  s('s-ta-tv3', 'Jag har tandvärk och kan inte sova.', 'Ich habe Zahnschmerzen und kann nicht schlafen.', [['jag', 'ich'], ['har', 'habe'], ['tandvärk', 'Zahnschmerzen'], ['och', 'und'], ['kan', 'kann'], ['inte', 'nicht'], ['sova', 'schlafen']], ['c-ta-tandvark']),
  s('s-ta-on1', 'Det gör ont här nere.', 'Es tut hier unten weh.', [['det', 'es'], ['gör', 'macht'], ['ont', 'Schmerz'], ['här', 'hier'], ['nere', 'unten']], ['c-ta-varmed']),
  s('s-ta-on2', 'Det gör ont här nere, på vänster sida.', 'Es tut hier unten weh, auf der linken Seite.', [['det', 'es'], ['gör', 'macht'], ['ont', 'Schmerz'], ['här', 'hier'], ['nere', 'unten'], ['på', 'auf'], ['vänster', 'linker'], ['sida', 'Seite']], ['c-ta-varmed']),
  s('s-ta-bed1', 'Kan jag få bedövning?', 'Kann ich eine Betäubung bekommen?', [['kan', 'kann'], ['jag', 'ich'], ['få', 'bekommen'], ['bedövning', 'Betäubung']], ['c-ta-bedovning']),
  s('s-ta-bed2', 'Kan jag få bedövning? Jag är nervös.', 'Kann ich eine Betäubung bekommen? Ich bin nervös.', [['kan', 'kann'], ['jag', 'ich'], ['få', 'bekommen'], ['bedövning', 'Betäubung'], ['jag', 'ich'], ['är', 'bin'], ['nervös', 'nervös']], ['c-ta-bedovning']),
  s('s-ta-hal1', 'Jag har ett hål.', 'Ich habe ein Loch.', [['jag', 'ich'], ['har', 'habe'], ['ett', 'ein'], ['hål', 'Loch']], ['c-ta-hal']),
  s('s-ta-hal2', 'Jag har ett hål, tror jag.', 'Ich habe ein Loch, glaube ich.', [['jag', 'ich'], ['har', 'habe'], ['ett', 'ein'], ['hål', 'Loch'], ['tror', 'glaube'], ['jag', 'ich']], ['c-ta-hal']),
  s('s-ta-kan1', 'Tanden är känslig för kallt.', 'Der Zahn ist kälteempfindlich.', [['tanden', 'der Zahn'], ['är', 'ist'], ['känslig', 'empfindlich'], ['för', 'für'], ['kallt', 'Kaltes']], ['c-ta-kansligt']),
  s('s-ta-kan2', 'Tanden är känslig för kallt vatten.', 'Der Zahn ist empfindlich gegen kaltes Wasser.', [['tanden', 'der Zahn'], ['är', 'ist'], ['känslig', 'empfindlich'], ['för', 'für'], ['kallt', 'kaltes'], ['vatten', 'Wasser']], ['c-ta-kansligt']),
  s('s-ta-bor1', 'Jag borstar två gånger om dagen.', 'Ich putze zweimal am Tag.', [['jag', 'ich'], ['borstar', 'bürste'], ['två', 'zwei'], ['gånger', 'Mal'], ['om', 'am'], ['dagen', 'Tag']], ['c-ta-borsta']),
  s('s-ta-bor2', 'Jag borstar två gånger om dagen, morgon och kväll.', 'Ich putze zweimal am Tag, morgens und abends.', [['jag', 'ich'], ['borstar', 'bürste'], ['två', 'zwei'], ['gånger', 'Mal'], ['om', 'am'], ['dagen', 'Tag'], ['morgon', 'Morgen'], ['och', 'und'], ['kväll', 'Abend']], ['c-ta-borsta']),
  s('s-ta-ny1', 'När kan jag komma tillbaka?', 'Wann kann ich wiederkommen?', [['när', 'wann'], ['kan', 'kann'], ['jag', 'ich'], ['komma', 'kommen'], ['tillbaka', 'zurück']], ['c-ta-nybesok']),
  s('s-ta-ny2', 'När kan jag komma tillbaka för resten?', 'Wann kann ich für den Rest wiederkommen?', [['när', 'wann'], ['kan', 'kann'], ['jag', 'ich'], ['komma', 'kommen'], ['tillbaka', 'zurück'], ['för', 'für'], ['resten', 'den Rest']], ['c-ta-nybesok']),

  // Studium
  s('s-st-ku1', 'Jag går en kurs i svenska.', 'Ich mache einen Schwedischkurs.', [['jag', 'ich'], ['går', 'gehe'], ['en', 'einen'], ['kurs', 'Kurs'], ['i', 'in'], ['svenska', 'Schwedisch']], ['c-st-kurs']),
  s('s-st-ku2', 'Jag går en kurs i svenska två kvällar i veckan.', 'Ich mache zwei Abende die Woche einen Schwedischkurs.', [['jag', 'ich'], ['går', 'gehe'], ['en', 'einen'], ['kurs', 'Kurs'], ['i', 'in'], ['svenska', 'Schwedisch'], ['två', 'zwei'], ['kvällar', 'Abende'], ['i', 'in'], ['veckan', 'der Woche']], ['c-st-kurs']),
  s('s-st-fo1', 'Föreläsningen börjar nio.', 'Die Vorlesung beginnt um neun.', [['föreläsningen', 'die Vorlesung'], ['börjar', 'beginnt'], ['nio', 'neun']], ['c-st-forelasning']),
  s('s-st-fo2', 'Föreläsningen börjar nio, men kom tidigare.', 'Die Vorlesung beginnt um neun, aber komm früher.', [['föreläsningen', 'die Vorlesung'], ['börjar', 'beginnt'], ['nio', 'neun'], ['men', 'aber'], ['kom', 'komm'], ['tidigare', 'früher']], ['c-st-forelasning']),
  s('s-st-te1', 'Jag har tenta på fredag.', 'Ich habe Freitag Prüfung.', [['jag', 'ich'], ['har', 'habe'], ['tenta', 'Prüfung'], ['på', 'am'], ['fredag', 'Freitag']], ['c-st-tenta']),
  s('s-st-te2', 'Jag har tenta på fredag och pluggar hela veckan.', 'Ich habe Freitag Prüfung und lerne die ganze Woche.', [['jag', 'ich'], ['har', 'habe'], ['tenta', 'Prüfung'], ['på', 'am'], ['fredag', 'Freitag'], ['och', 'und'], ['pluggar', 'büffle'], ['hela', 'die ganze'], ['veckan', 'Woche']], ['c-st-tenta']),
  s('s-st-in1', 'Uppgiften ska lämnas in i morgon.', 'Die Aufgabe muss morgen abgegeben werden.', [['uppgiften', 'die Aufgabe'], ['ska', 'soll'], ['lämnas', 'gelassen'], ['in', 'ein'], ['i', 'am'], ['morgon', 'Morgen']], ['c-st-inlamning']),
  s('s-st-in2', 'Uppgiften ska lämnas in i morgon, senast klockan tolv.', 'Die Aufgabe muss morgen abgegeben werden, spätestens um zwölf.', [['uppgiften', 'die Aufgabe'], ['ska', 'soll'], ['lämnas', 'gelassen'], ['in', 'ein'], ['i', 'am'], ['morgon', 'Morgen'], ['senast', 'spätestens'], ['klockan', 'die Uhr'], ['tolv', 'zwölf']], ['c-st-inlamning']),
  s('s-st-hi1', 'Jag hinner inte med allt.', 'Ich schaffe nicht alles.', [['jag', 'ich'], ['hinner', 'schaffe'], ['inte', 'nicht'], ['med', 'mit'], ['allt', 'alles']], ['c-st-hinner']),
  s('s-st-hi2', 'Jag hinner inte med allt den här veckan.', 'Ich schaffe diese Woche nicht alles.', [['jag', 'ich'], ['hinner', 'schaffe'], ['inte', 'nicht'], ['med', 'mit'], ['allt', 'alles'], ['den', 'die'], ['här', 'hier'], ['veckan', 'Woche']], ['c-st-hinner']),
  s('s-st-gr1', 'Vi jobbar i grupp.', 'Wir arbeiten in der Gruppe.', [['vi', 'wir'], ['jobbar', 'arbeiten'], ['i', 'in'], ['grupp', 'Gruppe']], ['c-st-grupp']),
  s('s-st-gr2', 'Vi jobbar i grupp, fyra stycken.', 'Wir arbeiten in der Gruppe, zu viert.', [['vi', 'wir'], ['jobbar', 'arbeiten'], ['i', 'in'], ['grupp', 'Gruppe'], ['fyra', 'vier'], ['stycken', 'Stück']], ['c-st-grupp']),
  s('s-st-fr1', 'Får jag ställa en fråga?', 'Darf ich eine Frage stellen?', [['får', 'darf'], ['jag', 'ich'], ['ställa', 'stellen'], ['en', 'eine'], ['fråga', 'Frage']], ['c-st-fraga']),
  s('s-st-fr2', 'Ursäkta, får jag ställa en fråga?', 'Entschuldigung, darf ich eine Frage stellen?', [['ursäkta', 'entschuldige'], ['får', 'darf'], ['jag', 'ich'], ['ställa', 'stellen'], ['en', 'eine'], ['fråga', 'Frage']], ['c-st-fraga']),
  s('s-st-fr3', 'Får jag ställa en fråga om uppgiften?', 'Darf ich eine Frage zur Aufgabe stellen?', [['får', 'darf'], ['jag', 'ich'], ['ställa', 'stellen'], ['en', 'eine'], ['fråga', 'Frage'], ['om', 'über'], ['uppgiften', 'die Aufgabe']], ['c-st-fraga']),

  // Umzug
  s('s-um-so1', 'Jag söker en lägenhet.', 'Ich suche eine Wohnung.', [['jag', 'ich'], ['söker', 'suche'], ['en', 'eine'], ['lägenhet', 'Wohnung']], ['c-um-soker']),
  s('s-um-so2', 'Jag söker en lägenhet nära jobbet.', 'Ich suche eine Wohnung in der Nähe der Arbeit.', [['jag', 'ich'], ['söker', 'suche'], ['en', 'eine'], ['lägenhet', 'Wohnung'], ['nära', 'nah'], ['jobbet', 'der Arbeit']], ['c-um-soker']),
  s('s-um-hy1', 'Vad kostar hyran?', 'Wie hoch ist die Miete?', [['vad', 'was'], ['kostar', 'kostet'], ['hyran', 'die Miete']], ['c-um-hyra']),
  s('s-um-hy2', 'Vad kostar hyran i månaden?', 'Wie hoch ist die Miete im Monat?', [['vad', 'was'], ['kostar', 'kostet'], ['hyran', 'die Miete'], ['i', 'im'], ['månaden', 'Monat']], ['c-um-hyra']),
  s('s-um-ru1', 'Hur många rum finns det?', 'Wie viele Zimmer gibt es?', [['hur', 'wie'], ['många', 'viele'], ['rum', 'Zimmer'], ['finns', 'gibt es'], ['det', 'es']], ['c-um-rum']),
  s('s-um-ru2', 'Hur många rum finns det, och kök?', 'Wie viele Zimmer gibt es, und Küche?', [['hur', 'wie'], ['många', 'viele'], ['rum', 'Zimmer'], ['finns', 'gibt es'], ['det', 'es'], ['och', 'und'], ['kök', 'Küche']], ['c-um-rum']),
  s('s-um-vi1', 'När är visningen?', 'Wann ist die Besichtigung?', [['när', 'wann'], ['är', 'ist'], ['visningen', 'die Besichtigung']], ['c-um-visning']),
  s('s-um-vi2', 'När är visningen? Jag vill komma.', 'Wann ist die Besichtigung? Ich möchte kommen.', [['när', 'wann'], ['är', 'ist'], ['visningen', 'die Besichtigung'], ['jag', 'ich'], ['vill', 'will'], ['komma', 'kommen']], ['c-um-visning']),
  s('s-um-ko1', 'Jag skriver på kontraktet.', 'Ich unterschreibe den Vertrag.', [['jag', 'ich'], ['skriver', 'schreibe'], ['på', 'auf'], ['kontraktet', 'den Vertrag']], ['c-um-kontrakt']),
  s('s-um-ko2', 'Jag skriver på kontraktet i morgon.', 'Ich unterschreibe den Vertrag morgen.', [['jag', 'ich'], ['skriver', 'schreibe'], ['på', 'auf'], ['kontraktet', 'den Vertrag'], ['i', 'am'], ['morgon', 'Morgen']], ['c-um-kontrakt']),
  s('s-um-la1', 'Vi packar lådorna ikväll.', 'Wir packen heute Abend die Kisten.', [['vi', 'wir'], ['packar', 'packen'], ['lådorna', 'die Kisten'], ['ikväll', 'heute Abend']], ['c-um-lador']),
  s('s-um-la2', 'Vi packar lådorna ikväll, resten på lördag.', 'Wir packen heute Abend die Kisten, den Rest am Samstag.', [['vi', 'wir'], ['packar', 'packen'], ['lådorna', 'die Kisten'], ['ikväll', 'heute Abend'], ['resten', 'den Rest'], ['på', 'am'], ['lördag', 'Samstag']], ['c-um-lador']),
  s('s-um-fl1', 'Vi flyttar in på lördag.', 'Wir ziehen am Samstag ein.', [['vi', 'wir'], ['flyttar', 'ziehen'], ['in', 'ein'], ['på', 'am'], ['lördag', 'Samstag']], ['c-um-flyttar']),
  s('s-um-fl2', 'Vi flyttar in på lördag, om allt går bra.', 'Wir ziehen am Samstag ein, wenn alles gut geht.', [['vi', 'wir'], ['flyttar', 'ziehen'], ['in', 'ein'], ['på', 'am'], ['lördag', 'Samstag'], ['om', 'wenn'], ['allt', 'alles'], ['går', 'geht'], ['bra', 'gut']], ['c-um-flyttar']),

  // Schwimmen
  s('s-si-sim1', 'Vi går till simhallen.', 'Wir gehen ins Schwimmbad.', [['vi', 'wir'], ['går', 'gehen'], ['till', 'zu'], ['simhallen', 'der Schwimmhalle']], ['c-si-simhall']),
  s('s-si-sim2', 'Vi går till simhallen på söndag.', 'Wir gehen am Sonntag ins Schwimmbad.', [['vi', 'wir'], ['går', 'gehen'], ['till', 'zu'], ['simhallen', 'der Schwimmhalle'], ['på', 'am'], ['söndag', 'Sonntag']], ['c-si-simhall']),
  s('s-si-du1', 'Man måste duscha först.', 'Man muss zuerst duschen.', [['man', 'man'], ['måste', 'muss'], ['duscha', 'duschen'], ['först', 'erst']], ['c-si-duscha']),
  s('s-si-du2', 'Man måste duscha först, utan badkläder.', 'Man muss zuerst duschen, ohne Badesachen.', [['man', 'man'], ['måste', 'muss'], ['duscha', 'duschen'], ['först', 'erst'], ['utan', 'ohne'], ['badkläder', 'Badesachen']], ['c-si-duscha']),
  s('s-si-ba1', 'Jag simmar tjugo banor.', 'Ich schwimme zwanzig Bahnen.', [['jag', 'ich'], ['simmar', 'schwimme'], ['tjugo', 'zwanzig'], ['banor', 'Bahnen']], ['c-si-bana']),
  s('s-si-ba2', 'Jag simmar tjugo banor och sedan bastu.', 'Ich schwimme zwanzig Bahnen und dann Sauna.', [['jag', 'ich'], ['simmar', 'schwimme'], ['tjugo', 'zwanzig'], ['banor', 'Bahnen'], ['och', 'und'], ['sedan', 'dann'], ['bastu', 'Sauna']], ['c-si-bana']),
  s('s-si-bas1', 'Ska vi bada bastu?', 'Wollen wir in die Sauna?', [['ska', 'sollen'], ['vi', 'wir'], ['bada', 'baden'], ['bastu', 'Sauna']], ['c-si-bastu']),
  s('s-si-bas2', 'Ska vi bada bastu efteråt?', 'Wollen wir danach in die Sauna?', [['ska', 'sollen'], ['vi', 'wir'], ['bada', 'baden'], ['bastu', 'Sauna'], ['efteråt', 'danach']], ['c-si-bastu']),
  s('s-si-va1', 'Det är för varmt för mig.', 'Es ist mir zu heiß.', [['det', 'es'], ['är', 'ist'], ['för', 'zu'], ['varmt', 'warm'], ['för', 'für'], ['mig', 'mich']], ['c-si-varmt']),
  s('s-si-va2', 'Det är för varmt för mig, jag går ut.', 'Es ist mir zu heiß, ich gehe raus.', [['det', 'es'], ['är', 'ist'], ['för', 'zu'], ['varmt', 'warm'], ['för', 'für'], ['mig', 'mich'], ['jag', 'ich'], ['går', 'gehe'], ['ut', 'raus']], ['c-si-varmt']),
  s('s-si-ha1', 'Har du en handduk?', 'Hast du ein Handtuch?', [['har', 'hast'], ['du', 'du'], ['en', 'ein'], ['handduk', 'Handtuch']], ['c-si-handduk']),
  s('s-si-ha2', 'Har du en handduk extra?', 'Hast du ein Handtuch übrig?', [['har', 'hast'], ['du', 'du'], ['en', 'ein'], ['handduk', 'Handtuch'], ['extra', 'extra']], ['c-si-handduk']),
  s('s-si-dj1', 'Hur djupt är det?', 'Wie tief ist es?', [['hur', 'wie'], ['djupt', 'tief'], ['är', 'ist'], ['det', 'es']], ['c-si-djupt']),
  s('s-si-dj2', 'Hur djupt är det här? Barnen ska bada.', 'Wie tief ist es hier? Die Kinder wollen baden.', [['hur', 'wie'], ['djupt', 'tief'], ['är', 'ist'], ['det', 'es'], ['här', 'hier'], ['barnen', 'die Kinder'], ['ska', 'sollen'], ['bada', 'baden']], ['c-si-djupt']),
];
