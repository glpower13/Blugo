// Ausbau 1 (2026-07-26): vier Themen, die im Alltag ständig gebraucht werden und
// bisher fehlten — Flughafen, Technik, Kochen, Friseur.
//
// Glossen folgen den Konventionen des bestehenden Inhalts (jag=ich, det=es/das,
// på=auf/am, tack=danke/bitte …), damit der Rückübersetzungs-Bericht sauber
// bleibt und ein Lerner nicht dasselbe Wort zweimal verschieden erklärt bekommt.

import type { Category, Chunk, Segment } from '../../domain/chunk';

export const categories: Category[] = [
  {
    id: 'cat-airport',
    areaId: 'area-travel',
    title: 'Am Flughafen',
    blurb: 'Einchecken, Gate, Gepäck — und was man sagt, wenn der Flug sich verspätet.',
    order: 5,
    cefr: 'A2',
  },
  {
    id: 'cat-tech',
    areaId: 'area-services',
    title: 'Internet & Technik',
    blurb: 'WLAN, Passwort, leerer Akku: die Sätze, die heute überall fallen.',
    order: 4,
    cefr: 'A2',
  },
  {
    id: 'cat-cooking',
    areaId: 'area-food',
    title: 'Kochen & Rezepte',
    blurb: 'Zusammen kochen — Rezept, Pfanne, Ofen, abschmecken.',
    order: 5,
    cefr: 'A2',
  },
  {
    id: 'cat-hair',
    areaId: 'area-services',
    title: 'Beim Friseur',
    blurb: 'Einen Termin bekommen und sagen, wie kurz es werden soll.',
    order: 5,
    cefr: 'A2',
  },
];

const c = (id: string, categoryId: string, sv: string, de: string, d: [string, string][]): Chunk => ({
  id,
  categoryId,
  sv,
  de,
  decoding: d.map(([a, b]) => ({ sv: a, de: b })),
});

const s = (id: string, sv: string, de: string, d: [string, string][], chunkIds: string[]): Segment => ({
  id,
  level: 2,
  sv,
  de,
  decoding: d.map(([a, b]) => ({ sv: a, de: b })),
  chunkIds,
});

