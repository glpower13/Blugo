// Ausbau 4 (2026-07-26): Farben & Beschreiben, Feiern, Garten, Verein.
//
// Schwerpunkt bewusst A1: Der Bestand war zuletzt vor allem bei A2/B1 gewachsen,
// aber wer anfängt, braucht zuerst die Sätze, mit denen man auf Dinge zeigt und
// sie beschreibt.

import type { Category, Chunk, Segment } from '../../domain/chunk';

export const categories: Category[] = [
  { id: 'cat-colours', areaId: 'area-shopping', title: 'Farben & Beschreiben', blurb: 'Auf etwas zeigen und sagen, welches: die Farbe, die Größe, das da.', order: 6, cefr: 'A1' },
  { id: 'cat-celebrate', areaId: 'area-friends', title: 'Feiern & Geburtstag', blurb: 'Gratulieren, anstoßen, ein Geschenk überreichen.', order: 9, cefr: 'A1' },
  { id: 'cat-garden', areaId: 'area-home', title: 'Garten & Balkon', blurb: 'Gießen, pflanzen, draußen sitzen — auch auf zwei Quadratmetern.', order: 5, cefr: 'A2' },
  { id: 'cat-forening', areaId: 'area-society', title: 'Verein & Ehrenamt', blurb: 'Das schwedische Vereinsleben: Mitglied werden, mithelfen, abstimmen.', order: 6, cefr: 'B1' },
];

const c = (id: string, categoryId: string, sv: string, de: string, d: [string, string][]): Chunk => ({
  id, categoryId, sv, de, decoding: d.map(([a, b]) => ({ sv: a, de: b })),
});
const s = (id: string, sv: string, de: string, d: [string, string][], chunkIds: string[]): Segment => ({
  id, level: 1, sv, de, decoding: d.map(([a, b]) => ({ sv: a, de: b })), chunkIds,
});

