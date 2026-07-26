// Ausbau 5 (2026-07-26): Allergien, Tierarzt, Reparieren, Kino & Theater.
//
// „Allergien & Ernährung" steht bewusst weit vorn im Essens-Bereich: Es ist das
// einzige Thema dieser App, bei dem ein nicht verstandener Satz gefährlich
// werden kann.

import type { Category, Chunk, Segment } from '../../domain/chunk';

export const categories: Category[] = [
  { id: 'cat-allergy', areaId: 'area-food', title: 'Allergien & Ernährung', blurb: 'Sagen, was du nicht verträgst — und danach fragen, was drin ist.', order: 6, cefr: 'A2' },
  { id: 'cat-vet', areaId: 'area-home', title: 'Beim Tierarzt', blurb: 'Wenn das Tier krank ist: erklären, was los ist.', order: 6, cefr: 'B1' },
  { id: 'cat-repair', areaId: 'area-home', title: 'Reparieren zu Hause', blurb: 'Tropfender Hahn, klemmende Tür, kaputte Lampe.', order: 7, cefr: 'A2' },
  { id: 'cat-cinema', areaId: 'area-friends', title: 'Kino & Theater', blurb: 'Karten, Sitzplätze, Untertitel — und wie es dir gefallen hat.', order: 10, cefr: 'A2' },
];

const c = (id: string, categoryId: string, sv: string, de: string, d: [string, string][]): Chunk => ({
  id, categoryId, sv, de, decoding: d.map(([a, b]) => ({ sv: a, de: b })),
});
const s = (id: string, sv: string, de: string, d: [string, string][], chunkIds: string[]): Segment => ({
  id, level: 2, sv, de, decoding: d.map(([a, b]) => ({ sv: a, de: b })), chunkIds,
});