export const chunks: Chunk[] = [
  // ── Am Flughafen ──────────────────────────────────────────────────────────
  c('c-ap-incheck', 'cat-airport', 'var är incheckningen?', 'wo ist der Check-in?', [
    ['var', 'wo'], ['är', 'ist'], ['incheckningen', 'die Eincheckung'],
  ]),
  c('c-ap-handbagage', 'cat-airport', 'jag har bara handbagage', 'ich habe nur Handgepäck', [
    ['jag', 'ich'], ['har', 'habe'], ['bara', 'nur'], ['handbagage', 'Handgepäck'],
  ]),
  c('c-ap-gate', 'cat-airport', 'vilken gate är det?', 'welches Gate ist es?', [
    ['vilken', 'welche'], ['gate', 'Gate'], ['är', 'ist'], ['det', 'es'],
  ]),
  c('c-ap-forsenat', 'cat-airport', 'flyget är försenat', 'der Flug hat Verspätung', [
    ['flyget', 'der Flug'], ['är', 'ist'], ['försenat', 'verspätet'],
  ]),
  c('c-ap-missat', 'cat-airport', 'jag har missat mitt flyg', 'ich habe meinen Flug verpasst', [
    ['jag', 'ich'], ['har', 'habe'], ['missat', 'verpasst'], ['mitt', 'meinen'], ['flyg', 'Flug'],
  ]),
  c('c-ap-bagage', 'cat-airport', 'var hämtar man bagaget?', 'wo holt man das Gepäck?', [
    ['var', 'wo'], ['hämtar', 'holt'], ['man', 'man'], ['bagaget', 'das Gepäck'],
  ]),
  c('c-ap-pass', 'cat-airport', 'har du ditt pass?', 'hast du deinen Pass?', [
    ['har', 'hast'], ['du', 'du'], ['ditt', 'deinen'], ['pass', 'Pass'],
  ]),

  // ── Internet & Technik ────────────────────────────────────────────────────
  c('c-tk-losenord', 'cat-tech', 'vad är lösenordet?', 'wie ist das Passwort?', [
    ['vad', 'was'], ['är', 'ist'], ['lösenordet', 'das Passwort'],
  ]),
  c('c-tk-wifi', 'cat-tech', 'wifi funkar inte', 'das WLAN geht nicht', [
    ['wifi', 'WLAN'], ['funkar', 'funktioniert'], ['inte', 'nicht'],
  ]),
  c('c-tk-batteri', 'cat-tech', 'mitt batteri är slut', 'mein Akku ist leer', [
    ['mitt', 'mein'], ['batteri', 'Akku'], ['är', 'ist'], ['slut', 'leer'],
  ]),
  c('c-tk-ladda', 'cat-tech', 'kan jag ladda här?', 'kann ich hier laden?', [
    ['kan', 'kann'], ['jag', 'ich'], ['ladda', 'laden'], ['här', 'hier'],
  ]),
  c('c-tk-lank', 'cat-tech', 'jag skickar en länk', 'ich schicke einen Link', [
    ['jag', 'ich'], ['skickar', 'schicke'], ['en', 'einen'], ['länk', 'Link'],
  ]),
  c('c-tk-hangt', 'cat-tech', 'den har hängt sig', 'er ist abgestürzt', [
    ['den', 'er'], ['har', 'hat'], ['hängt', 'gehängt'], ['sig', 'sich'],
  ]),
  c('c-tk-starta', 'cat-tech', 'starta om den', 'starte ihn neu', [
    ['starta', 'starte'], ['om', 'um'], ['den', 'ihn'],
  ]),

  // ── Kochen & Rezepte ──────────────────────────────────────────────────────
  c('c-ko-laga', 'cat-cooking', 'vad ska vi laga?', 'was sollen wir kochen?', [
    ['vad', 'was'], ['ska', 'sollen'], ['vi', 'wir'], ['laga', 'zubereiten'],
  ]),
  c('c-ko-recept', 'cat-cooking', 'jag följer ett recept', 'ich folge einem Rezept', [
    ['jag', 'ich'], ['följer', 'folge'], ['ett', 'einem'], ['recept', 'Rezept'],
  ]),
  c('c-ko-koka', 'cat-cooking', 'det ska koka i tio minuter', 'es soll zehn Minuten kochen', [
    ['det', 'es'], ['ska', 'soll'], ['koka', 'kochen'], ['i', 'in'], ['tio', 'zehn'], ['minuter', 'Minuten'],
  ]),
  c('c-ko-salta', 'cat-cooking', 'salta lite mer', 'salz etwas mehr', [
    ['salta', 'salze'], ['lite', 'wenig'], ['mer', 'mehr'],
  ]),
  c('c-ko-stekpanna', 'cat-cooking', 'har du en stekpanna?', 'hast du eine Pfanne?', [
    ['har', 'hast'], ['du', 'du'], ['en', 'eine'], ['stekpanna', 'Bratpfanne'],
  ]),
  c('c-ko-ugnen', 'cat-cooking', 'sätt på ugnen', 'schalte den Ofen an', [
    ['sätt', 'setze'], ['på', 'auf'], ['ugnen', 'den Ofen'],
  ]),
  c('c-ko-smakar', 'cat-cooking', 'smakar det bra?', 'schmeckt es gut?', [
    ['smakar', 'schmeckt'], ['det', 'es'], ['bra', 'gut'],
  ]),

  // ── Beim Friseur ──────────────────────────────────────────────────────────
  c('c-fr-klippa', 'cat-hair', 'jag vill klippa mig', 'ich möchte mir die Haare schneiden lassen', [
    ['jag', 'ich'], ['vill', 'will'], ['klippa', 'schneiden'], ['mig', 'mich'],
  ]),
  c('c-fr-kortare', 'cat-hair', 'bara lite kortare', 'nur ein bisschen kürzer', [
    ['bara', 'nur'], ['lite', 'wenig'], ['kortare', 'kürzer'],
  ]),
  c('c-fr-forkort', 'cat-hair', 'inte för kort', 'nicht zu kurz', [
    ['inte', 'nicht'], ['för', 'zu'], ['kort', 'kurz'],
  ]),
  c('c-fr-tid', 'cat-hair', 'har ni en tid idag?', 'habt ihr heute einen Termin?', [
    ['har', 'habt'], ['ni', 'ihr'], ['en', 'einen'], ['tid', 'Termin'], ['idag', 'heute'],
  ]),
  c('c-fr-lugg', 'cat-hair', 'jag vill ha lugg', 'ich möchte einen Pony', [
    ['jag', 'ich'], ['vill', 'will'], ['ha', 'haben'], ['lugg', 'Pony'],
  ]),
  c('c-fr-sadar', 'cat-hair', 'så där, tack', 'so ist gut, danke', [
    ['så', 'so'], ['där', 'dort'], ['tack', 'danke'],
  ]),
];

