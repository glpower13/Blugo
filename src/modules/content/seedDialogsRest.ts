// GESPRÄCHE zu den ÄLTEREN Themen — damit am Ende JEDES Thema eine Szene hat.
//
// WARUM DAS ZÄHLT: Der Lern-Loop übt eine Wendung isoliert; ein Gespräch
// verlangt sie an der richtigen Stelle, unter Zeitdruck, mit einer Antwort
// davor und danach. Ein Thema ohne Szene bleibt deshalb halb geübt — egal wie
// viele Kontext-Sätze es hat.
//
// ⚠️ EHRLICH: von uns/der KI verfasst, NICHT muttersprachlich geprüft
// (docs/content-review-schwedisch.md).
//
// Jede „du"-Zeile ist WÖRTLICH ihr Chunk — sonst wäre der Abruf nicht prüfbar.

import type { Dialog } from '../../domain/dialog';

export const dialogs: Dialog[] = [
  // ── Begrüßen & Kennenlernen ───────────────────────────────────────────────
  {
    id: 'dlg-halsning',
    categoryId: 'cat-greet',
    title: 'Jemanden kennenlernen',
    blurb: 'Der allererste Wortwechsel — hallo, Name, Herkunft, tschüss.',
    scene: 'street',
    partnerName: 'Ida',
    turns: [
      { id: 'hl1', speaker: 'partner', sv: 'Hej! Vi har visst inte träffats förut.', de: 'Hallo! Wir haben uns wohl noch nicht getroffen.', listenFirst: true, decoding: [{ sv: 'hej', de: 'hallo' }, { sv: 'vi', de: 'wir' }, { sv: 'har', de: 'haben' }, { sv: 'visst', de: 'wohl' }, { sv: 'inte', de: 'nicht' }, { sv: 'träffats', de: 'uns getroffen' }, { sv: 'förut', de: 'vorher' }] },
      { id: 'hl2', speaker: 'you', sv: 'jag heter', de: 'ich heiße', chunkId: 'c-heter', suggestions: ['Jag heter.', 'Jag är nybörjare.'] },
      { id: 'hl3', speaker: 'partner', sv: 'Trevligt! Jag heter Ida. Hur är läget?', de: 'Schön! Ich heiße Ida. Wie ist die Lage?', decoding: [{ sv: 'trevligt', de: 'nett' }, { sv: 'jag', de: 'ich' }, { sv: 'heter', de: 'heiße' }, { sv: 'Ida', de: 'Ida' }, { sv: 'hur', de: 'wie' }, { sv: 'är', de: 'ist' }, { sv: 'läget', de: 'die Lage' }] },
      { id: 'hl4', speaker: 'you', sv: 'hur mår du?', de: 'wie geht es dir?', chunkId: 'c-hej', suggestions: ['Hur mår du?', 'Hur går det?'] },
      { id: 'hl5', speaker: 'partner', sv: 'Tack, riktigt fint. Och du då?', de: 'Danke, richtig gut. Und du?', decoding: [{ sv: 'tack', de: 'danke' }, { sv: 'riktigt', de: 'richtig' }, { sv: 'fint', de: 'schön' }, { sv: 'och', de: 'und' }, { sv: 'du', de: 'du' }, { sv: 'då', de: 'denn' }] },
      { id: 'hl6', speaker: 'you', sv: 'jag mår bra', de: 'mir geht es gut', chunkId: 'c-marbra', suggestions: ['Jag mår bra.', 'Det går bra, tack.'] },
      { id: 'hl7', speaker: 'partner', sv: 'Du låter inte som härifrån, om jag får säga så.', de: 'Du klingst nicht wie von hier, wenn ich das sagen darf.', decoding: [{ sv: 'du', de: 'du' }, { sv: 'låter', de: 'klingst' }, { sv: 'inte', de: 'nicht' }, { sv: 'som', de: 'wie' }, { sv: 'härifrån', de: 'von hier' }, { sv: 'om', de: 'wenn' }, { sv: 'jag', de: 'ich' }, { sv: 'får', de: 'darf' }, { sv: 'säga', de: 'sagen' }, { sv: 'så', de: 'so' }] },
      { id: 'hl8', speaker: 'you', sv: 'varifrån kommer du?', de: 'woher kommst du?', chunkId: 'c-varifran', suggestions: ['Varifrån kommer du?', 'Var bor du?'] },
      { id: 'hl9', speaker: 'partner', sv: 'Från Malmö, men jag bor här nu. Vi borde ta en fika.', de: 'Aus Malmö, aber ich wohne jetzt hier. Wir sollten mal einen Kaffee trinken.', decoding: [{ sv: 'från', de: 'aus' }, { sv: 'Malmö', de: 'Malmö' }, { sv: 'men', de: 'aber' }, { sv: 'jag', de: 'ich' }, { sv: 'bor', de: 'wohne' }, { sv: 'här', de: 'hier' }, { sv: 'nu', de: 'jetzt' }, { sv: 'vi', de: 'wir' }, { sv: 'borde', de: 'sollten' }, { sv: 'ta', de: 'nehmen' }, { sv: 'en', de: 'einen' }, { sv: 'fika', de: 'Kaffee' }] },
      { id: 'hl10', speaker: 'you', sv: 'vi ses', de: 'wir sehen uns', chunkId: 'c-vises', suggestions: ['Vi ses.', 'Vi hörs.'] },
      { id: 'hl11', speaker: 'partner', sv: 'Absolut. Ha en fin dag, {name}!', de: 'Auf jeden Fall. Hab einen schönen Tag, {name}!', decoding: [{ sv: 'absolut', de: 'absolut' }, { sv: 'ha', de: 'hab' }, { sv: 'en', de: 'einen' }, { sv: 'fin', de: 'schönen' }, { sv: 'dag', de: 'Tag' }] },
      { id: 'hl12', speaker: 'you', sv: 'hej då', de: 'tschüss', chunkId: 'c-hejda', suggestions: ['Hej då.', 'Vi ses.'] },
    ],
  },

  // ── Sich verständigen ─────────────────────────────────────────────────────
  {
    id: 'dlg-forsta',
    categoryId: 'cat-understand',
    title: 'Ich habe das nicht verstanden',
    blurb: 'Nachfragen statt nicken — die wichtigste Fertigkeit am Anfang.',
    scene: 'office',
    partnerName: 'Beamter',
    turns: [
      { id: 'fo1', speaker: 'partner', sv: 'Du behöver lämna in blanketten före den femtonde.', de: 'Du musst das Formular vor dem Fünfzehnten abgeben.', listenFirst: true, decoding: [{ sv: 'du', de: 'du' }, { sv: 'behöver', de: 'brauchst' }, { sv: 'lämna', de: 'abgeben' }, { sv: 'in', de: 'ein' }, { sv: 'blanketten', de: 'das Formular' }, { sv: 'före', de: 'vor' }, { sv: 'den', de: 'dem' }, { sv: 'femtonde', de: 'Fünfzehnten' }] },
      { id: 'fo2', speaker: 'you', sv: 'jag förstår inte', de: 'ich verstehe nicht', chunkId: 'c-forstar', suggestions: ['Jag förstår inte.', 'Kan du upprepa?'] },
      { id: 'fo3', speaker: 'partner', sv: 'Blanketten. Före den femtonde. Annars förfaller ansökan.', de: 'Das Formular. Vor dem Fünfzehnten. Sonst verfällt der Antrag.', decoding: [{ sv: 'blanketten', de: 'das Formular' }, { sv: 'före', de: 'vor' }, { sv: 'den', de: 'dem' }, { sv: 'femtonde', de: 'Fünfzehnten' }, { sv: 'annars', de: 'sonst' }, { sv: 'förfaller', de: 'verfällt' }, { sv: 'ansökan', de: 'der Antrag' }] },
      { id: 'fo4', speaker: 'you', sv: 'kan du prata långsammare?', de: 'kannst du langsamer sprechen?', chunkId: 'c-langsam', suggestions: ['Kan du prata långsammare?', 'Kan du upprepa?'] },
      { id: 'fo5', speaker: 'partner', sv: 'Självklart. Jag säger det långsamt: blanketten, före den femtonde.', de: 'Selbstverständlich. Ich sage es langsam: das Formular, vor dem Fünfzehnten.', decoding: [{ sv: 'självklart', de: 'selbstverständlich' }, { sv: 'jag', de: 'ich' }, { sv: 'säger', de: 'sage' }, { sv: 'det', de: 'es' }, { sv: 'långsamt', de: 'langsam' }, { sv: 'blanketten', de: 'das Formular' }, { sv: 'före', de: 'vor' }, { sv: 'den', de: 'dem' }, { sv: 'femtonde', de: 'Fünfzehnten' }] },
      { id: 'fo6', speaker: 'you', sv: 'kan du upprepa?', de: 'kannst du das wiederholen?', chunkId: 'c-upprepa', suggestions: ['Kan du upprepa?', 'Kan du skriva det?'] },
      { id: 'fo7', speaker: 'partner', sv: 'Gärna. Och du måste bifoga ett intyg också.', de: 'Gern. Und du musst auch eine Bescheinigung beilegen.', decoding: [{ sv: 'gärna', de: 'gern' }, { sv: 'och', de: 'und' }, { sv: 'du', de: 'du' }, { sv: 'måste', de: 'musst' }, { sv: 'bifoga', de: 'beilegen' }, { sv: 'ett', de: 'eine' }, { sv: 'intyg', de: 'Bescheinigung' }, { sv: 'också', de: 'auch' }] },
      { id: 'fo8', speaker: 'you', sv: 'vad betyder det?', de: 'was bedeutet das?', chunkId: 'c-betyder', suggestions: ['Vad betyder det?', 'Vad är det för ord?'] },
      { id: 'fo9', speaker: 'partner', sv: 'Ett papper från din arbetsgivare. Det räcker.', de: 'Ein Papier von deinem Arbeitgeber. Das reicht.', decoding: [{ sv: 'ett', de: 'ein' }, { sv: 'papper', de: 'Papier' }, { sv: 'från', de: 'von' }, { sv: 'din', de: 'deinem' }, { sv: 'arbetsgivare', de: 'Arbeitgeber' }, { sv: 'det', de: 'das' }, { sv: 'räcker', de: 'reicht' }] },
      { id: 'fo10', speaker: 'you', sv: 'hur säger man det på svenska?', de: 'wie sagt man das auf Schwedisch?', chunkId: 'c-pasvenska', suggestions: ['Hur säger man det på svenska?', 'Hur uttalar man det?'] },
      { id: 'fo11', speaker: 'partner', sv: 'Ett intyg från jobbet, helt enkelt.', de: 'Eine Bescheinigung von der Arbeit, ganz einfach.', decoding: [{ sv: 'ett', de: 'eine' }, { sv: 'intyg', de: 'Bescheinigung' }, { sv: 'från', de: 'von' }, { sv: 'jobbet', de: 'der Arbeit' }, { sv: 'helt', de: 'ganz' }, { sv: 'enkelt', de: 'einfach' }] },
      { id: 'fo12', speaker: 'you', sv: 'talar du engelska?', de: 'sprichst du Englisch?', chunkId: 'c-engelska', suggestions: ['Talar du engelska?', 'Jag är nybörjare.'] },
    ],
  },

  // ── Essen & Trinken ───────────────────────────────────────────────────────
  {
    id: 'dlg-mat',
    categoryId: 'cat-food',
    title: 'Zu Gast am Esstisch',
    blurb: 'Hunger, Durst, Kaffee — und guten Appetit wünschen.',
    scene: 'cafe',
    partnerName: 'Gastgeber',
    turns: [
      { id: 'mt1', speaker: 'partner', sv: 'Kom in! Maten är nästan klar.', de: 'Komm rein! Das Essen ist fast fertig.', listenFirst: true, decoding: [{ sv: 'kom', de: 'komm' }, { sv: 'in', de: 'herein' }, { sv: 'maten', de: 'das Essen' }, { sv: 'är', de: 'ist' }, { sv: 'nästan', de: 'fast' }, { sv: 'klar', de: 'fertig' }] },
      { id: 'mt2', speaker: 'you', sv: 'jag är hungrig', de: 'ich bin hungrig', chunkId: 'c-hungrig', suggestions: ['Jag är hungrig.', 'Jag är törstig.'] },
      { id: 'mt3', speaker: 'partner', sv: 'Bra! Det blir gott. Vill du ha något att dricka först?', de: 'Gut! Es wird lecker. Möchtest du zuerst etwas trinken?', decoding: [{ sv: 'bra', de: 'gut' }, { sv: 'det', de: 'es' }, { sv: 'blir', de: 'wird' }, { sv: 'gott', de: 'lecker' }, { sv: 'vill', de: 'willst' }, { sv: 'du', de: 'du' }, { sv: 'ha', de: 'haben' }, { sv: 'något', de: 'etwas' }, { sv: 'att', de: 'zu' }, { sv: 'dricka', de: 'trinken' }, { sv: 'först', de: 'zuerst' }] },
      { id: 'mt4', speaker: 'you', sv: 'jag är törstig', de: 'ich bin durstig', chunkId: 'c-torstig', suggestions: ['Jag är törstig.', 'Jag är hungrig.'] },
      { id: 'mt5', speaker: 'partner', sv: 'Vatten, öl eller kanske kaffe efteråt?', de: 'Wasser, Bier oder vielleicht Kaffee danach?', decoding: [{ sv: 'vatten', de: 'Wasser' }, { sv: 'öl', de: 'Bier' }, { sv: 'eller', de: 'oder' }, { sv: 'kanske', de: 'vielleicht' }, { sv: 'kaffe', de: 'Kaffee' }, { sv: 'efteråt', de: 'danach' }] },
      { id: 'mt6', speaker: 'you', sv: 'jag gillar kaffe', de: 'ich mag Kaffee', chunkId: 'c-gillar', suggestions: ['Jag gillar kaffe.', 'Te eller kaffe?'] },
      { id: 'mt7', speaker: 'partner', sv: 'Då kokar jag en kanna. Mjölk och socker står framme.', de: 'Dann koche ich eine Kanne. Milch und Zucker stehen bereit.', decoding: [{ sv: 'då', de: 'dann' }, { sv: 'kokar', de: 'koche' }, { sv: 'jag', de: 'ich' }, { sv: 'en', de: 'eine' }, { sv: 'kanna', de: 'Kanne' }, { sv: 'mjölk', de: 'Milch' }, { sv: 'och', de: 'und' }, { sv: 'socker', de: 'Zucker' }, { sv: 'står', de: 'stehen' }, { sv: 'framme', de: 'bereit' }] },
      { id: 'mt8', speaker: 'you', sv: 'utan mjölk, tack', de: 'ohne Milch, bitte', chunkId: 'c-utanmjolk', suggestions: ['Utan mjölk, tack.', 'Med mjölk, tack.'] },
      { id: 'mt9', speaker: 'partner', sv: 'Svart alltså. Nu sätter vi oss, allt står på bordet.', de: 'Also schwarz. Jetzt setzen wir uns, alles steht auf dem Tisch.', decoding: [{ sv: 'svart', de: 'schwarz' }, { sv: 'alltså', de: 'also' }, { sv: 'nu', de: 'jetzt' }, { sv: 'sätter', de: 'setzen' }, { sv: 'vi', de: 'wir' }, { sv: 'oss', de: 'uns' }, { sv: 'allt', de: 'alles' }, { sv: 'står', de: 'steht' }, { sv: 'på', de: 'auf' }, { sv: 'bordet', de: 'dem Tisch' }] },
      { id: 'mt10', speaker: 'you', sv: 'smaklig måltid', de: 'guten Appetit', chunkId: 'c-smaklig', suggestions: ['Smaklig måltid.', 'Det var gott.'] },
      { id: 'mt11', speaker: 'partner', sv: 'Tack detsamma, {name}. Ta för dig ordentligt!', de: 'Danke gleichfalls, {name}. Nimm dir ordentlich!', decoding: [{ sv: 'tack', de: 'danke' }, { sv: 'detsamma', de: 'dasselbe' }, { sv: 'ta', de: 'nimm' }, { sv: 'för', de: 'für' }, { sv: 'dig', de: 'dich' }, { sv: 'ordentligt', de: 'ordentlich' }] },
      { id: 'mt12', speaker: 'you', sv: 'det smakar bra', de: 'das schmeckt gut', chunkId: 'c-smakarbra', suggestions: ['Det smakar bra.', 'Det var gott.'] },
    ],
  },

  // ── Familie & Herkunft ────────────────────────────────────────────────────
  {
    id: 'dlg-familj',
    categoryId: 'cat-family',
    title: 'Über die Familie reden',
    blurb: 'Woher, wo wohnst du, Geschwister, Kinder.',
    scene: 'home',
    partnerName: 'Kerstin',
    turns: [
      { id: 'fa1', speaker: 'partner', sv: 'Du är ny i huset, eller hur? Var kommer du ifrån?', de: 'Du bist neu im Haus, oder? Wo kommst du her?', listenFirst: true, decoding: [{ sv: 'du', de: 'du' }, { sv: 'är', de: 'bist' }, { sv: 'ny', de: 'neu' }, { sv: 'i', de: 'in' }, { sv: 'huset', de: 'dem Haus' }, { sv: 'eller', de: 'oder' }, { sv: 'hur', de: 'wie' }, { sv: 'var', de: 'wo' }, { sv: 'kommer', de: 'kommst' }, { sv: 'du', de: 'du' }, { sv: 'ifrån', de: 'her' }] },
      { id: 'fa2', speaker: 'you', sv: 'jag kommer från Tyskland', de: 'ich komme aus Deutschland', chunkId: 'c-frantyskland', suggestions: ['Jag kommer från Tyskland.', 'Varifrån kommer du?'] },
      { id: 'fa3', speaker: 'partner', sv: 'Så spännande! Flyttade hela familjen hit?', de: 'Wie spannend! Ist die ganze Familie mitgezogen?', decoding: [{ sv: 'så', de: 'so' }, { sv: 'spännande', de: 'spannend' }, { sv: 'flyttade', de: 'zog' }, { sv: 'hela', de: 'die ganze' }, { sv: 'familjen', de: 'Familie' }, { sv: 'hit', de: 'hierher' }] },
      { id: 'fa4', speaker: 'you', sv: 'min familj', de: 'meine Familie', chunkId: 'c-familj', suggestions: ['Min familj.', 'Jag har en bror.'] },
      { id: 'fa5', speaker: 'partner', sv: 'Är ni många? Jag har tre systrar själv.', de: 'Seid ihr viele? Ich habe selbst drei Schwestern.', decoding: [{ sv: 'är', de: 'seid' }, { sv: 'ni', de: 'ihr' }, { sv: 'många', de: 'viele' }, { sv: 'jag', de: 'ich' }, { sv: 'har', de: 'habe' }, { sv: 'tre', de: 'drei' }, { sv: 'systrar', de: 'Schwestern' }, { sv: 'själv', de: 'selbst' }] },
      { id: 'fa6', speaker: 'you', sv: 'jag har en bror', de: 'ich habe einen Bruder', chunkId: 'c-bror', suggestions: ['Jag har en bror.', 'Har du barn?'] },
      { id: 'fa7', speaker: 'partner', sv: 'Bor han också här, eller stannade han kvar?', de: 'Wohnt er auch hier, oder ist er geblieben?', decoding: [{ sv: 'bor', de: 'wohnt' }, { sv: 'han', de: 'er' }, { sv: 'också', de: 'auch' }, { sv: 'här', de: 'hier' }, { sv: 'eller', de: 'oder' }, { sv: 'stannade', de: 'blieb' }, { sv: 'han', de: 'er' }, { sv: 'kvar', de: 'zurück' }] },
      { id: 'fa8', speaker: 'you', sv: 'var bor du?', de: 'wo wohnst du?', chunkId: 'c-bordu', suggestions: ['Var bor du?', 'Var ligger stationen?'] },
      { id: 'fa9', speaker: 'partner', sv: 'En trappa upp, med min man och två barn.', de: 'Eine Etage höher, mit meinem Mann und zwei Kindern.', decoding: [{ sv: 'en', de: 'eine' }, { sv: 'trappa', de: 'Treppe' }, { sv: 'upp', de: 'hinauf' }, { sv: 'med', de: 'mit' }, { sv: 'min', de: 'meinem' }, { sv: 'man', de: 'Mann' }, { sv: 'och', de: 'und' }, { sv: 'två', de: 'zwei' }, { sv: 'barn', de: 'Kindern' }] },
      { id: 'fa10', speaker: 'you', sv: 'har du barn?', de: 'hast du Kinder?', chunkId: 'c-harbarn', suggestions: ['Har du barn?', 'Hur gammal är du?'] },
      { id: 'fa11', speaker: 'partner', sv: 'Två pojkar, sju och tio. De leker jämt i trapphuset.', de: 'Zwei Jungen, sieben und zehn. Sie spielen ständig im Treppenhaus.', decoding: [{ sv: 'två', de: 'zwei' }, { sv: 'pojkar', de: 'Jungen' }, { sv: 'sju', de: 'sieben' }, { sv: 'och', de: 'und' }, { sv: 'tio', de: 'zehn' }, { sv: 'de', de: 'sie' }, { sv: 'leker', de: 'spielen' }, { sv: 'jämt', de: 'ständig' }, { sv: 'i', de: 'in' }, { sv: 'trapphuset', de: 'dem Treppenhaus' }] },
      { id: 'fa12', speaker: 'you', sv: 'barnen leker ute', de: 'die Kinder spielen draußen', chunkId: 'c-barnenlekerute', suggestions: ['Barnen leker ute.', 'Har du barn?'] },
    ],
  },

  // ── Alltag & Small Talk ───────────────────────────────────────────────────
  {
    id: 'dlg-vardag',
    categoryId: 'cat-daily',
    title: 'An der Bushaltestelle',
    blurb: 'Wetter, Beruf, Alter — der Klassiker unter Fremden.',
    scene: 'station',
    partnerName: 'Fremder',
    turns: [
      { id: 'vd1', speaker: 'partner', sv: 'Bussen är sen igen. Typiskt måndag.', de: 'Der Bus ist wieder spät. Typisch Montag.', listenFirst: true, decoding: [{ sv: 'bussen', de: 'der Bus' }, { sv: 'är', de: 'ist' }, { sv: 'sen', de: 'spät' }, { sv: 'igen', de: 'wieder' }, { sv: 'typiskt', de: 'typisch' }, { sv: 'måndag', de: 'Montag' }] },
      { id: 'vd2', speaker: 'you', sv: 'det regnar', de: 'es regnet', chunkId: 'c-regnar', suggestions: ['Det regnar.', 'Det är molnigt idag.'] },
      { id: 'vd3', speaker: 'partner', sv: 'Ja, men i morgon ska solen komma tillbaka, sägs det.', de: 'Ja, aber morgen soll die Sonne zurückkommen, heißt es.', decoding: [{ sv: 'ja', de: 'ja' }, { sv: 'men', de: 'aber' }, { sv: 'i', de: 'am' }, { sv: 'morgon', de: 'Morgen' }, { sv: 'ska', de: 'soll' }, { sv: 'solen', de: 'die Sonne' }, { sv: 'komma', de: 'kommen' }, { sv: 'tillbaka', de: 'zurück' }, { sv: 'sägs', de: 'wird gesagt' }, { sv: 'det', de: 'es' }] },
      { id: 'vd4', speaker: 'you', sv: 'vilket vackert väder!', de: 'was für schönes Wetter!', chunkId: 'c-vader', suggestions: ['Vilket vackert väder!', 'Vilket väder!'] },
      { id: 'vd5', speaker: 'partner', sv: 'Ha ha, du är optimist! Jobbar du här i närheten?', de: 'Ha ha, du bist Optimist! Arbeitest du hier in der Nähe?', decoding: [{ sv: 'ha', de: 'ha' }, { sv: 'ha', de: 'ha' }, { sv: 'du', de: 'du' }, { sv: 'är', de: 'bist' }, { sv: 'optimist', de: 'Optimist' }, { sv: 'jobbar', de: 'arbeitest' }, { sv: 'du', de: 'du' }, { sv: 'här', de: 'hier' }, { sv: 'i', de: 'in' }, { sv: 'närheten', de: 'der Nähe' }] },
      { id: 'vd6', speaker: 'you', sv: 'vad jobbar du med?', de: 'was machst du beruflich?', chunkId: 'c-jobbar', suggestions: ['Vad jobbar du med?', 'Jag jobbar på ett kontor.'] },
      { id: 'vd7', speaker: 'partner', sv: 'Jag kör lastbil. Har gjort det i tjugo år nu.', de: 'Ich fahre Lastwagen. Mache ich jetzt seit zwanzig Jahren.', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'kör', de: 'fahre' }, { sv: 'lastbil', de: 'Lastwagen' }, { sv: 'har', de: 'habe' }, { sv: 'gjort', de: 'gemacht' }, { sv: 'det', de: 'es' }, { sv: 'i', de: 'seit' }, { sv: 'tjugo', de: 'zwanzig' }, { sv: 'år', de: 'Jahren' }, { sv: 'nu', de: 'jetzt' }] },
      { id: 'vd8', speaker: 'you', sv: 'hur gammal är du?', de: 'wie alt bist du?', chunkId: 'c-gammal', suggestions: ['Hur gammal är du?', 'När fyller du år?'] },
      { id: 'vd9', speaker: 'partner', sv: 'Fyrtiotvå. Äldre än jag ser ut, brukar folk säga.', de: 'Zweiundvierzig. Älter als ich aussehe, sagen die Leute meistens.', decoding: [{ sv: 'fyrtiotvå', de: 'zweiundvierzig' }, { sv: 'äldre', de: 'älter' }, { sv: 'än', de: 'als' }, { sv: 'jag', de: 'ich' }, { sv: 'ser', de: 'sehe' }, { sv: 'ut', de: 'aus' }, { sv: 'brukar', de: 'pflegen' }, { sv: 'folk', de: 'Leute' }, { sv: 'säga', de: 'sagen' }] },
      { id: 'vd10', speaker: 'you', sv: 'trevligt att träffas', de: 'schön, dich kennenzulernen', chunkId: 'c-trevligt', suggestions: ['Trevligt att träffas.', 'Det var trevligt.'] },
      { id: 'vd11', speaker: 'partner', sv: 'Detsamma! Där kommer bussen äntligen.', de: 'Gleichfalls! Da kommt endlich der Bus.', decoding: [{ sv: 'detsamma', de: 'dasselbe' }, { sv: 'där', de: 'dort' }, { sv: 'kommer', de: 'kommt' }, { sv: 'bussen', de: 'der Bus' }, { sv: 'äntligen', de: 'endlich' }] },
      { id: 'vd12', speaker: 'you', sv: 'ha det bra', de: 'mach es gut', chunkId: 'c-hadetbra', suggestions: ['Ha det bra.', 'Hej då.'] },
    ],
  },

  // ── Zahlen & Zeit ─────────────────────────────────────────────────────────
  {
    id: 'dlg-siffror',
    categoryId: 'cat-numbers',
    title: 'Uhrzeit und Datum',
    blurb: 'Wie spät, welcher Tag, welches Datum — und wie lange noch.',
    scene: 'street',
    partnerName: 'Reisender',
    turns: [
      { id: 'sf1', speaker: 'partner', sv: 'Ursäkta, jag har glömt min telefon hemma.', de: 'Entschuldigung, ich habe mein Handy zu Hause vergessen.', listenFirst: true, decoding: [{ sv: 'ursäkta', de: 'entschuldige' }, { sv: 'jag', de: 'ich' }, { sv: 'har', de: 'habe' }, { sv: 'glömt', de: 'vergessen' }, { sv: 'min', de: 'mein' }, { sv: 'telefon', de: 'Telefon' }, { sv: 'hemma', de: 'daheim' }] },
      { id: 'sf2', speaker: 'you', sv: 'vad är klockan?', de: 'wie spät ist es?', chunkId: 'c-klockan', suggestions: ['Vad är klockan?', 'Vilken dag är det?'] },
      { id: 'sf3', speaker: 'partner', sv: 'Det var precis det jag ville fråga dig!', de: 'Genau das wollte ich dich fragen!', decoding: [{ sv: 'det', de: 'das' }, { sv: 'var', de: 'war' }, { sv: 'precis', de: 'genau' }, { sv: 'det', de: 'das' }, { sv: 'jag', de: 'ich' }, { sv: 'ville', de: 'wollte' }, { sv: 'fråga', de: 'fragen' }, { sv: 'dig', de: 'dich' }] },
      { id: 'sf4', speaker: 'you', sv: 'klockan är tre', de: 'es ist drei Uhr', chunkId: 'c-klockantre', suggestions: ['Klockan är tre.', 'Klockan är halv fyra.'] },
      { id: 'sf5', speaker: 'partner', sv: 'Tack! Och tåget mot norr, går det snart?', de: 'Danke! Und der Zug nach Norden, fährt der bald?', decoding: [{ sv: 'tack', de: 'danke' }, { sv: 'och', de: 'und' }, { sv: 'tåget', de: 'der Zug' }, { sv: 'mot', de: 'gegen' }, { sv: 'norr', de: 'Norden' }, { sv: 'går', de: 'geht' }, { sv: 'det', de: 'er' }, { sv: 'snart', de: 'bald' }] },
      { id: 'sf6', speaker: 'you', sv: 'om en timme', de: 'in einer Stunde', chunkId: 'c-entimme', suggestions: ['Om en timme.', 'Om en vecka.'] },
      { id: 'sf7', speaker: 'partner', sv: 'Då hinner jag gå till affären och tillbaka.', de: 'Dann schaffe ich es zum Laden und zurück.', decoding: [{ sv: 'då', de: 'dann' }, { sv: 'hinner', de: 'schaffe' }, { sv: 'jag', de: 'ich' }, { sv: 'gå', de: 'gehen' }, { sv: 'till', de: 'zu' }, { sv: 'affären', de: 'dem Laden' }, { sv: 'och', de: 'und' }, { sv: 'tillbaka', de: 'zurück' }] },
      { id: 'sf8', speaker: 'you', sv: 'det tar tio minuter', de: 'das dauert zehn Minuten', chunkId: 'c-tiominuter', suggestions: ['Det tar tio minuter.', 'Hur lång tid tar det?'] },
      { id: 'sf9', speaker: 'partner', sv: 'Perfekt. Jag måste också fylla i en biljett med datum.', de: 'Perfekt. Ich muss auch ein Ticket mit Datum ausfüllen.', decoding: [{ sv: 'perfekt', de: 'perfekt' }, { sv: 'jag', de: 'ich' }, { sv: 'måste', de: 'muss' }, { sv: 'också', de: 'auch' }, { sv: 'fylla', de: 'füllen' }, { sv: 'i', de: 'ein' }, { sv: 'en', de: 'ein' }, { sv: 'biljett', de: 'Ticket' }, { sv: 'med', de: 'mit' }, { sv: 'datum', de: 'Datum' }] },
      { id: 'sf10', speaker: 'you', sv: 'vilket datum är det?', de: 'welches Datum ist heute?', chunkId: 'c-vaddatum', suggestions: ['Vilket datum är det?', 'Vilken dag är det?'] },
      { id: 'sf11', speaker: 'partner', sv: 'Den tolfte, tror jag. Eller var det den trettonde?', de: 'Der Zwölfte, glaube ich. Oder war es der Dreizehnte?', decoding: [{ sv: 'den', de: 'der' }, { sv: 'tolfte', de: 'Zwölfte' }, { sv: 'tror', de: 'glaube' }, { sv: 'jag', de: 'ich' }, { sv: 'eller', de: 'oder' }, { sv: 'var', de: 'war' }, { sv: 'det', de: 'es' }, { sv: 'den', de: 'der' }, { sv: 'trettonde', de: 'Dreizehnte' }] },
      { id: 'sf12', speaker: 'you', sv: 'vilken dag är det?', de: 'welcher Tag ist es?', chunkId: 'c-vilkendag', suggestions: ['Vilken dag är det?', 'Idag är det torsdag.'] },
    ],
  },

  // ── Höflich & Basics ──────────────────────────────────────────────────────
  {
    id: 'dlg-artighet',
    categoryId: 'cat-politeness',
    title: 'Im Gedränge',
    blurb: 'Entschuldigen, danken, ablehnen — die kleinen Wörter, die alles tragen.',
    scene: 'shop',
    partnerName: 'Passantin',
    turns: [
      { id: 'ar1', speaker: 'partner', sv: 'Aj! Du trampade visst på min fot.', de: 'Autsch! Du bist wohl auf meinen Fuß getreten.', listenFirst: true, decoding: [{ sv: 'aj', de: 'autsch' }, { sv: 'du', de: 'du' }, { sv: 'trampade', de: 'tratest' }, { sv: 'visst', de: 'wohl' }, { sv: 'på', de: 'auf' }, { sv: 'min', de: 'meinen' }, { sv: 'fot', de: 'Fuß' }] },
      { id: 'ar2', speaker: 'you', sv: 'förlåt', de: 'entschuldigung', chunkId: 'c-forlat', suggestions: ['Förlåt.', 'Ursäkta mig.'] },
      { id: 'ar3', speaker: 'partner', sv: 'Det gjorde inget. Här är trångt i dag.', de: 'Das hat nichts gemacht. Hier ist es heute eng.', decoding: [{ sv: 'det', de: 'das' }, { sv: 'gjorde', de: 'machte' }, { sv: 'inget', de: 'nichts' }, { sv: 'här', de: 'hier' }, { sv: 'är', de: 'ist' }, { sv: 'trångt', de: 'eng' }, { sv: 'i', de: 'am' }, { sv: 'dag', de: 'Tag' }] },
      { id: 'ar4', speaker: 'you', sv: 'ingen fara', de: 'kein Problem', chunkId: 'c-ingenfara', suggestions: ['Ingen fara.', 'Varsågod.'] },
      { id: 'ar5', speaker: 'partner', sv: 'Du tappade förresten din handske där borta.', de: 'Du hast übrigens deinen Handschuh dort verloren.', decoding: [{ sv: 'du', de: 'du' }, { sv: 'tappade', de: 'verlorst' }, { sv: 'förresten', de: 'übrigens' }, { sv: 'din', de: 'deinen' }, { sv: 'handske', de: 'Handschuh' }, { sv: 'där', de: 'dort' }, { sv: 'borta', de: 'drüben' }] },
      { id: 'ar6', speaker: 'you', sv: 'ursäkta mig', de: 'entschuldigen Sie', chunkId: 'c-ursaktamig', suggestions: ['Ursäkta mig.', 'Förlåt.'] },
      { id: 'ar7', speaker: 'partner', sv: 'Här. Vill du ha en påse till dina saker?', de: 'Hier. Willst du eine Tüte für deine Sachen?', decoding: [{ sv: 'här', de: 'hier' }, { sv: 'vill', de: 'willst' }, { sv: 'du', de: 'du' }, { sv: 'ha', de: 'haben' }, { sv: 'en', de: 'eine' }, { sv: 'påse', de: 'Tüte' }, { sv: 'till', de: 'für' }, { sv: 'dina', de: 'deine' }, { sv: 'saker', de: 'Sachen' }] },
      { id: 'ar8', speaker: 'you', sv: 'ja, tack', de: 'ja, bitte', chunkId: 'c-jatack', suggestions: ['Ja, tack.', 'Nej, tack.'] },
      { id: 'ar9', speaker: 'partner', sv: 'Varsågod. Behöver du hjälp att bära också?', de: 'Bitte sehr. Brauchst du auch Hilfe beim Tragen?', decoding: [{ sv: 'varsågod', de: 'bitte' }, { sv: 'behöver', de: 'brauchst' }, { sv: 'du', de: 'du' }, { sv: 'hjälp', de: 'Hilfe' }, { sv: 'att', de: 'zu' }, { sv: 'bära', de: 'tragen' }, { sv: 'också', de: 'auch' }] },
      { id: 'ar10', speaker: 'you', sv: 'nej, tack', de: 'nein, danke', chunkId: 'c-nejtack', suggestions: ['Nej, tack.', 'Ja, tack.'] },
      { id: 'ar11', speaker: 'partner', sv: 'Som du vill. Ha en fin dag!', de: 'Wie du willst. Hab einen schönen Tag!', decoding: [{ sv: 'som', de: 'wie' }, { sv: 'du', de: 'du' }, { sv: 'vill', de: 'willst' }, { sv: 'ha', de: 'hab' }, { sv: 'en', de: 'einen' }, { sv: 'fin', de: 'schönen' }, { sv: 'dag', de: 'Tag' }] },
      { id: 'ar12', speaker: 'you', sv: 'varsågod', de: 'bitte sehr', chunkId: 'c-varsagod', suggestions: ['Varsågod.', 'Tack så mycket.'] },
    ],
  },

  // ── Bezahlen ──────────────────────────────────────────────────────────────
  {
    id: 'dlg-betala',
    categoryId: 'cat-pay',
    title: 'An der Kasse',
    blurb: 'Summe, Karte oder bar, Kassenbon — und einmal zu teuer.',
    scene: 'shop',
    partnerName: 'Kassierer',
    turns: [
      { id: 'bt1', speaker: 'partner', sv: 'Hej! Var det allt för i dag?', de: 'Hallo! War das alles für heute?', listenFirst: true, decoding: [{ sv: 'hej', de: 'hallo' }, { sv: 'var', de: 'war' }, { sv: 'det', de: 'das' }, { sv: 'allt', de: 'alles' }, { sv: 'för', de: 'für' }, { sv: 'i', de: 'am' }, { sv: 'dag', de: 'Tag' }] },
      { id: 'bt2', speaker: 'you', sv: 'hur mycket blir det?', de: 'wie viel macht das?', chunkId: 'c-blirdet', suggestions: ['Hur mycket blir det?', 'Vad kostar det?'] },
      { id: 'bt3', speaker: 'partner', sv: 'Trehundra kronor jämnt.', de: 'Genau dreihundert Kronen.', decoding: [{ sv: 'trehundra', de: 'dreihundert' }, { sv: 'kronor', de: 'Kronen' }, { sv: 'jämnt', de: 'glatt' }] },
      { id: 'bt4', speaker: 'you', sv: 'det är för dyrt', de: 'das ist zu teuer', chunkId: 'c-fordyrt', suggestions: ['Det är för dyrt.', 'Kan vi förhandla om priset?'] },
      { id: 'bt5', speaker: 'partner', sv: 'Osten är dyr just nu. Vill du lägga tillbaka något?', de: 'Der Käse ist gerade teuer. Willst du etwas zurücklegen?', decoding: [{ sv: 'osten', de: 'der Käse' }, { sv: 'är', de: 'ist' }, { sv: 'dyr', de: 'teuer' }, { sv: 'just', de: 'gerade' }, { sv: 'nu', de: 'jetzt' }, { sv: 'vill', de: 'willst' }, { sv: 'du', de: 'du' }, { sv: 'lägga', de: 'legen' }, { sv: 'tillbaka', de: 'zurück' }, { sv: 'något', de: 'etwas' }] },
      { id: 'bt6', speaker: 'you', sv: 'kan jag betala med kort?', de: 'kann ich mit Karte zahlen?', chunkId: 'c-medkort', suggestions: ['Kan jag betala med kort?', 'Jag betalar kontant.'] },
      { id: 'bt7', speaker: 'partner', sv: 'Självklart. Terminalen är trasig i dag, tyvärr.', de: 'Selbstverständlich. Das Terminal ist heute leider kaputt.', decoding: [{ sv: 'självklart', de: 'selbstverständlich' }, { sv: 'terminalen', de: 'das Terminal' }, { sv: 'är', de: 'ist' }, { sv: 'trasig', de: 'kaputt' }, { sv: 'i', de: 'am' }, { sv: 'dag', de: 'Tag' }, { sv: 'tyvärr', de: 'leider' }] },
      { id: 'bt8', speaker: 'you', sv: 'jag betalar kontant', de: 'ich zahle bar', chunkId: 'c-kontant', suggestions: ['Jag betalar kontant.', 'Kan jag betala med kort?'] },
      { id: 'bt9', speaker: 'partner', sv: 'Tack. Här är växeln, femtio kronor tillbaka.', de: 'Danke. Hier ist das Wechselgeld, fünfzig Kronen zurück.', decoding: [{ sv: 'tack', de: 'danke' }, { sv: 'här', de: 'hier' }, { sv: 'är', de: 'ist' }, { sv: 'växeln', de: 'das Wechselgeld' }, { sv: 'femtio', de: 'fünfzig' }, { sv: 'kronor', de: 'Kronen' }, { sv: 'tillbaka', de: 'zurück' }] },
      { id: 'bt10', speaker: 'you', sv: 'kan jag få kvittot?', de: 'kann ich den Kassenbon haben?', chunkId: 'c-kvitto', suggestions: ['Kan jag få kvittot?', 'Jag har kvittot.'] },
      { id: 'bt11', speaker: 'partner', sv: 'Här. Spara det om du vill byta något.', de: 'Hier. Heb ihn auf, falls du etwas umtauschen willst.', decoding: [{ sv: 'här', de: 'hier' }, { sv: 'spara', de: 'bewahre' }, { sv: 'det', de: 'ihn' }, { sv: 'om', de: 'wenn' }, { sv: 'du', de: 'du' }, { sv: 'vill', de: 'willst' }, { sv: 'byta', de: 'tauschen' }, { sv: 'något', de: 'etwas' }] },
      { id: 'bt12', speaker: 'you', sv: 'tack så mycket', de: 'vielen Dank', chunkId: 'c-tack', suggestions: ['Tack så mycket.', 'Tack för inbjudan.'] },
    ],
  },

  // ── Notfall & Hilfe ───────────────────────────────────────────────────────
  {
    id: 'dlg-nodfall',
    categoryId: 'cat-help-emergency',
    title: 'Wenn es ernst wird',
    blurb: 'Hilfe rufen, sagen was los ist — kurze, klare Sätze.',
    scene: 'clinic',
    partnerName: 'Passant',
    turns: [
      { id: 'nd1', speaker: 'partner', sv: 'Vad har hänt? Du ser blek ut.', de: 'Was ist passiert? Du siehst blass aus.', listenFirst: true, decoding: [{ sv: 'vad', de: 'was' }, { sv: 'har', de: 'ist' }, { sv: 'hänt', de: 'geschehen' }, { sv: 'du', de: 'du' }, { sv: 'ser', de: 'siehst' }, { sv: 'blek', de: 'blass' }, { sv: 'ut', de: 'aus' }] },
      { id: 'nd2', speaker: 'you', sv: 'hjälp!', de: 'Hilfe!', chunkId: 'c-hjalp', suggestions: ['Hjälp!', 'Kan du hjälpa mig?'] },
      { id: 'nd3', speaker: 'partner', sv: 'Lugn, jag är här. Berätta vad som är fel.', de: 'Ruhig, ich bin da. Erzähl, was los ist.', decoding: [{ sv: 'lugn', de: 'ruhig' }, { sv: 'jag', de: 'ich' }, { sv: 'är', de: 'bin' }, { sv: 'här', de: 'hier' }, { sv: 'berätta', de: 'erzähle' }, { sv: 'vad', de: 'was' }, { sv: 'som', de: 'das' }, { sv: 'är', de: 'ist' }, { sv: 'fel', de: 'falsch' }] },
      { id: 'nd4', speaker: 'you', sv: 'det är en nödsituation', de: 'das ist ein Notfall', chunkId: 'c-nodsituation', suggestions: ['Det är en nödsituation.', 'Jag är sjuk.'] },
      { id: 'nd5', speaker: 'partner', sv: 'Okej. Är någon skadad? Ska jag ringa?', de: 'Okay. Ist jemand verletzt? Soll ich anrufen?', decoding: [{ sv: 'okej', de: 'okay' }, { sv: 'är', de: 'ist' }, { sv: 'någon', de: 'jemand' }, { sv: 'skadad', de: 'verletzt' }, { sv: 'ska', de: 'soll' }, { sv: 'jag', de: 'ich' }, { sv: 'ringa', de: 'anrufen' }] },
      { id: 'nd6', speaker: 'you', sv: 'ring en ambulans!', de: 'ruf einen Krankenwagen!', chunkId: 'c-ambulans', suggestions: ['Ring en ambulans!', 'Ring polisen!'] },
      { id: 'nd7', speaker: 'partner', sv: 'Jag ringer nu. De kommer om några minuter.', de: 'Ich rufe jetzt an. Sie kommen in ein paar Minuten.', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'ringer', de: 'rufe an' }, { sv: 'nu', de: 'jetzt' }, { sv: 'de', de: 'sie' }, { sv: 'kommer', de: 'kommen' }, { sv: 'om', de: 'in' }, { sv: 'några', de: 'einigen' }, { sv: 'minuter', de: 'Minuten' }] },
      { id: 'nd8', speaker: 'you', sv: 'ring polisen!', de: 'ruf die Polizei!', chunkId: 'c-ringpolis', suggestions: ['Ring polisen!', 'Ring en ambulans!'] },
      { id: 'nd9', speaker: 'partner', sv: 'Också det. Vet du var vi är just nu?', de: 'Auch das. Weißt du, wo wir gerade sind?', decoding: [{ sv: 'också', de: 'auch' }, { sv: 'det', de: 'das' }, { sv: 'vet', de: 'weißt' }, { sv: 'du', de: 'du' }, { sv: 'var', de: 'wo' }, { sv: 'vi', de: 'wir' }, { sv: 'är', de: 'sind' }, { sv: 'just', de: 'gerade' }, { sv: 'nu', de: 'jetzt' }] },
      { id: 'nd10', speaker: 'you', sv: 'jag har gått vilse', de: 'ich habe mich verlaufen', chunkId: 'c-vilse', suggestions: ['Jag har gått vilse.', 'Hur kommer jag till centrum?'] },
      { id: 'nd11', speaker: 'partner', sv: 'Vi står vid stora torget. Har du allt med dig?', de: 'Wir stehen am großen Platz. Hast du alles dabei?', decoding: [{ sv: 'vi', de: 'wir' }, { sv: 'står', de: 'stehen' }, { sv: 'vid', de: 'bei' }, { sv: 'stora', de: 'großen' }, { sv: 'torget', de: 'dem Platz' }, { sv: 'har', de: 'hast' }, { sv: 'du', de: 'du' }, { sv: 'allt', de: 'alles' }, { sv: 'med', de: 'mit' }, { sv: 'dig', de: 'dir' }] },
      { id: 'nd12', speaker: 'you', sv: 'jag hittar inte min väska', de: 'ich finde meine Tasche nicht', chunkId: 'c-tappatvaska', suggestions: ['Jag hittar inte min väska.', 'Jag har gått vilse.'] },
    ],
  },

  // ── Abmachen & Treffen ────────────────────────────────────────────────────
  {
    id: 'dlg-trafftid',
    categoryId: 'cat-hangout',
    title: 'Kurz abmachen',
    blurb: 'Am Telefon: verabreden, unterwegs sein, absagen.',
    scene: 'street',
    partnerName: 'Kompis',
    turns: [
      { id: 'tt1', speaker: 'partner', sv: 'Tjena! Har du något för dig i kväll?', de: 'Servus! Hast du heute Abend was vor?', listenFirst: true, decoding: [{ sv: 'tjena', de: 'servus' }, { sv: 'har', de: 'hast' }, { sv: 'du', de: 'du' }, { sv: 'något', de: 'etwas' }, { sv: 'för', de: 'für' }, { sv: 'dig', de: 'dich' }, { sv: 'i', de: 'am' }, { sv: 'kväll', de: 'Abend' }] },
      { id: 'tt2', speaker: 'you', sv: 'ska vi ses?', de: 'sollen wir uns treffen?', chunkId: 'c-sesses', suggestions: ['Ska vi ses?', 'Vill du komma?'] },
      { id: 'tt3', speaker: 'partner', sv: 'Gärna! Vi kan käka något och kolla på matchen.', de: 'Gern! Wir können was essen und das Spiel schauen.', decoding: [{ sv: 'gärna', de: 'gern' }, { sv: 'vi', de: 'wir' }, { sv: 'kan', de: 'können' }, { sv: 'käka', de: 'essen' }, { sv: 'något', de: 'etwas' }, { sv: 'och', de: 'und' }, { sv: 'kolla', de: 'schauen' }, { sv: 'på', de: 'auf' }, { sv: 'matchen', de: 'das Spiel' }] },
      { id: 'tt4', speaker: 'you', sv: 'det låter kul', de: 'das klingt gut', chunkId: 'c-lateskul', suggestions: ['Det låter kul.', 'Jag kommer gärna.'] },
      { id: 'tt5', speaker: 'partner', sv: 'Toppen. Jag är hemma från sju. Hör av dig innan.', de: 'Super. Ich bin ab sieben zu Hause. Melde dich vorher.', decoding: [{ sv: 'toppen', de: 'super' }, { sv: 'jag', de: 'ich' }, { sv: 'är', de: 'bin' }, { sv: 'hemma', de: 'daheim' }, { sv: 'från', de: 'ab' }, { sv: 'sju', de: 'sieben' }, { sv: 'hör', de: 'höre' }, { sv: 'av', de: 'von' }, { sv: 'dig', de: 'dir' }, { sv: 'innan', de: 'vorher' }] },
      { id: 'tt6', speaker: 'you', sv: 'jag ringer dig sen', de: 'ich rufe dich später an', chunkId: 'c-ringerdig', suggestions: ['Jag ringer dig sen.', 'Jag ringer dig senare.'] },
      { id: 'tt7', speaker: 'partner', sv: 'Var är du nu förresten? Det låter blåsigt.', de: 'Wo bist du übrigens gerade? Es klingt windig.', decoding: [{ sv: 'var', de: 'wo' }, { sv: 'är', de: 'bist' }, { sv: 'du', de: 'du' }, { sv: 'nu', de: 'jetzt' }, { sv: 'förresten', de: 'übrigens' }, { sv: 'det', de: 'es' }, { sv: 'låter', de: 'klingt' }, { sv: 'blåsigt', de: 'windig' }] },
      { id: 'tt8', speaker: 'you', sv: 'jag är på väg', de: 'ich bin unterwegs', chunkId: 'c-pavag', suggestions: ['Jag är på väg.', 'Jag kommer nu.'] },
      { id: 'tt9', speaker: 'partner', sv: 'Och Anders då, kommer han också i kväll?', de: 'Und Anders, kommt der heute Abend auch?', decoding: [{ sv: 'och', de: 'und' }, { sv: 'Anders', de: 'Anders' }, { sv: 'då', de: 'denn' }, { sv: 'kommer', de: 'kommt' }, { sv: 'han', de: 'er' }, { sv: 'också', de: 'auch' }, { sv: 'i', de: 'am' }, { sv: 'kväll', de: 'Abend' }] },
      { id: 'tt10', speaker: 'you', sv: 'jag kan inte komma', de: 'ich kann nicht kommen', chunkId: 'c-kanintekomma', suggestions: ['Jag kan inte komma.', 'Tyvärr kan jag inte.'] },
      { id: 'tt11', speaker: 'partner', sv: 'Skämtar du? Du sa ju precis att du var på väg!', de: 'Machst du Witze? Du hast doch gerade gesagt, du bist unterwegs!', decoding: [{ sv: 'skämtar', de: 'scherzt' }, { sv: 'du', de: 'du' }, { sv: 'du', de: 'du' }, { sv: 'sa', de: 'sagtest' }, { sv: 'ju', de: 'ja' }, { sv: 'precis', de: 'gerade' }, { sv: 'att', de: 'dass' }, { sv: 'du', de: 'du' }, { sv: 'var', de: 'warst' }, { sv: 'på', de: 'auf' }, { sv: 'väg', de: 'Weg' }] },
      { id: 'tt12', speaker: 'you', sv: 'vi hörs', de: 'wir hören uns', chunkId: 'c-vihors', suggestions: ['Vi hörs.', 'Vi hörs senare.'] },
    ],
  },

  // ── Trainieren ────────────────────────────────────────────────────────────
  {
    id: 'dlg-traning',
    categoryId: 'cat-training',
    title: 'Zusammen laufen',
    blurb: 'Verabreden, durchhalten, noch eine Runde.',
    scene: 'track',
    partnerName: 'Trainingspartner',
    turns: [
      { id: 'tn1', speaker: 'partner', sv: 'Vädret är perfekt i dag. Inte för varmt.', de: 'Das Wetter ist heute perfekt. Nicht zu warm.', listenFirst: true, decoding: [{ sv: 'vädret', de: 'das Wetter' }, { sv: 'är', de: 'ist' }, { sv: 'perfekt', de: 'perfekt' }, { sv: 'i', de: 'am' }, { sv: 'dag', de: 'Tag' }, { sv: 'inte', de: 'nicht' }, { sv: 'för', de: 'zu' }, { sv: 'varmt', de: 'warm' }] },
      { id: 'tn2', speaker: 'you', sv: 'ska vi springa?', de: 'sollen wir laufen?', chunkId: 'c-skavispringa', suggestions: ['Ska vi springa?', 'Ska vi vandra i skogen?'] },
      { id: 'tn3', speaker: 'partner', sv: 'Absolut. Fem kilometer runt sjön, som vanligt?', de: 'Auf jeden Fall. Fünf Kilometer um den See, wie immer?', decoding: [{ sv: 'absolut', de: 'absolut' }, { sv: 'fem', de: 'fünf' }, { sv: 'kilometer', de: 'Kilometer' }, { sv: 'runt', de: 'um' }, { sv: 'sjön', de: 'den See' }, { sv: 'som', de: 'wie' }, { sv: 'vanligt', de: 'gewöhnlich' }] },
      { id: 'tn4', speaker: 'you', sv: 'jag tränar tre gånger i veckan', de: 'ich trainiere dreimal die Woche', chunkId: 'c-jagtranar', suggestions: ['Jag tränar tre gånger i veckan.', 'Jag övar varje dag.'] },
      { id: 'tn5', speaker: 'partner', sv: 'Det märks. Du håller tempot hela vägen nu.', de: 'Das merkt man. Du hältst jetzt das Tempo die ganze Strecke.', decoding: [{ sv: 'det', de: 'das' }, { sv: 'märks', de: 'merkt sich' }, { sv: 'du', de: 'du' }, { sv: 'håller', de: 'hältst' }, { sv: 'tempot', de: 'das Tempo' }, { sv: 'hela', de: 'den ganzen' }, { sv: 'vägen', de: 'Weg' }, { sv: 'nu', de: 'jetzt' }] },
      { id: 'tn6', speaker: 'you', sv: 'du är i bra form', de: 'du bist gut in Form', chunkId: 'c-braformad', suggestions: ['Du är i bra form.', 'Jag är trött.'] },
      { id: 'tn7', speaker: 'partner', sv: 'Tack! Sista backen är kvar. Klarar du en till?', de: 'Danke! Der letzte Hügel fehlt noch. Schaffst du noch einen?', decoding: [{ sv: 'tack', de: 'danke' }, { sv: 'sista', de: 'letzte' }, { sv: 'backen', de: 'der Hang' }, { sv: 'är', de: 'ist' }, { sv: 'kvar', de: 'übrig' }, { sv: 'klarar', de: 'schaffst' }, { sv: 'du', de: 'du' }, { sv: 'en', de: 'einen' }, { sv: 'till', de: 'noch' }] },
      { id: 'tn8', speaker: 'you', sv: 'en gång till!', de: 'noch einmal!', chunkId: 'c-engangtill', suggestions: ['En gång till!', 'En till, tack.'] },
      { id: 'tn9', speaker: 'partner', sv: 'Det var sista! Nu tar vi det lugnt hem.', de: 'Das war der letzte! Jetzt gehen wir ruhig heim.', decoding: [{ sv: 'det', de: 'das' }, { sv: 'var', de: 'war' }, { sv: 'sista', de: 'letzte' }, { sv: 'nu', de: 'jetzt' }, { sv: 'tar', de: 'nehmen' }, { sv: 'vi', de: 'wir' }, { sv: 'det', de: 'es' }, { sv: 'lugnt', de: 'ruhig' }, { sv: 'hem', de: 'heim' }] },
      { id: 'tn10', speaker: 'you', sv: 'jag är trött', de: 'ich bin müde', chunkId: 'c-jagartrott', suggestions: ['Jag är trött.', 'Jag behöver vila.'] },
      { id: 'tn11', speaker: 'partner', sv: 'Förtjänat. Samma tid på torsdag, {name}?', de: 'Verdient. Gleiche Zeit am Donnerstag, {name}?', decoding: [{ sv: 'förtjänat', de: 'verdient' }, { sv: 'samma', de: 'gleiche' }, { sv: 'tid', de: 'Zeit' }, { sv: 'på', de: 'am' }, { sv: 'torsdag', de: 'Donnerstag' }] },
      { id: 'tn12', speaker: 'you', sv: 'jag behöver vila', de: 'ich brauche Ruhe', chunkId: 'c-behovervila', suggestions: ['Jag behöver vila.', 'Jag är trött.'] },
    ],
  },

  // ── Raus in die Natur ─────────────────────────────────────────────────────
  {
    id: 'dlg-natur',
    categoryId: 'cat-nature',
    title: 'Wanderung im Wald',
    blurb: 'Losziehen, die Aussicht genießen, draußen übernachten.',
    scene: 'lake',
    partnerName: 'Wanderfreundin',
    turns: [
      { id: 'nt1', speaker: 'partner', sv: 'Ryggsäcken är packad. Vart ska vi egentligen?', de: 'Der Rucksack ist gepackt. Wohin gehen wir eigentlich?', listenFirst: true, decoding: [{ sv: 'ryggsäcken', de: 'der Rucksack' }, { sv: 'är', de: 'ist' }, { sv: 'packad', de: 'gepackt' }, { sv: 'vart', de: 'wohin' }, { sv: 'ska', de: 'sollen' }, { sv: 'vi', de: 'wir' }, { sv: 'egentligen', de: 'eigentlich' }] },
      { id: 'nt2', speaker: 'you', sv: 'ska vi vandra i skogen?', de: 'sollen wir im Wald wandern?', chunkId: 'c-vandra', suggestions: ['Ska vi vandra i skogen?', 'Ska vi springa?'] },
      { id: 'nt3', speaker: 'partner', sv: 'Ja! Stigen upp till berget tar en timme.', de: 'Ja! Der Pfad hoch zum Berg dauert eine Stunde.', decoding: [{ sv: 'ja', de: 'ja' }, { sv: 'stigen', de: 'der Pfad' }, { sv: 'upp', de: 'hinauf' }, { sv: 'till', de: 'zu' }, { sv: 'berget', de: 'dem Berg' }, { sv: 'tar', de: 'nimmt' }, { sv: 'en', de: 'eine' }, { sv: 'timme', de: 'Stunde' }] },
      { id: 'nt4', speaker: 'you', sv: 'solen skiner', de: 'die Sonne scheint', chunkId: 'c-solenskiner', suggestions: ['Solen skiner.', 'Det regnar.'] },
      { id: 'nt5', speaker: 'partner', sv: 'Perfekt väder. Se dig om när vi kommer upp!', de: 'Perfektes Wetter. Schau dich um, wenn wir oben sind!', decoding: [{ sv: 'perfekt', de: 'perfektes' }, { sv: 'väder', de: 'Wetter' }, { sv: 'se', de: 'sieh' }, { sv: 'dig', de: 'dich' }, { sv: 'om', de: 'um' }, { sv: 'när', de: 'wenn' }, { sv: 'vi', de: 'wir' }, { sv: 'kommer', de: 'kommen' }, { sv: 'upp', de: 'hinauf' }] },
      { id: 'nt6', speaker: 'you', sv: 'vilken vacker utsikt!', de: 'was für eine schöne Aussicht!', chunkId: 'c-vackerutsikt', suggestions: ['Vilken vacker utsikt!', 'Vilket vackert väder!'] },
      { id: 'nt7', speaker: 'partner', sv: 'Man ser hela sjön härifrån. Vill du stanna över natten?', de: 'Man sieht von hier den ganzen See. Willst du über Nacht bleiben?', decoding: [{ sv: 'man', de: 'man' }, { sv: 'ser', de: 'sieht' }, { sv: 'hela', de: 'den ganzen' }, { sv: 'sjön', de: 'See' }, { sv: 'härifrån', de: 'von hier' }, { sv: 'vill', de: 'willst' }, { sv: 'du', de: 'du' }, { sv: 'stanna', de: 'bleiben' }, { sv: 'över', de: 'über' }, { sv: 'natten', de: 'die Nacht' }] },
      { id: 'nt8', speaker: 'you', sv: 'vi sover ute i natt', de: 'wir schlafen heute draußen', chunkId: 'c-sovaute', suggestions: ['Vi sover ute i natt.', 'Var ska vi bo?'] },
      { id: 'nt9', speaker: 'partner', sv: 'Då tänder vi en eld. Efter solnedgången sjunker temperaturen.', de: 'Dann machen wir ein Feuer. Nach Sonnenuntergang fällt die Temperatur.', decoding: [{ sv: 'då', de: 'dann' }, { sv: 'tänder', de: 'zünden' }, { sv: 'vi', de: 'wir' }, { sv: 'en', de: 'ein' }, { sv: 'eld', de: 'Feuer' }, { sv: 'efter', de: 'nach' }, { sv: 'solnedgången', de: 'dem Sonnenuntergang' }, { sv: 'sjunker', de: 'sinkt' }, { sv: 'temperaturen', de: 'die Temperatur' }] },
      { id: 'nt10', speaker: 'you', sv: 'det är kallt ute', de: 'es ist kalt draußen', chunkId: 'c-kallt', suggestions: ['Det är kallt ute.', 'Jag fryser.'] },
      { id: 'nt11', speaker: 'partner', sv: 'Ta på dig fler lager, så går det bra hela natten.', de: 'Zieh mehr Schichten an, dann geht es die ganze Nacht gut.', decoding: [{ sv: 'ta', de: 'nimm' }, { sv: 'på', de: 'auf' }, { sv: 'dig', de: 'dich' }, { sv: 'fler', de: 'mehr' }, { sv: 'lager', de: 'Schichten' }, { sv: 'så', de: 'so' }, { sv: 'går', de: 'geht' }, { sv: 'det', de: 'es' }, { sv: 'bra', de: 'gut' }, { sv: 'hela', de: 'die ganze' }, { sv: 'natten', de: 'Nacht' }] },
      { id: 'nt12', speaker: 'you', sv: 'jag fryser', de: 'mir ist kalt', chunkId: 'c-jagfryser', suggestions: ['Jag fryser.', 'Det är kallt ute.'] },
    ],
  },

  // ── Wetter & Jahreszeiten ─────────────────────────────────────────────────
  {
    id: 'dlg-vader',
    categoryId: 'cat-weather',
    title: 'Wetter vor der Tür',
    blurb: 'Wind, Wolken, Regenschirm — und morgen wird es besser.',
    scene: 'street',
    partnerName: 'Kollege',
    turns: [
      { id: 'vr1', speaker: 'partner', sv: 'Har du sett ut genom fönstret i dag?', de: 'Hast du heute aus dem Fenster gesehen?', listenFirst: true, decoding: [{ sv: 'har', de: 'hast' }, { sv: 'du', de: 'du' }, { sv: 'sett', de: 'gesehen' }, { sv: 'ut', de: 'hinaus' }, { sv: 'genom', de: 'durch' }, { sv: 'fönstret', de: 'das Fenster' }, { sv: 'i', de: 'am' }, { sv: 'dag', de: 'Tag' }] },
      { id: 'vr2', speaker: 'you', sv: 'vilket väder!', de: 'was für ein Wetter!', chunkId: 'c-vilketvader', suggestions: ['Vilket väder!', 'Vilket vackert väder!'] },
      { id: 'vr3', speaker: 'partner', sv: 'Precis. Och det ska bli värre mot eftermiddagen.', de: 'Genau. Und gegen Nachmittag soll es schlimmer werden.', decoding: [{ sv: 'precis', de: 'genau' }, { sv: 'och', de: 'und' }, { sv: 'det', de: 'es' }, { sv: 'ska', de: 'soll' }, { sv: 'bli', de: 'werden' }, { sv: 'värre', de: 'schlimmer' }, { sv: 'mot', de: 'gegen' }, { sv: 'eftermiddagen', de: 'den Nachmittag' }] },
      { id: 'vr4', speaker: 'you', sv: 'det blåser mycket', de: 'es ist sehr windig', chunkId: 'c-blasermycket', suggestions: ['Det blåser mycket.', 'Det är molnigt idag.'] },
      { id: 'vr5', speaker: 'partner', sv: 'Träden böjer sig på gården. Ingen sol på hela dagen.', de: 'Die Bäume biegen sich im Hof. Den ganzen Tag keine Sonne.', decoding: [{ sv: 'träden', de: 'die Bäume' }, { sv: 'böjer', de: 'biegen' }, { sv: 'sig', de: 'sich' }, { sv: 'på', de: 'auf' }, { sv: 'gården', de: 'dem Hof' }, { sv: 'ingen', de: 'keine' }, { sv: 'sol', de: 'Sonne' }, { sv: 'på', de: 'an' }, { sv: 'hela', de: 'dem ganzen' }, { sv: 'dagen', de: 'Tag' }] },
      { id: 'vr6', speaker: 'you', sv: 'det är molnigt idag', de: 'heute ist es bewölkt', chunkId: 'c-molnigt', suggestions: ['Det är molnigt idag.', 'Det regnar.'] },
      { id: 'vr7', speaker: 'partner', sv: 'Jag ska ut och handla ändå. Behöver jag något?', de: 'Ich muss trotzdem einkaufen. Brauche ich etwas?', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'ska', de: 'soll' }, { sv: 'ut', de: 'hinaus' }, { sv: 'och', de: 'und' }, { sv: 'handla', de: 'einkaufen' }, { sv: 'ändå', de: 'trotzdem' }, { sv: 'behöver', de: 'brauche' }, { sv: 'jag', de: 'ich' }, { sv: 'något', de: 'etwas' }] },
      { id: 'vr8', speaker: 'you', sv: 'ta med paraply', de: 'nimm einen Schirm mit', chunkId: 'c-tamedparaply', suggestions: ['Ta med paraply.', 'Ta på dig mössa.'] },
      { id: 'vr9', speaker: 'partner', sv: 'Klokt. Här inne är det åtminstone skönt.', de: 'Klug. Hier drinnen ist es wenigstens angenehm.', decoding: [{ sv: 'klokt', de: 'klug' }, { sv: 'här', de: 'hier' }, { sv: 'inne', de: 'drinnen' }, { sv: 'är', de: 'ist' }, { sv: 'det', de: 'es' }, { sv: 'åtminstone', de: 'wenigstens' }, { sv: 'skönt', de: 'schön' }] },
      { id: 'vr10', speaker: 'you', sv: 'det är varmt inne', de: 'drinnen ist es warm', chunkId: 'c-varmtinne', suggestions: ['Det är varmt inne.', 'Det är kallt ute.'] },
      { id: 'vr11', speaker: 'partner', sv: 'Prognosen lovar bättre väder till helgen.', de: 'Die Vorhersage verspricht besseres Wetter zum Wochenende.', decoding: [{ sv: 'prognosen', de: 'die Vorhersage' }, { sv: 'lovar', de: 'verspricht' }, { sv: 'bättre', de: 'besseres' }, { sv: 'väder', de: 'Wetter' }, { sv: 'till', de: 'zu' }, { sv: 'helgen', de: 'dem Wochenende' }] },
      { id: 'vr12', speaker: 'you', sv: 'imorgon blir det soligt', de: 'morgen wird es sonnig', chunkId: 'c-blirsoligt', suggestions: ['Imorgon blir det soligt.', 'På sommaren är det ljust.'] },
    ],
  },

  // ── Wohnen & Zuhause ──────────────────────────────────────────────────────
  {
    id: 'dlg-boende',
    categoryId: 'cat-home',
    title: 'Die Wohnung zeigen',
    blurb: 'Hereinbitten, Zimmer zeigen, über die Miete reden.',
    scene: 'home',
    partnerName: 'Besuch',
    turns: [
      { id: 'bo1', speaker: 'partner', sv: 'Så här ser det alltså ut! Får jag komma in?', de: 'So sieht es also aus! Darf ich reinkommen?', listenFirst: true, decoding: [{ sv: 'så', de: 'so' }, { sv: 'här', de: 'hier' }, { sv: 'ser', de: 'sieht' }, { sv: 'det', de: 'es' }, { sv: 'alltså', de: 'also' }, { sv: 'ut', de: 'aus' }, { sv: 'får', de: 'darf' }, { sv: 'jag', de: 'ich' }, { sv: 'komma', de: 'kommen' }, { sv: 'in', de: 'herein' }] },
      { id: 'bo2', speaker: 'you', sv: 'välkommen in', de: 'komm herein', chunkId: 'c-valkommenin', suggestions: ['Välkommen in.', 'Varsågod.'] },
      { id: 'bo3', speaker: 'partner', sv: 'Tack! Ljust och fint. Bor du ensam här?', de: 'Danke! Hell und schön. Wohnst du hier allein?', decoding: [{ sv: 'tack', de: 'danke' }, { sv: 'ljust', de: 'hell' }, { sv: 'och', de: 'und' }, { sv: 'fint', de: 'schön' }, { sv: 'bor', de: 'wohnst' }, { sv: 'du', de: 'du' }, { sv: 'ensam', de: 'allein' }, { sv: 'här', de: 'hier' }] },
      { id: 'bo4', speaker: 'you', sv: 'jag bor med en kompis', de: 'ich wohne mit einem Freund', chunkId: 'c-bormedkompis', suggestions: ['Jag bor med en kompis.', 'Jag bor i en lägenhet.'] },
      { id: 'bo5', speaker: 'partner', sv: 'Smart. Ensam blir det dyrt i den här stadsdelen.', de: 'Klug. Allein wird es in diesem Viertel teuer.', decoding: [{ sv: 'smart', de: 'klug' }, { sv: 'ensam', de: 'allein' }, { sv: 'blir', de: 'wird' }, { sv: 'det', de: 'es' }, { sv: 'dyrt', de: 'teuer' }, { sv: 'i', de: 'in' }, { sv: 'den', de: 'dem' }, { sv: 'här', de: 'hier' }, { sv: 'stadsdelen', de: 'Stadtteil' }] },
      { id: 'bo6', speaker: 'you', sv: 'hyran är hög', de: 'die Miete ist hoch', chunkId: 'c-hyranhog', suggestions: ['Hyran är hög.', 'Det är för dyrt.'] },
      { id: 'bo7', speaker: 'partner', sv: 'Överallt nu för tiden. Hur stort är det egentligen?', de: 'Überall heutzutage. Wie groß ist es eigentlich?', decoding: [{ sv: 'överallt', de: 'überall' }, { sv: 'nu', de: 'jetzt' }, { sv: 'för', de: 'für' }, { sv: 'tiden', de: 'die Zeit' }, { sv: 'hur', de: 'wie' }, { sv: 'stort', de: 'groß' }, { sv: 'är', de: 'ist' }, { sv: 'det', de: 'es' }, { sv: 'egentligen', de: 'eigentlich' }] },
      { id: 'bo8', speaker: 'you', sv: 'jag bor i en lägenhet', de: 'ich wohne in einer Wohnung', chunkId: 'c-borilagenhet', suggestions: ['Jag bor i en lägenhet.', 'Hur många rum har du?'] },
      { id: 'bo9', speaker: 'partner', sv: 'Det ser jag! Men hur många rum har ni?', de: 'Das sehe ich! Aber wie viele Zimmer habt ihr?', decoding: [{ sv: 'det', de: 'das' }, { sv: 'ser', de: 'sehe' }, { sv: 'jag', de: 'ich' }, { sv: 'men', de: 'aber' }, { sv: 'hur', de: 'wie' }, { sv: 'många', de: 'viele' }, { sv: 'rum', de: 'Zimmer' }, { sv: 'har', de: 'habt' }, { sv: 'ni', de: 'ihr' }] },
      { id: 'bo10', speaker: 'you', sv: 'hur många rum har du?', de: 'wie viele Zimmer hast du?', chunkId: 'c-hurmangarum', suggestions: ['Hur många rum har du?', 'Var är rummet?'] },
      { id: 'bo11', speaker: 'partner', sv: 'Tre hos mig. Men köket är knappt en korridor.', de: 'Bei mir drei. Aber die Küche ist kaum ein Flur.', decoding: [{ sv: 'tre', de: 'drei' }, { sv: 'hos', de: 'bei' }, { sv: 'mig', de: 'mir' }, { sv: 'men', de: 'aber' }, { sv: 'köket', de: 'die Küche' }, { sv: 'är', de: 'ist' }, { sv: 'knappt', de: 'kaum' }, { sv: 'en', de: 'ein' }, { sv: 'korridor', de: 'Flur' }] },
      { id: 'bo12', speaker: 'you', sv: 'köket är litet', de: 'die Küche ist klein', chunkId: 'c-koketlitet', suggestions: ['Köket är litet.', 'Den är för liten.'] },
    ],
  },

  // ── Winter & Schnee ───────────────────────────────────────────────────────
  {
    id: 'dlg-vinter',
    categoryId: 'cat-winter',
    title: 'Erster Schnee',
    blurb: 'Glätte, Mütze, früh dunkel — und Ski fahren.',
    scene: 'street',
    partnerName: 'Grannen',
    turns: [
      { id: 'vi1', speaker: 'partner', sv: 'Titta ut! Allt är vitt sedan i natt.', de: 'Schau raus! Seit heute Nacht ist alles weiß.', listenFirst: true, decoding: [{ sv: 'titta', de: 'schau' }, { sv: 'ut', de: 'hinaus' }, { sv: 'allt', de: 'alles' }, { sv: 'är', de: 'ist' }, { sv: 'vitt', de: 'weiß' }, { sv: 'sedan', de: 'seit' }, { sv: 'i', de: 'in' }, { sv: 'natt', de: 'Nacht' }] },
      { id: 'vi2', speaker: 'you', sv: 'det snöar', de: 'es schneit', chunkId: 'c-detsnoar', suggestions: ['Det snöar.', 'Det regnar.'] },
      { id: 'vi3', speaker: 'partner', sv: 'Och det fortsätter hela dagen, enligt prognosen.', de: 'Und es geht laut Vorhersage den ganzen Tag weiter.', decoding: [{ sv: 'och', de: 'und' }, { sv: 'det', de: 'es' }, { sv: 'fortsätter', de: 'fährt fort' }, { sv: 'hela', de: 'den ganzen' }, { sv: 'dagen', de: 'Tag' }, { sv: 'enligt', de: 'laut' }, { sv: 'prognosen', de: 'der Vorhersage' }] },
      { id: 'vi4', speaker: 'you', sv: 'det är halt på vägen', de: 'die Straße ist glatt', chunkId: 'c-haltpavagen', suggestions: ['Det är halt på vägen.', 'Det snöar.'] },
      { id: 'vi5', speaker: 'partner', sv: 'Var försiktig. Två personer föll utanför porten i morse.', de: 'Sei vorsichtig. Heute Morgen sind zwei Leute vor der Tür gestürzt.', decoding: [{ sv: 'var', de: 'sei' }, { sv: 'försiktig', de: 'vorsichtig' }, { sv: 'två', de: 'zwei' }, { sv: 'personer', de: 'Personen' }, { sv: 'föll', de: 'fielen' }, { sv: 'utanför', de: 'außerhalb' }, { sv: 'porten', de: 'des Tores' }, { sv: 'i', de: 'am' }, { sv: 'morse', de: 'Morgen' }] },
      { id: 'vi6', speaker: 'you', sv: 'jag fryser', de: 'mir ist kalt', chunkId: 'c-jagfryser', suggestions: ['Jag fryser.', 'Det är kallt ute.'] },
      { id: 'vi7', speaker: 'partner', sv: 'Klä på dig ordentligt, det är minus tio.', de: 'Zieh dich ordentlich an, es sind minus zehn.', decoding: [{ sv: 'klä', de: 'kleide' }, { sv: 'på', de: 'auf' }, { sv: 'dig', de: 'dich' }, { sv: 'ordentligt', de: 'ordentlich' }, { sv: 'det', de: 'es' }, { sv: 'är', de: 'ist' }, { sv: 'minus', de: 'minus' }, { sv: 'tio', de: 'zehn' }] },
      { id: 'vi8', speaker: 'you', sv: 'ta på dig mössa', de: 'setz eine Mütze auf', chunkId: 'c-tapadigmossa', suggestions: ['Ta på dig mössa.', 'Ta med paraply.'] },
      { id: 'vi9', speaker: 'partner', sv: 'Redan gjort. Snön ligger perfekt uppe i backen nu.', de: 'Schon erledigt. Der Schnee liegt jetzt perfekt oben am Hang.', decoding: [{ sv: 'redan', de: 'schon' }, { sv: 'gjort', de: 'gemacht' }, { sv: 'snön', de: 'der Schnee' }, { sv: 'ligger', de: 'liegt' }, { sv: 'perfekt', de: 'perfekt' }, { sv: 'uppe', de: 'oben' }, { sv: 'i', de: 'an' }, { sv: 'backen', de: 'dem Hang' }, { sv: 'nu', de: 'jetzt' }] },
      { id: 'vi10', speaker: 'you', sv: 'ska vi åka skidor?', de: 'sollen wir Ski fahren?', chunkId: 'c-akaskidor', suggestions: ['Ska vi åka skidor?', 'Ska vi springa?'] },
      { id: 'vi11', speaker: 'partner', sv: 'Ja! Men vi måste starta tidigt i dag.', de: 'Ja! Aber wir müssen heute früh starten.', decoding: [{ sv: 'ja', de: 'ja' }, { sv: 'men', de: 'aber' }, { sv: 'vi', de: 'wir' }, { sv: 'måste', de: 'müssen' }, { sv: 'starta', de: 'starten' }, { sv: 'tidigt', de: 'früh' }, { sv: 'i', de: 'am' }, { sv: 'dag', de: 'Tag' }] },
      { id: 'vi12', speaker: 'you', sv: 'det blir mörkt tidigt', de: 'es wird früh dunkel', chunkId: 'c-morkttidigt', suggestions: ['Det blir mörkt tidigt.', 'På sommaren är det ljust.'] },
    ],
  },
];