export const chunks: Chunk[] = [
  // ── Allergien & Ernährung ─────────────────────────────────────────────────
  c('c-al-allergisk', 'cat-allergy', 'jag är allergisk mot nötter', 'ich bin allergisch gegen Nüsse', [['jag', 'ich'], ['är', 'bin'], ['allergisk', 'allergisch'], ['mot', 'gegen'], ['nötter', 'Nüsse']]),
  c('c-al-innehaller', 'cat-allergy', 'vad innehåller den?', 'was ist da drin?', [['vad', 'was'], ['innehåller', 'enthält'], ['den', 'sie']]),
  c('c-al-glutenfri', 'cat-allergy', 'finns det något glutenfritt?', 'gibt es etwas Glutenfreies?', [['finns', 'gibt es'], ['det', 'es'], ['något', 'etwas'], ['glutenfritt', 'Glutenfreies']]),
  c('c-al-vegetarian', 'cat-allergy', 'jag äter inget kött', 'ich esse kein Fleisch', [['jag', 'ich'], ['äter', 'esse'], ['inget', 'kein'], ['kött', 'Fleisch']]),
  c('c-al-laktos', 'cat-allergy', 'jag tål inte laktos', 'ich vertrage keine Laktose', [['jag', 'ich'], ['tål', 'vertrage'], ['inte', 'nicht'], ['laktos', 'Laktose']]),
  c('c-al-viktigt', 'cat-allergy', 'det är viktigt för mig', 'das ist wichtig für mich', [['det', 'es'], ['är', 'ist'], ['viktigt', 'wichtig'], ['för', 'für'], ['mig', 'mich']]),
  c('c-al-utan', 'cat-allergy', 'kan ni göra den utan ost?', 'könnt ihr die ohne Käse machen?', [['kan', 'könnt'], ['ni', 'ihr'], ['göra', 'machen'], ['den', 'sie'], ['utan', 'ohne'], ['ost', 'Käse']]),

  // ── Beim Tierarzt ─────────────────────────────────────────────────────────
  c('c-vt-sjuk', 'cat-vet', 'min hund är sjuk', 'mein Hund ist krank', [['min', 'mein'], ['hund', 'Hund'], ['är', 'ist'], ['sjuk', 'krank']]),
  c('c-vt-ater', 'cat-vet', 'den äter inget', 'er frisst nichts', [['den', 'er'], ['äter', 'isst'], ['inget', 'nichts']]),
  c('c-vt-sedan', 'cat-vet', 'det har varit så i två dagar', 'das ist seit zwei Tagen so', [['det', 'es'], ['har', 'ist'], ['varit', 'gewesen'], ['så', 'so'], ['i', 'in'], ['två', 'zwei'], ['dagar', 'Tagen']]),
  c('c-vt-halta', 'cat-vet', 'den haltar på bakbenet', 'er humpelt auf dem Hinterbein', [['den', 'er'], ['haltar', 'hinkt'], ['på', 'auf'], ['bakbenet', 'dem Hinterbein']]),
  c('c-vt-vaccin', 'cat-vet', 'behöver den vaccin?', 'braucht er eine Impfung?', [['behöver', 'braucht'], ['den', 'er'], ['vaccin', 'Impfstoff']]),
  c('c-vt-medicin', 'cat-vet', 'hur ofta ska den ha medicinen?', 'wie oft soll er das Medikament bekommen?', [['hur', 'wie'], ['ofta', 'oft'], ['ska', 'soll'], ['den', 'er'], ['ha', 'haben'], ['medicinen', 'das Medikament']]),
  c('c-vt-orolig', 'cat-vet', 'jag är orolig för den', 'ich mache mir Sorgen um ihn', [['jag', 'ich'], ['är', 'bin'], ['orolig', 'besorgt'], ['för', 'für'], ['den', 'ihn']]),

  // ── Reparieren zu Hause ───────────────────────────────────────────────────
  c('c-rp-droppar', 'cat-repair', 'kranen droppar', 'der Hahn tropft', [['kranen', 'der Hahn'], ['droppar', 'tropft']]),
  c('c-rp-lampan', 'cat-repair', 'lampan fungerar inte', 'die Lampe geht nicht', [['lampan', 'die Lampe'], ['fungerar', 'funktioniert'], ['inte', 'nicht']]),
  c('c-rp-dorren', 'cat-repair', 'dörren går inte att stänga', 'die Tür lässt sich nicht schließen', [['dörren', 'die Tür'], ['går', 'geht'], ['inte', 'nicht'], ['att', 'zu'], ['stänga', 'schließen']]),
  c('c-rp-verktyg', 'cat-repair', 'jag behöver verktyg', 'ich brauche Werkzeug', [['jag', 'ich'], ['behöver', 'brauche'], ['verktyg', 'Werkzeug']]),
  c('c-rp-sjalv', 'cat-repair', 'jag fixar det själv', 'ich mache das selbst', [['jag', 'ich'], ['fixar', 'richte'], ['det', 'es'], ['själv', 'selbst']]),
  c('c-rp-ringa', 'cat-repair', 'vi får ringa en hantverkare', 'wir müssen einen Handwerker rufen', [['vi', 'wir'], ['får', 'dürfen'], ['ringa', 'anrufen'], ['en', 'einen'], ['hantverkare', 'Handwerker']]),
  c('c-rp-vantar', 'cat-repair', 'det kan vänta till helgen', 'das kann bis zum Wochenende warten', [['det', 'es'], ['kan', 'kann'], ['vänta', 'warten'], ['till', 'zu'], ['helgen', 'dem Wochenende']]),

  // ── Kino & Theater ────────────────────────────────────────────────────────
  c('c-ki-tvabiljetter', 'cat-cinema', 'två biljetter, tack', 'zwei Karten, bitte', [['två', 'zwei'], ['biljetter', 'Tickets'], ['tack', 'bitte']]),
  c('c-ki-vilkensalong', 'cat-cinema', 'vilken salong är det?', 'welcher Saal ist es?', [['vilken', 'welcher'], ['salong', 'Saal'], ['är', 'ist'], ['det', 'es']]),
  c('c-ki-textad', 'cat-cinema', 'är filmen textad?', 'hat der Film Untertitel?', [['är', 'ist'], ['filmen', 'der Film'], ['textad', 'untertitelt']]),
  c('c-ki-plats', 'cat-cinema', 'ursäkta, det är min plats', 'Entschuldigung, das ist mein Platz', [['ursäkta', 'entschuldige'], ['det', 'das'], ['är', 'ist'], ['min', 'mein'], ['plats', 'Platz']]),
  c('c-ki-paus', 'cat-cinema', 'när är pausen?', 'wann ist die Pause?', [['när', 'wann'], ['är', 'ist'], ['pausen', 'die Pause']]),
  c('c-ki-tyckte', 'cat-cinema', 'vad tyckte du om den?', 'wie fandest du ihn?', [['vad', 'was'], ['tyckte', 'meintest'], ['du', 'du'], ['om', 'über'], ['den', 'ihn']]),
  c('c-ki-vardvart', 'cat-cinema', 'den var värd att se', 'er war sehenswert', [['den', 'er'], ['var', 'war'], ['värd', 'wert'], ['att', 'zu'], ['se', 'sehen']]),
];

