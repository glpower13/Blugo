// GESPRÄCHE auf dem Meilenstein A1 — zu den neuen Themen.
//
// ⚠️ EHRLICH: von uns/der KI verfasst, NICHT muttersprachlich geprüft.
// Wortstellung, Idiomatik und Ton hat niemand gegengelesen
// (docs/content-review-schwedisch.md).
//
// REGEL FÜR JEDE „du"-ZEILE: Ihr `sv` ist WÖRTLICH der Chunk — sonst wäre der
// Abruf nicht prüfbar und der Fortschritt aus dem Gespräch kein echtes Können
// (erzwungen in `seedContent.test.ts`). Die Partner-Zeilen sind verständlicher
// Input: neue Wörter sind erlaubt, solange jedes eine Wort-für-Wort-Glosse hat.

import type { Dialog } from '../../domain/dialog';

export const dialogs: Dialog[] = [
  // ── Zeit & Uhrzeit ────────────────────────────────────────────────────────
  {
    id: 'dlg-tid',
    categoryId: 'cat-time',
    title: 'Wann treffen wir uns?',
    blurb: 'Einen Termin ausmachen, sich verspäten, sich verabschieden.',
    scene: 'office',
    partnerName: 'Anna',
    turns: [
      { id: 'tid1', speaker: 'partner', sv: 'Hej {name}! Vi ska ju träffas den här veckan.', de: 'Hallo {name}! Wir wollten uns diese Woche ja treffen.', listenFirst: true, decoding: [{ sv: 'hej', de: 'hallo' }, { sv: 'vi', de: 'wir' }, { sv: 'ska', de: 'sollen' }, { sv: 'ju', de: 'ja' }, { sv: 'träffas', de: 'treffen' }, { sv: 'den', de: 'die' }, { sv: 'här', de: 'hier' }, { sv: 'veckan', de: 'Woche' }] },
      { id: 'tid2', speaker: 'you', sv: 'vilken tid passar dig?', de: 'welche Zeit passt dir?', chunkId: 'c-vilkentidpassar', suggestions: ['Vilken tid passar dig?', 'Vilken dag passar dig?'] },
      { id: 'tid3', speaker: 'partner', sv: 'Torsdag går bra. Vilken tid tänker du?', de: 'Donnerstag geht gut. An welche Zeit denkst du?', decoding: [{ sv: 'torsdag', de: 'Donnerstag' }, { sv: 'går', de: 'geht' }, { sv: 'bra', de: 'gut' }, { sv: 'vilken', de: 'welche' }, { sv: 'tid', de: 'Zeit' }, { sv: 'tänker', de: 'denkst' }, { sv: 'du', de: 'du' }] },
      { id: 'tid4', speaker: 'you', sv: 'klockan är halv fyra', de: 'es ist halb vier', chunkId: 'c-halvfyra', suggestions: ['Klockan är halv fyra.', 'Klockan är kvart över tre.'] },
      { id: 'tid5', speaker: 'partner', sv: 'Bra. Vi ses vid stationen då.', de: 'Gut. Dann sehen wir uns am Bahnhof.', decoding: [{ sv: 'bra', de: 'gut' }, { sv: 'vi', de: 'wir' }, { sv: 'ses', de: 'sehen uns' }, { sv: 'vid', de: 'bei' }, { sv: 'stationen', de: 'dem Bahnhof' }, { sv: 'då', de: 'dann' }] },
      { id: 'tid6', speaker: 'you', sv: 'hur lång tid tar det?', de: 'wie lange dauert das?', chunkId: 'c-hurlangtid', suggestions: ['Hur lång tid tar det?', 'Hur mycket kostar det?'] },
      { id: 'tid7', speaker: 'partner', sv: 'Ungefär tjugo minuter med buss. Jag väntar utanför.', de: 'Etwa zwanzig Minuten mit dem Bus. Ich warte draußen.', decoding: [{ sv: 'ungefär', de: 'ungefähr' }, { sv: 'tjugo', de: 'zwanzig' }, { sv: 'minuter', de: 'Minuten' }, { sv: 'med', de: 'mit' }, { sv: 'buss', de: 'Bus' }, { sv: 'jag', de: 'ich' }, { sv: 'väntar', de: 'warte' }, { sv: 'utanför', de: 'draußen' }] },
      { id: 'tid8', speaker: 'you', sv: 'jag kommer nu', de: 'ich komme jetzt', chunkId: 'c-kommernu', suggestions: ['Jag kommer nu.', 'Jag är på väg.'] },
      { id: 'tid9', speaker: 'partner', sv: 'Ingen stress. Jag måste springa på ett möte sen.', de: 'Kein Stress. Ich muss später zu einem Treffen.', decoding: [{ sv: 'ingen', de: 'kein' }, { sv: 'stress', de: 'Stress' }, { sv: 'jag', de: 'ich' }, { sv: 'måste', de: 'muss' }, { sv: 'springa', de: 'laufen' }, { sv: 'på', de: 'auf' }, { sv: 'ett', de: 'ein' }, { sv: 'möte', de: 'Treffen' }, { sv: 'sen', de: 'später' }] },
      { id: 'tid10', speaker: 'you', sv: 'vi hörs senare', de: 'wir hören uns später', chunkId: 'c-horssenare', suggestions: ['Vi hörs senare.', 'Vi hörs.'] },
      { id: 'tid11', speaker: 'partner', sv: 'Gör det! Ha det bra så länge, {name}.', de: 'Mach das! Bis dahin alles Gute, {name}.', decoding: [{ sv: 'gör', de: 'mach' }, { sv: 'det', de: 'das' }, { sv: 'ha', de: 'hab' }, { sv: 'det', de: 'es' }, { sv: 'bra', de: 'gut' }, { sv: 'så', de: 'so' }, { sv: 'länge', de: 'lange' }] },
      { id: 'tid12', speaker: 'you', sv: 'vi ses i morgon', de: 'wir sehen uns morgen', chunkId: 'c-imorgon', suggestions: ['Vi ses i morgon.', 'Vi ses nästa vecka.'] },
    ],
  },

  // ── Tage & Jahreszeiten ───────────────────────────────────────────────────
  {
    id: 'dlg-vecka',
    categoryId: 'cat-week',
    title: 'Was machst du am Wochenende?',
    blurb: 'Wochentage, freie Tage, Geburtstag — der Kalender auf Schwedisch.',
    scene: 'street',
    partnerName: 'Erik',
    turns: [
      { id: 'vk1', speaker: 'partner', sv: 'Hej! Jag tappar bort mig i veckan. Är det onsdag?', de: 'Hallo! Ich verliere den Überblick. Ist Mittwoch?', listenFirst: true, decoding: [{ sv: 'hej', de: 'hallo' }, { sv: 'jag', de: 'ich' }, { sv: 'tappar', de: 'verliere' }, { sv: 'bort', de: 'weg' }, { sv: 'mig', de: 'mich' }, { sv: 'i', de: 'in' }, { sv: 'veckan', de: 'der Woche' }, { sv: 'är', de: 'ist' }, { sv: 'det', de: 'es' }, { sv: 'onsdag', de: 'Mittwoch' }] },
      { id: 'vk2', speaker: 'you', sv: 'idag är det torsdag', de: 'heute ist Donnerstag', chunkId: 'c-idagartorsdag', suggestions: ['Idag är det torsdag.', 'Idag är det fredag.'] },
      { id: 'vk3', speaker: 'partner', sv: 'Oj! Då hinner jag inte med tvätten.', de: 'Oh! Dann schaffe ich die Wäsche nicht.', decoding: [{ sv: 'oj', de: 'oh' }, { sv: 'då', de: 'dann' }, { sv: 'hinner', de: 'schaffe' }, { sv: 'jag', de: 'ich' }, { sv: 'inte', de: 'nicht' }, { sv: 'med', de: 'mit' }, { sv: 'tvätten', de: 'der Wäsche' }] },
      { id: 'vk4', speaker: 'you', sv: 'det passar på måndag', de: 'am Montag passt es', chunkId: 'c-pamandag', suggestions: ['Det passar på måndag.', 'Det passar på torsdag.'] },
      { id: 'vk5', speaker: 'partner', sv: 'Tack! Och vad gör du på lördag och söndag?', de: 'Danke! Und was machst du am Samstag und Sonntag?', decoding: [{ sv: 'tack', de: 'danke' }, { sv: 'och', de: 'und' }, { sv: 'vad', de: 'was' }, { sv: 'gör', de: 'machst' }, { sv: 'du', de: 'du' }, { sv: 'på', de: 'am' }, { sv: 'lördag', de: 'Samstag' }, { sv: 'och', de: 'und' }, { sv: 'söndag', de: 'Sonntag' }] },
      { id: 'vk6', speaker: 'you', sv: 'jag är ledig i helgen', de: 'am Wochenende habe ich frei', chunkId: 'c-ledigihelgen', suggestions: ['Jag är ledig i helgen.', 'Jag jobbar i helgen.'] },
      { id: 'vk7', speaker: 'partner', sv: 'Perfekt. Vi grillar hemma hos oss om du vill.', de: 'Perfekt. Wir grillen bei uns zu Hause, wenn du magst.', decoding: [{ sv: 'perfekt', de: 'perfekt' }, { sv: 'vi', de: 'wir' }, { sv: 'grillar', de: 'grillen' }, { sv: 'hemma', de: 'daheim' }, { sv: 'hos', de: 'bei' }, { sv: 'oss', de: 'uns' }, { sv: 'om', de: 'wenn' }, { sv: 'du', de: 'du' }, { sv: 'vill', de: 'willst' }] },
      { id: 'vk8', speaker: 'you', sv: 'vi ses nästa vecka', de: 'wir sehen uns nächste Woche', chunkId: 'c-nastavecka', suggestions: ['Vi ses nästa vecka.', 'Vi ses i morgon.'] },
      { id: 'vk9', speaker: 'partner', sv: 'Förresten, det är kalas hos min syster snart.', de: 'Übrigens, bei meiner Schwester gibt es bald eine Feier.', decoding: [{ sv: 'förresten', de: 'übrigens' }, { sv: 'det', de: 'es' }, { sv: 'är', de: 'ist' }, { sv: 'kalas', de: 'Feier' }, { sv: 'hos', de: 'bei' }, { sv: 'min', de: 'meiner' }, { sv: 'syster', de: 'Schwester' }, { sv: 'snart', de: 'bald' }] },
      { id: 'vk10', speaker: 'you', sv: 'när fyller du år?', de: 'wann hast du Geburtstag?', chunkId: 'c-fyllerar', suggestions: ['När fyller du år?', 'Vilken dag är det?'] },
      { id: 'vk11', speaker: 'partner', sv: 'I mars. Men jag är bortrest hela februari.', de: 'Im März. Aber den ganzen Februar bin ich verreist.', decoding: [{ sv: 'i', de: 'im' }, { sv: 'mars', de: 'März' }, { sv: 'men', de: 'aber' }, { sv: 'jag', de: 'ich' }, { sv: 'är', de: 'bin' }, { sv: 'bortrest', de: 'verreist' }, { sv: 'hela', de: 'ganzen' }, { sv: 'februari', de: 'Februar' }] },
      { id: 'vk12', speaker: 'you', sv: 'jag kommer om en vecka', de: 'ich komme in einer Woche', chunkId: 'c-omenvecka', suggestions: ['Jag kommer om en vecka.', 'Jag kommer nu.'] },
    ],
  },

  // ── Fika & Süßes ──────────────────────────────────────────────────────────
  {
    id: 'dlg-fika',
    categoryId: 'cat-fika',
    title: 'Fika: die schwedische Kaffeepause',
    blurb: 'Vorschlagen, Platz suchen, bestellen, nachbestellen.',
    scene: 'cafe',
    partnerName: 'Bedienung',
    turns: [
      { id: 'fk1', speaker: 'partner', sv: 'Kollegan din står vid dörren och väntar.', de: 'Deine Kollegin steht an der Tür und wartet.', listenFirst: true, decoding: [{ sv: 'kollegan', de: 'die Kollegin' }, { sv: 'din', de: 'deine' }, { sv: 'står', de: 'steht' }, { sv: 'vid', de: 'bei' }, { sv: 'dörren', de: 'der Tür' }, { sv: 'och', de: 'und' }, { sv: 'väntar', de: 'wartet' }] },
      { id: 'fk2', speaker: 'you', sv: 'ska vi fika?', de: 'wollen wir Kaffee trinken?', chunkId: 'c-skavifika', suggestions: ['Ska vi fika?', 'Ska vi ses?'] },
      { id: 'fk3', speaker: 'partner', sv: 'Gärna! Det är fullt där inne, men bord finns kvar.', de: 'Gern! Drinnen ist es voll, aber Tische sind noch frei.', decoding: [{ sv: 'gärna', de: 'gern' }, { sv: 'det', de: 'es' }, { sv: 'är', de: 'ist' }, { sv: 'fullt', de: 'voll' }, { sv: 'där', de: 'dort' }, { sv: 'inne', de: 'drinnen' }, { sv: 'men', de: 'aber' }, { sv: 'bord', de: 'Tische' }, { sv: 'finns', de: 'gibt es' }, { sv: 'kvar', de: 'übrig' }] },
      { id: 'fk4', speaker: 'you', sv: 'kan vi sitta här?', de: 'können wir hier sitzen?', chunkId: 'c-sittahar', suggestions: ['Kan vi sitta här?', 'Kan jag sitta här?'] },
      { id: 'fk5', speaker: 'partner', sv: 'Absolut. Vad får det lov att vara?', de: 'Absolut. Was darf es sein?', decoding: [{ sv: 'absolut', de: 'absolut' }, { sv: 'vad', de: 'was' }, { sv: 'får', de: 'darf' }, { sv: 'det', de: 'es' }, { sv: 'lov', de: 'Erlaubnis' }, { sv: 'att', de: 'zu' }, { sv: 'vara', de: 'sein' }] },
      { id: 'fk6', speaker: 'you', sv: 'kaffe och kaka, tack', de: 'Kaffee und Kuchen, bitte', chunkId: 'c-kaffeochkaka', suggestions: ['Kaffe och kaka, tack.', 'Te eller kaffe?'] },
      { id: 'fk7', speaker: 'partner', sv: 'Svart kaffe, eller vill du ha något i?', de: 'Schwarzen Kaffee, oder möchtest du etwas hinein?', decoding: [{ sv: 'svart', de: 'schwarz' }, { sv: 'kaffe', de: 'Kaffee' }, { sv: 'eller', de: 'oder' }, { sv: 'vill', de: 'willst' }, { sv: 'du', de: 'du' }, { sv: 'ha', de: 'haben' }, { sv: 'något', de: 'etwas' }, { sv: 'i', de: 'hinein' }] },
      { id: 'fk8', speaker: 'you', sv: 'med mjölk, tack', de: 'mit Milch, bitte', chunkId: 'c-medmjolk', suggestions: ['Med mjölk, tack.', 'Utan mjölk, tack.'] },
      { id: 'fk9', speaker: 'partner', sv: 'Varsågod. Kakan är bakad i morse.', de: 'Bitte sehr. Der Kuchen ist heute Morgen gebacken.', decoding: [{ sv: 'varsågod', de: 'bitte' }, { sv: 'kakan', de: 'der Kuchen' }, { sv: 'är', de: 'ist' }, { sv: 'bakad', de: 'gebacken' }, { sv: 'i', de: 'am' }, { sv: 'morse', de: 'Morgen' }] },
      { id: 'fk10', speaker: 'you', sv: 'det smakar bra', de: 'das schmeckt gut', chunkId: 'c-smakarbra', suggestions: ['Det smakar bra.', 'Det var gott.'] },
      { id: 'fk11', speaker: 'partner', sv: 'Vad roligt att höra! Räcker det, eller vill du ha mer?', de: 'Schön zu hören! Reicht das, oder möchtest du mehr?', decoding: [{ sv: 'vad', de: 'wie' }, { sv: 'roligt', de: 'schön' }, { sv: 'att', de: 'zu' }, { sv: 'höra', de: 'hören' }, { sv: 'räcker', de: 'reicht' }, { sv: 'det', de: 'es' }, { sv: 'eller', de: 'oder' }, { sv: 'vill', de: 'willst' }, { sv: 'du', de: 'du' }, { sv: 'ha', de: 'haben' }, { sv: 'mer', de: 'mehr' }] },
      { id: 'fk12', speaker: 'you', sv: 'en kopp till, tack', de: 'noch eine Tasse, bitte', chunkId: 'c-enkopptill', suggestions: ['En kopp till, tack.', 'En till, tack.'] },
    ],
  },

  // ── Sprache & Lernen ──────────────────────────────────────────────────────
  {
    id: 'dlg-sprak',
    categoryId: 'cat-language',
    title: 'Beim Sprachtreff',
    blurb: 'Sagen, wo du stehst — und nachfragen, statt zu raten.',
    scene: 'school',
    partnerName: 'Sara',
    turns: [
      { id: 'sp1', speaker: 'partner', sv: 'Välkommen! Har du pratat svenska länge?', de: 'Willkommen! Sprichst du schon lange Schwedisch?', listenFirst: true, decoding: [{ sv: 'välkommen', de: 'willkommen' }, { sv: 'har', de: 'hast' }, { sv: 'du', de: 'du' }, { sv: 'pratat', de: 'gesprochen' }, { sv: 'svenska', de: 'Schwedisch' }, { sv: 'länge', de: 'lange' }] },
      { id: 'sp2', speaker: 'you', sv: 'jag är nybörjare', de: 'ich bin Anfänger', chunkId: 'c-jagarnyborjare', suggestions: ['Jag är nybörjare.', 'Jag pratar lite svenska.'] },
      { id: 'sp3', speaker: 'partner', sv: 'Ingen fara, alla börjar där. Varför just svenska?', de: 'Kein Problem, alle fangen dort an. Warum ausgerechnet Schwedisch?', decoding: [{ sv: 'ingen', de: 'keine' }, { sv: 'fara', de: 'Gefahr' }, { sv: 'alla', de: 'alle' }, { sv: 'börjar', de: 'beginnen' }, { sv: 'där', de: 'dort' }, { sv: 'varför', de: 'warum' }, { sv: 'just', de: 'gerade' }, { sv: 'svenska', de: 'Schwedisch' }] },
      { id: 'sp4', speaker: 'you', sv: 'jag lär mig svenska', de: 'ich lerne Schwedisch', chunkId: 'c-larmigsvenska', suggestions: ['Jag lär mig svenska.', 'Jag övar varje dag.'] },
      { id: 'sp5', speaker: 'partner', sv: 'Bra! Här är ett ord som många tycker är svårt: sjuksköterska.', de: 'Gut! Hier ist ein Wort, das viele schwer finden: Krankenschwester.', decoding: [{ sv: 'bra', de: 'gut' }, { sv: 'här', de: 'hier' }, { sv: 'är', de: 'ist' }, { sv: 'ett', de: 'ein' }, { sv: 'ord', de: 'Wort' }, { sv: 'som', de: 'das' }, { sv: 'många', de: 'viele' }, { sv: 'tycker', de: 'finden' }, { sv: 'är', de: 'ist' }, { sv: 'svårt', de: 'schwer' }, { sv: 'sjuksköterska', de: 'Krankenschwester' }] },
      { id: 'sp6', speaker: 'you', sv: 'hur uttalar man det?', de: 'wie spricht man das aus?', chunkId: 'c-hururtalar', suggestions: ['Hur uttalar man det?', 'Hur stavar man det?'] },
      { id: 'sp7', speaker: 'partner', sv: 'Lyssna långsamt, säg det sedan efter mig.', de: 'Hör langsam zu, sag es dann nach.', decoding: [{ sv: 'lyssna', de: 'höre' }, { sv: 'långsamt', de: 'langsam' }, { sv: 'säg', de: 'sage' }, { sv: 'det', de: 'es' }, { sv: 'sedan', de: 'dann' }, { sv: 'efter', de: 'nach' }, { sv: 'mig', de: 'mir' }] },
      { id: 'sp8', speaker: 'you', sv: 'kan du skriva det?', de: 'kannst du das schreiben?', chunkId: 'c-kanduskriva', suggestions: ['Kan du skriva det?', 'Kan du upprepa?'] },
      { id: 'sp9', speaker: 'partner', sv: 'Visst. Och här står ett till: lagom.', de: 'Klar. Und hier steht noch eins: lagom.', decoding: [{ sv: 'visst', de: 'klar' }, { sv: 'och', de: 'und' }, { sv: 'här', de: 'hier' }, { sv: 'står', de: 'steht' }, { sv: 'ett', de: 'eins' }, { sv: 'till', de: 'noch' }, { sv: 'lagom', de: 'gerade genug' }] },
      { id: 'sp10', speaker: 'you', sv: 'vad är det för ord?', de: 'was ist das für ein Wort?', chunkId: 'c-vadardetforord', suggestions: ['Vad är det för ord?', 'Vad betyder det?'] },
      { id: 'sp11', speaker: 'partner', sv: 'Ett väldigt svenskt ord. Inte för mycket, inte för lite.', de: 'Ein sehr schwedisches Wort. Nicht zu viel, nicht zu wenig.', decoding: [{ sv: 'ett', de: 'ein' }, { sv: 'väldigt', de: 'sehr' }, { sv: 'svenskt', de: 'schwedisches' }, { sv: 'ord', de: 'Wort' }, { sv: 'inte', de: 'nicht' }, { sv: 'för', de: 'zu' }, { sv: 'mycket', de: 'viel' }, { sv: 'inte', de: 'nicht' }, { sv: 'för', de: 'zu' }, { sv: 'lite', de: 'wenig' }] },
      { id: 'sp12', speaker: 'you', sv: 'jag övar varje dag', de: 'ich übe jeden Tag', chunkId: 'c-ovarvarjedag', suggestions: ['Jag övar varje dag.', 'Jag lär mig svenska.'] },
    ],
  },

  // ── Small Talk ────────────────────────────────────────────────────────────
  {
    id: 'dlg-smalltalk',
    categoryId: 'cat-smalltalk',
    title: 'Im Treppenhaus',
    blurb: 'Zwei Minuten plaudern — und sich freundlich losreißen.',
    scene: 'street',
    partnerName: 'Nachbarin',
    turns: [
      { id: 'st1', speaker: 'partner', sv: 'Hej {name}! Länge sedan vi sågs.', de: 'Hallo {name}! Lange her, dass wir uns gesehen haben.', listenFirst: true, decoding: [{ sv: 'hej', de: 'hallo' }, { sv: 'länge', de: 'lange' }, { sv: 'sedan', de: 'seit' }, { sv: 'vi', de: 'wir' }, { sv: 'sågs', de: 'uns sahen' }] },
      { id: 'st2', speaker: 'you', sv: 'hur går det?', de: 'wie läuft es?', chunkId: 'c-hurgardet', suggestions: ['Hur går det?', 'Hur mår du?'] },
      { id: 'st3', speaker: 'partner', sv: 'Jo tack, bra. Mycket att göra på jobbet bara. Och du?', de: 'Danke, gut. Nur viel zu tun auf der Arbeit. Und du?', decoding: [{ sv: 'jo', de: 'doch' }, { sv: 'tack', de: 'danke' }, { sv: 'bra', de: 'gut' }, { sv: 'mycket', de: 'viel' }, { sv: 'att', de: 'zu' }, { sv: 'göra', de: 'tun' }, { sv: 'på', de: 'auf' }, { sv: 'jobbet', de: 'der Arbeit' }, { sv: 'bara', de: 'nur' }, { sv: 'och', de: 'und' }, { sv: 'du', de: 'du' }] },
      { id: 'st4', speaker: 'you', sv: 'det går bra, tack', de: 'es läuft gut, danke', chunkId: 'c-detgarbra', suggestions: ['Det går bra, tack.', 'Jag mår bra.'] },
      { id: 'st5', speaker: 'partner', sv: 'Vi fick förresten en ny lägenhet i höst.', de: 'Wir haben übrigens im Herbst eine neue Wohnung bekommen.', decoding: [{ sv: 'vi', de: 'wir' }, { sv: 'fick', de: 'bekamen' }, { sv: 'förresten', de: 'übrigens' }, { sv: 'en', de: 'eine' }, { sv: 'ny', de: 'neue' }, { sv: 'lägenhet', de: 'Wohnung' }, { sv: 'i', de: 'im' }, { sv: 'höst', de: 'Herbst' }] },
      { id: 'st6', speaker: 'you', sv: 'vad roligt!', de: 'wie schön!', chunkId: 'c-vadroligt', suggestions: ['Vad roligt!', 'Så synd!'] },
      { id: 'st7', speaker: 'partner', sv: 'Ja, men flytten blir jobbig. Vi packar redan.', de: 'Ja, aber der Umzug wird anstrengend. Wir packen schon.', decoding: [{ sv: 'ja', de: 'ja' }, { sv: 'men', de: 'aber' }, { sv: 'flytten', de: 'der Umzug' }, { sv: 'blir', de: 'wird' }, { sv: 'jobbig', de: 'anstrengend' }, { sv: 'vi', de: 'wir' }, { sv: 'packar', de: 'packen' }, { sv: 'redan', de: 'schon' }] },
      { id: 'st8', speaker: 'you', sv: 'vi måste ses snart', de: 'wir müssen uns bald sehen', chunkId: 'c-sessnart', suggestions: ['Vi måste ses snart.', 'Vi ses nästa vecka.'] },
      { id: 'st9', speaker: 'partner', sv: 'Absolut! Kom förbi på kaffe när du vill.', de: 'Unbedingt! Komm auf einen Kaffee vorbei, wann du willst.', decoding: [{ sv: 'absolut', de: 'absolut' }, { sv: 'kom', de: 'komm' }, { sv: 'förbi', de: 'vorbei' }, { sv: 'på', de: 'auf' }, { sv: 'kaffe', de: 'Kaffee' }, { sv: 'när', de: 'wann' }, { sv: 'du', de: 'du' }, { sv: 'vill', de: 'willst' }] },
      { id: 'st10', speaker: 'you', sv: 'jag måste gå nu', de: 'ich muss jetzt gehen', chunkId: 'c-mastega', suggestions: ['Jag måste gå nu.', 'Jag måste lägga på.'] },
      { id: 'st11', speaker: 'partner', sv: 'Självklart. Spring du, {name}!', de: 'Natürlich. Lauf du nur, {name}!', decoding: [{ sv: 'självklart', de: 'selbstverständlich' }, { sv: 'spring', de: 'lauf' }, { sv: 'du', de: 'du' }] },
      { id: 'st12', speaker: 'you', sv: 'det var trevligt', de: 'das war nett', chunkId: 'c-vartrevligt', suggestions: ['Det var trevligt.', 'Trevligt att träffas.'] },
    ],
  },
];