export const chunks: Chunk[] = [
  // ── Farben & Beschreiben ──────────────────────────────────────────────────
  c('c-fa-vilkenfarg', 'cat-colours', 'vilken färg vill du ha?', 'welche Farbe willst du?', [['vilken', 'welche'], ['färg', 'Farbe'], ['vill', 'willst'], ['du', 'du'], ['ha', 'haben']]),
  c('c-fa-rod', 'cat-colours', 'den röda, tack', 'die rote, bitte', [['den', 'die'], ['röda', 'rote'], ['tack', 'bitte']]),
  c('c-fa-bla', 'cat-colours', 'jag gillar den blå', 'ich mag die blaue', [['jag', 'ich'], ['gillar', 'mag'], ['den', 'die'], ['blå', 'blaue']]),
  c('c-fa-morkare', 'cat-colours', 'har ni den i mörkare?', 'habt ihr die in dunkler?', [['har', 'habt'], ['ni', 'ihr'], ['den', 'die'], ['i', 'in'], ['mörkare', 'dunkler']]),
  c('c-fa-fin', 'cat-colours', 'den är väldigt fin', 'sie ist sehr schön', [['den', 'sie'], ['är', 'ist'], ['väldigt', 'sehr'], ['fin', 'schön']]),
  c('c-fa-denhar', 'cat-colours', 'får jag se den?', 'darf ich sie sehen?', [['får', 'darf'], ['jag', 'ich'], ['se', 'sehen'], ['den', 'sie']]),
  c('c-fa-vad', 'cat-colours', 'vad heter den på svenska?', 'wie heißt das auf Schwedisch?', [['vad', 'was'], ['heter', 'heißt'], ['den', 'sie'], ['på', 'auf'], ['svenska', 'Schwedisch']]),

  // ── Feiern & Geburtstag ───────────────────────────────────────────────────
  c('c-fe-grattis', 'cat-celebrate', 'grattis på födelsedagen!', 'herzlichen Glückwunsch zum Geburtstag!', [['grattis', 'Glückwunsch'], ['på', 'auf'], ['födelsedagen', 'den Geburtstag']]),
  c('c-fe-skal', 'cat-celebrate', 'skål!', 'prost!', [['skål', 'Schale']]),
  c('c-fe-present', 'cat-celebrate', 'här är en present till dig', 'hier ist ein Geschenk für dich', [['här', 'hier'], ['är', 'ist'], ['en', 'ein'], ['present', 'Geschenk'], ['till', 'für'], ['dig', 'dich']]),
  c('c-fe-fyller', 'cat-celebrate', 'hur gammal fyller du?', 'wie alt wirst du?', [['hur', 'wie'], ['gammal', 'alt'], ['fyller', 'füllst'], ['du', 'du']]),
  c('c-fe-tarta', 'cat-celebrate', 'vill du ha tårta?', 'willst du Torte?', [['vill', 'willst'], ['du', 'du'], ['ha', 'haben'], ['tårta', 'Torte']]),
  c('c-fe-tal', 'cat-celebrate', 'jag vill säga några ord', 'ich möchte ein paar Worte sagen', [['jag', 'ich'], ['vill', 'will'], ['säga', 'sagen'], ['några', 'einige'], ['ord', 'Worte']]),
  c('c-fe-tack', 'cat-celebrate', 'tack för att ni kom', 'danke, dass ihr gekommen seid', [['tack', 'danke'], ['för', 'für'], ['att', 'dass'], ['ni', 'ihr'], ['kom', 'kamt']]),

  // ── Garten & Balkon ───────────────────────────────────────────────────────
  c('c-ga-vattna', 'cat-garden', 'jag måste vattna blommorna', 'ich muss die Blumen gießen', [['jag', 'ich'], ['måste', 'muss'], ['vattna', 'gießen'], ['blommorna', 'die Blumen']]),
  c('c-ga-planta', 'cat-garden', 'vi planterar i maj', 'wir pflanzen im Mai', [['vi', 'wir'], ['planterar', 'pflanzen'], ['i', 'im'], ['maj', 'Mai']]),
  c('c-ga-balkong', 'cat-garden', 'vi sitter på balkongen', 'wir sitzen auf dem Balkon', [['vi', 'wir'], ['sitter', 'sitzen'], ['på', 'auf'], ['balkongen', 'dem Balkon']]),
  c('c-ga-vaxer', 'cat-garden', 'det växer bra i år', 'es wächst dieses Jahr gut', [['det', 'es'], ['växer', 'wächst'], ['bra', 'gut'], ['i', 'in'], ['år', 'Jahr']]),
  c('c-ga-skugga', 'cat-garden', 'det står i skuggan', 'es steht im Schatten', [['det', 'es'], ['står', 'steht'], ['i', 'im'], ['skuggan', 'Schatten']]),
  c('c-ga-klippa', 'cat-garden', 'jag klipper gräset på lördag', 'ich mähe am Samstag den Rasen', [['jag', 'ich'], ['klipper', 'schneide'], ['gräset', 'das Gras'], ['på', 'am'], ['lördag', 'Samstag']]),
  c('c-ga-skorda', 'cat-garden', 'vi skördar tomaterna snart', 'wir ernten bald die Tomaten', [['vi', 'wir'], ['skördar', 'ernten'], ['tomaterna', 'die Tomaten'], ['snart', 'bald']]),

  // ── Verein & Ehrenamt ─────────────────────────────────────────────────────
  c('c-ve-medlem', 'cat-forening', 'jag vill bli medlem', 'ich möchte Mitglied werden', [['jag', 'ich'], ['vill', 'will'], ['bli', 'werden'], ['medlem', 'Mitglied']]),
  c('c-ve-avgift', 'cat-forening', 'vad kostar medlemsavgiften?', 'wie hoch ist der Mitgliedsbeitrag?', [['vad', 'was'], ['kostar', 'kostet'], ['medlemsavgiften', 'der Mitgliedsbeitrag']]),
  c('c-ve-mote', 'cat-forening', 'årsmötet är i mars', 'die Jahresversammlung ist im März', [['årsmötet', 'die Jahresversammlung'], ['är', 'ist'], ['i', 'im'], ['mars', 'März']]),
  c('c-ve-rosta', 'cat-forening', 'vi röstar om förslaget', 'wir stimmen über den Vorschlag ab', [['vi', 'wir'], ['röstar', 'stimmen'], ['om', 'über'], ['förslaget', 'den Vorschlag']]),
  c('c-ve-hjalpa', 'cat-forening', 'jag kan hjälpa till ideellt', 'ich kann ehrenamtlich mithelfen', [['jag', 'ich'], ['kan', 'kann'], ['hjälpa', 'helfen'], ['till', 'zu'], ['ideellt', 'ehrenamtlich']]),
  c('c-ve-styrelse', 'cat-forening', 'vem sitter i styrelsen?', 'wer sitzt im Vorstand?', [['vem', 'wer'], ['sitter', 'sitzt'], ['i', 'im'], ['styrelsen', 'Vorstand']]),
  c('c-ve-anmalan', 'cat-forening', 'anmälan är öppen nu', 'die Anmeldung ist jetzt offen', [['anmälan', 'die Anmeldung'], ['är', 'ist'], ['öppen', 'offen'], ['nu', 'jetzt']]),
];