export const segments: Segment[] = [
  // Allergien
  s('s-al-al1', 'Jag är allergisk mot nötter.', 'Ich bin allergisch gegen Nüsse.', [['jag', 'ich'], ['är', 'bin'], ['allergisk', 'allergisch'], ['mot', 'gegen'], ['nötter', 'Nüsse']], ['c-al-allergisk']),
  s('s-al-al2', 'Jag är allergisk mot nötter, även spår av dem.', 'Ich bin allergisch gegen Nüsse, auch gegen Spuren davon.', [['jag', 'ich'], ['är', 'bin'], ['allergisk', 'allergisch'], ['mot', 'gegen'], ['nötter', 'Nüsse'], ['även', 'auch'], ['spår', 'Spuren'], ['av', 'von'], ['dem', 'ihnen']], ['c-al-allergisk']),
  s('s-al-al3', 'Jag är allergisk mot nötter. Det är viktigt för mig.', 'Ich bin allergisch gegen Nüsse. Das ist wichtig für mich.', [['jag', 'ich'], ['är', 'bin'], ['allergisk', 'allergisch'], ['mot', 'gegen'], ['nötter', 'Nüsse'], ['det', 'es'], ['är', 'ist'], ['viktigt', 'wichtig'], ['för', 'für'], ['mig', 'mich']], ['c-al-allergisk', 'c-al-viktigt']),
  s('s-al-in1', 'Vad innehåller den?', 'Was ist da drin?', [['vad', 'was'], ['innehåller', 'enthält'], ['den', 'sie']], ['c-al-innehaller']),
  s('s-al-in2', 'Vad innehåller den? Jag måste veta.', 'Was ist da drin? Ich muss es wissen.', [['vad', 'was'], ['innehåller', 'enthält'], ['den', 'sie'], ['jag', 'ich'], ['måste', 'muss'], ['veta', 'wissen']], ['c-al-innehaller']),
  s('s-al-gl1', 'Finns det något glutenfritt?', 'Gibt es etwas Glutenfreies?', [['finns', 'gibt es'], ['det', 'es'], ['något', 'etwas'], ['glutenfritt', 'Glutenfreies']], ['c-al-glutenfri']),
  s('s-al-gl2', 'Finns det något glutenfritt på menyn?', 'Gibt es auf der Karte etwas Glutenfreies?', [['finns', 'gibt es'], ['det', 'es'], ['något', 'etwas'], ['glutenfritt', 'Glutenfreies'], ['på', 'auf'], ['menyn', 'der Karte']], ['c-al-glutenfri']),
  s('s-al-ve1', 'Jag äter inget kött.', 'Ich esse kein Fleisch.', [['jag', 'ich'], ['äter', 'esse'], ['inget', 'kein'], ['kött', 'Fleisch']], ['c-al-vegetarian']),
  s('s-al-ve2', 'Jag äter inget kött, men fisk går bra.', 'Ich esse kein Fleisch, aber Fisch geht.', [['jag', 'ich'], ['äter', 'esse'], ['inget', 'kein'], ['kött', 'Fleisch'], ['men', 'aber'], ['fisk', 'Fisch'], ['går', 'geht'], ['bra', 'gut']], ['c-al-vegetarian']),
  s('s-al-la1', 'Jag tål inte laktos.', 'Ich vertrage keine Laktose.', [['jag', 'ich'], ['tål', 'vertrage'], ['inte', 'nicht'], ['laktos', 'Laktose']], ['c-al-laktos']),
  s('s-al-la2', 'Jag tål inte laktos, har ni havremjölk?', 'Ich vertrage keine Laktose, habt ihr Hafermilch?', [['jag', 'ich'], ['tål', 'vertrage'], ['inte', 'nicht'], ['laktos', 'Laktose'], ['har', 'habt'], ['ni', 'ihr'], ['havremjölk', 'Hafermilch']], ['c-al-laktos']),
  s('s-al-vi1', 'Det är viktigt för mig.', 'Das ist wichtig für mich.', [['det', 'es'], ['är', 'ist'], ['viktigt', 'wichtig'], ['för', 'für'], ['mig', 'mich']], ['c-al-viktigt']),
  s('s-al-vi2', 'Det är viktigt för mig, inte bara en smaksak.', 'Das ist wichtig für mich, nicht nur Geschmackssache.', [['det', 'es'], ['är', 'ist'], ['viktigt', 'wichtig'], ['för', 'für'], ['mig', 'mich'], ['inte', 'nicht'], ['bara', 'nur'], ['en', 'eine'], ['smaksak', 'Geschmackssache']], ['c-al-viktigt']),
  s('s-al-ut1', 'Kan ni göra den utan ost?', 'Könnt ihr die ohne Käse machen?', [['kan', 'könnt'], ['ni', 'ihr'], ['göra', 'machen'], ['den', 'sie'], ['utan', 'ohne'], ['ost', 'Käse']], ['c-al-utan']),
  s('s-al-ut2', 'Kan ni göra den utan ost, tack?', 'Könnt ihr die ohne Käse machen, bitte?', [['kan', 'könnt'], ['ni', 'ihr'], ['göra', 'machen'], ['den', 'sie'], ['utan', 'ohne'], ['ost', 'Käse'], ['tack', 'bitte']], ['c-al-utan']),

  // Tierarzt
  s('s-vt-sj1', 'Min hund är sjuk.', 'Mein Hund ist krank.', [['min', 'mein'], ['hund', 'Hund'], ['är', 'ist'], ['sjuk', 'krank']], ['c-vt-sjuk']),
  s('s-vt-sj2', 'Min hund är sjuk, den är helt matt.', 'Mein Hund ist krank, er ist ganz matt.', [['min', 'mein'], ['hund', 'Hund'], ['är', 'ist'], ['sjuk', 'krank'], ['den', 'er'], ['är', 'ist'], ['helt', 'ganz'], ['matt', 'matt']], ['c-vt-sjuk']),
  s('s-vt-at1', 'Den äter inget.', 'Er frisst nichts.', [['den', 'er'], ['äter', 'isst'], ['inget', 'nichts']], ['c-vt-ater']),
  s('s-vt-at2', 'Den äter inget och dricker lite.', 'Er frisst nichts und trinkt wenig.', [['den', 'er'], ['äter', 'isst'], ['inget', 'nichts'], ['och', 'und'], ['dricker', 'trinkt'], ['lite', 'wenig']], ['c-vt-ater']),
  s('s-vt-se1', 'Det har varit så i två dagar.', 'Das ist seit zwei Tagen so.', [['det', 'es'], ['har', 'ist'], ['varit', 'gewesen'], ['så', 'so'], ['i', 'in'], ['två', 'zwei'], ['dagar', 'Tagen']], ['c-vt-sedan']),
  s('s-vt-se2', 'Det har varit så i två dagar, inte längre.', 'Das ist seit zwei Tagen so, nicht länger.', [['det', 'es'], ['har', 'ist'], ['varit', 'gewesen'], ['så', 'so'], ['i', 'in'], ['två', 'zwei'], ['dagar', 'Tagen'], ['inte', 'nicht'], ['längre', 'länger']], ['c-vt-sedan']),
  s('s-vt-ha1', 'Den haltar på bakbenet.', 'Er humpelt auf dem Hinterbein.', [['den', 'er'], ['haltar', 'hinkt'], ['på', 'auf'], ['bakbenet', 'dem Hinterbein']], ['c-vt-halta']),
  s('s-vt-ha2', 'Den haltar på bakbenet sedan promenaden.', 'Er humpelt seit dem Spaziergang auf dem Hinterbein.', [['den', 'er'], ['haltar', 'hinkt'], ['på', 'auf'], ['bakbenet', 'dem Hinterbein'], ['sedan', 'seit'], ['promenaden', 'dem Spaziergang']], ['c-vt-halta']),
  s('s-vt-va1', 'Behöver den vaccin?', 'Braucht er eine Impfung?', [['behöver', 'braucht'], ['den', 'er'], ['vaccin', 'Impfstoff']], ['c-vt-vaccin']),
  s('s-vt-va2', 'Behöver den vaccin i år också?', 'Braucht er dieses Jahr auch eine Impfung?', [['behöver', 'braucht'], ['den', 'er'], ['vaccin', 'Impfstoff'], ['i', 'in'], ['år', 'Jahr'], ['också', 'auch']], ['c-vt-vaccin']),
  s('s-vt-me1', 'Hur ofta ska den ha medicinen?', 'Wie oft soll er das Medikament bekommen?', [['hur', 'wie'], ['ofta', 'oft'], ['ska', 'soll'], ['den', 'er'], ['ha', 'haben'], ['medicinen', 'das Medikament']], ['c-vt-medicin']),
  s('s-vt-me2', 'Hur ofta ska den ha medicinen, och hur länge?', 'Wie oft soll er das Medikament bekommen, und wie lange?', [['hur', 'wie'], ['ofta', 'oft'], ['ska', 'soll'], ['den', 'er'], ['ha', 'haben'], ['medicinen', 'das Medikament'], ['och', 'und'], ['hur', 'wie'], ['länge', 'lange']], ['c-vt-medicin']),
  s('s-vt-or1', 'Jag är orolig för den.', 'Ich mache mir Sorgen um ihn.', [['jag', 'ich'], ['är', 'bin'], ['orolig', 'besorgt'], ['för', 'für'], ['den', 'ihn']], ['c-vt-orolig']),
  s('s-vt-or2', 'Jag är orolig för den, den är aldrig så här.', 'Ich mache mir Sorgen um ihn, er ist nie so.', [['jag', 'ich'], ['är', 'bin'], ['orolig', 'besorgt'], ['för', 'für'], ['den', 'ihn'], ['den', 'er'], ['är', 'ist'], ['aldrig', 'nie'], ['så', 'so'], ['här', 'hier']], ['c-vt-orolig']),

  // Reparieren
  s('s-rp-dr1', 'Kranen droppar.', 'Der Hahn tropft.', [['kranen', 'der Hahn'], ['droppar', 'tropft']], ['c-rp-droppar']),
  s('s-rp-dr2', 'Kranen droppar hela natten.', 'Der Hahn tropft die ganze Nacht.', [['kranen', 'der Hahn'], ['droppar', 'tropft'], ['hela', 'die ganze'], ['natten', 'Nacht']], ['c-rp-droppar']),
  s('s-rp-la1', 'Lampan fungerar inte.', 'Die Lampe geht nicht.', [['lampan', 'die Lampe'], ['fungerar', 'funktioniert'], ['inte', 'nicht']], ['c-rp-lampan']),
  s('s-rp-la2', 'Lampan fungerar inte, kanske är det glödlampan.', 'Die Lampe geht nicht, vielleicht ist es die Glühbirne.', [['lampan', 'die Lampe'], ['fungerar', 'funktioniert'], ['inte', 'nicht'], ['kanske', 'vielleicht'], ['är', 'ist'], ['det', 'es'], ['glödlampan', 'die Glühbirne']], ['c-rp-lampan']),
  s('s-rp-do1', 'Dörren går inte att stänga.', 'Die Tür lässt sich nicht schließen.', [['dörren', 'die Tür'], ['går', 'geht'], ['inte', 'nicht'], ['att', 'zu'], ['stänga', 'schließen']], ['c-rp-dorren']),
  s('s-rp-do2', 'Dörren går inte att stänga sedan i går.', 'Die Tür lässt sich seit gestern nicht schließen.', [['dörren', 'die Tür'], ['går', 'geht'], ['inte', 'nicht'], ['att', 'zu'], ['stänga', 'schließen'], ['sedan', 'seit'], ['i', 'am'], ['går', 'gestern']], ['c-rp-dorren']),
  s('s-rp-ve1', 'Jag behöver verktyg.', 'Ich brauche Werkzeug.', [['jag', 'ich'], ['behöver', 'brauche'], ['verktyg', 'Werkzeug']], ['c-rp-verktyg']),
  s('s-rp-ve2', 'Jag behöver verktyg, har du något?', 'Ich brauche Werkzeug, hast du etwas?', [['jag', 'ich'], ['behöver', 'brauche'], ['verktyg', 'Werkzeug'], ['har', 'hast'], ['du', 'du'], ['något', 'etwas']], ['c-rp-verktyg']),
  s('s-rp-sj1', 'Jag fixar det själv.', 'Ich mache das selbst.', [['jag', 'ich'], ['fixar', 'richte'], ['det', 'es'], ['själv', 'selbst']], ['c-rp-sjalv']),
  s('s-rp-sj2', 'Jag fixar det själv, det är inte svårt.', 'Ich mache das selbst, es ist nicht schwer.', [['jag', 'ich'], ['fixar', 'richte'], ['det', 'es'], ['själv', 'selbst'], ['det', 'es'], ['är', 'ist'], ['inte', 'nicht'], ['svårt', 'schwer']], ['c-rp-sjalv']),
  s('s-rp-ri1', 'Vi får ringa en hantverkare.', 'Wir müssen einen Handwerker rufen.', [['vi', 'wir'], ['får', 'dürfen'], ['ringa', 'anrufen'], ['en', 'einen'], ['hantverkare', 'Handwerker']], ['c-rp-ringa']),
  s('s-rp-ri2', 'Vi får ringa en hantverkare, jag klarar det inte.', 'Wir müssen einen Handwerker rufen, ich schaffe es nicht.', [['vi', 'wir'], ['får', 'dürfen'], ['ringa', 'anrufen'], ['en', 'einen'], ['hantverkare', 'Handwerker'], ['jag', 'ich'], ['klarar', 'schaffe'], ['det', 'es'], ['inte', 'nicht']], ['c-rp-ringa']),
  s('s-rp-vt1', 'Det kan vänta till helgen.', 'Das kann bis zum Wochenende warten.', [['det', 'es'], ['kan', 'kann'], ['vänta', 'warten'], ['till', 'zu'], ['helgen', 'dem Wochenende']], ['c-rp-vantar']),
  s('s-rp-vt2', 'Det kan vänta till helgen, inget brådskar.', 'Das kann bis zum Wochenende warten, nichts eilt.', [['det', 'es'], ['kan', 'kann'], ['vänta', 'warten'], ['till', 'zu'], ['helgen', 'dem Wochenende'], ['inget', 'nichts'], ['brådskar', 'eilt']], ['c-rp-vantar']),

  // Kino
  s('s-ki-bi1', 'Två biljetter, tack.', 'Zwei Karten, bitte.', [['två', 'zwei'], ['biljetter', 'Tickets'], ['tack', 'bitte']], ['c-ki-tvabiljetter']),
  s('s-ki-bi2', 'Två biljetter, tack. Till klockan sju.', 'Zwei Karten, bitte. Für sieben Uhr.', [['två', 'zwei'], ['biljetter', 'Tickets'], ['tack', 'bitte'], ['till', 'zu'], ['klockan', 'die Uhr'], ['sju', 'sieben']], ['c-ki-tvabiljetter']),
  s('s-ki-sa1', 'Vilken salong är det?', 'Welcher Saal ist es?', [['vilken', 'welcher'], ['salong', 'Saal'], ['är', 'ist'], ['det', 'es']], ['c-ki-vilkensalong']),
  s('s-ki-sa2', 'Vilken salong är det, den stora?', 'Welcher Saal ist es, der große?', [['vilken', 'welcher'], ['salong', 'Saal'], ['är', 'ist'], ['det', 'es'], ['den', 'der'], ['stora', 'große']], ['c-ki-vilkensalong']),
  s('s-ki-te1', 'Är filmen textad?', 'Hat der Film Untertitel?', [['är', 'ist'], ['filmen', 'der Film'], ['textad', 'untertitelt']], ['c-ki-textad']),
  s('s-ki-te2', 'Är filmen textad på svenska?', 'Hat der Film schwedische Untertitel?', [['är', 'ist'], ['filmen', 'der Film'], ['textad', 'untertitelt'], ['på', 'auf'], ['svenska', 'Schwedisch']], ['c-ki-textad']),
  s('s-ki-pl1', 'Ursäkta, det är min plats.', 'Entschuldigung, das ist mein Platz.', [['ursäkta', 'entschuldige'], ['det', 'das'], ['är', 'ist'], ['min', 'mein'], ['plats', 'Platz']], ['c-ki-plats']),
  s('s-ki-pl2', 'Ursäkta, det är min plats — rad fem.', 'Entschuldigung, das ist mein Platz — Reihe fünf.', [['ursäkta', 'entschuldige'], ['det', 'das'], ['är', 'ist'], ['min', 'mein'], ['plats', 'Platz'], ['rad', 'Reihe'], ['fem', 'fünf']], ['c-ki-plats']),
  s('s-ki-pa1', 'När är pausen?', 'Wann ist die Pause?', [['när', 'wann'], ['är', 'ist'], ['pausen', 'die Pause']], ['c-ki-paus']),
  s('s-ki-pa2', 'När är pausen, efter första akten?', 'Wann ist die Pause, nach dem ersten Akt?', [['när', 'wann'], ['är', 'ist'], ['pausen', 'die Pause'], ['efter', 'nach'], ['första', 'ersten'], ['akten', 'dem Akt']], ['c-ki-paus']),
  s('s-ki-ty1', 'Vad tyckte du om den?', 'Wie fandest du ihn?', [['vad', 'was'], ['tyckte', 'meintest'], ['du', 'du'], ['om', 'über'], ['den', 'ihn']], ['c-ki-tyckte']),
  s('s-ki-ty2', 'Vad tyckte du om den? Jag var förvånad.', 'Wie fandest du ihn? Ich war überrascht.', [['vad', 'was'], ['tyckte', 'meintest'], ['du', 'du'], ['om', 'über'], ['den', 'ihn'], ['jag', 'ich'], ['var', 'war'], ['förvånad', 'überrascht']], ['c-ki-tyckte']),
  s('s-ki-vd1', 'Den var värd att se.', 'Er war sehenswert.', [['den', 'er'], ['var', 'war'], ['värd', 'wert'], ['att', 'zu'], ['se', 'sehen']], ['c-ki-vardvart']),
  s('s-ki-vd2', 'Den var värd att se, även på bio.', 'Er war sehenswert, sogar im Kino.', [['den', 'er'], ['var', 'war'], ['värd', 'wert'], ['att', 'zu'], ['se', 'sehen'], ['även', 'auch'], ['på', 'im'], ['bio', 'Kino']], ['c-ki-vardvart']),
];
