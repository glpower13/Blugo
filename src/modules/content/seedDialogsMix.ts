// GEMISCHTE SZENEN — die Wendungen, die in keinem anderen Gespräch vorkommen.
//
// WARUM GEMISCHT UND NICHT „dritte Szene je Thema": Nach den 55 Themenszenen
// blieben 86 Wendungen übrig, meist zwei pro Thema. Eine eigene Szene für zwei
// Wendungen wäre Füllmaterial. Stattdessen zieht jede Szene hier die Reste
// VERWANDTER Themen zusammen — im Laden geht es dann um Größe, Umtausch UND
// Reklamation, so wie im echten Leben.
//
// Das ist kein Kompromiss, sondern der bessere Fall: Wer zwischen Themen
// wechseln muss, ruft härter ab als wer eine Themenliste durchgeht
// (Interleaving, `docs/02-science.md`). Eine „du"-Zeile speist immer den
// Gedächtnis-Zustand IHRER Wendung — egal, unter welchem Thema die Szene steht.
//
// ⚠️ EHRLICH: von uns/der KI verfasst, NICHT muttersprachlich geprüft
// (docs/content-review-schwedisch.md).

import type { Dialog } from '../../domain/dialog';

export const dialogs: Dialog[] = [
  // ── Unterwegs: Weg, Bus, Flughafen ────────────────────────────────────────
  {
    id: 'dlg-mix-vag',
    categoryId: 'cat-around',
    title: 'Verlaufen mit Gepäck',
    blurb: 'Weg fragen, Haltestelle finden, zum Flughafen kommen.',
    scene: 'station',
    partnerName: 'Passantin',
    turns: [
      { id: 'mv1', speaker: 'partner', sv: 'Du ser vilsen ut. Behöver du hjälp?', de: 'Du siehst verloren aus. Brauchst du Hilfe?', listenFirst: true, decoding: [{ sv: 'du', de: 'du' }, { sv: 'ser', de: 'siehst' }, { sv: 'vilsen', de: 'verloren' }, { sv: 'ut', de: 'aus' }, { sv: 'behöver', de: 'brauchst' }, { sv: 'du', de: 'du' }, { sv: 'hjälp', de: 'Hilfe' }] },
      { id: 'mv2', speaker: 'you', sv: 'var är toaletten?', de: 'wo ist die Toilette?', chunkId: 'c-var-toa', suggestions: ['Var är toaletten?', 'Var är kassan?'] },
      { id: 'mv3', speaker: 'partner', sv: 'Gå in i hallen och sedan förbi kiosken.', de: 'Geh in die Halle und dann am Kiosk vorbei.', decoding: [{ sv: 'gå', de: 'geh' }, { sv: 'in', de: 'hinein' }, { sv: 'i', de: 'in' }, { sv: 'hallen', de: 'die Halle' }, { sv: 'och', de: 'und' }, { sv: 'sedan', de: 'dann' }, { sv: 'förbi', de: 'vorbei' }, { sv: 'kiosken', de: 'dem Kiosk' }] },
      { id: 'mv4', speaker: 'you', sv: 'rakt fram', de: 'geradeaus', chunkId: 'c-raktfram', suggestions: ['Rakt fram.', 'Till höger.'] },
      { id: 'mv5', speaker: 'partner', sv: 'Precis. Och vid pelaren svänger du.', de: 'Genau. Und an der Säule biegst du ab.', decoding: [{ sv: 'precis', de: 'genau' }, { sv: 'och', de: 'und' }, { sv: 'vid', de: 'bei' }, { sv: 'pelaren', de: 'der Säule' }, { sv: 'svänger', de: 'biegst' }, { sv: 'du', de: 'du' }] },
      { id: 'mv6', speaker: 'you', sv: 'till höger', de: 'nach rechts', chunkId: 'c-hoger', suggestions: ['Till höger.', 'Till vänster.'] },
      { id: 'mv7', speaker: 'partner', sv: 'Nej, åt andra hållet faktiskt.', de: 'Nein, tatsächlich in die andere Richtung.', decoding: [{ sv: 'nej', de: 'nein' }, { sv: 'åt', de: 'in' }, { sv: 'andra', de: 'andere' }, { sv: 'hållet', de: 'die Richtung' }, { sv: 'faktiskt', de: 'tatsächlich' }] },
      { id: 'mv8', speaker: 'you', sv: 'till vänster', de: 'nach links', chunkId: 'c-vanster', suggestions: ['Till vänster.', 'Till höger.'] },
      { id: 'mv9', speaker: 'partner', sv: 'Just det. Ska du vidare med buss eller tåg?', de: 'Genau. Fährst du weiter mit Bus oder Zug?', decoding: [{ sv: 'just', de: 'gerade' }, { sv: 'det', de: 'das' }, { sv: 'ska', de: 'wirst' }, { sv: 'du', de: 'du' }, { sv: 'vidare', de: 'weiter' }, { sv: 'med', de: 'mit' }, { sv: 'buss', de: 'Bus' }, { sv: 'eller', de: 'oder' }, { sv: 'tåg', de: 'Zug' }] },
      { id: 'mv10', speaker: 'you', sv: 'var är hållplatsen?', de: 'wo ist die Haltestelle?', chunkId: 'c-hallplats', suggestions: ['Var är hållplatsen?', 'Vilket spår?'] },
      { id: 'mv11', speaker: 'partner', sv: 'Utanför, till vänster om utgången.', de: 'Draußen, links vom Ausgang.', decoding: [{ sv: 'utanför', de: 'draußen' }, { sv: 'till', de: 'zu' }, { sv: 'vänster', de: 'links' }, { sv: 'om', de: 'von' }, { sv: 'utgången', de: 'dem Ausgang' }] },
      { id: 'mv12', speaker: 'you', sv: 'när går bussen?', de: 'wann fährt der Bus?', chunkId: 'c-narbuss', suggestions: ['När går bussen?', 'När går tåget?'] },
      { id: 'mv13', speaker: 'partner', sv: 'Var tjugonde minut. Men taxi går fortare.', de: 'Alle zwanzig Minuten. Aber Taxi geht schneller.', decoding: [{ sv: 'var', de: 'jede' }, { sv: 'tjugonde', de: 'zwanzigste' }, { sv: 'minut', de: 'Minute' }, { sv: 'men', de: 'aber' }, { sv: 'taxi', de: 'Taxi' }, { sv: 'går', de: 'geht' }, { sv: 'fortare', de: 'schneller' }] },
      { id: 'mv14', speaker: 'you', sv: 'till flygplatsen, tack', de: 'zum Flughafen, bitte', chunkId: 'c-flygplatsen', suggestions: ['Till flygplatsen, tack.', 'En biljett, tack.'] },
    ],
  },

  // ── Essen: Tisch, Karte, satt — und Brot vom Bäcker ───────────────────────
  {
    id: 'dlg-mix-restaurang',
    categoryId: 'cat-restaurant',
    title: 'Essen gehen, von vorn bis satt',
    blurb: 'Tisch, Karte, Getränk, Nachtisch — und am Ende ist man satt.',
    scene: 'cafe',
    partnerName: 'Kellnerin',
    turns: [
      { id: 'mr1', speaker: 'partner', sv: 'Hej och välkomna! Är ni två i sällskapet?', de: 'Hallo und willkommen! Seid ihr zu zweit?', listenFirst: true, decoding: [{ sv: 'hej', de: 'hallo' }, { sv: 'och', de: 'und' }, { sv: 'välkomna', de: 'willkommen' }, { sv: 'är', de: 'seid' }, { sv: 'ni', de: 'ihr' }, { sv: 'två', de: 'zwei' }, { sv: 'i', de: 'in' }, { sv: 'sällskapet', de: 'der Gesellschaft' }] },
      { id: 'mr2', speaker: 'you', sv: 'ett bord för två', de: 'einen Tisch für zwei', chunkId: 'c-bordtva', suggestions: ['Ett bord för två.', 'Kan vi sitta här?'] },
      { id: 'mr3', speaker: 'partner', sv: 'Vid fönstret går bra. Slå er ner.', de: 'Am Fenster geht gut. Setzt euch.', decoding: [{ sv: 'vid', de: 'bei' }, { sv: 'fönstret', de: 'dem Fenster' }, { sv: 'går', de: 'geht' }, { sv: 'bra', de: 'gut' }, { sv: 'slå', de: 'schlagt' }, { sv: 'er', de: 'euch' }, { sv: 'ner', de: 'nieder' }] },
      { id: 'mr4', speaker: 'you', sv: 'kan jag få menyn?', de: 'kann ich die Karte haben?', chunkId: 'c-menyn', suggestions: ['Kan jag få menyn?', 'Kan jag få notan?'] },
      { id: 'mr5', speaker: 'partner', sv: 'Varsågod. Något att dricka under tiden?', de: 'Bitte sehr. Etwas zu trinken in der Zwischenzeit?', decoding: [{ sv: 'varsågod', de: 'bitte' }, { sv: 'något', de: 'etwas' }, { sv: 'att', de: 'zu' }, { sv: 'dricka', de: 'trinken' }, { sv: 'under', de: 'unter' }, { sv: 'tiden', de: 'der Zeit' }] },
      { id: 'mr6', speaker: 'you', sv: 'te eller kaffe?', de: 'Tee oder Kaffee?', chunkId: 'c-teellerkaffe', suggestions: ['Te eller kaffe?', 'Med mjölk, tack.'] },
      { id: 'mr7', speaker: 'partner', sv: 'Båda finns. Vi bakar brödet själva också.', de: 'Beides gibt es. Wir backen das Brot auch selbst.', decoding: [{ sv: 'båda', de: 'beide' }, { sv: 'finns', de: 'gibt es' }, { sv: 'vi', de: 'wir' }, { sv: 'bakar', de: 'backen' }, { sv: 'brödet', de: 'das Brot' }, { sv: 'själva', de: 'selbst' }, { sv: 'också', de: 'auch' }] },
      { id: 'mr8', speaker: 'you', sv: 'har ni bröd?', de: 'habt ihr Brot?', chunkId: 'c-harbrod', suggestions: ['Har ni bröd?', 'Har ni något sött?'] },
      { id: 'mr9', speaker: 'partner', sv: 'Färskt sedan i morse. Efterrätt sedan?', de: 'Frisch seit heute Morgen. Danach Nachtisch?', decoding: [{ sv: 'färskt', de: 'frisch' }, { sv: 'sedan', de: 'seit' }, { sv: 'i', de: 'am' }, { sv: 'morse', de: 'Morgen' }, { sv: 'efterrätt', de: 'Nachtisch' }, { sv: 'sedan', de: 'danach' }] },
      { id: 'mr10', speaker: 'you', sv: 'har ni något sött?', de: 'habt ihr etwas Süßes?', chunkId: 'c-nagotsott', suggestions: ['Har ni något sött?', 'Kaffe och kaka, tack.'] },
      { id: 'mr11', speaker: 'partner', sv: 'Vi har paj. Hur var maten annars?', de: 'Wir haben Kuchen. Wie war das Essen sonst?', decoding: [{ sv: 'vi', de: 'wir' }, { sv: 'har', de: 'haben' }, { sv: 'paj', de: 'Kuchen' }, { sv: 'hur', de: 'wie' }, { sv: 'var', de: 'war' }, { sv: 'maten', de: 'das Essen' }, { sv: 'annars', de: 'sonst' }] },
      { id: 'mr12', speaker: 'you', sv: 'det var gott', de: 'das war lecker', chunkId: 'c-vargott', suggestions: ['Det var gott.', 'Det smakar bra.'] },
      { id: 'mr13', speaker: 'partner', sv: 'Vad kul att höra! Orkar ni mer?', de: 'Wie schön zu hören! Schafft ihr noch mehr?', decoding: [{ sv: 'vad', de: 'wie' }, { sv: 'kul', de: 'schön' }, { sv: 'att', de: 'zu' }, { sv: 'höra', de: 'hören' }, { sv: 'orkar', de: 'schafft' }, { sv: 'ni', de: 'ihr' }, { sv: 'mer', de: 'mehr' }] },
      { id: 'mr14', speaker: 'you', sv: 'jag är mätt', de: 'ich bin satt', chunkId: 'c-matt', suggestions: ['Jag är mätt.', 'Jag är hungrig.'] },
    ],
  },

  // ── Ankommen: Zimmer, Frühstück, Mietwagen ────────────────────────────────
  {
    id: 'dlg-mix-hotell',
    categoryId: 'cat-hotel',
    title: 'Spät angekommen',
    blurb: 'Zimmer, Frühstück, Mietwagen, Geld wechseln — alles an einem Tresen.',
    scene: 'hotel',
    partnerName: 'Rezeption',
    turns: [
      { id: 'mh1', speaker: 'partner', sv: 'God kväll! Har ni bokat hos oss?', de: 'Guten Abend! Habt ihr bei uns gebucht?', listenFirst: true, decoding: [{ sv: 'god', de: 'guten' }, { sv: 'kväll', de: 'Abend' }, { sv: 'har', de: 'habt' }, { sv: 'ni', de: 'ihr' }, { sv: 'bokat', de: 'gebucht' }, { sv: 'hos', de: 'bei' }, { sv: 'oss', de: 'uns' }] },
      { id: 'mh2', speaker: 'you', sv: 'har ni ett ledigt rum?', de: 'habt ihr ein freies Zimmer?', chunkId: 'c-ledigtrum', suggestions: ['Har ni ett ledigt rum?', 'Jag har bokat ett rum.'] },
      { id: 'mh3', speaker: 'partner', sv: 'Ett kvar, på tredje våningen. Legitimation, tack.', de: 'Eins übrig, im dritten Stock. Ausweis, bitte.', decoding: [{ sv: 'ett', de: 'eins' }, { sv: 'kvar', de: 'übrig' }, { sv: 'på', de: 'auf' }, { sv: 'tredje', de: 'dritter' }, { sv: 'våningen', de: 'Etage' }, { sv: 'legitimation', de: 'Ausweis' }, { sv: 'tack', de: 'bitte' }] },
      { id: 'mh4', speaker: 'you', sv: 'har du legitimation?', de: 'hast du einen Ausweis?', chunkId: 'c-harlegitimation', suggestions: ['Har du legitimation?', 'Vad är ditt personnummer?'] },
      { id: 'mh5', speaker: 'partner', sv: 'Ja, jag menar ditt. Och numret också, tack.', de: 'Ja, ich meine deinen. Und die Nummer auch, bitte.', decoding: [{ sv: 'ja', de: 'ja' }, { sv: 'jag', de: 'ich' }, { sv: 'menar', de: 'meine' }, { sv: 'ditt', de: 'deinen' }, { sv: 'och', de: 'und' }, { sv: 'numret', de: 'die Nummer' }, { sv: 'också', de: 'auch' }, { sv: 'tack', de: 'bitte' }] },
      { id: 'mh6', speaker: 'you', sv: 'vad är ditt personnummer?', de: 'wie ist deine Personennummer?', chunkId: 'c-dittpersonnummer', suggestions: ['Vad är ditt personnummer?', 'Har du legitimation?'] },
      { id: 'mh7', speaker: 'partner', sv: 'Nu skrattar jag. Här är nyckeln till er.', de: 'Jetzt muss ich lachen. Hier ist euer Schlüssel.', decoding: [{ sv: 'nu', de: 'jetzt' }, { sv: 'skrattar', de: 'lache' }, { sv: 'jag', de: 'ich' }, { sv: 'här', de: 'hier' }, { sv: 'är', de: 'ist' }, { sv: 'nyckeln', de: 'der Schlüssel' }, { sv: 'till', de: 'zu' }, { sv: 'er', de: 'euch' }] },
      { id: 'mh8', speaker: 'you', sv: 'var är rummet?', de: 'wo ist das Zimmer?', chunkId: 'c-varrummet', suggestions: ['Var är rummet?', 'Var är toaletten?'] },
      { id: 'mh9', speaker: 'partner', sv: 'Hissen till höger, sedan sista dörren.', de: 'Der Aufzug rechts, dann die letzte Tür.', decoding: [{ sv: 'hissen', de: 'der Aufzug' }, { sv: 'till', de: 'zu' }, { sv: 'höger', de: 'rechts' }, { sv: 'sedan', de: 'dann' }, { sv: 'sista', de: 'letzte' }, { sv: 'dörren', de: 'die Tür' }] },
      { id: 'mh10', speaker: 'you', sv: 'när är frukost?', de: 'wann gibt es Frühstück?', chunkId: 'c-narfrukost', suggestions: ['När är frukost?', 'När stänger ni?'] },
      { id: 'mh11', speaker: 'partner', sv: 'Från sju till tio. Behöver ni något mer i kväll?', de: 'Von sieben bis zehn. Braucht ihr heute Abend noch etwas?', decoding: [{ sv: 'från', de: 'von' }, { sv: 'sju', de: 'sieben' }, { sv: 'till', de: 'bis' }, { sv: 'tio', de: 'zehn' }, { sv: 'behöver', de: 'braucht' }, { sv: 'ni', de: 'ihr' }, { sv: 'något', de: 'etwas' }, { sv: 'mer', de: 'mehr' }, { sv: 'i', de: 'am' }, { sv: 'kväll', de: 'Abend' }] },
      { id: 'mh12', speaker: 'you', sv: 'kan jag växla pengar?', de: 'kann ich Geld wechseln?', chunkId: 'c-vaxlapengar', suggestions: ['Kan jag växla pengar?', 'Var finns en bankomat?'] },
      { id: 'mh13', speaker: 'partner', sv: 'Tyvärr inte. Men bilen står klar på gården.', de: 'Leider nicht. Aber das Auto steht bereit im Hof.', decoding: [{ sv: 'tyvärr', de: 'leider' }, { sv: 'inte', de: 'nicht' }, { sv: 'men', de: 'aber' }, { sv: 'bilen', de: 'das Auto' }, { sv: 'står', de: 'steht' }, { sv: 'klar', de: 'bereit' }, { sv: 'på', de: 'auf' }, { sv: 'gården', de: 'dem Hof' }] },
      { id: 'mh14', speaker: 'you', sv: 'vi hyr en bil', de: 'wir mieten ein Auto', chunkId: 'c-hyraenbil', suggestions: ['Vi hyr en bil.', 'Vi tar cykeln i stället.'] },
      { id: 'mh15', speaker: 'partner', sv: 'Bra. Ta med papperen — och passet, alltid.', de: 'Gut. Nimm die Papiere mit — und den Pass, immer.', decoding: [{ sv: 'bra', de: 'gut' }, { sv: 'ta', de: 'nimm' }, { sv: 'med', de: 'mit' }, { sv: 'papperen', de: 'die Papiere' }, { sv: 'och', de: 'und' }, { sv: 'passet', de: 'den Pass' }, { sv: 'alltid', de: 'immer' }] },
      { id: 'mh16', speaker: 'you', sv: 'glöm inte passet', de: 'vergiss den Pass nicht', chunkId: 'c-glomintepasset', suggestions: ['Glöm inte passet.', 'Jag måste packa väskan.'] },
    ],
  },

  // ── Im Laden: Größe, Umtausch, Reklamation ────────────────────────────────
  {
    id: 'dlg-mix-butik',
    categoryId: 'cat-shop',
    title: 'Umtauschen im Laden',
    blurb: 'Größe, Farbe, Umkleide — und die Jacke von letzter Woche.',
    scene: 'shop',
    partnerName: 'Verkäufer',
    turns: [
      { id: 'mb1', speaker: 'partner', sv: 'Hej! Söker du något särskilt i dag?', de: 'Hallo! Suchst du heute etwas Bestimmtes?', listenFirst: true, decoding: [{ sv: 'hej', de: 'hallo' }, { sv: 'söker', de: 'suchst' }, { sv: 'du', de: 'du' }, { sv: 'något', de: 'etwas' }, { sv: 'särskilt', de: 'Besonderes' }, { sv: 'i', de: 'am' }, { sv: 'dag', de: 'Tag' }] },
      { id: 'mb2', speaker: 'you', sv: 'har ni den i blått?', de: 'habt ihr das in Blau?', chunkId: 'c-iblatt', suggestions: ['Har ni den i blått?', 'Har ni en annan färg?'] },
      { id: 'mb3', speaker: 'partner', sv: 'Blått finns. Vilken behöver du?', de: 'Blau gibt es. Welche brauchst du?', decoding: [{ sv: 'blått', de: 'Blau' }, { sv: 'finns', de: 'gibt es' }, { sv: 'vilken', de: 'welche' }, { sv: 'behöver', de: 'brauchst' }, { sv: 'du', de: 'du' }] },
      { id: 'mb4', speaker: 'you', sv: 'vilken storlek?', de: 'welche Größe?', chunkId: 'c-storlek', suggestions: ['Vilken storlek?', 'Har ni en mindre storlek?'] },
      { id: 'mb5', speaker: 'partner', sv: 'Medium eller large. Prova gärna först.', de: 'Medium oder Large. Probier gern erst an.', decoding: [{ sv: 'medium', de: 'Medium' }, { sv: 'eller', de: 'oder' }, { sv: 'large', de: 'Large' }, { sv: 'prova', de: 'probiere' }, { sv: 'gärna', de: 'gern' }, { sv: 'först', de: 'zuerst' }] },
      { id: 'mb6', speaker: 'you', sv: 'var är provrummet?', de: 'wo ist die Umkleide?', chunkId: 'c-provrum', suggestions: ['Var är provrummet?', 'Var är kassan?'] },
      { id: 'mb7', speaker: 'partner', sv: 'Bakom hyllan där. Hur satt den?', de: 'Hinter dem Regal dort. Wie saß sie?', decoding: [{ sv: 'bakom', de: 'hinter' }, { sv: 'hyllan', de: 'dem Regal' }, { sv: 'där', de: 'dort' }, { sv: 'hur', de: 'wie' }, { sv: 'satt', de: 'saß' }, { sv: 'den', de: 'sie' }] },
      { id: 'mb8', speaker: 'you', sv: 'den är för liten', de: 'das ist zu klein', chunkId: 'c-forliten', suggestions: ['Den är för liten.', 'Den är för stor.'] },
      { id: 'mb9', speaker: 'partner', sv: 'Jag hämtar en större. Var det något mer?', de: 'Ich hole eine größere. War da noch etwas?', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'hämtar', de: 'hole' }, { sv: 'en', de: 'eine' }, { sv: 'större', de: 'größere' }, { sv: 'var', de: 'war' }, { sv: 'det', de: 'es' }, { sv: 'något', de: 'etwas' }, { sv: 'mer', de: 'mehr' }] },
      { id: 'mb10', speaker: 'you', sv: 'det är fel på varan', de: 'die Ware ist fehlerhaft', chunkId: 'c-felpavaran', suggestions: ['Det är fel på varan.', 'Den är trasig.'] },
      { id: 'mb11', speaker: 'partner', sv: 'Oj. Har du kvar kvittot från köpet?', de: 'Oh. Hast du den Bon vom Kauf noch?', decoding: [{ sv: 'oj', de: 'oh' }, { sv: 'har', de: 'hast' }, { sv: 'du', de: 'du' }, { sv: 'kvar', de: 'übrig' }, { sv: 'kvittot', de: 'den Bon' }, { sv: 'från', de: 'von' }, { sv: 'köpet', de: 'dem Kauf' }] },
      { id: 'mb12', speaker: 'you', sv: 'jag har kvittot', de: 'ich habe den Kassenbon', chunkId: 'c-harkvittot', suggestions: ['Jag har kvittot.', 'Kan jag få kvittot?'] },
      { id: 'mb13', speaker: 'partner', sv: 'Perfekt, då ordnar vi det direkt. Ledsen för besväret.', de: 'Perfekt, dann regeln wir das sofort. Sorry für die Mühe.', decoding: [{ sv: 'perfekt', de: 'perfekt' }, { sv: 'då', de: 'dann' }, { sv: 'ordnar', de: 'regeln' }, { sv: 'vi', de: 'wir' }, { sv: 'det', de: 'es' }, { sv: 'direkt', de: 'direkt' }, { sv: 'ledsen', de: 'traurig' }, { sv: 'för', de: 'für' }, { sv: 'besväret', de: 'die Mühe' }] },
      { id: 'mb14', speaker: 'you', sv: 'jag förväntade mig något annat', de: 'ich hatte etwas anderes erwartet', chunkId: 'c-forvantademignagot', suggestions: ['Jag förväntade mig något annat.', 'Det är för dyrt.'] },
    ],
  },

  // ── Werkstatt & Rennen ────────────────────────────────────────────────────
  {
    id: 'dlg-mix-verkstad',
    categoryId: 'cat-workshop',
    title: 'Der Wagen springt nicht an',
    blurb: 'Werkzeug, Reifen, Motor — und das Rennen fängt gleich an.',
    scene: 'garage',
    partnerName: 'Kumpel',
    turns: [
      { id: 'mw1', speaker: 'partner', sv: 'Du står här ute. Vad är det med den?', de: 'Du stehst hier draußen. Was ist mit ihm?', listenFirst: true, decoding: [{ sv: 'du', de: 'du' }, { sv: 'står', de: 'stehst' }, { sv: 'här', de: 'hier' }, { sv: 'ute', de: 'draußen' }, { sv: 'vad', de: 'was' }, { sv: 'är', de: 'ist' }, { sv: 'det', de: 'es' }, { sv: 'med', de: 'mit' }, { sv: 'den', de: 'ihm' }] },
      { id: 'mw2', speaker: 'you', sv: 'bilen startar inte', de: 'das Auto springt nicht an', chunkId: 'c-startarinte', suggestions: ['Bilen startar inte.', 'Det är motorn.'] },
      { id: 'mw3', speaker: 'partner', sv: 'Vi öppnar huven och tittar. Håll den öppen.', de: 'Wir machen die Haube auf und schauen. Halt sie offen.', decoding: [{ sv: 'vi', de: 'wir' }, { sv: 'öppnar', de: 'öffnen' }, { sv: 'huven', de: 'die Haube' }, { sv: 'och', de: 'und' }, { sv: 'tittar', de: 'schauen' }, { sv: 'håll', de: 'halte' }, { sv: 'den', de: 'sie' }, { sv: 'öppen', de: 'offen' }] },
      { id: 'mw4', speaker: 'you', sv: 'kan du hålla den här?', de: 'kannst du das hier halten?', chunkId: 'c-hallden', suggestions: ['Kan du hålla den här?', 'Har du ett verktyg?'] },
      { id: 'mw5', speaker: 'partner', sv: 'Visst. Vi behöver något att skruva med.', de: 'Klar. Wir brauchen etwas zum Schrauben.', decoding: [{ sv: 'visst', de: 'klar' }, { sv: 'vi', de: 'wir' }, { sv: 'behöver', de: 'brauchen' }, { sv: 'något', de: 'etwas' }, { sv: 'att', de: 'zu' }, { sv: 'skruva', de: 'schrauben' }, { sv: 'med', de: 'mit' }] },
      { id: 'mw6', speaker: 'you', sv: 'har du ett verktyg?', de: 'hast du ein Werkzeug?', chunkId: 'c-verktyg', suggestions: ['Har du ett verktyg?', 'Kan du hålla den här?'] },
      { id: 'mw7', speaker: 'partner', sv: 'I lådan. Titta förresten på framhjulet.', de: 'In der Kiste. Schau übrigens mal aufs Vorderrad.', decoding: [{ sv: 'i', de: 'in' }, { sv: 'lådan', de: 'der Kiste' }, { sv: 'titta', de: 'schau' }, { sv: 'förresten', de: 'übrigens' }, { sv: 'på', de: 'auf' }, { sv: 'framhjulet', de: 'das Vorderrad' }] },
      { id: 'mw8', speaker: 'you', sv: 'däcket är punkterat', de: 'der Reifen ist platt', chunkId: 'c-punkterat', suggestions: ['Däcket är punkterat.', 'Bilen startar inte.'] },
      { id: 'mw9', speaker: 'partner', sv: 'Två fel på en gång. Vi hinner inte till start.', de: 'Zwei Fehler auf einmal. Wir schaffen es nicht zum Start.', decoding: [{ sv: 'två', de: 'zwei' }, { sv: 'fel', de: 'Fehler' }, { sv: 'på', de: 'auf' }, { sv: 'en', de: 'ein' }, { sv: 'gång', de: 'Mal' }, { sv: 'vi', de: 'wir' }, { sv: 'hinner', de: 'schaffen' }, { sv: 'inte', de: 'nicht' }, { sv: 'till', de: 'zu' }, { sv: 'start', de: 'Start' }] },
      { id: 'mw10', speaker: 'you', sv: 'loppet börjar snart', de: 'das Rennen beginnt bald', chunkId: 'c-loppet', suggestions: ['Loppet börjar snart.', 'Matchen börjar klockan sju.'] },
      { id: 'mw11', speaker: 'partner', sv: 'Vi ser det på skärmen i stället. Han körde otroligt i fjol.', de: 'Wir schauen es stattdessen auf dem Bildschirm. Er fuhr letztes Jahr unglaublich.', decoding: [{ sv: 'vi', de: 'wir' }, { sv: 'ser', de: 'sehen' }, { sv: 'det', de: 'es' }, { sv: 'på', de: 'auf' }, { sv: 'skärmen', de: 'dem Bildschirm' }, { sv: 'i', de: 'an' }, { sv: 'stället', de: 'der Stelle' }, { sv: 'han', de: 'er' }, { sv: 'körde', de: 'fuhr' }, { sv: 'otroligt', de: 'unglaublich' }, { sv: 'i', de: 'im' }, { sv: 'fjol', de: 'Vorjahr' }] },
      { id: 'mw12', speaker: 'you', sv: 'det var nytt rekord', de: 'das war ein neuer Rekord', chunkId: 'c-nytt-rekord', suggestions: ['Det var nytt rekord.', 'Vilken bil!'] },
    ],
  },

  // ── Abends online: zocken, Spiel gucken, angeln ───────────────────────────
  {
    id: 'dlg-mix-spel',
    categoryId: 'cat-gaming',
    title: 'Abends im Headset',
    blurb: 'Zocken, das Spiel nebenbei — und Pläne für morgen früh.',
    scene: 'gaming',
    partnerName: 'Micke',
    turns: [
      { id: 'ms1', speaker: 'partner', sv: 'Jag är inne nu. Ljudet är dåligt.', de: 'Ich bin jetzt drin. Der Ton ist schlecht.', listenFirst: true, decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'är', de: 'bin' }, { sv: 'inne', de: 'drinnen' }, { sv: 'nu', de: 'jetzt' }, { sv: 'ljudet', de: 'der Ton' }, { sv: 'är', de: 'ist' }, { sv: 'dåligt', de: 'schlecht' }] },
      { id: 'ms2', speaker: 'you', sv: 'hör du mig?', de: 'hörst du mich?', chunkId: 'c-horduemig', suggestions: ['Hör du mig?', 'Jag hör dig dåligt.'] },
      { id: 'ms3', speaker: 'partner', sv: 'Nu hör jag dig klart. Kör vi?', de: 'Jetzt höre ich dich klar. Legen wir los?', decoding: [{ sv: 'nu', de: 'jetzt' }, { sv: 'hör', de: 'höre' }, { sv: 'jag', de: 'ich' }, { sv: 'dig', de: 'dich' }, { sv: 'klart', de: 'klar' }, { sv: 'kör', de: 'fahren' }, { sv: 'vi', de: 'wir' }] },
      { id: 'ms4', speaker: 'you', sv: 'vänta lite', de: 'warte kurz', chunkId: 'c-vantalite', suggestions: ['Vänta lite.', 'Jag är strax tillbaka.'] },
      { id: 'ms5', speaker: 'partner', sv: 'Ingen stress. Matchen går på tv:n samtidigt.', de: 'Kein Stress. Das Spiel läuft gleichzeitig im Fernsehen.', decoding: [{ sv: 'ingen', de: 'kein' }, { sv: 'stress', de: 'Stress' }, { sv: 'matchen', de: 'das Spiel' }, { sv: 'går', de: 'geht' }, { sv: 'på', de: 'auf' }, { sv: 'tv', de: 'Fernsehen' }, { sv: 'n', de: 'dem' }, { sv: 'samtidigt', de: 'gleichzeitig' }] },
      { id: 'ms6', speaker: 'you', sv: 'matchen börjar klockan sju', de: 'das Spiel beginnt um sieben', chunkId: 'c-matchen', suggestions: ['Matchen börjar klockan sju.', 'Loppet börjar snart.'] },
      { id: 'ms7', speaker: 'partner', sv: 'Den har börjat. Det står ett noll för dem.', de: 'Es hat begonnen. Es steht eins zu null für sie.', decoding: [{ sv: 'den', de: 'es' }, { sv: 'har', de: 'hat' }, { sv: 'börjat', de: 'begonnen' }, { sv: 'det', de: 'es' }, { sv: 'står', de: 'steht' }, { sv: 'ett', de: 'eins' }, { sv: 'noll', de: 'null' }, { sv: 'för', de: 'für' }, { sv: 'dem', de: 'sie' }] },
      { id: 'ms8', speaker: 'you', sv: 'vi ligger under', de: 'wir liegen zurück', chunkId: 'c-vihalleross', suggestions: ['Vi ligger under.', 'Hur står det?'] },
      { id: 'ms9', speaker: 'partner', sv: 'Det vänder. Din runda var förresten grym.', de: 'Das dreht sich. Deine Runde war übrigens stark.', decoding: [{ sv: 'det', de: 'es' }, { sv: 'vänder', de: 'wendet' }, { sv: 'din', de: 'deine' }, { sv: 'runda', de: 'Runde' }, { sv: 'var', de: 'war' }, { sv: 'förresten', de: 'übrigens' }, { sv: 'grym', de: 'stark' }] },
      { id: 'ms10', speaker: 'you', sv: 'bra spelat!', de: 'gut gespielt!', chunkId: 'c-braspelat', suggestions: ['Bra spelat!', 'En runda till?'] },
      { id: 'ms11', speaker: 'partner', sv: 'Tack! Vad gör du i morgon bitti egentligen?', de: 'Danke! Was machst du morgen früh eigentlich?', decoding: [{ sv: 'tack', de: 'danke' }, { sv: 'vad', de: 'was' }, { sv: 'gör', de: 'machst' }, { sv: 'du', de: 'du' }, { sv: 'i', de: 'am' }, { sv: 'morgon', de: 'Morgen' }, { sv: 'bitti', de: 'früh' }, { sv: 'egentligen', de: 'eigentlich' }] },
      { id: 'ms12', speaker: 'you', sv: 'jag fiskar', de: 'ich angle', chunkId: 'c-fiskar', suggestions: ['Jag fiskar.', 'Nappar det?'] },
    ],
  },

  // ── Arbeit: Termin, Gespräch, Abschluss ───────────────────────────────────
  {
    id: 'dlg-mix-jobb',
    categoryId: 'cat-work',
    title: 'Ein Tag im Büro',
    blurb: 'Termin absagen, Gespräch klären, Vereinbarung schließen.',
    scene: 'office',
    partnerName: 'Chefin',
    turns: [
      { id: 'mj1', speaker: 'partner', sv: 'God morgon! Är du på plats hela dagen?', de: 'Guten Morgen! Bist du den ganzen Tag da?', listenFirst: true, decoding: [{ sv: 'god', de: 'guten' }, { sv: 'morgon', de: 'Morgen' }, { sv: 'är', de: 'bist' }, { sv: 'du', de: 'du' }, { sv: 'på', de: 'auf' }, { sv: 'plats', de: 'Platz' }, { sv: 'hela', de: 'den ganzen' }, { sv: 'dagen', de: 'Tag' }] },
      { id: 'mj2', speaker: 'you', sv: 'jag jobbar på ett kontor', de: 'ich arbeite in einem Büro', chunkId: 'c-jobbarpakontor', suggestions: ['Jag jobbar på ett kontor.', 'Vad jobbar du med?'] },
      { id: 'mj3', speaker: 'partner', sv: 'Det vet jag. Jag menade i morgon, fredag.', de: 'Das weiß ich. Ich meinte morgen, Freitag.', decoding: [{ sv: 'det', de: 'das' }, { sv: 'vet', de: 'weiß' }, { sv: 'jag', de: 'ich' }, { sv: 'jag', de: 'ich' }, { sv: 'menade', de: 'meinte' }, { sv: 'i', de: 'am' }, { sv: 'morgon', de: 'Morgen' }, { sv: 'fredag', de: 'Freitag' }] },
      { id: 'mj4', speaker: 'you', sv: 'jag är ledig idag', de: 'ich habe heute frei', chunkId: 'c-ledigidag', suggestions: ['Jag är ledig idag.', 'Jag är ledig i helgen.'] },
      { id: 'mj5', speaker: 'partner', sv: 'Då flyttar vi. Du hade ju en tid på förmiddagen?', de: 'Dann verschieben wir. Du hattest ja einen Termin am Vormittag?', decoding: [{ sv: 'då', de: 'dann' }, { sv: 'flyttar', de: 'verlegen' }, { sv: 'vi', de: 'wir' }, { sv: 'du', de: 'du' }, { sv: 'hade', de: 'hattest' }, { sv: 'ju', de: 'ja' }, { sv: 'en', de: 'einen' }, { sv: 'tid', de: 'Termin' }, { sv: 'på', de: 'am' }, { sv: 'förmiddagen', de: 'Vormittag' }] },
      { id: 'mj6', speaker: 'you', sv: 'jag har en tid klockan nio', de: 'ich habe einen Termin um neun', chunkId: 'c-hartidklockannio', suggestions: ['Jag har en tid klockan nio.', 'Passar det på torsdag?'] },
      { id: 'mj7', speaker: 'partner', sv: 'Hinner du båda? Annars ringer du och ändrar.', de: 'Schaffst du beide? Sonst rufst du an und änderst.', decoding: [{ sv: 'hinner', de: 'schaffst' }, { sv: 'du', de: 'du' }, { sv: 'båda', de: 'beide' }, { sv: 'annars', de: 'sonst' }, { sv: 'ringer', de: 'rufst an' }, { sv: 'du', de: 'du' }, { sv: 'och', de: 'und' }, { sv: 'ändrar', de: 'änderst' }] },
      { id: 'mj8', speaker: 'you', sv: 'jag måste avboka', de: 'ich muss absagen', chunkId: 'c-mastaavboka', suggestions: ['Jag måste avboka.', 'Kan vi flytta tiden?'] },
      { id: 'mj9', speaker: 'partner', sv: 'Klokt. Vi ska dessutom träffa den nya kandidaten.', de: 'Klug. Außerdem treffen wir die neue Kandidatin.', decoding: [{ sv: 'klokt', de: 'klug' }, { sv: 'vi', de: 'wir' }, { sv: 'ska', de: 'sollen' }, { sv: 'dessutom', de: 'außerdem' }, { sv: 'träffa', de: 'treffen' }, { sv: 'den', de: 'die' }, { sv: 'nya', de: 'neue' }, { sv: 'kandidaten', de: 'Kandidatin' }] },
      { id: 'mj10', speaker: 'you', sv: 'när blir intervjun?', de: 'wann ist das Vorstellungsgespräch?', chunkId: 'c-narblirintervjun', suggestions: ['När blir intervjun?', 'Kan vi boka ett möte?'] },
      { id: 'mj11', speaker: 'partner', sv: 'Efter lunch. Hon saknar en rekommendation.', de: 'Nach dem Mittagessen. Ihr fehlt eine Empfehlung.', decoding: [{ sv: 'efter', de: 'nach' }, { sv: 'lunch', de: 'Mittagessen' }, { sv: 'hon', de: 'sie' }, { sv: 'saknar', de: 'vermisst' }, { sv: 'en', de: 'eine' }, { sv: 'rekommendation', de: 'Empfehlung' }] },
      { id: 'mj12', speaker: 'you', sv: 'kan du ge mig en referens?', de: 'kannst du mir eine Referenz geben?', chunkId: 'c-geenreferens', suggestions: ['Kan du ge mig en referens?', 'Jag har erfarenhet av det.'] },
      { id: 'mj13', speaker: 'partner', sv: 'Åt henne, menar du. Ja, det fixar jag.', de: 'Für sie, meinst du. Ja, das mache ich.', decoding: [{ sv: 'åt', de: 'für' }, { sv: 'henne', de: 'sie' }, { sv: 'menar', de: 'meinst' }, { sv: 'du', de: 'du' }, { sv: 'ja', de: 'ja' }, { sv: 'det', de: 'das' }, { sv: 'fixar', de: 'richte' }, { sv: 'jag', de: 'ich' }] },
      { id: 'mj14', speaker: 'you', sv: 'vi har ett avtal', de: 'wir haben eine Vereinbarung', chunkId: 'c-viharettavtal', suggestions: ['Vi har ett avtal.', 'Då är vi överens.'] },
      { id: 'mj15', speaker: 'partner', sv: 'Så säger vi. Skriver du under i eftermiddag?', de: 'So machen wir es. Unterschreibst du heute Nachmittag?', decoding: [{ sv: 'så', de: 'so' }, { sv: 'säger', de: 'sagen' }, { sv: 'vi', de: 'wir' }, { sv: 'skriver', de: 'schreibst' }, { sv: 'du', de: 'du' }, { sv: 'under', de: 'unter' }, { sv: 'i', de: 'am' }, { sv: 'eftermiddag', de: 'Nachmittag' }] },
      { id: 'mj16', speaker: 'you', sv: 'det går jag med på', de: 'darauf lasse ich mich ein', chunkId: 'c-detgarjagmedpa', suggestions: ['Det går jag med på.', 'Då säger vi så.'] },
    ],
  },

  // ── Am Telefon: einladen, absagen, grüßen ─────────────────────────────────
  {
    id: 'dlg-mix-telefon',
    categoryId: 'cat-phone',
    title: 'Ein Anruf am Abend',
    blurb: 'Wer ist dran, was am Wochenende, eingeladen — und wieder aufgelegt.',
    scene: 'home',
    partnerName: 'Unbekannte Nummer',
    turns: [
      { id: 'mt1', speaker: 'partner', sv: 'Hallå? Är det du, {name}?', de: 'Hallo? Bist du das, {name}?', listenFirst: true, decoding: [{ sv: 'hallå', de: 'hallo' }, { sv: 'är', de: 'ist' }, { sv: 'det', de: 'es' }, { sv: 'du', de: 'du' }] },
      { id: 'mt2', speaker: 'you', sv: 'vem är det?', de: 'wer ist da?', chunkId: 'c-vemardet', suggestions: ['Vem är det?', 'Hör du mig?'] },
      { id: 'mt3', speaker: 'partner', sv: 'Det är Johanna! Jag har nytt nummer.', de: 'Hier ist Johanna! Ich habe eine neue Nummer.', decoding: [{ sv: 'det', de: 'es' }, { sv: 'är', de: 'ist' }, { sv: 'Johanna', de: 'Johanna' }, { sv: 'jag', de: 'ich' }, { sv: 'har', de: 'habe' }, { sv: 'nytt', de: 'neue' }, { sv: 'nummer', de: 'Nummer' }] },
      { id: 'mt4', speaker: 'you', sv: 'vad gör du i helgen?', de: 'was machst du am Wochenende?', chunkId: 'c-vadgordu', suggestions: ['Vad gör du i helgen?', 'Jag är ledig i helgen.'] },
      { id: 'mt5', speaker: 'partner', sv: 'Ingenting alls, faktiskt. Har du något på gång?', de: 'Gar nichts, tatsächlich. Hast du etwas vor?', decoding: [{ sv: 'ingenting', de: 'nichts' }, { sv: 'alls', de: 'überhaupt' }, { sv: 'faktiskt', de: 'tatsächlich' }, { sv: 'har', de: 'hast' }, { sv: 'du', de: 'du' }, { sv: 'något', de: 'etwas' }, { sv: 'på', de: 'auf' }, { sv: 'gång', de: 'Gang' }] },
      { id: 'mt6', speaker: 'you', sv: 'jag bjuder på middag', de: 'ich lade zum Essen ein', chunkId: 'c-bjuderpamiddag', suggestions: ['Jag bjuder på middag.', 'Vill du komma?'] },
      { id: 'mt7', speaker: 'partner', sv: 'Vad snällt! Ska jag ta med min syster också?', de: 'Wie nett! Soll ich meine Schwester auch mitbringen?', decoding: [{ sv: 'vad', de: 'wie' }, { sv: 'snällt', de: 'nett' }, { sv: 'ska', de: 'soll' }, { sv: 'jag', de: 'ich' }, { sv: 'ta', de: 'nehmen' }, { sv: 'med', de: 'mit' }, { sv: 'min', de: 'meine' }, { sv: 'syster', de: 'Schwester' }, { sv: 'också', de: 'auch' }] },
      { id: 'mt8', speaker: 'you', sv: 'vill du komma?', de: 'möchtest du kommen?', chunkId: 'c-villdukomma', suggestions: ['Vill du komma?', 'Kan jag ta med en vän?'] },
      { id: 'mt9', speaker: 'partner', sv: 'Gärna! Fast hon reser bort på lördag.', de: 'Gern! Allerdings verreist sie am Samstag.', decoding: [{ sv: 'gärna', de: 'gern' }, { sv: 'fast', de: 'allerdings' }, { sv: 'hon', de: 'sie' }, { sv: 'reser', de: 'reist' }, { sv: 'bort', de: 'weg' }, { sv: 'på', de: 'am' }, { sv: 'lördag', de: 'Samstag' }] },
      { id: 'mt10', speaker: 'you', sv: 'så synd!', de: 'wie schade!', chunkId: 'c-sasynd', suggestions: ['Så synd!', 'Vad roligt!'] },
      { id: 'mt11', speaker: 'partner', sv: 'Nästa gång. Nu måste jag lägga på, barnen ropar.', de: 'Nächstes Mal. Jetzt muss ich auflegen, die Kinder rufen.', decoding: [{ sv: 'nästa', de: 'nächstes' }, { sv: 'gång', de: 'Mal' }, { sv: 'nu', de: 'jetzt' }, { sv: 'måste', de: 'muss' }, { sv: 'jag', de: 'ich' }, { sv: 'lägga', de: 'legen' }, { sv: 'på', de: 'auf' }, { sv: 'barnen', de: 'die Kinder' }, { sv: 'ropar', de: 'rufen' }] },
      { id: 'mt12', speaker: 'you', sv: 'jag ringer dig senare', de: 'ich rufe dich später an', chunkId: 'c-ringersenare', suggestions: ['Jag ringer dig senare.', 'Vi hörs senare.'] },
      { id: 'mt13', speaker: 'partner', sv: 'Gör det. Puss så länge!', de: 'Mach das. Bis dahin, Küsschen!', decoding: [{ sv: 'gör', de: 'mach' }, { sv: 'det', de: 'das' }, { sv: 'puss', de: 'Küsschen' }, { sv: 'så', de: 'so' }, { sv: 'länge', de: 'lange' }] },
      { id: 'mt14', speaker: 'you', sv: 'hälsa hemma!', de: 'grüß zu Hause!', chunkId: 'c-halsahemma', suggestions: ['Hälsa hemma!', 'Ha det bra.'] },
    ],
  },

  // ── Gesundheit: Arzt, Apotheke, wie es einem geht ─────────────────────────
  {
    id: 'dlg-mix-halsa',
    categoryId: 'cat-pharmacy',
    title: 'Nach dem Arztbesuch',
    blurb: 'Rezept, Dosierung — und ehrlich sagen, wie es einem damit geht.',
    scene: 'clinic',
    partnerName: 'Apotekare',
    turns: [
      { id: 'mha1', speaker: 'partner', sv: 'Hej igen. Var du hos doktorn i dag?', de: 'Hallo wieder. Warst du heute beim Arzt?', listenFirst: true, decoding: [{ sv: 'hej', de: 'hallo' }, { sv: 'igen', de: 'wieder' }, { sv: 'var', de: 'warst' }, { sv: 'du', de: 'du' }, { sv: 'hos', de: 'bei' }, { sv: 'doktorn', de: 'dem Arzt' }, { sv: 'i', de: 'am' }, { sv: 'dag', de: 'Tag' }] },
      { id: 'mha2', speaker: 'you', sv: 'jag behöver en läkare', de: 'ich brauche einen Arzt', chunkId: 'c-lakare', suggestions: ['Jag behöver en läkare.', 'Jag är sjuk.'] },
      { id: 'mha3', speaker: 'partner', sv: 'Vårdcentralen ligger tvärs över gatan.', de: 'Das Gesundheitszentrum liegt gegenüber auf der Straße.', decoding: [{ sv: 'vårdcentralen', de: 'das Gesundheitszentrum' }, { sv: 'ligger', de: 'liegt' }, { sv: 'tvärs', de: 'quer' }, { sv: 'över', de: 'über' }, { sv: 'gatan', de: 'der Straße' }] },
      { id: 'mha4', speaker: 'you', sv: 'har du ett recept?', de: 'hast du ein Rezept?', chunkId: 'c-harduettrecept', suggestions: ['Har du ett recept?', 'Finns det utan recept?'] },
      { id: 'mha5', speaker: 'partner', sv: 'Det ligger redan i systemet. Här är förpackningen.', de: 'Es liegt schon im System. Hier ist die Packung.', decoding: [{ sv: 'det', de: 'es' }, { sv: 'ligger', de: 'liegt' }, { sv: 'redan', de: 'schon' }, { sv: 'i', de: 'in' }, { sv: 'systemet', de: 'dem System' }, { sv: 'här', de: 'hier' }, { sv: 'är', de: 'ist' }, { sv: 'förpackningen', de: 'die Packung' }] },
      { id: 'mha6', speaker: 'you', sv: 'två gånger om dagen', de: 'zweimal am Tag', chunkId: 'c-tvaganger', suggestions: ['Två gånger om dagen.', 'Hur många tabletter?'] },
      { id: 'mha7', speaker: 'partner', sv: 'Precis, och alltid med mat. Hur mår du annars?', de: 'Genau, und immer mit Essen. Wie geht es dir sonst?', decoding: [{ sv: 'precis', de: 'genau' }, { sv: 'och', de: 'und' }, { sv: 'alltid', de: 'immer' }, { sv: 'med', de: 'mit' }, { sv: 'mat', de: 'Essen' }, { sv: 'hur', de: 'wie' }, { sv: 'mår', de: 'befindest' }, { sv: 'du', de: 'du' }, { sv: 'annars', de: 'sonst' }] },
      { id: 'mha8', speaker: 'you', sv: 'det gör mig ledsen', de: 'das macht mich traurig', chunkId: 'c-gormigledsen', suggestions: ['Det gör mig ledsen.', 'Jag är orolig för det.'] },
      { id: 'mha9', speaker: 'partner', sv: 'Det är tungt att vara sjuk länge. Men proverna såg bra ut.', de: 'Es ist schwer, lange krank zu sein. Aber die Proben sahen gut aus.', decoding: [{ sv: 'det', de: 'es' }, { sv: 'är', de: 'ist' }, { sv: 'tungt', de: 'schwer' }, { sv: 'att', de: 'zu' }, { sv: 'vara', de: 'sein' }, { sv: 'sjuk', de: 'krank' }, { sv: 'länge', de: 'lange' }, { sv: 'men', de: 'aber' }, { sv: 'proverna', de: 'die Proben' }, { sv: 'såg', de: 'sahen' }, { sv: 'bra', de: 'gut' }, { sv: 'ut', de: 'aus' }] },
      { id: 'mha10', speaker: 'you', sv: 'jag är nöjd med resultatet', de: 'ich bin mit dem Ergebnis zufrieden', chunkId: 'c-arnojd', suggestions: ['Jag är nöjd med resultatet.', 'Det känns bra nu.'] },
    ],
  },

  // ── Familie: Schule, Jahreszeit, Feste ────────────────────────────────────
  {
    id: 'dlg-mix-familj',
    categoryId: 'cat-kids',
    title: 'Am Küchentisch im Dezember',
    blurb: 'Schulbeginn, Lehrkraft, dunkler Winter — und was zu Weihnachten läuft.',
    scene: 'home',
    partnerName: 'Partnerin',
    turns: [
      { id: 'mf1', speaker: 'partner', sv: 'Det är alldeles mörkt ute och klockan är bara fyra.', de: 'Es ist ganz dunkel draußen und es ist erst vier Uhr.', listenFirst: true, decoding: [{ sv: 'det', de: 'es' }, { sv: 'är', de: 'ist' }, { sv: 'alldeles', de: 'ganz' }, { sv: 'mörkt', de: 'dunkel' }, { sv: 'ute', de: 'draußen' }, { sv: 'och', de: 'und' }, { sv: 'klockan', de: 'die Uhr' }, { sv: 'är', de: 'ist' }, { sv: 'bara', de: 'nur' }, { sv: 'fyra', de: 'vier' }] },
      { id: 'mf2', speaker: 'you', sv: 'i januari är det kallt', de: 'im Januar ist es kalt', chunkId: 'c-ijanuari', suggestions: ['I januari är det kallt.', 'Det blir mörkt tidigt.'] },
      { id: 'mf3', speaker: 'partner', sv: 'Och ljuset kommer tillbaka först i mars.', de: 'Und das Licht kommt erst im März zurück.', decoding: [{ sv: 'och', de: 'und' }, { sv: 'ljuset', de: 'das Licht' }, { sv: 'kommer', de: 'kommt' }, { sv: 'tillbaka', de: 'zurück' }, { sv: 'först', de: 'erst' }, { sv: 'i', de: 'im' }, { sv: 'mars', de: 'März' }] },
      { id: 'mf4', speaker: 'you', sv: 'på sommaren är det ljust', de: 'im Sommer ist es hell', chunkId: 'c-pasommaren', suggestions: ['På sommaren är det ljust.', 'I januari är det kallt.'] },
      { id: 'mf5', speaker: 'partner', sv: 'Långt dit. Väckte du barnen i tid i morse?', de: 'Weit hin. Hast du die Kinder heute Morgen rechtzeitig geweckt?', decoding: [{ sv: 'långt', de: 'weit' }, { sv: 'dit', de: 'dorthin' }, { sv: 'väckte', de: 'wecktest' }, { sv: 'du', de: 'du' }, { sv: 'barnen', de: 'die Kinder' }, { sv: 'i', de: 'in' }, { sv: 'tid', de: 'Zeit' }, { sv: 'i', de: 'am' }, { sv: 'morse', de: 'Morgen' }] },
      { id: 'mf6', speaker: 'you', sv: 'skolan börjar klockan åtta', de: 'die Schule beginnt um acht', chunkId: 'c-skolanborjar', suggestions: ['Skolan börjar klockan åtta.', 'Det är dags att sova.'] },
      { id: 'mf7', speaker: 'partner', sv: 'Vi ska förresten på föräldramöte på tisdag.', de: 'Wir haben übrigens am Dienstag Elternabend.', decoding: [{ sv: 'vi', de: 'wir' }, { sv: 'ska', de: 'sollen' }, { sv: 'förresten', de: 'übrigens' }, { sv: 'på', de: 'auf' }, { sv: 'föräldramöte', de: 'Elternabend' }, { sv: 'på', de: 'am' }, { sv: 'tisdag', de: 'Dienstag' }] },
      { id: 'mf8', speaker: 'you', sv: 'vem är läraren?', de: 'wer ist die Lehrkraft?', chunkId: 'c-vemarlararen', suggestions: ['Vem är läraren?', 'Hur gick provet?'] },
      { id: 'mf9', speaker: 'partner', sv: 'Hon som bor i grannhuset. Snäll, säger barnen.', de: 'Die, die im Nachbarhaus wohnt. Nett, sagen die Kinder.', decoding: [{ sv: 'hon', de: 'sie' }, { sv: 'som', de: 'die' }, { sv: 'bor', de: 'wohnt' }, { sv: 'i', de: 'in' }, { sv: 'grannhuset', de: 'dem Nachbarhaus' }, { sv: 'snäll', de: 'nett' }, { sv: 'säger', de: 'sagen' }, { sv: 'barnen', de: 'die Kinder' }] },
      { id: 'mf10', speaker: 'you', sv: 'vad gör ni under jul?', de: 'was macht ihr an Weihnachten?', chunkId: 'c-vadgorniunderjul', suggestions: ['Vad gör ni under jul?', 'När firar ni det?'] },
      { id: 'mf11', speaker: 'partner', sv: 'Vi stannar hemma. Och till våren blir det ägg och sill.', de: 'Wir bleiben zu Hause. Und im Frühling gibt es Eier und Hering.', decoding: [{ sv: 'vi', de: 'wir' }, { sv: 'stannar', de: 'bleiben' }, { sv: 'hemma', de: 'daheim' }, { sv: 'och', de: 'und' }, { sv: 'till', de: 'zu' }, { sv: 'våren', de: 'dem Frühling' }, { sv: 'blir', de: 'wird' }, { sv: 'det', de: 'es' }, { sv: 'ägg', de: 'Eier' }, { sv: 'och', de: 'und' }, { sv: 'sill', de: 'Hering' }] },
      { id: 'mf12', speaker: 'you', sv: 'glad påsk!', de: 'frohe Ostern!', chunkId: 'c-gladpask', suggestions: ['Glad påsk!', 'Vi firar midsommar.'] },
    ],
  },

  // ── Meinung: zustimmen, widersprechen, Gesellschaft ───────────────────────
  {
    id: 'dlg-mix-asikt',
    categoryId: 'cat-opinion',
    title: 'Streit über den Vorschlag',
    blurb: 'Zustimmen, widersprechen, die Sichtweise des anderen anerkennen.',
    scene: 'school',
    partnerName: 'Studienfreund',
    turns: [
      { id: 'ma1', speaker: 'partner', sv: 'Har du läst förslaget om nya regler i kommunen?', de: 'Hast du den Vorschlag über neue Regeln in der Gemeinde gelesen?', listenFirst: true, decoding: [{ sv: 'har', de: 'hast' }, { sv: 'du', de: 'du' }, { sv: 'läst', de: 'gelesen' }, { sv: 'förslaget', de: 'den Vorschlag' }, { sv: 'om', de: 'über' }, { sv: 'nya', de: 'neue' }, { sv: 'regler', de: 'Regeln' }, { sv: 'i', de: 'in' }, { sv: 'kommunen', de: 'der Gemeinde' }] },
      { id: 'ma2', speaker: 'you', sv: 'jag tycker att det är bra', de: 'ich finde, das ist gut', chunkId: 'c-tyckerattdetarbra', suggestions: ['Jag tycker att det är bra.', 'Jag håller med dig.'] },
      { id: 'ma3', speaker: 'partner', sv: 'Verkligen? Det kostar oss alla mer varje månad.', de: 'Wirklich? Es kostet uns alle jeden Monat mehr.', decoding: [{ sv: 'verkligen', de: 'wirklich' }, { sv: 'det', de: 'es' }, { sv: 'kostar', de: 'kostet' }, { sv: 'oss', de: 'uns' }, { sv: 'alla', de: 'alle' }, { sv: 'mer', de: 'mehr' }, { sv: 'varje', de: 'jeden' }, { sv: 'månad', de: 'Monat' }] },
      { id: 'ma4', speaker: 'you', sv: 'tvärtom, det tror jag inte', de: 'im Gegenteil, das glaube ich nicht', chunkId: 'c-tvartomtrorjaginte', suggestions: ['Tvärtom, det tror jag inte.', 'Jag håller inte med.'] },
      { id: 'ma5', speaker: 'partner', sv: 'Jag har sett siffrorna. De blir dyrare, inte billigare.', de: 'Ich habe die Zahlen gesehen. Sie werden teurer, nicht billiger.', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'har', de: 'habe' }, { sv: 'sett', de: 'gesehen' }, { sv: 'siffrorna', de: 'die Zahlen' }, { sv: 'de', de: 'sie' }, { sv: 'blir', de: 'werden' }, { sv: 'dyrare', de: 'teurer' }, { sv: 'inte', de: 'nicht' }, { sv: 'billigare', de: 'billiger' }] },
      { id: 'ma6', speaker: 'you', sv: 'jag förstår ditt perspektiv', de: 'ich verstehe deine Sichtweise', chunkId: 'c-forstardittperspektiv', suggestions: ['Jag förstår ditt perspektiv.', 'Det är ett bra argument.'] },
      { id: 'ma7', speaker: 'partner', sv: 'Tack. Så du håller med mig ändå, alltså?', de: 'Danke. Also stimmst du mir doch zu?', decoding: [{ sv: 'tack', de: 'danke' }, { sv: 'så', de: 'also' }, { sv: 'du', de: 'du' }, { sv: 'håller', de: 'hältst' }, { sv: 'med', de: 'mit' }, { sv: 'mig', de: 'mir' }, { sv: 'ändå', de: 'doch' }, { sv: 'alltså', de: 'also' }] },
      { id: 'ma8', speaker: 'you', sv: 'så enkelt är det inte', de: 'so einfach ist es nicht', chunkId: 'c-saenkeltardetinte', suggestions: ['Så enkelt är det inte.', 'Det beror på situationen.'] },
      { id: 'ma9', speaker: 'partner', sv: 'Ha ha, typiskt dig. Vad är det du ser som jag missar?', de: 'Ha ha, typisch du. Was siehst du, das ich übersehe?', decoding: [{ sv: 'ha', de: 'ha' }, { sv: 'ha', de: 'ha' }, { sv: 'typiskt', de: 'typisch' }, { sv: 'dig', de: 'dich' }, { sv: 'vad', de: 'was' }, { sv: 'är', de: 'ist' }, { sv: 'det', de: 'es' }, { sv: 'du', de: 'du' }, { sv: 'ser', de: 'siehst' }, { sv: 'som', de: 'das' }, { sv: 'jag', de: 'ich' }, { sv: 'missar', de: 'verpasse' }] },
      { id: 'ma10', speaker: 'you', sv: 'vi måste tänka på miljön', de: 'wir müssen an die Umwelt denken', chunkId: 'c-tankapamiljon', suggestions: ['Vi måste tänka på miljön.', 'Utsläppen måste minska.'] },
      { id: 'ma11', speaker: 'partner', sv: 'Det argumentet fanns inte för tjugo år sedan.', de: 'Dieses Argument gab es vor zwanzig Jahren nicht.', decoding: [{ sv: 'det', de: 'das' }, { sv: 'argumentet', de: 'Argument' }, { sv: 'fanns', de: 'gab es' }, { sv: 'inte', de: 'nicht' }, { sv: 'för', de: 'vor' }, { sv: 'tjugo', de: 'zwanzig' }, { sv: 'år', de: 'Jahren' }, { sv: 'sedan', de: 'her' }] },
      { id: 'ma12', speaker: 'you', sv: 'samhället förändras hela tiden', de: 'die Gesellschaft verändert sich ständig', chunkId: 'c-samhalletforandras', suggestions: ['Samhället förändras hela tiden.', 'Klimatet förändras snabbt.'] },
    ],
  },

  // ── Sprache: buchstabieren, wörtlich, erzählen, Redewendung ───────────────
  {
    id: 'dlg-mix-sprak',
    categoryId: 'cat-nuance',
    title: 'Nach dem Kurs',
    blurb: 'Buchstabieren, Ausdrücke, eine kurze Geschichte — und eine Redewendung.',
    scene: 'school',
    partnerName: 'Kursleiterin',
    turns: [
      { id: 'msp1', speaker: 'partner', sv: 'Du var tyst i dag. Går det bra med kursen?', de: 'Du warst heute still. Läuft es gut mit dem Kurs?', listenFirst: true, decoding: [{ sv: 'du', de: 'du' }, { sv: 'var', de: 'warst' }, { sv: 'tyst', de: 'still' }, { sv: 'i', de: 'am' }, { sv: 'dag', de: 'Tag' }, { sv: 'går', de: 'geht' }, { sv: 'det', de: 'es' }, { sv: 'bra', de: 'gut' }, { sv: 'med', de: 'mit' }, { sv: 'kursen', de: 'dem Kurs' }] },
      { id: 'msp2', speaker: 'you', sv: 'jag pratar lite svenska', de: 'ich spreche ein bisschen Schwedisch', chunkId: 'c-pratarlite', suggestions: ['Jag pratar lite svenska.', 'Jag är nybörjare.'] },
      { id: 'msp3', speaker: 'partner', sv: 'Mer än lite. Men namnet mitt skriver alla fel.', de: 'Mehr als ein bisschen. Aber meinen Namen schreiben alle falsch.', decoding: [{ sv: 'mer', de: 'mehr' }, { sv: 'än', de: 'als' }, { sv: 'lite', de: 'wenig' }, { sv: 'men', de: 'aber' }, { sv: 'namnet', de: 'den Namen' }, { sv: 'mitt', de: 'meinen' }, { sv: 'skriver', de: 'schreiben' }, { sv: 'alla', de: 'alle' }, { sv: 'fel', de: 'falsch' }] },
      { id: 'msp4', speaker: 'you', sv: 'hur stavar man det?', de: 'wie schreibt man das?', chunkId: 'c-hurstavar', suggestions: ['Hur stavar man det?', 'Hur uttalar man det?'] },
      { id: 'msp5', speaker: 'partner', sv: 'Med dubbla bokstäver. Och „hjärta" är också lurigt.', de: 'Mit doppelten Buchstaben. Und „Herz" ist auch tückisch.', decoding: [{ sv: 'med', de: 'mit' }, { sv: 'dubbla', de: 'doppelten' }, { sv: 'bokstäver', de: 'Buchstaben' }, { sv: 'och', de: 'und' }, { sv: 'hjärta', de: 'Herz' }, { sv: 'är', de: 'ist' }, { sv: 'också', de: 'auch' }, { sv: 'lurigt', de: 'tückisch' }] },
      { id: 'msp6', speaker: 'you', sv: 'uttrycket betyder något annat', de: 'der Ausdruck bedeutet etwas anderes', chunkId: 'c-uttrycketbetyderannat', suggestions: ['Uttrycket betyder något annat.', 'Vad är det för ord?'] },
      { id: 'msp7', speaker: 'partner', sv: 'Just det, i uttryck betyder ordet inte samma sak.', de: 'Eben, in Ausdrücken bedeutet das Wort nicht dasselbe.', decoding: [{ sv: 'just', de: 'gerade' }, { sv: 'det', de: 'das' }, { sv: 'i', de: 'in' }, { sv: 'uttryck', de: 'Ausdrücken' }, { sv: 'betyder', de: 'bedeutet' }, { sv: 'ordet', de: 'das Wort' }, { sv: 'inte', de: 'nicht' }, { sv: 'samma', de: 'dieselbe' }, { sv: 'sak', de: 'Sache' }] },
      { id: 'msp8', speaker: 'you', sv: 'bokstavligt talat', de: 'wörtlich genommen', chunkId: 'c-bokstavligttalat', suggestions: ['Bokstavligt talat.', 'Man får läsa mellan raderna.'] },
      { id: 'msp9', speaker: 'partner', sv: 'Berätta något på svenska nu. Vad hände i går?', de: 'Erzähl jetzt etwas auf Schwedisch. Was ist gestern passiert?', decoding: [{ sv: 'berätta', de: 'erzähle' }, { sv: 'något', de: 'etwas' }, { sv: 'på', de: 'auf' }, { sv: 'svenska', de: 'Schwedisch' }, { sv: 'nu', de: 'jetzt' }, { sv: 'vad', de: 'was' }, { sv: 'hände', de: 'geschah' }, { sv: 'i', de: 'am' }, { sv: 'går', de: 'gestern' }] },
      { id: 'msp10', speaker: 'you', sv: 'jag minns att det regnade', de: 'ich erinnere mich, dass es regnete', chunkId: 'c-jagminnsattdetregnade', suggestions: ['Jag minns att det regnade.', 'Det började helt vanligt.'] },
      { id: 'msp11', speaker: 'partner', sv: 'Och sedan? Sammanfatta gärna i en mening.', de: 'Und dann? Fass es gern in einem Satz zusammen.', decoding: [{ sv: 'och', de: 'und' }, { sv: 'sedan', de: 'dann' }, { sv: 'sammanfatta', de: 'fasse zusammen' }, { sv: 'gärna', de: 'gern' }, { sv: 'i', de: 'in' }, { sv: 'en', de: 'einem' }, { sv: 'mening', de: 'Satz' }] },
      { id: 'msp12', speaker: 'you', sv: 'kort sagt gick det bra', de: 'kurz gesagt ging es gut', chunkId: 'c-kortsagtgickdetbra', suggestions: ['Kort sagt gick det bra.', 'Till slut löste det sig.'] },
      { id: 'msp13', speaker: 'partner', sv: 'Snyggt! Du är nästan i mål med kursen.', de: 'Sauber! Du bist fast am Ziel mit dem Kurs.', decoding: [{ sv: 'snyggt', de: 'sauber' }, { sv: 'du', de: 'du' }, { sv: 'är', de: 'bist' }, { sv: 'nästan', de: 'fast' }, { sv: 'i', de: 'in' }, { sv: 'mål', de: 'Ziel' }, { sv: 'med', de: 'mit' }, { sv: 'kursen', de: 'dem Kurs' }] },
      { id: 'msp14', speaker: 'you', sv: 'ingen fara på taket', de: 'kein Grund zur Sorge', chunkId: 'c-ingenfarapataket', suggestions: ['Ingen fara på taket.', 'Det är ingen ko på isen.'] },
      { id: 'msp15', speaker: 'partner', sv: 'Ha ha, den satt! Provet blev inställt tre gånger dock.', de: 'Ha ha, der saß! Die Prüfung fiel allerdings dreimal aus.', decoding: [{ sv: 'ha', de: 'ha' }, { sv: 'ha', de: 'ha' }, { sv: 'den', de: 'der' }, { sv: 'satt', de: 'saß' }, { sv: 'provet', de: 'die Prüfung' }, { sv: 'blev', de: 'wurde' }, { sv: 'inställt', de: 'abgesagt' }, { sv: 'tre', de: 'drei' }, { sv: 'gånger', de: 'Mal' }, { sv: 'dock', de: 'jedoch' }] },
      { id: 'msp16', speaker: 'you', sv: 'det var droppen', de: 'das war zu viel des Guten', chunkId: 'c-detvardroppen', suggestions: ['Det var droppen.', 'Så synd!'] },
    ],
  },

  // ── Zeitung, Uhrzeit, gestern ─────────────────────────────────────────────
  {
    id: 'dlg-mix-nyheter',
    categoryId: 'cat-media',
    title: 'Was gestern in der Zeitung stand',
    blurb: 'Nachrichten, Uhrzeit, gestern — der Morgen am Frühstückstisch.',
    scene: 'home',
    partnerName: 'Mitbewohner',
    turns: [
      { id: 'mn1', speaker: 'partner', sv: 'Har du hört om bron? Alla pratar om den.', de: 'Hast du von der Brücke gehört? Alle reden davon.', listenFirst: true, decoding: [{ sv: 'har', de: 'hast' }, { sv: 'du', de: 'du' }, { sv: 'hört', de: 'gehört' }, { sv: 'om', de: 'über' }, { sv: 'bron', de: 'die Brücke' }, { sv: 'alla', de: 'alle' }, { sv: 'pratar', de: 'reden' }, { sv: 'om', de: 'über' }, { sv: 'den', de: 'sie' }] },
      { id: 'mn2', speaker: 'you', sv: 'jag såg en nyhet om det', de: 'ich habe eine Nachricht darüber gesehen', chunkId: 'c-sagennyhet', suggestions: ['Jag såg en nyhet om det.', 'Det stod i tidningen.'] },
      { id: 'mn3', speaker: 'partner', sv: 'På nätet? Jag litar mer på papperet.', de: 'Im Netz? Ich vertraue dem Papier mehr.', decoding: [{ sv: 'på', de: 'auf' }, { sv: 'nätet', de: 'dem Netz' }, { sv: 'jag', de: 'ich' }, { sv: 'litar', de: 'vertraue' }, { sv: 'mer', de: 'mehr' }, { sv: 'på', de: 'auf' }, { sv: 'papperet', de: 'das Papier' }] },
      { id: 'mn4', speaker: 'you', sv: 'det stod i tidningen', de: 'das stand in der Zeitung', chunkId: 'c-stoditidningen', suggestions: ['Det stod i tidningen.', 'Jag såg en nyhet om det.'] },
      { id: 'mn5', speaker: 'partner', sv: 'Då stämmer det nog. När hände olyckan?', de: 'Dann stimmt es wohl. Wann ist der Unfall passiert?', decoding: [{ sv: 'då', de: 'dann' }, { sv: 'stämmer', de: 'stimmt' }, { sv: 'det', de: 'es' }, { sv: 'nog', de: 'wohl' }, { sv: 'när', de: 'wann' }, { sv: 'hände', de: 'geschah' }, { sv: 'olyckan', de: 'der Unfall' }] },
      { id: 'mn6', speaker: 'you', sv: 'det var igår', de: 'das war gestern', chunkId: 'c-varigar', suggestions: ['Det var igår.', 'Jag minns att det regnade.'] },
      { id: 'mn7', speaker: 'partner', sv: 'Mitt på eftermiddagen, sa de. Vad är klockan nu?', de: 'Mitten am Nachmittag, sagten sie. Wie spät ist es jetzt?', decoding: [{ sv: 'mitt', de: 'mitten' }, { sv: 'på', de: 'am' }, { sv: 'eftermiddagen', de: 'Nachmittag' }, { sv: 'sa', de: 'sagten' }, { sv: 'de', de: 'sie' }, { sv: 'vad', de: 'was' }, { sv: 'är', de: 'ist' }, { sv: 'klockan', de: 'die Uhr' }, { sv: 'nu', de: 'jetzt' }] },
      { id: 'mn8', speaker: 'you', sv: 'klockan är kvart över tre', de: 'es ist Viertel nach drei', chunkId: 'c-kvartover', suggestions: ['Klockan är kvart över tre.', 'Klockan är halv fyra.'] },
      { id: 'mn9', speaker: 'partner', sv: 'Redan? Jag skulle överföra hyran i dag.', de: 'Schon? Ich wollte heute die Miete überweisen.', decoding: [{ sv: 'redan', de: 'schon' }, { sv: 'jag', de: 'ich' }, { sv: 'skulle', de: 'sollte' }, { sv: 'överföra', de: 'überführen' }, { sv: 'hyran', de: 'die Miete' }, { sv: 'i', de: 'am' }, { sv: 'dag', de: 'Tag' }] },
      { id: 'mn10', speaker: 'you', sv: 'jag vill överföra pengar', de: 'ich möchte Geld überweisen', chunkId: 'c-overforapengar', suggestions: ['Jag vill överföra pengar.', 'Kan jag växla pengar?'] },
    ],
  },
];