export const segments: Segment[] = [
  // Farben
  s('s-fa-vf1', 'Vilken färg vill du ha?', 'Welche Farbe willst du?', [['vilken', 'welche'], ['färg', 'Farbe'], ['vill', 'willst'], ['du', 'du'], ['ha', 'haben']], ['c-fa-vilkenfarg']),
  s('s-fa-vf2', 'Vi har flera. Vilken färg vill du ha?', 'Wir haben mehrere. Welche Farbe willst du?', [['vi', 'wir'], ['har', 'haben'], ['flera', 'mehrere'], ['vilken', 'welche'], ['färg', 'Farbe'], ['vill', 'willst'], ['du', 'du'], ['ha', 'haben']], ['c-fa-vilkenfarg']),
  s('s-fa-ro1', 'Den röda, tack.', 'Die rote, bitte.', [['den', 'die'], ['röda', 'rote'], ['tack', 'bitte']], ['c-fa-rod']),
  s('s-fa-ro2', 'Den röda, tack. Den passar bäst.', 'Die rote, bitte. Die passt am besten.', [['den', 'die'], ['röda', 'rote'], ['tack', 'bitte'], ['den', 'die'], ['passar', 'passt'], ['bäst', 'am besten']], ['c-fa-rod']),
  s('s-fa-bl1', 'Jag gillar den blå.', 'Ich mag die blaue.', [['jag', 'ich'], ['gillar', 'mag'], ['den', 'die'], ['blå', 'blaue']], ['c-fa-bla']),
  s('s-fa-bl2', 'Jag gillar den blå bättre.', 'Ich mag die blaue lieber.', [['jag', 'ich'], ['gillar', 'mag'], ['den', 'die'], ['blå', 'blaue'], ['bättre', 'besser']], ['c-fa-bla']),
  s('s-fa-mo1', 'Har ni den i mörkare?', 'Habt ihr die in dunkler?', [['har', 'habt'], ['ni', 'ihr'], ['den', 'die'], ['i', 'in'], ['mörkare', 'dunkler']], ['c-fa-morkare']),
  s('s-fa-mo2', 'Har ni den i mörkare, eller bara så här?', 'Habt ihr die in dunkler, oder nur so?', [['har', 'habt'], ['ni', 'ihr'], ['den', 'die'], ['i', 'in'], ['mörkare', 'dunkler'], ['eller', 'oder'], ['bara', 'nur'], ['så', 'so'], ['här', 'hier']], ['c-fa-morkare']),
  s('s-fa-fi1', 'Den är väldigt fin.', 'Sie ist sehr schön.', [['den', 'sie'], ['är', 'ist'], ['väldigt', 'sehr'], ['fin', 'schön']], ['c-fa-fin']),
  s('s-fa-fi2', 'Den är väldigt fin. Får jag se den?', 'Sie ist sehr schön. Darf ich sie sehen?', [['den', 'sie'], ['är', 'ist'], ['väldigt', 'sehr'], ['fin', 'schön'], ['får', 'darf'], ['jag', 'ich'], ['se', 'sehen'], ['den', 'sie']], ['c-fa-fin', 'c-fa-denhar']),
  s('s-fa-dh1', 'Får jag se den?', 'Darf ich sie sehen?', [['får', 'darf'], ['jag', 'ich'], ['se', 'sehen'], ['den', 'sie']], ['c-fa-denhar']),
  s('s-fa-dh2', 'Får jag se den närmare?', 'Darf ich sie näher ansehen?', [['får', 'darf'], ['jag', 'ich'], ['se', 'sehen'], ['den', 'sie'], ['närmare', 'näher']], ['c-fa-denhar']),
  s('s-fa-va1', 'Vad heter den på svenska?', 'Wie heißt das auf Schwedisch?', [['vad', 'was'], ['heter', 'heißt'], ['den', 'sie'], ['på', 'auf'], ['svenska', 'Schwedisch']], ['c-fa-vad']),
  s('s-fa-va2', 'Ursäkta, vad heter den på svenska?', 'Entschuldigung, wie heißt das auf Schwedisch?', [['ursäkta', 'entschuldige'], ['vad', 'was'], ['heter', 'heißt'], ['den', 'sie'], ['på', 'auf'], ['svenska', 'Schwedisch']], ['c-fa-vad']),

  // Feiern
  s('s-fe-gr1', 'Grattis på födelsedagen!', 'Herzlichen Glückwunsch zum Geburtstag!', [['grattis', 'Glückwunsch'], ['på', 'auf'], ['födelsedagen', 'den Geburtstag']], ['c-fe-grattis']),
  s('s-fe-gr2', 'Grattis på födelsedagen, {name} hälsar också!', 'Herzlichen Glückwunsch zum Geburtstag, {name} grüßt auch!', [['grattis', 'Glückwunsch'], ['på', 'auf'], ['födelsedagen', 'den Geburtstag'], ['hälsar', 'grüßt'], ['också', 'auch']], ['c-fe-grattis']),
  s('s-fe-sk1', 'Skål!', 'Prost!', [['skål', 'Schale']], ['c-fe-skal']),
  s('s-fe-sk2', 'Skål för dig!', 'Prost auf dich!', [['skål', 'Schale'], ['för', 'für'], ['dig', 'dich']], ['c-fe-skal']),
  s('s-fe-pr1', 'Här är en present till dig.', 'Hier ist ein Geschenk für dich.', [['här', 'hier'], ['är', 'ist'], ['en', 'ein'], ['present', 'Geschenk'], ['till', 'für'], ['dig', 'dich']], ['c-fe-present']),
  s('s-fe-pr2', 'Här är en present till dig, öppna den!', 'Hier ist ein Geschenk für dich, mach es auf!', [['här', 'hier'], ['är', 'ist'], ['en', 'ein'], ['present', 'Geschenk'], ['till', 'für'], ['dig', 'dich'], ['öppna', 'öffne'], ['den', 'es']], ['c-fe-present']),
  s('s-fe-fy1', 'Hur gammal fyller du?', 'Wie alt wirst du?', [['hur', 'wie'], ['gammal', 'alt'], ['fyller', 'füllst'], ['du', 'du']], ['c-fe-fyller']),
  s('s-fe-fy2', 'Hur gammal fyller du i år?', 'Wie alt wirst du dieses Jahr?', [['hur', 'wie'], ['gammal', 'alt'], ['fyller', 'füllst'], ['du', 'du'], ['i', 'in'], ['år', 'Jahr']], ['c-fe-fyller']),
  s('s-fe-ta1', 'Vill du ha tårta?', 'Willst du Torte?', [['vill', 'willst'], ['du', 'du'], ['ha', 'haben'], ['tårta', 'Torte']], ['c-fe-tarta']),
  s('s-fe-ta2', 'Vill du ha tårta eller kaffe först?', 'Willst du zuerst Torte oder Kaffee?', [['vill', 'willst'], ['du', 'du'], ['ha', 'haben'], ['tårta', 'Torte'], ['eller', 'oder'], ['kaffe', 'Kaffee'], ['först', 'erst']], ['c-fe-tarta']),
  s('s-fe-tl1', 'Jag vill säga några ord.', 'Ich möchte ein paar Worte sagen.', [['jag', 'ich'], ['vill', 'will'], ['säga', 'sagen'], ['några', 'einige'], ['ord', 'Worte']], ['c-fe-tal']),
  s('s-fe-tl2', 'Vänta lite, jag vill säga några ord.', 'Wartet kurz, ich möchte ein paar Worte sagen.', [['vänta', 'warte'], ['lite', 'wenig'], ['jag', 'ich'], ['vill', 'will'], ['säga', 'sagen'], ['några', 'einige'], ['ord', 'Worte']], ['c-fe-tal']),
  s('s-fe-tk1', 'Tack för att ni kom.', 'Danke, dass ihr gekommen seid.', [['tack', 'danke'], ['för', 'für'], ['att', 'dass'], ['ni', 'ihr'], ['kom', 'kamt']], ['c-fe-tack']),
  s('s-fe-tk2', 'Tack för att ni kom hela vägen hit.', 'Danke, dass ihr den ganzen Weg hergekommen seid.', [['tack', 'danke'], ['för', 'für'], ['att', 'dass'], ['ni', 'ihr'], ['kom', 'kamt'], ['hela', 'den ganzen'], ['vägen', 'Weg'], ['hit', 'hierher']], ['c-fe-tack']),

  // Garten
  s('s-ga-va1', 'Jag måste vattna blommorna.', 'Ich muss die Blumen gießen.', [['jag', 'ich'], ['måste', 'muss'], ['vattna', 'gießen'], ['blommorna', 'die Blumen']], ['c-ga-vattna']),
  s('s-ga-va2', 'Jag måste vattna blommorna innan solen kommer.', 'Ich muss die Blumen gießen, bevor die Sonne kommt.', [['jag', 'ich'], ['måste', 'muss'], ['vattna', 'gießen'], ['blommorna', 'die Blumen'], ['innan', 'bevor'], ['solen', 'die Sonne'], ['kommer', 'kommt']], ['c-ga-vattna']),
  s('s-ga-pl1', 'Vi planterar i maj.', 'Wir pflanzen im Mai.', [['vi', 'wir'], ['planterar', 'pflanzen'], ['i', 'im'], ['maj', 'Mai']], ['c-ga-planta']),
  s('s-ga-pl2', 'Vi planterar i maj, tidigare är för kallt.', 'Wir pflanzen im Mai, früher ist es zu kalt.', [['vi', 'wir'], ['planterar', 'pflanzen'], ['i', 'im'], ['maj', 'Mai'], ['tidigare', 'früher'], ['är', 'ist'], ['för', 'zu'], ['kallt', 'kalt']], ['c-ga-planta']),
  s('s-ga-ba1', 'Vi sitter på balkongen.', 'Wir sitzen auf dem Balkon.', [['vi', 'wir'], ['sitter', 'sitzen'], ['på', 'auf'], ['balkongen', 'dem Balkon']], ['c-ga-balkong']),
  s('s-ga-ba2', 'Vi sitter på balkongen och dricker kaffe.', 'Wir sitzen auf dem Balkon und trinken Kaffee.', [['vi', 'wir'], ['sitter', 'sitzen'], ['på', 'auf'], ['balkongen', 'dem Balkon'], ['och', 'und'], ['dricker', 'trinken'], ['kaffe', 'Kaffee']], ['c-ga-balkong']),
  s('s-ga-vx1', 'Det växer bra i år.', 'Es wächst dieses Jahr gut.', [['det', 'es'], ['växer', 'wächst'], ['bra', 'gut'], ['i', 'in'], ['år', 'Jahr']], ['c-ga-vaxer']),
  s('s-ga-vx2', 'Det växer bra i år, mycket regn.', 'Es wächst dieses Jahr gut, viel Regen.', [['det', 'es'], ['växer', 'wächst'], ['bra', 'gut'], ['i', 'in'], ['år', 'Jahr'], ['mycket', 'viel'], ['regn', 'Regen']], ['c-ga-vaxer']),
  s('s-ga-sk1', 'Det står i skuggan.', 'Es steht im Schatten.', [['det', 'es'], ['står', 'steht'], ['i', 'im'], ['skuggan', 'Schatten']], ['c-ga-skugga']),
  s('s-ga-sk2', 'Det står i skuggan hela dagen.', 'Es steht den ganzen Tag im Schatten.', [['det', 'es'], ['står', 'steht'], ['i', 'im'], ['skuggan', 'Schatten'], ['hela', 'den ganzen'], ['dagen', 'Tag']], ['c-ga-skugga']),
  s('s-ga-kl1', 'Jag klipper gräset på lördag.', 'Ich mähe am Samstag den Rasen.', [['jag', 'ich'], ['klipper', 'schneide'], ['gräset', 'das Gras'], ['på', 'am'], ['lördag', 'Samstag']], ['c-ga-klippa']),
  s('s-ga-kl2', 'Jag klipper gräset på lördag om det inte regnar.', 'Ich mähe am Samstag den Rasen, wenn es nicht regnet.', [['jag', 'ich'], ['klipper', 'schneide'], ['gräset', 'das Gras'], ['på', 'am'], ['lördag', 'Samstag'], ['om', 'wenn'], ['det', 'es'], ['inte', 'nicht'], ['regnar', 'regnet']], ['c-ga-klippa']),
  s('s-ga-sd1', 'Vi skördar tomaterna snart.', 'Wir ernten bald die Tomaten.', [['vi', 'wir'], ['skördar', 'ernten'], ['tomaterna', 'die Tomaten'], ['snart', 'bald']], ['c-ga-skorda']),
  s('s-ga-sd2', 'Vi skördar tomaterna snart, de är nästan röda.', 'Wir ernten bald die Tomaten, sie sind fast rot.', [['vi', 'wir'], ['skördar', 'ernten'], ['tomaterna', 'die Tomaten'], ['snart', 'bald'], ['de', 'sie'], ['är', 'sind'], ['nästan', 'fast'], ['röda', 'rot']], ['c-ga-skorda']),

  // Verein
  s('s-ve-me1', 'Jag vill bli medlem.', 'Ich möchte Mitglied werden.', [['jag', 'ich'], ['vill', 'will'], ['bli', 'werden'], ['medlem', 'Mitglied']], ['c-ve-medlem']),
  s('s-ve-me2', 'Jag vill bli medlem i föreningen.', 'Ich möchte Mitglied im Verein werden.', [['jag', 'ich'], ['vill', 'will'], ['bli', 'werden'], ['medlem', 'Mitglied'], ['i', 'in'], ['föreningen', 'dem Verein']], ['c-ve-medlem']),
  s('s-ve-av1', 'Vad kostar medlemsavgiften?', 'Wie hoch ist der Mitgliedsbeitrag?', [['vad', 'was'], ['kostar', 'kostet'], ['medlemsavgiften', 'der Mitgliedsbeitrag']], ['c-ve-avgift']),
  s('s-ve-av2', 'Vad kostar medlemsavgiften per år?', 'Wie hoch ist der Mitgliedsbeitrag pro Jahr?', [['vad', 'was'], ['kostar', 'kostet'], ['medlemsavgiften', 'der Mitgliedsbeitrag'], ['per', 'pro'], ['år', 'Jahr']], ['c-ve-avgift']),
  s('s-ve-mo1', 'Årsmötet är i mars.', 'Die Jahresversammlung ist im März.', [['årsmötet', 'die Jahresversammlung'], ['är', 'ist'], ['i', 'im'], ['mars', 'März']], ['c-ve-mote']),
  s('s-ve-mo2', 'Årsmötet är i mars, alla får komma.', 'Die Jahresversammlung ist im März, alle dürfen kommen.', [['årsmötet', 'die Jahresversammlung'], ['är', 'ist'], ['i', 'im'], ['mars', 'März'], ['alla', 'alle'], ['får', 'dürfen'], ['komma', 'kommen']], ['c-ve-mote']),
  s('s-ve-ro1', 'Vi röstar om förslaget.', 'Wir stimmen über den Vorschlag ab.', [['vi', 'wir'], ['röstar', 'stimmen'], ['om', 'über'], ['förslaget', 'den Vorschlag']], ['c-ve-rosta']),
  s('s-ve-ro2', 'Vi röstar om förslaget efter pausen.', 'Wir stimmen nach der Pause über den Vorschlag ab.', [['vi', 'wir'], ['röstar', 'stimmen'], ['om', 'über'], ['förslaget', 'den Vorschlag'], ['efter', 'nach'], ['pausen', 'der Pause']], ['c-ve-rosta']),
  s('s-ve-hj1', 'Jag kan hjälpa till ideellt.', 'Ich kann ehrenamtlich mithelfen.', [['jag', 'ich'], ['kan', 'kann'], ['hjälpa', 'helfen'], ['till', 'zu'], ['ideellt', 'ehrenamtlich']], ['c-ve-hjalpa']),
  s('s-ve-hj2', 'Jag kan hjälpa till ideellt några timmar i veckan.', 'Ich kann ein paar Stunden die Woche ehrenamtlich mithelfen.', [['jag', 'ich'], ['kan', 'kann'], ['hjälpa', 'helfen'], ['till', 'zu'], ['ideellt', 'ehrenamtlich'], ['några', 'einige'], ['timmar', 'Stunden'], ['i', 'in'], ['veckan', 'der Woche']], ['c-ve-hjalpa']),
  s('s-ve-st1', 'Vem sitter i styrelsen?', 'Wer sitzt im Vorstand?', [['vem', 'wer'], ['sitter', 'sitzt'], ['i', 'im'], ['styrelsen', 'Vorstand']], ['c-ve-styrelse']),
  s('s-ve-st2', 'Vem sitter i styrelsen i år?', 'Wer sitzt dieses Jahr im Vorstand?', [['vem', 'wer'], ['sitter', 'sitzt'], ['i', 'im'], ['styrelsen', 'Vorstand'], ['i', 'in'], ['år', 'Jahr']], ['c-ve-styrelse']),
  s('s-ve-an1', 'Anmälan är öppen nu.', 'Die Anmeldung ist jetzt offen.', [['anmälan', 'die Anmeldung'], ['är', 'ist'], ['öppen', 'offen'], ['nu', 'jetzt']], ['c-ve-anmalan']),
  s('s-ve-an2', 'Anmälan är öppen nu, sista dagen är på fredag.', 'Die Anmeldung ist jetzt offen, letzter Tag ist Freitag.', [['anmälan', 'die Anmeldung'], ['är', 'ist'], ['öppen', 'offen'], ['nu', 'jetzt'], ['sista', 'letzter'], ['dagen', 'Tag'], ['är', 'ist'], ['på', 'am'], ['fredag', 'Freitag']], ['c-ve-anmalan']),
];
