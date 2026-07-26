// GESPRÄCHE auf dem Meilenstein B1 — hier hört das Abfragen auf.
//
// ⚠️ EHRLICH: von uns/der KI verfasst, NICHT muttersprachlich geprüft
// (docs/content-review-schwedisch.md).
//
// Jede „du"-Zeile ist WÖRTLICH ihr Chunk — sonst wäre der Abruf nicht prüfbar.

import type { Dialog } from '../../domain/dialog';

export const dialogs: Dialog[] = [
  // ── Gefühle & Befinden ────────────────────────────────────────────────────
  {
    id: 'dlg-kanslor',
    categoryId: 'cat-feelings',
    title: 'Wie es dir wirklich geht',
    blurb: 'Über Druck, Sorge und Enttäuschung reden — ohne „bra, tack".',
    scene: 'home',
    partnerName: 'Lena',
    turns: [
      { id: 'ks1', speaker: 'partner', sv: 'Du har varit tyst hela veckan. Är allt bra, {name}?', de: 'Du warst die ganze Woche still. Ist alles gut, {name}?', listenFirst: true, decoding: [{ sv: 'du', de: 'du' }, { sv: 'har', de: 'bist' }, { sv: 'varit', de: 'gewesen' }, { sv: 'tyst', de: 'still' }, { sv: 'hela', de: 'die ganze' }, { sv: 'veckan', de: 'Woche' }, { sv: 'är', de: 'ist' }, { sv: 'allt', de: 'alles' }, { sv: 'bra', de: 'gut' }] },
      { id: 'ks2', speaker: 'you', sv: 'jag känner mig stressad', de: 'ich fühle mich gestresst', chunkId: 'c-kannerstressad', suggestions: ['Jag känner mig stressad.', 'Jag är trött.'] },
      { id: 'ks3', speaker: 'partner', sv: 'Det märks. Är det jobbet eller något annat?', de: 'Das merkt man. Ist es die Arbeit oder etwas anderes?', decoding: [{ sv: 'det', de: 'das' }, { sv: 'märks', de: 'merkt sich' }, { sv: 'är', de: 'ist' }, { sv: 'det', de: 'es' }, { sv: 'jobbet', de: 'die Arbeit' }, { sv: 'eller', de: 'oder' }, { sv: 'något', de: 'etwas' }, { sv: 'annat', de: 'anderes' }] },
      { id: 'ks4', speaker: 'you', sv: 'jag är orolig för det', de: 'ich mache mir Sorgen darüber', chunkId: 'c-arorolig', suggestions: ['Jag är orolig för det.', 'Det gör mig ledsen.'] },
      { id: 'ks5', speaker: 'partner', sv: 'Berätta. Blev det inte som du hoppades?', de: 'Erzähl. Wurde es nicht so, wie du gehofft hast?', decoding: [{ sv: 'berätta', de: 'erzähle' }, { sv: 'blev', de: 'wurde' }, { sv: 'det', de: 'es' }, { sv: 'inte', de: 'nicht' }, { sv: 'som', de: 'wie' }, { sv: 'du', de: 'du' }, { sv: 'hoppades', de: 'hofftest' }] },
      { id: 'ks6', speaker: 'you', sv: 'jag blev besviken', de: 'ich war enttäuscht', chunkId: 'c-blevbesviken', suggestions: ['Jag blev besviken.', 'Jag förväntade mig något annat.'] },
      { id: 'ks7', speaker: 'partner', sv: 'Det förstår jag. Du gjorde ändå ett bra jobb.', de: 'Das verstehe ich. Du hast trotzdem gute Arbeit gemacht.', decoding: [{ sv: 'det', de: 'das' }, { sv: 'förstår', de: 'verstehe' }, { sv: 'jag', de: 'ich' }, { sv: 'du', de: 'du' }, { sv: 'gjorde', de: 'machtest' }, { sv: 'ändå', de: 'trotzdem' }, { sv: 'ett', de: 'eine' }, { sv: 'bra', de: 'gute' }, { sv: 'jobb', de: 'Arbeit' }] },
      { id: 'ks8', speaker: 'you', sv: 'det känns bra nu', de: 'es fühlt sich jetzt gut an', chunkId: 'c-detkannsbra', suggestions: ['Det känns bra nu.', 'Jag är nöjd med resultatet.'] },
      { id: 'ks9', speaker: 'partner', sv: 'Bra. Ta det lugnt i helgen, du behöver det.', de: 'Gut. Nimm es am Wochenende ruhig, du brauchst es.', decoding: [{ sv: 'bra', de: 'gut' }, { sv: 'ta', de: 'nimm' }, { sv: 'det', de: 'es' }, { sv: 'lugnt', de: 'ruhig' }, { sv: 'i', de: 'an' }, { sv: 'helgen', de: 'dem Wochenende' }, { sv: 'du', de: 'du' }, { sv: 'behöver', de: 'brauchst' }, { sv: 'det', de: 'es' }] },
      { id: 'ks10', speaker: 'you', sv: 'jag behöver vila', de: 'ich brauche Ruhe', chunkId: 'c-behovervila', suggestions: ['Jag behöver vila.', 'Jag är trött.'] },
      { id: 'ks11', speaker: 'partner', sv: 'Och förresten: du sa ifrån på mötet. Det var modigt.', de: 'Und übrigens: du hast im Meeting etwas gesagt. Das war mutig.', decoding: [{ sv: 'och', de: 'und' }, { sv: 'förresten', de: 'übrigens' }, { sv: 'du', de: 'du' }, { sv: 'sa', de: 'sagtest' }, { sv: 'ifrån', de: 'davon' }, { sv: 'på', de: 'auf' }, { sv: 'mötet', de: 'dem Treffen' }, { sv: 'det', de: 'das' }, { sv: 'var', de: 'war' }, { sv: 'modigt', de: 'mutig' }] },
      { id: 'ks12', speaker: 'you', sv: 'jag är stolt över dig', de: 'ich bin stolz auf dich', chunkId: 'c-stoltover', suggestions: ['Jag är stolt över dig.', 'Jag är nöjd med resultatet.'] },
    ],
  },

  // ── Reklamation & Probleme ────────────────────────────────────────────────
  {
    id: 'dlg-reklamation',
    categoryId: 'cat-complaint',
    title: 'Etwas ist kaputt',
    blurb: 'Ruhig, aber bestimmt: reklamieren, Garantie klären, Geld zurück.',
    scene: 'shop',
    partnerName: 'Kundendienst',
    turns: [
      { id: 'rk1', speaker: 'partner', sv: 'Hej! Vad gäller det?', de: 'Hallo! Worum geht es?', listenFirst: true, decoding: [{ sv: 'hej', de: 'hallo' }, { sv: 'vad', de: 'was' }, { sv: 'gäller', de: 'gilt' }, { sv: 'det', de: 'es' }] },
      { id: 'rk2', speaker: 'you', sv: 'den är trasig', de: 'es ist kaputt', chunkId: 'c-dentrasig', suggestions: ['Den är trasig.', 'Det är fel på varan.'] },
      { id: 'rk3', speaker: 'partner', sv: 'Oj. Har den varit så sedan du köpte den?', de: 'Oh. War sie so, seit du sie gekauft hast?', decoding: [{ sv: 'oj', de: 'oh' }, { sv: 'har', de: 'ist' }, { sv: 'den', de: 'sie' }, { sv: 'varit', de: 'gewesen' }, { sv: 'så', de: 'so' }, { sv: 'sedan', de: 'seit' }, { sv: 'du', de: 'du' }, { sv: 'köpte', de: 'kauftest' }, { sv: 'den', de: 'sie' }] },
      { id: 'rk4', speaker: 'you', sv: 'det har fungerat dåligt hela tiden', de: 'es hat die ganze Zeit schlecht funktioniert', chunkId: 'c-fungeratdaligt', suggestions: ['Det har fungerat dåligt hela tiden.', 'Det låter konstigt.'] },
      { id: 'rk5', speaker: 'partner', sv: 'Då borde du ha hört av dig tidigare, ärligt talat.', de: 'Dann hättest du dich ehrlich gesagt früher melden sollen.', decoding: [{ sv: 'då', de: 'dann' }, { sv: 'borde', de: 'solltest' }, { sv: 'du', de: 'du' }, { sv: 'ha', de: 'haben' }, { sv: 'hört', de: 'gehört' }, { sv: 'av', de: 'von' }, { sv: 'dig', de: 'dir' }, { sv: 'tidigare', de: 'früher' }, { sv: 'ärligt', de: 'ehrlich' }, { sv: 'talat', de: 'gesprochen' }] },
      { id: 'rk6', speaker: 'you', sv: 'jag vill klaga på det här', de: 'ich möchte mich darüber beschweren', chunkId: 'c-villklaga', suggestions: ['Jag vill klaga på det här.', 'Jag förväntade mig något annat.'] },
      { id: 'rk7', speaker: 'partner', sv: 'Jag noterar det. Men jag beslutar inte om pengar.', de: 'Ich notiere das. Aber über Geld entscheide ich nicht.', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'noterar', de: 'notiere' }, { sv: 'det', de: 'das' }, { sv: 'men', de: 'aber' }, { sv: 'jag', de: 'ich' }, { sv: 'beslutar', de: 'entscheide' }, { sv: 'inte', de: 'nicht' }, { sv: 'om', de: 'über' }, { sv: 'pengar', de: 'Geld' }] },
      { id: 'rk8', speaker: 'you', sv: 'vem kan jag prata med?', de: 'mit wem kann ich sprechen?', chunkId: 'c-vempratamed', suggestions: ['Vem kan jag prata med?', 'Vem är det?'] },
      { id: 'rk9', speaker: 'partner', sv: 'Min chef kommer om tio minuter. Har du kvittot kvar?', de: 'Mein Chef kommt in zehn Minuten. Hast du den Bon noch?', decoding: [{ sv: 'min', de: 'mein' }, { sv: 'chef', de: 'Chef' }, { sv: 'kommer', de: 'kommt' }, { sv: 'om', de: 'in' }, { sv: 'tio', de: 'zehn' }, { sv: 'minuter', de: 'Minuten' }, { sv: 'har', de: 'hast' }, { sv: 'du', de: 'du' }, { sv: 'kvittot', de: 'den Bon' }, { sv: 'kvar', de: 'übrig' }] },
      { id: 'rk10', speaker: 'you', sv: 'gäller garantin fortfarande?', de: 'gilt die Garantie noch?', chunkId: 'c-gallergarantin', suggestions: ['Gäller garantin fortfarande?', 'Jag har kvittot.'] },
      { id: 'rk11', speaker: 'partner', sv: 'Ja, i två år. Vi byter den eller betalar tillbaka.', de: 'Ja, zwei Jahre. Wir tauschen sie oder zahlen zurück.', decoding: [{ sv: 'ja', de: 'ja' }, { sv: 'i', de: 'in' }, { sv: 'två', de: 'zwei' }, { sv: 'år', de: 'Jahre' }, { sv: 'vi', de: 'wir' }, { sv: 'byter', de: 'tauschen' }, { sv: 'den', de: 'sie' }, { sv: 'eller', de: 'oder' }, { sv: 'betalar', de: 'zahlen' }, { sv: 'tillbaka', de: 'zurück' }] },
      { id: 'rk12', speaker: 'you', sv: 'får jag pengarna tillbaka?', de: 'bekomme ich das Geld zurück?', chunkId: 'c-pengarnatillbaka', suggestions: ['Får jag pengarna tillbaka?', 'Kan jag byta den?'] },
    ],
  },

  // ── Filme, Bücher & Nachrichten ───────────────────────────────────────────
  {
    id: 'dlg-medier',
    categoryId: 'cat-media',
    title: 'Was schaust du gerade?',
    blurb: 'Über Serien, Filme und Bücher reden — und eine Empfehlung holen.',
    scene: 'home',
    partnerName: 'Oskar',
    turns: [
      { id: 'md1', speaker: 'partner', sv: 'Jag satt uppe alldeles för länge i går kväll.', de: 'Ich bin gestern Abend viel zu lange aufgeblieben.', listenFirst: true, decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'satt', de: 'saß' }, { sv: 'uppe', de: 'oben' }, { sv: 'alldeles', de: 'ganz' }, { sv: 'för', de: 'zu' }, { sv: 'länge', de: 'lange' }, { sv: 'i', de: 'am' }, { sv: 'går', de: 'gestern' }, { sv: 'kväll', de: 'Abend' }] },
      { id: 'md2', speaker: 'you', sv: 'vilken serie ser du på?', de: 'welche Serie schaust du?', chunkId: 'c-vilkenserie', suggestions: ['Vilken serie ser du på?', 'Vilket spel spelar du?'] },
      { id: 'md3', speaker: 'partner', sv: 'En svensk deckare. Sex avsnitt, alla korta.', de: 'Ein schwedischer Krimi. Sechs Folgen, alle kurz.', decoding: [{ sv: 'en', de: 'ein' }, { sv: 'svensk', de: 'schwedischer' }, { sv: 'deckare', de: 'Krimi' }, { sv: 'sex', de: 'sechs' }, { sv: 'avsnitt', de: 'Folgen' }, { sv: 'alla', de: 'alle' }, { sv: 'korta', de: 'kurz' }] },
      { id: 'md4', speaker: 'you', sv: 'vad handlar den om?', de: 'worum geht es darin?', chunkId: 'c-vadhandlardenom', suggestions: ['Vad handlar den om?', 'Vad betyder det?'] },
      { id: 'md5', speaker: 'partner', sv: 'En liten stad där ingen säger sanningen. Jag avslöjar inget mer.', de: 'Eine kleine Stadt, in der niemand die Wahrheit sagt. Mehr verrate ich nicht.', decoding: [{ sv: 'en', de: 'eine' }, { sv: 'liten', de: 'kleine' }, { sv: 'stad', de: 'Stadt' }, { sv: 'där', de: 'wo' }, { sv: 'ingen', de: 'niemand' }, { sv: 'säger', de: 'sagt' }, { sv: 'sanningen', de: 'die Wahrheit' }, { sv: 'jag', de: 'ich' }, { sv: 'avslöjar', de: 'verrate' }, { sv: 'inget', de: 'nichts' }, { sv: 'mer', de: 'mehr' }] },
      { id: 'md6', speaker: 'you', sv: 'sista avsnittet var bäst', de: 'die letzte Folge war die beste', chunkId: 'c-sistaavsnittet', suggestions: ['Sista avsnittet var bäst.', 'Filmen var för lång.'] },
      { id: 'md7', speaker: 'partner', sv: 'Har du redan sett den? Då förstår du varför jag satt uppe.', de: 'Hast du sie schon gesehen? Dann verstehst du, warum ich aufgeblieben bin.', decoding: [{ sv: 'har', de: 'hast' }, { sv: 'du', de: 'du' }, { sv: 'redan', de: 'schon' }, { sv: 'sett', de: 'gesehen' }, { sv: 'den', de: 'sie' }, { sv: 'då', de: 'dann' }, { sv: 'förstår', de: 'verstehst' }, { sv: 'du', de: 'du' }, { sv: 'varför', de: 'warum' }, { sv: 'jag', de: 'ich' }, { sv: 'satt', de: 'saß' }, { sv: 'uppe', de: 'oben' }] },
      { id: 'md8', speaker: 'you', sv: 'filmen var för lång', de: 'der Film war zu lang', chunkId: 'c-filmenvarforlang', suggestions: ['Filmen var för lång.', 'Sista avsnittet var bäst.'] },
      { id: 'md9', speaker: 'partner', sv: 'Filmen, ja. Boken var mycket bättre, tycker jag.', de: 'Der Film, ja. Das Buch war viel besser, finde ich.', decoding: [{ sv: 'filmen', de: 'der Film' }, { sv: 'ja', de: 'ja' }, { sv: 'boken', de: 'das Buch' }, { sv: 'var', de: 'war' }, { sv: 'mycket', de: 'viel' }, { sv: 'bättre', de: 'besser' }, { sv: 'tycker', de: 'meine' }, { sv: 'jag', de: 'ich' }] },
      { id: 'md10', speaker: 'you', sv: 'jag läser en roman just nu', de: 'ich lese gerade einen Roman', chunkId: 'c-laserenroman', suggestions: ['Jag läser en roman just nu.', 'Det stod i tidningen.'] },
      { id: 'md11', speaker: 'partner', sv: 'På svenska? Modigt! Vill du ha fler tips?', de: 'Auf Schwedisch? Mutig! Willst du mehr Tipps?', decoding: [{ sv: 'på', de: 'auf' }, { sv: 'svenska', de: 'Schwedisch' }, { sv: 'modigt', de: 'mutig' }, { sv: 'vill', de: 'willst' }, { sv: 'du', de: 'du' }, { sv: 'ha', de: 'haben' }, { sv: 'fler', de: 'mehr' }, { sv: 'tips', de: 'Tipps' }] },
      { id: 'md12', speaker: 'you', sv: 'kan du rekommendera något?', de: 'kannst du etwas empfehlen?', chunkId: 'c-rekommenderanagot', suggestions: ['Kan du rekommendera något?', 'Vad rekommenderar du?'] },
    ],
  },

  // ── Feste & Traditionen ───────────────────────────────────────────────────
  {
    id: 'dlg-traditioner',
    categoryId: 'cat-traditions',
    title: 'Mittsommer erklärt',
    blurb: 'Nach Bräuchen fragen, zugeben, dass man neu ist — und mitmachen.',
    scene: 'lake',
    partnerName: 'Britta',
    turns: [
      { id: 'tr1', speaker: 'partner', sv: 'Nu är det snart midsommar. Ska du fira med oss?', de: 'Bald ist Mittsommer. Feierst du mit uns?', listenFirst: true, decoding: [{ sv: 'nu', de: 'jetzt' }, { sv: 'är', de: 'ist' }, { sv: 'det', de: 'es' }, { sv: 'snart', de: 'bald' }, { sv: 'midsommar', de: 'Mittsommer' }, { sv: 'ska', de: 'wirst' }, { sv: 'du', de: 'du' }, { sv: 'fira', de: 'feiern' }, { sv: 'med', de: 'mit' }, { sv: 'oss', de: 'uns' }] },
      { id: 'tr2', speaker: 'you', sv: 'jag har aldrig varit med', de: 'ich war noch nie dabei', chunkId: 'c-aldrigvaritmed', suggestions: ['Jag har aldrig varit med.', 'Jag är nybörjare.'] },
      { id: 'tr3', speaker: 'partner', sv: 'Då blir det första gången! Vi står ute hela dagen.', de: 'Dann wird es das erste Mal! Wir sind den ganzen Tag draußen.', decoding: [{ sv: 'då', de: 'dann' }, { sv: 'blir', de: 'wird' }, { sv: 'det', de: 'es' }, { sv: 'första', de: 'erste' }, { sv: 'gången', de: 'Mal' }, { sv: 'vi', de: 'wir' }, { sv: 'står', de: 'stehen' }, { sv: 'ute', de: 'draußen' }, { sv: 'hela', de: 'den ganzen' }, { sv: 'dagen', de: 'Tag' }] },
      { id: 'tr4', speaker: 'you', sv: 'när firar ni det?', de: 'wann feiert ihr das?', chunkId: 'c-narfirarnidet', suggestions: ['När firar ni det?', 'När börjar festen?'] },
      { id: 'tr5', speaker: 'partner', sv: 'Alltid en fredag i juni, när nätterna är ljusa.', de: 'Immer an einem Freitag im Juni, wenn die Nächte hell sind.', decoding: [{ sv: 'alltid', de: 'immer' }, { sv: 'en', de: 'einen' }, { sv: 'fredag', de: 'Freitag' }, { sv: 'i', de: 'im' }, { sv: 'juni', de: 'Juni' }, { sv: 'när', de: 'wenn' }, { sv: 'nätterna', de: 'die Nächte' }, { sv: 'är', de: 'sind' }, { sv: 'ljusa', de: 'hell' }] },
      { id: 'tr6', speaker: 'you', sv: 'det är en gammal tradition', de: 'das ist eine alte Tradition', chunkId: 'c-gammaltradition', suggestions: ['Det är en gammal tradition.', 'Vi firar midsommar.'] },
      { id: 'tr7', speaker: 'partner', sv: 'Mycket gammal. Ingen minns riktigt varför vi gör så.', de: 'Sehr alt. Niemand erinnert sich richtig, warum wir das so machen.', decoding: [{ sv: 'mycket', de: 'sehr' }, { sv: 'gammal', de: 'alt' }, { sv: 'ingen', de: 'niemand' }, { sv: 'minns', de: 'erinnert sich' }, { sv: 'riktigt', de: 'richtig' }, { sv: 'varför', de: 'warum' }, { sv: 'vi', de: 'wir' }, { sv: 'gör', de: 'machen' }, { sv: 'så', de: 'so' }] },
      { id: 'tr8', speaker: 'you', sv: 'vi äter alltid tillsammans', de: 'wir essen immer zusammen', chunkId: 'c-aterallttillsammans', suggestions: ['Vi äter alltid tillsammans.', 'Vi sjunger tillsammans.'] },
      { id: 'tr9', speaker: 'partner', sv: 'Precis. Och mellan rätterna sjunger alla, högt och falskt.', de: 'Genau. Und zwischen den Gängen singen alle, laut und schief.', decoding: [{ sv: 'precis', de: 'genau' }, { sv: 'och', de: 'und' }, { sv: 'mellan', de: 'zwischen' }, { sv: 'rätterna', de: 'den Gängen' }, { sv: 'sjunger', de: 'singen' }, { sv: 'alla', de: 'alle' }, { sv: 'högt', de: 'laut' }, { sv: 'och', de: 'und' }, { sv: 'falskt', de: 'falsch' }] },
      { id: 'tr10', speaker: 'you', sv: 'vi sjunger tillsammans', de: 'wir singen zusammen', chunkId: 'c-sjungertillsammans', suggestions: ['Vi sjunger tillsammans.', 'Vi äter alltid tillsammans.'] },
      { id: 'tr11', speaker: 'partner', sv: 'Just det! Du hänger med redan, {name}.', de: 'Genau! Du kommst schon mit, {name}.', decoding: [{ sv: 'just', de: 'gerade' }, { sv: 'det', de: 'das' }, { sv: 'du', de: 'du' }, { sv: 'hänger', de: 'hängst' }, { sv: 'med', de: 'mit' }, { sv: 'redan', de: 'schon' }] },
      { id: 'tr12', speaker: 'you', sv: 'vi firar midsommar', de: 'wir feiern Mittsommer', chunkId: 'c-firarmidsommar', suggestions: ['Vi firar midsommar.', 'Glad påsk!'] },
    ],
  },

  // ── Bewerbung & Arbeitssuche ──────────────────────────────────────────────
  {
    id: 'dlg-ansokan',
    categoryId: 'cat-jobsearch',
    title: 'Das Vorstellungsgespräch',
    blurb: 'Erfahrung nennen, nach dem Lohn fragen, den Anfang festlegen.',
    scene: 'office',
    partnerName: 'Personalchefin',
    turns: [
      { id: 'an1', speaker: 'partner', sv: 'Välkommen in. Berätta lite om dig själv.', de: 'Willkommen. Erzähl ein bisschen von dir.', listenFirst: true, decoding: [{ sv: 'välkommen', de: 'willkommen' }, { sv: 'in', de: 'herein' }, { sv: 'berätta', de: 'erzähle' }, { sv: 'lite', de: 'wenig' }, { sv: 'om', de: 'über' }, { sv: 'dig', de: 'dich' }, { sv: 'själv', de: 'selbst' }] },
      { id: 'an2', speaker: 'you', sv: 'jag söker jobb', de: 'ich suche Arbeit', chunkId: 'c-sokerjobb', suggestions: ['Jag söker jobb.', 'Jag jobbar på ett kontor.'] },
      { id: 'an3', speaker: 'partner', sv: 'Det förstod jag. Hur hittade du oss?', de: 'Das habe ich verstanden. Wie hast du uns gefunden?', decoding: [{ sv: 'det', de: 'das' }, { sv: 'förstod', de: 'verstand' }, { sv: 'jag', de: 'ich' }, { sv: 'hur', de: 'wie' }, { sv: 'hittade', de: 'fandest' }, { sv: 'du', de: 'du' }, { sv: 'oss', de: 'uns' }] },
      { id: 'an4', speaker: 'you', sv: 'jag har skickat en ansökan', de: 'ich habe eine Bewerbung geschickt', chunkId: 'c-skickatansokan', suggestions: ['Jag har skickat en ansökan.', 'Jag skickar ett mejl.'] },
      { id: 'an5', speaker: 'partner', sv: 'Jag har läst den. Vad har du gjort tidigare?', de: 'Ich habe sie gelesen. Was hast du vorher gemacht?', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'har', de: 'habe' }, { sv: 'läst', de: 'gelesen' }, { sv: 'den', de: 'sie' }, { sv: 'vad', de: 'was' }, { sv: 'har', de: 'hast' }, { sv: 'du', de: 'du' }, { sv: 'gjort', de: 'gemacht' }, { sv: 'tidigare', de: 'früher' }] },
      { id: 'an6', speaker: 'you', sv: 'jag har erfarenhet av det', de: 'ich habe Erfahrung damit', chunkId: 'c-harerfarenhet', suggestions: ['Jag har erfarenhet av det.', 'Jag har en utbildning i det.'] },
      { id: 'an7', speaker: 'partner', sv: 'Bra. Har du läst något formellt inom området?', de: 'Gut. Hast du in dem Bereich etwas Formales gelernt?', decoding: [{ sv: 'bra', de: 'gut' }, { sv: 'har', de: 'hast' }, { sv: 'du', de: 'du' }, { sv: 'läst', de: 'gelernt' }, { sv: 'något', de: 'etwas' }, { sv: 'formellt', de: 'Formales' }, { sv: 'inom', de: 'innerhalb' }, { sv: 'området', de: 'des Bereichs' }] },
      { id: 'an8', speaker: 'you', sv: 'jag har en utbildning i det', de: 'ich habe darin eine Ausbildung', chunkId: 'c-harutbildning', suggestions: ['Jag har en utbildning i det.', 'Jag har erfarenhet av det.'] },
      { id: 'an9', speaker: 'partner', sv: 'Utmärkt. Har du några frågor till mig?', de: 'Ausgezeichnet. Hast du Fragen an mich?', decoding: [{ sv: 'utmärkt', de: 'ausgezeichnet' }, { sv: 'har', de: 'hast' }, { sv: 'du', de: 'du' }, { sv: 'några', de: 'einige' }, { sv: 'frågor', de: 'Fragen' }, { sv: 'till', de: 'an' }, { sv: 'mig', de: 'mich' }] },
      { id: 'an10', speaker: 'you', sv: 'vad är lönen?', de: 'wie hoch ist der Lohn?', chunkId: 'c-vadarlonen', suggestions: ['Vad är lönen?', 'Vad kostar det?'] },
      { id: 'an11', speaker: 'partner', sv: 'Vi följer avtalet. Kan du börja i nästa vecka?', de: 'Wir folgen dem Tarifvertrag. Kannst du nächste Woche anfangen?', decoding: [{ sv: 'vi', de: 'wir' }, { sv: 'följer', de: 'folgen' }, { sv: 'avtalet', de: 'dem Vertrag' }, { sv: 'kan', de: 'kannst' }, { sv: 'du', de: 'du' }, { sv: 'börja', de: 'beginnen' }, { sv: 'i', de: 'in' }, { sv: 'nästa', de: 'nächster' }, { sv: 'vecka', de: 'Woche' }] },
      { id: 'an12', speaker: 'you', sv: 'jag börjar på måndag', de: 'ich fange am Montag an', chunkId: 'c-borjarpamandag', suggestions: ['Jag börjar på måndag.', 'Det passar på måndag.'] },
    ],
  },

  // ── Meinung & Begründung ──────────────────────────────────────────────────
  {
    id: 'dlg-asikt',
    categoryId: 'cat-opinion',
    title: 'Anderer Meinung sein',
    blurb: 'Zustimmen, widersprechen, begründen — ohne Streit.',
    scene: 'school',
    partnerName: 'Peter',
    turns: [
      { id: 'as1', speaker: 'partner', sv: 'De vill stänga vägen genom byn. Bra idé, eller hur?', de: 'Sie wollen die Straße durchs Dorf sperren. Gute Idee, oder?', listenFirst: true, decoding: [{ sv: 'de', de: 'sie' }, { sv: 'vill', de: 'wollen' }, { sv: 'stänga', de: 'schließen' }, { sv: 'vägen', de: 'die Straße' }, { sv: 'genom', de: 'durch' }, { sv: 'byn', de: 'das Dorf' }, { sv: 'bra', de: 'gute' }, { sv: 'idé', de: 'Idee' }, { sv: 'eller', de: 'oder' }, { sv: 'hur', de: 'wie' }] },
      { id: 'as2', speaker: 'you', sv: 'vad tycker du om det?', de: 'was hältst du davon?', chunkId: 'c-vadtyckerduomdet', suggestions: ['Vad tycker du om det?', 'Vad betyder det?'] },
      { id: 'as3', speaker: 'partner', sv: 'Jag är för. Barnen skulle kunna cykla tryggt.', de: 'Ich bin dafür. Die Kinder könnten sicher Rad fahren.', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'är', de: 'bin' }, { sv: 'för', de: 'dafür' }, { sv: 'barnen', de: 'die Kinder' }, { sv: 'skulle', de: 'würden' }, { sv: 'kunna', de: 'können' }, { sv: 'cykla', de: 'radfahren' }, { sv: 'tryggt', de: 'sicher' }] },
      { id: 'as4', speaker: 'you', sv: 'jag håller med dig', de: 'ich stimme dir zu', chunkId: 'c-hallermeddig', suggestions: ['Jag håller med dig.', 'Jag håller inte med.'] },
      { id: 'as5', speaker: 'partner', sv: 'Men affärerna förlorar kunder. Det oroar många här.', de: 'Aber die Läden verlieren Kunden. Das beunruhigt hier viele.', decoding: [{ sv: 'men', de: 'aber' }, { sv: 'affärerna', de: 'die Läden' }, { sv: 'förlorar', de: 'verlieren' }, { sv: 'kunder', de: 'Kunden' }, { sv: 'det', de: 'das' }, { sv: 'oroar', de: 'beunruhigt' }, { sv: 'många', de: 'viele' }, { sv: 'här', de: 'hier' }] },
      { id: 'as6', speaker: 'you', sv: 'det beror på situationen', de: 'das kommt auf die Situation an', chunkId: 'c-detberorpa', suggestions: ['Det beror på situationen.', 'Så enkelt är det inte.'] },
      { id: 'as7', speaker: 'partner', sv: 'Hur menar du? Antingen stänger vi eller så gör vi det inte.', de: 'Wie meinst du das? Entweder sperren wir oder nicht.', decoding: [{ sv: 'hur', de: 'wie' }, { sv: 'menar', de: 'meinst' }, { sv: 'du', de: 'du' }, { sv: 'antingen', de: 'entweder' }, { sv: 'stänger', de: 'schließen' }, { sv: 'vi', de: 'wir' }, { sv: 'eller', de: 'oder' }, { sv: 'så', de: 'so' }, { sv: 'gör', de: 'machen' }, { sv: 'vi', de: 'wir' }, { sv: 'det', de: 'es' }, { sv: 'inte', de: 'nicht' }] },
      { id: 'as8', speaker: 'you', sv: 'anledningen är enkel', de: 'der Grund ist einfach', chunkId: 'c-anledningenarenkel', suggestions: ['Anledningen är enkel.', 'Låt mig förklara.'] },
      { id: 'as9', speaker: 'partner', sv: 'Okej. Om vi stänger bara på helgerna, då?', de: 'Okay. Und wenn wir nur an den Wochenenden sperren?', decoding: [{ sv: 'okej', de: 'okay' }, { sv: 'om', de: 'wenn' }, { sv: 'vi', de: 'wir' }, { sv: 'stänger', de: 'schließen' }, { sv: 'bara', de: 'nur' }, { sv: 'på', de: 'an' }, { sv: 'helgerna', de: 'den Wochenenden' }, { sv: 'då', de: 'dann' }] },
      { id: 'as10', speaker: 'you', sv: 'det är ett bra argument', de: 'das ist ein gutes Argument', chunkId: 'c-ettbraargument', suggestions: ['Det är ett bra argument.', 'Jag håller med dig.'] },
      { id: 'as11', speaker: 'partner', sv: 'Men helt utan bilar går det ändå inte, säger jag.', de: 'Aber ganz ohne Autos geht es trotzdem nicht, sage ich.', decoding: [{ sv: 'men', de: 'aber' }, { sv: 'helt', de: 'ganz' }, { sv: 'utan', de: 'ohne' }, { sv: 'bilar', de: 'Autos' }, { sv: 'går', de: 'geht' }, { sv: 'det', de: 'es' }, { sv: 'ändå', de: 'trotzdem' }, { sv: 'inte', de: 'nicht' }, { sv: 'säger', de: 'sage' }, { sv: 'jag', de: 'ich' }] },
      { id: 'as12', speaker: 'you', sv: 'jag håller inte med', de: 'ich stimme nicht zu', chunkId: 'c-hallerintemed', suggestions: ['Jag håller inte med.', 'Jag håller med dig.'] },
    ],
  },
];