export const segments: Segment[] = [
  // Flughafen
  s('s-ap-incheck1', 'Ursäkta, var är incheckningen?', 'Entschuldigung, wo ist der Check-in?', [['ursäkta', 'entschuldige'], ['var', 'wo'], ['är', 'ist'], ['incheckningen', 'die Eincheckung']], ['c-ap-incheck']),
  s('s-ap-incheck2', 'Var är incheckningen för Stockholm?', 'Wo ist der Check-in nach Stockholm?', [['var', 'wo'], ['är', 'ist'], ['incheckningen', 'die Eincheckung'], ['för', 'für'], ['stockholm', 'Stockholm']], ['c-ap-incheck']),
  s('s-ap-incheck3', 'Var är incheckningen? Jag är sen.', 'Wo ist der Check-in? Ich bin spät dran.', [['var', 'wo'], ['är', 'ist'], ['incheckningen', 'die Eincheckung'], ['jag', 'ich'], ['är', 'bin'], ['sen', 'spät']], ['c-ap-incheck']),
  s('s-ap-hand1', 'Jag har bara handbagage.', 'Ich habe nur Handgepäck.', [['jag', 'ich'], ['har', 'habe'], ['bara', 'nur'], ['handbagage', 'Handgepäck']], ['c-ap-handbagage']),
  s('s-ap-hand2', 'Ingen väska, jag har bara handbagage.', 'Kein Koffer, ich habe nur Handgepäck.', [['ingen', 'kein'], ['väska', 'Tasche'], ['jag', 'ich'], ['har', 'habe'], ['bara', 'nur'], ['handbagage', 'Handgepäck']], ['c-ap-handbagage']),
  s('s-ap-hand3', 'Jag har bara handbagage, går det snabbare då?', 'Ich habe nur Handgepäck, geht es dann schneller?', [['jag', 'ich'], ['har', 'habe'], ['bara', 'nur'], ['handbagage', 'Handgepäck'], ['går', 'geht'], ['det', 'es'], ['snabbare', 'schneller'], ['då', 'dann']], ['c-ap-handbagage']),
  s('s-ap-gate1', 'Vilken gate är det?', 'Welches Gate ist es?', [['vilken', 'welche'], ['gate', 'Gate'], ['är', 'ist'], ['det', 'es']], ['c-ap-gate']),
  s('s-ap-gate2', 'Vilken gate är det? Jag hittar inte.', 'Welches Gate ist es? Ich finde es nicht.', [['vilken', 'welche'], ['gate', 'Gate'], ['är', 'ist'], ['det', 'es'], ['jag', 'ich'], ['hittar', 'finde'], ['inte', 'nicht']], ['c-ap-gate']),
  s('s-ap-gate3', 'Ursäkta, vilken gate är det till Göteborg?', 'Entschuldigung, welches Gate ist es nach Göteborg?', [['ursäkta', 'entschuldige'], ['vilken', 'welche'], ['gate', 'Gate'], ['är', 'ist'], ['det', 'es'], ['till', 'nach'], ['göteborg', 'Göteborg']], ['c-ap-gate']),
  s('s-ap-fors1', 'Flyget är försenat.', 'Der Flug hat Verspätung.', [['flyget', 'der Flug'], ['är', 'ist'], ['försenat', 'verspätet']], ['c-ap-forsenat']),
  s('s-ap-fors2', 'Flyget är försenat en timme.', 'Der Flug hat eine Stunde Verspätung.', [['flyget', 'der Flug'], ['är', 'ist'], ['försenat', 'verspätet'], ['en', 'eine'], ['timme', 'Stunde']], ['c-ap-forsenat']),
  s('s-ap-fors3', 'Tyvärr, flyget är försenat igen.', 'Leider hat der Flug wieder Verspätung.', [['tyvärr', 'leider'], ['flyget', 'der Flug'], ['är', 'ist'], ['försenat', 'verspätet'], ['igen', 'wieder']], ['c-ap-forsenat']),
  s('s-ap-miss1', 'Jag har missat mitt flyg.', 'Ich habe meinen Flug verpasst.', [['jag', 'ich'], ['har', 'habe'], ['missat', 'verpasst'], ['mitt', 'meinen'], ['flyg', 'Flug']], ['c-ap-missat']),
  s('s-ap-miss2', 'Hjälp, jag har missat mitt flyg!', 'Hilfe, ich habe meinen Flug verpasst!', [['hjälp', 'Hilfe'], ['jag', 'ich'], ['har', 'habe'], ['missat', 'verpasst'], ['mitt', 'meinen'], ['flyg', 'Flug']], ['c-ap-missat']),
  s('s-ap-miss3', 'Jag har missat mitt flyg. Vad gör jag nu?', 'Ich habe meinen Flug verpasst. Was mache ich jetzt?', [['jag', 'ich'], ['har', 'habe'], ['missat', 'verpasst'], ['mitt', 'meinen'], ['flyg', 'Flug'], ['vad', 'was'], ['gör', 'mache'], ['jag', 'ich'], ['nu', 'jetzt']], ['c-ap-missat']),
  s('s-ap-bag1', 'Var hämtar man bagaget?', 'Wo holt man das Gepäck?', [['var', 'wo'], ['hämtar', 'holt'], ['man', 'man'], ['bagaget', 'das Gepäck']], ['c-ap-bagage']),
  s('s-ap-bag2', 'Var hämtar man bagaget? Jag ser inga skyltar.', 'Wo holt man das Gepäck? Ich sehe keine Schilder.', [['var', 'wo'], ['hämtar', 'holt'], ['man', 'man'], ['bagaget', 'das Gepäck'], ['jag', 'ich'], ['ser', 'sehe'], ['inga', 'keine'], ['skyltar', 'Schilder']], ['c-ap-bagage']),
  s('s-ap-bag3', 'Först passet, sedan: var hämtar man bagaget?', 'Erst der Pass, dann: wo holt man das Gepäck?', [['först', 'erst'], ['passet', 'der Pass'], ['sedan', 'dann'], ['var', 'wo'], ['hämtar', 'holt'], ['man', 'man'], ['bagaget', 'das Gepäck']], ['c-ap-bagage']),
  s('s-ap-pass1', 'Har du ditt pass?', 'Hast du deinen Pass?', [['har', 'hast'], ['du', 'du'], ['ditt', 'deinen'], ['pass', 'Pass']], ['c-ap-pass']),
  s('s-ap-pass2', 'Har du ditt pass? Vi måste gå nu.', 'Hast du deinen Pass? Wir müssen jetzt gehen.', [['har', 'hast'], ['du', 'du'], ['ditt', 'deinen'], ['pass', 'Pass'], ['vi', 'wir'], ['måste', 'müssen'], ['gå', 'gehen'], ['nu', 'jetzt']], ['c-ap-pass']),
  s('s-ap-pass3', 'Har du ditt pass? Bra, då checkar vi in.', 'Hast du deinen Pass? Gut, dann checken wir ein.', [['har', 'hast'], ['du', 'du'], ['ditt', 'deinen'], ['pass', 'Pass'], ['bra', 'gut'], ['då', 'dann'], ['checkar', 'checken'], ['vi', 'wir'], ['in', 'ein']], ['c-ap-pass']),

  // Technik
  s('s-tk-los1', 'Vad är lösenordet?', 'Wie ist das Passwort?', [['vad', 'was'], ['är', 'ist'], ['lösenordet', 'das Passwort']], ['c-tk-losenord']),
  s('s-tk-los2', 'Vad är lösenordet till wifi?', 'Wie ist das Passwort fürs WLAN?', [['vad', 'was'], ['är', 'ist'], ['lösenordet', 'das Passwort'], ['till', 'zu'], ['wifi', 'WLAN']], ['c-tk-losenord']),
  s('s-tk-los3', 'Vad är lösenordet? Jag har glömt det.', 'Wie ist das Passwort? Ich habe es vergessen.', [['vad', 'was'], ['är', 'ist'], ['lösenordet', 'das Passwort'], ['jag', 'ich'], ['har', 'habe'], ['glömt', 'vergessen'], ['det', 'es']], ['c-tk-losenord']),
  s('s-tk-wifi1', 'Wifi funkar inte.', 'Das WLAN geht nicht.', [['wifi', 'WLAN'], ['funkar', 'funktioniert'], ['inte', 'nicht']], ['c-tk-wifi']),
  s('s-tk-wifi2', 'Wifi funkar inte här inne.', 'Das WLAN geht hier drinnen nicht.', [['wifi', 'WLAN'], ['funkar', 'funktioniert'], ['inte', 'nicht'], ['här', 'hier'], ['inne', 'drinnen']], ['c-tk-wifi']),
  s('s-tk-bat1', 'Mitt batteri är slut.', 'Mein Akku ist leer.', [['mitt', 'mein'], ['batteri', 'Akku'], ['är', 'ist'], ['slut', 'leer']], ['c-tk-batteri']),
  s('s-tk-bat2', 'Mitt batteri är slut, jag ringer sedan.', 'Mein Akku ist leer, ich rufe später an.', [['mitt', 'mein'], ['batteri', 'Akku'], ['är', 'ist'], ['slut', 'leer'], ['jag', 'ich'], ['ringer', 'rufe an'], ['sedan', 'danach']], ['c-tk-batteri']),
  s('s-tk-bat3', 'Mitt batteri är slut. Kan jag ladda här?', 'Mein Akku ist leer. Kann ich hier laden?', [['mitt', 'mein'], ['batteri', 'Akku'], ['är', 'ist'], ['slut', 'leer'], ['kan', 'kann'], ['jag', 'ich'], ['ladda', 'laden'], ['här', 'hier']], ['c-tk-batteri', 'c-tk-ladda']),
  s('s-tk-ladd1', 'Kan jag ladda här?', 'Kann ich hier laden?', [['kan', 'kann'], ['jag', 'ich'], ['ladda', 'laden'], ['här', 'hier']], ['c-tk-ladda']),
  s('s-tk-ladd2', 'Kan jag ladda här någonstans?', 'Kann ich hier irgendwo laden?', [['kan', 'kann'], ['jag', 'ich'], ['ladda', 'laden'], ['här', 'hier'], ['någonstans', 'irgendwo']], ['c-tk-ladda']),
  s('s-tk-lank1', 'Jag skickar en länk.', 'Ich schicke einen Link.', [['jag', 'ich'], ['skickar', 'schicke'], ['en', 'einen'], ['länk', 'Link']], ['c-tk-lank']),
  s('s-tk-lank2', 'Jag skickar en länk till dig.', 'Ich schicke dir einen Link.', [['jag', 'ich'], ['skickar', 'schicke'], ['en', 'einen'], ['länk', 'Link'], ['till', 'zu'], ['dig', 'dir']], ['c-tk-lank']),
  s('s-tk-lank3', 'Vänta, jag skickar en länk.', 'Warte, ich schicke einen Link.', [['vänta', 'warte'], ['jag', 'ich'], ['skickar', 'schicke'], ['en', 'einen'], ['länk', 'Link']], ['c-tk-lank']),
  s('s-tk-hang1', 'Den har hängt sig.', 'Er ist abgestürzt.', [['den', 'er'], ['har', 'hat'], ['hängt', 'gehängt'], ['sig', 'sich']], ['c-tk-hangt']),
  s('s-tk-hang2', 'Datorn igen — den har hängt sig.', 'Der Rechner wieder — er ist abgestürzt.', [['datorn', 'der Rechner'], ['igen', 'wieder'], ['den', 'er'], ['har', 'hat'], ['hängt', 'gehängt'], ['sig', 'sich']], ['c-tk-hangt']),
  s('s-tk-hang3', 'Den har hängt sig. Starta om den.', 'Er ist abgestürzt. Starte ihn neu.', [['den', 'er'], ['har', 'hat'], ['hängt', 'gehängt'], ['sig', 'sich'], ['starta', 'starte'], ['om', 'um'], ['den', 'ihn']], ['c-tk-hangt', 'c-tk-starta']),
  s('s-tk-start1', 'Starta om den.', 'Starte ihn neu.', [['starta', 'starte'], ['om', 'um'], ['den', 'ihn']], ['c-tk-starta']),
  s('s-tk-start2', 'Starta om den, det brukar hjälpa.', 'Starte ihn neu, das hilft meistens.', [['starta', 'starte'], ['om', 'um'], ['den', 'ihn'], ['det', 'das'], ['brukar', 'pflegt'], ['hjälpa', 'helfen']], ['c-tk-starta']),

  // Kochen
  s('s-ko-laga1', 'Vad ska vi laga?', 'Was sollen wir kochen?', [['vad', 'was'], ['ska', 'sollen'], ['vi', 'wir'], ['laga', 'zubereiten']], ['c-ko-laga']),
  s('s-ko-laga2', 'Vad ska vi laga i kväll?', 'Was sollen wir heute Abend kochen?', [['vad', 'was'], ['ska', 'sollen'], ['vi', 'wir'], ['laga', 'zubereiten'], ['i', 'am'], ['kväll', 'Abend']], ['c-ko-laga']),
  s('s-ko-laga3', 'Jag är hungrig. Vad ska vi laga?', 'Ich habe Hunger. Was sollen wir kochen?', [['jag', 'ich'], ['är', 'bin'], ['hungrig', 'hungrig'], ['vad', 'was'], ['ska', 'sollen'], ['vi', 'wir'], ['laga', 'zubereiten']], ['c-ko-laga']),
  s('s-ko-rec1', 'Jag följer ett recept.', 'Ich folge einem Rezept.', [['jag', 'ich'], ['följer', 'folge'], ['ett', 'einem'], ['recept', 'Rezept']], ['c-ko-recept']),
  s('s-ko-rec2', 'Jag följer ett recept från min mormor.', 'Ich folge einem Rezept von meiner Oma.', [['jag', 'ich'], ['följer', 'folge'], ['ett', 'einem'], ['recept', 'Rezept'], ['från', 'von'], ['min', 'meiner'], ['mormor', 'Oma']], ['c-ko-recept']),
  s('s-ko-rec3', 'Jag följer ett recept, så det tar lite tid.', 'Ich folge einem Rezept, also dauert es etwas.', [['jag', 'ich'], ['följer', 'folge'], ['ett', 'einem'], ['recept', 'Rezept'], ['så', 'so'], ['det', 'es'], ['tar', 'nimmt'], ['lite', 'wenig'], ['tid', 'Zeit']], ['c-ko-recept']),
  s('s-ko-koka1', 'Det ska koka i tio minuter.', 'Es soll zehn Minuten kochen.', [['det', 'es'], ['ska', 'soll'], ['koka', 'kochen'], ['i', 'in'], ['tio', 'zehn'], ['minuter', 'Minuten']], ['c-ko-koka']),
  s('s-ko-koka2', 'Det ska koka i tio minuter, inte längre.', 'Es soll zehn Minuten kochen, nicht länger.', [['det', 'es'], ['ska', 'soll'], ['koka', 'kochen'], ['i', 'in'], ['tio', 'zehn'], ['minuter', 'Minuten'], ['inte', 'nicht'], ['längre', 'länger']], ['c-ko-koka']),
  s('s-ko-salt1', 'Salta lite mer.', 'Salz etwas mehr.', [['salta', 'salze'], ['lite', 'wenig'], ['mer', 'mehr']], ['c-ko-salta']),
  s('s-ko-salt2', 'Salta lite mer, det smakar tunt.', 'Salz etwas mehr, es schmeckt fad.', [['salta', 'salze'], ['lite', 'wenig'], ['mer', 'mehr'], ['det', 'es'], ['smakar', 'schmeckt'], ['tunt', 'dünn']], ['c-ko-salta']),
  s('s-ko-salt3', 'Smakar det bra? Salta lite mer.', 'Schmeckt es gut? Salz etwas mehr.', [['smakar', 'schmeckt'], ['det', 'es'], ['bra', 'gut'], ['salta', 'salze'], ['lite', 'wenig'], ['mer', 'mehr']], ['c-ko-salta', 'c-ko-smakar']),
  s('s-ko-stek1', 'Har du en stekpanna?', 'Hast du eine Pfanne?', [['har', 'hast'], ['du', 'du'], ['en', 'eine'], ['stekpanna', 'Bratpfanne']], ['c-ko-stekpanna']),
  s('s-ko-stek2', 'Har du en stekpanna? Den stora, tack.', 'Hast du eine Pfanne? Die große, bitte.', [['har', 'hast'], ['du', 'du'], ['en', 'eine'], ['stekpanna', 'Bratpfanne'], ['den', 'die'], ['stora', 'große'], ['tack', 'bitte']], ['c-ko-stekpanna']),
  s('s-ko-ugn1', 'Sätt på ugnen.', 'Schalte den Ofen an.', [['sätt', 'setze'], ['på', 'auf'], ['ugnen', 'den Ofen']], ['c-ko-ugnen']),
  s('s-ko-ugn2', 'Sätt på ugnen på tvåhundra grader.', 'Schalte den Ofen auf zweihundert Grad an.', [['sätt', 'setze'], ['på', 'auf'], ['ugnen', 'den Ofen'], ['på', 'auf'], ['tvåhundra', 'zweihundert'], ['grader', 'Grad']], ['c-ko-ugnen']),
  s('s-ko-ugn3', 'Sätt på ugnen först, sedan lagar vi.', 'Schalte erst den Ofen an, dann kochen wir.', [['sätt', 'setze'], ['på', 'auf'], ['ugnen', 'den Ofen'], ['först', 'erst'], ['sedan', 'dann'], ['lagar', 'bereiten zu'], ['vi', 'wir']], ['c-ko-ugnen']),
  s('s-ko-smak1', 'Smakar det bra?', 'Schmeckt es gut?', [['smakar', 'schmeckt'], ['det', 'es'], ['bra', 'gut']], ['c-ko-smakar']),
  s('s-ko-smak2', 'Smakar det bra, eller saknas något?', 'Schmeckt es gut, oder fehlt etwas?', [['smakar', 'schmeckt'], ['det', 'es'], ['bra', 'gut'], ['eller', 'oder'], ['saknas', 'fehlt'], ['något', 'etwas']], ['c-ko-smakar']),

  // Friseur
  s('s-fr-klipp1', 'Jag vill klippa mig.', 'Ich möchte mir die Haare schneiden lassen.', [['jag', 'ich'], ['vill', 'will'], ['klippa', 'schneiden'], ['mig', 'mich']], ['c-fr-klippa']),
  s('s-fr-klipp2', 'Hej, jag vill klippa mig.', 'Hallo, ich möchte mir die Haare schneiden lassen.', [['hej', 'hallo'], ['jag', 'ich'], ['vill', 'will'], ['klippa', 'schneiden'], ['mig', 'mich']], ['c-fr-klippa']),
  s('s-fr-klipp3', 'Jag vill klippa mig, bara lite kortare.', 'Ich möchte mir die Haare schneiden lassen, nur ein bisschen kürzer.', [['jag', 'ich'], ['vill', 'will'], ['klippa', 'schneiden'], ['mig', 'mich'], ['bara', 'nur'], ['lite', 'wenig'], ['kortare', 'kürzer']], ['c-fr-klippa', 'c-fr-kortare']),
  s('s-fr-kort1', 'Bara lite kortare.', 'Nur ein bisschen kürzer.', [['bara', 'nur'], ['lite', 'wenig'], ['kortare', 'kürzer']], ['c-fr-kortare']),
  s('s-fr-kort2', 'Bara lite kortare i nacken.', 'Nur ein bisschen kürzer im Nacken.', [['bara', 'nur'], ['lite', 'wenig'], ['kortare', 'kürzer'], ['i', 'im'], ['nacken', 'Nacken']], ['c-fr-kortare']),
  s('s-fr-fork1', 'Inte för kort.', 'Nicht zu kurz.', [['inte', 'nicht'], ['för', 'zu'], ['kort', 'kurz']], ['c-fr-forkort']),
  s('s-fr-fork2', 'Inte för kort, tack.', 'Nicht zu kurz, bitte.', [['inte', 'nicht'], ['för', 'zu'], ['kort', 'kurz'], ['tack', 'bitte']], ['c-fr-forkort']),
  s('s-fr-fork3', 'Bara lite kortare, inte för kort.', 'Nur ein bisschen kürzer, nicht zu kurz.', [['bara', 'nur'], ['lite', 'wenig'], ['kortare', 'kürzer'], ['inte', 'nicht'], ['för', 'zu'], ['kort', 'kurz']], ['c-fr-forkort']),
  s('s-fr-tid1', 'Har ni en tid idag?', 'Habt ihr heute einen Termin?', [['har', 'habt'], ['ni', 'ihr'], ['en', 'einen'], ['tid', 'Termin'], ['idag', 'heute']], ['c-fr-tid']),
  s('s-fr-tid2', 'Har ni en tid idag eller i morgon?', 'Habt ihr heute oder morgen einen Termin?', [['har', 'habt'], ['ni', 'ihr'], ['en', 'einen'], ['tid', 'Termin'], ['idag', 'heute'], ['eller', 'oder'], ['i', 'am'], ['morgon', 'Morgen']], ['c-fr-tid']),
  s('s-fr-tid3', 'Hej! Har ni en tid idag?', 'Hallo! Habt ihr heute einen Termin?', [['hej', 'hallo'], ['har', 'habt'], ['ni', 'ihr'], ['en', 'einen'], ['tid', 'Termin'], ['idag', 'heute']], ['c-fr-tid']),
  s('s-fr-lugg1', 'Jag vill ha lugg.', 'Ich möchte einen Pony.', [['jag', 'ich'], ['vill', 'will'], ['ha', 'haben'], ['lugg', 'Pony']], ['c-fr-lugg']),
  s('s-fr-lugg2', 'Jag vill ha lugg, men inte för kort.', 'Ich möchte einen Pony, aber nicht zu kurz.', [['jag', 'ich'], ['vill', 'will'], ['ha', 'haben'], ['lugg', 'Pony'], ['men', 'aber'], ['inte', 'nicht'], ['för', 'zu'], ['kort', 'kurz']], ['c-fr-lugg']),
  s('s-fr-sad1', 'Så där, tack.', 'So ist gut, danke.', [['så', 'so'], ['där', 'dort'], ['tack', 'danke']], ['c-fr-sadar']),
  s('s-fr-sad2', 'Perfekt. Så där, tack.', 'Perfekt. So ist gut, danke.', [['perfekt', 'perfekt'], ['så', 'so'], ['där', 'dort'], ['tack', 'danke']], ['c-fr-sadar']),
];
