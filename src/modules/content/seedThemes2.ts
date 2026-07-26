// Ausbau 2 (2026-07-26): Haustiere, Camping & Allemansrätten, Musik, Nachbarn.
//
// „Allemansrätten" steht bewusst drin: Wer in Schweden draußen unterwegs ist,
// stolpert über dieses Wort am ersten Tag — und es hat im Deutschen kein
// Gegenstück, das man einfach einsetzen könnte.

import type { Category, Chunk, Segment } from '../../domain/chunk';

export const categories: Category[] = [
  {
    id: 'cat-pets',
    areaId: 'area-people',
    title: 'Haustiere',
    blurb: 'Hund, Katze, und die Fragen, die im Treppenhaus dazu fallen.',
    order: 11,
    cefr: 'A2',
  },
  {
    id: 'cat-camping',
    areaId: 'area-outdoors',
    title: 'Zelten & Allemansrätten',
    blurb: 'Draußen übernachten — und das schwedische Recht, das das erlaubt.',
    order: 6,
    cefr: 'B1',
  },
  {
    id: 'cat-music',
    areaId: 'area-friends',
    title: 'Musik & Konzerte',
    blurb: 'Was du hörst, was du spielst, und wann es losgeht.',
    order: 8,
    cefr: 'B1',
  },
  {
    id: 'cat-neighbours',
    areaId: 'area-people',
    title: 'Nachbarn & Hausordnung',
    blurb: 'Waschküche, Müll, Lautstärke: das Zusammenleben im Haus.',
    order: 12,
    cefr: 'A2',
  },
];

const c = (id: string, categoryId: string, sv: string, de: string, d: [string, string][]): Chunk => ({
  id, categoryId, sv, de, decoding: d.map(([a, b]) => ({ sv: a, de: b })),
});
const s = (id: string, sv: string, de: string, d: [string, string][], chunkIds: string[]): Segment => ({
  id, level: 2, sv, de, decoding: d.map(([a, b]) => ({ sv: a, de: b })), chunkIds,
});

export const chunks: Chunk[] = [
  // ── Haustiere ─────────────────────────────────────────────────────────────
  c('c-pe-husdjur', 'cat-pets', 'har du husdjur?', 'hast du Haustiere?', [['har', 'hast'], ['du', 'du'], ['husdjur', 'Haustiere']]),
  c('c-pe-hund', 'cat-pets', 'jag har en hund', 'ich habe einen Hund', [['jag', 'ich'], ['har', 'habe'], ['en', 'einen'], ['hund', 'Hund']]),
  c('c-pe-katten', 'cat-pets', 'katten är inne', 'die Katze ist drinnen', [['katten', 'die Katze'], ['är', 'ist'], ['inne', 'drinnen']]),
  c('c-pe-klappa', 'cat-pets', 'får jag klappa den?', 'darf ich ihn streicheln?', [['får', 'darf'], ['jag', 'ich'], ['klappa', 'streicheln'], ['den', 'ihn']]),
  c('c-pe-ut', 'cat-pets', 'hunden måste ut', 'der Hund muss raus', [['hunden', 'der Hund'], ['måste', 'muss'], ['ut', 'raus']]),
  c('c-pe-bits', 'cat-pets', 'den bits inte', 'er beißt nicht', [['den', 'er'], ['bits', 'beißt'], ['inte', 'nicht']]),
  c('c-pe-passar', 'cat-pets', 'vem passar katten?', 'wer schaut nach der Katze?', [['vem', 'wer'], ['passar', 'passt auf'], ['katten', 'die Katze']]),

  // ── Zelten & Allemansrätten ───────────────────────────────────────────────
  c('c-ca-talta', 'cat-camping', 'vi ska tälta i helgen', 'wir wollen am Wochenende zelten', [['vi', 'wir'], ['ska', 'sollen'], ['tälta', 'zelten'], ['i', 'am'], ['helgen', 'Wochenende']]),
  c('c-ca-farman', 'cat-camping', 'här får man tälta', 'hier darf man zelten', [['här', 'hier'], ['får', 'darf'], ['man', 'man'], ['tälta', 'zelten']]),
  c('c-ca-allemans', 'cat-camping', 'allemansrätten gäller här', 'das Jedermannsrecht gilt hier', [['allemansrätten', 'das Jedermannsrecht'], ['gäller', 'gilt'], ['här', 'hier']]),
  c('c-ca-vatten', 'cat-camping', 'vi behöver vatten', 'wir brauchen Wasser', [['vi', 'wir'], ['behöver', 'brauchen'], ['vatten', 'Wasser']]),
  c('c-ca-elden', 'cat-camping', 'elden måste släckas', 'das Feuer muss gelöscht werden', [['elden', 'das Feuer'], ['måste', 'muss'], ['släckas', 'gelöscht werden']]),
  c('c-ca-kallt', 'cat-camping', 'det blir kallt i natt', 'es wird heute Nacht kalt', [['det', 'es'], ['blir', 'wird'], ['kallt', 'kalt'], ['i', 'in'], ['natt', 'Nacht']]),
  c('c-ca-skrap', 'cat-camping', 'vi tar med skräpet hem', 'wir nehmen den Müll mit nach Hause', [['vi', 'wir'], ['tar', 'nehmen'], ['med', 'mit'], ['skräpet', 'den Abfall'], ['hem', 'heim']]),

  // ── Musik & Konzerte ──────────────────────────────────────────────────────
  c('c-mu-gillar', 'cat-music', 'vilken musik gillar du?', 'welche Musik magst du?', [['vilken', 'welche'], ['musik', 'Musik'], ['gillar', 'magst'], ['du', 'du']]),
  c('c-mu-gitarr', 'cat-music', 'jag spelar gitarr', 'ich spiele Gitarre', [['jag', 'ich'], ['spelar', 'spiele'], ['gitarr', 'Gitarre']]),
  c('c-mu-borjar', 'cat-music', 'konserten börjar åtta', 'das Konzert beginnt um acht', [['konserten', 'das Konzert'], ['börjar', 'beginnt'], ['åtta', 'acht']]),
  c('c-mu-biljetter', 'cat-music', 'har du biljetterna?', 'hast du die Karten?', [['har', 'hast'], ['du', 'du'], ['biljetterna', 'die Karten']]),
  c('c-mu-bandet', 'cat-music', 'bandet är jättebra', 'die Band ist super', [['bandet', 'die Band'], ['är', 'ist'], ['jättebra', 'super']]),
  c('c-mu-sjunga', 'cat-music', 'kan du sjunga med?', 'kannst du mitsingen?', [['kan', 'kannst'], ['du', 'du'], ['sjunga', 'singen'], ['med', 'mit']]),
  c('c-mu-fram', 'cat-music', 'vi står långt fram', 'wir stehen weit vorne', [['vi', 'wir'], ['står', 'stehen'], ['långt', 'weit'], ['fram', 'vorne']]),

  // ── Nachbarn & Hausordnung ────────────────────────────────────────────────
  c('c-na-vaning', 'cat-neighbours', 'jag bor på tredje våningen', 'ich wohne im dritten Stock', [['jag', 'ich'], ['bor', 'wohne'], ['på', 'auf'], ['tredje', 'dritten'], ['våningen', 'der Etage']]),
  c('c-na-volym', 'cat-neighbours', 'kan du sänka volymen?', 'kannst du leiser machen?', [['kan', 'kannst'], ['du', 'du'], ['sänka', 'senken'], ['volymen', 'die Lautstärke']]),
  c('c-na-tvattstuga', 'cat-neighbours', 'tvättstugan är bokad', 'die Waschküche ist gebucht', [['tvättstugan', 'die Waschküche'], ['är', 'ist'], ['bokad', 'gebucht']]),
  c('c-na-sopor', 'cat-neighbours', 'soporna töms på fredag', 'der Müll wird freitags geleert', [['soporna', 'der Müll'], ['töms', 'wird geleert'], ['på', 'am'], ['fredag', 'Freitag']]),
  c('c-na-staddag', 'cat-neighbours', 'vi har städdag på lördag', 'wir haben Putztag am Samstag', [['vi', 'wir'], ['har', 'haben'], ['städdag', 'Putztag'], ['på', 'am'], ['lördag', 'Samstag']]),
  c('c-na-grannen', 'cat-neighbours', 'grannen klagade', 'der Nachbar hat sich beschwert', [['grannen', 'der Nachbar'], ['klagade', 'klagte']]),
  c('c-na-lana', 'cat-neighbours', 'får jag låna en borrmaskin?', 'darf ich eine Bohrmaschine leihen?', [['får', 'darf'], ['jag', 'ich'], ['låna', 'leihen'], ['en', 'eine'], ['borrmaskin', 'Bohrmaschine']]),
];

export const segments: Segment[] = [
  // Haustiere
  s('s-pe-hus1', 'Har du husdjur?', 'Hast du Haustiere?', [['har', 'hast'], ['du', 'du'], ['husdjur', 'Haustiere']], ['c-pe-husdjur']),
  s('s-pe-hus2', 'Har du husdjur hemma?', 'Hast du Haustiere daheim?', [['har', 'hast'], ['du', 'du'], ['husdjur', 'Haustiere'], ['hemma', 'daheim']], ['c-pe-husdjur']),
  s('s-pe-hus3', 'Har du husdjur? Jag har en hund.', 'Hast du Haustiere? Ich habe einen Hund.', [['har', 'hast'], ['du', 'du'], ['husdjur', 'Haustiere'], ['jag', 'ich'], ['har', 'habe'], ['en', 'einen'], ['hund', 'Hund']], ['c-pe-husdjur', 'c-pe-hund']),
  s('s-pe-hund1', 'Jag har en hund.', 'Ich habe einen Hund.', [['jag', 'ich'], ['har', 'habe'], ['en', 'einen'], ['hund', 'Hund']], ['c-pe-hund']),
  s('s-pe-hund2', 'Jag har en hund som heter Bosse.', 'Ich habe einen Hund, der Bosse heißt.', [['jag', 'ich'], ['har', 'habe'], ['en', 'einen'], ['hund', 'Hund'], ['som', 'der'], ['heter', 'heißt'], ['bosse', 'Bosse']], ['c-pe-hund']),
  s('s-pe-katt1', 'Katten är inne.', 'Die Katze ist drinnen.', [['katten', 'die Katze'], ['är', 'ist'], ['inne', 'drinnen']], ['c-pe-katten']),
  s('s-pe-katt2', 'Katten är inne, det regnar ute.', 'Die Katze ist drinnen, draußen regnet es.', [['katten', 'die Katze'], ['är', 'ist'], ['inne', 'drinnen'], ['det', 'es'], ['regnar', 'regnet'], ['ute', 'draußen']], ['c-pe-katten']),
  s('s-pe-katt3', 'Är katten inne? Ja, katten är inne.', 'Ist die Katze drinnen? Ja, die Katze ist drinnen.', [['är', 'ist'], ['katten', 'die Katze'], ['inne', 'drinnen'], ['ja', 'ja'], ['katten', 'die Katze'], ['är', 'ist'], ['inne', 'drinnen']], ['c-pe-katten']),
  s('s-pe-klapp1', 'Får jag klappa den?', 'Darf ich ihn streicheln?', [['får', 'darf'], ['jag', 'ich'], ['klappa', 'streicheln'], ['den', 'ihn']], ['c-pe-klappa']),
  s('s-pe-klapp2', 'Vilken fin hund! Får jag klappa den?', 'Was für ein schöner Hund! Darf ich ihn streicheln?', [['vilken', 'welch'], ['fin', 'schöner'], ['hund', 'Hund'], ['får', 'darf'], ['jag', 'ich'], ['klappa', 'streicheln'], ['den', 'ihn']], ['c-pe-klappa']),
  s('s-pe-klapp3', 'Får jag klappa den? Den bits inte, va?', 'Darf ich ihn streicheln? Er beißt nicht, oder?', [['får', 'darf'], ['jag', 'ich'], ['klappa', 'streicheln'], ['den', 'ihn'], ['den', 'er'], ['bits', 'beißt'], ['inte', 'nicht'], ['va', 'was']], ['c-pe-klappa', 'c-pe-bits']),
  s('s-pe-ut1', 'Hunden måste ut.', 'Der Hund muss raus.', [['hunden', 'der Hund'], ['måste', 'muss'], ['ut', 'raus']], ['c-pe-ut']),
  s('s-pe-ut2', 'Hunden måste ut, jag går en runda.', 'Der Hund muss raus, ich gehe eine Runde.', [['hunden', 'der Hund'], ['måste', 'muss'], ['ut', 'raus'], ['jag', 'ich'], ['går', 'gehe'], ['en', 'eine'], ['runda', 'Runde']], ['c-pe-ut']),
  s('s-pe-bits1', 'Den bits inte.', 'Er beißt nicht.', [['den', 'er'], ['bits', 'beißt'], ['inte', 'nicht']], ['c-pe-bits']),
  s('s-pe-bits2', 'Var lugn, den bits inte.', 'Sei ruhig, er beißt nicht.', [['var', 'sei'], ['lugn', 'ruhig'], ['den', 'er'], ['bits', 'beißt'], ['inte', 'nicht']], ['c-pe-bits']),
  s('s-pe-pass1', 'Vem passar katten?', 'Wer schaut nach der Katze?', [['vem', 'wer'], ['passar', 'passt auf'], ['katten', 'die Katze']], ['c-pe-passar']),
  s('s-pe-pass2', 'Vi reser bort. Vem passar katten?', 'Wir verreisen. Wer schaut nach der Katze?', [['vi', 'wir'], ['reser', 'reisen'], ['bort', 'weg'], ['vem', 'wer'], ['passar', 'passt auf'], ['katten', 'die Katze']], ['c-pe-passar']),
  s('s-pe-pass3', 'Vem passar katten i helgen?', 'Wer schaut am Wochenende nach der Katze?', [['vem', 'wer'], ['passar', 'passt auf'], ['katten', 'die Katze'], ['i', 'am'], ['helgen', 'Wochenende']], ['c-pe-passar']),

  // Camping
  s('s-ca-talt1', 'Vi ska tälta i helgen.', 'Wir wollen am Wochenende zelten.', [['vi', 'wir'], ['ska', 'sollen'], ['tälta', 'zelten'], ['i', 'am'], ['helgen', 'Wochenende']], ['c-ca-talta']),
  s('s-ca-talt2', 'Vi ska tälta i helgen, vid sjön.', 'Wir wollen am Wochenende zelten, am See.', [['vi', 'wir'], ['ska', 'sollen'], ['tälta', 'zelten'], ['i', 'am'], ['helgen', 'Wochenende'], ['vid', 'bei'], ['sjön', 'dem See']], ['c-ca-talta']),
  s('s-ca-far1', 'Här får man tälta.', 'Hier darf man zelten.', [['här', 'hier'], ['får', 'darf'], ['man', 'man'], ['tälta', 'zelten']], ['c-ca-farman']),
  s('s-ca-far2', 'Här får man tälta en natt.', 'Hier darf man eine Nacht zelten.', [['här', 'hier'], ['får', 'darf'], ['man', 'man'], ['tälta', 'zelten'], ['en', 'eine'], ['natt', 'Nacht']], ['c-ca-farman']),
  s('s-ca-far3', 'Här får man tälta — allemansrätten gäller här.', 'Hier darf man zelten — das Jedermannsrecht gilt hier.', [['här', 'hier'], ['får', 'darf'], ['man', 'man'], ['tälta', 'zelten'], ['allemansrätten', 'das Jedermannsrecht'], ['gäller', 'gilt'], ['här', 'hier']], ['c-ca-farman', 'c-ca-allemans']),
  s('s-ca-alle1', 'Allemansrätten gäller här.', 'Das Jedermannsrecht gilt hier.', [['allemansrätten', 'das Jedermannsrecht'], ['gäller', 'gilt'], ['här', 'hier']], ['c-ca-allemans']),
  s('s-ca-alle2', 'Allemansrätten gäller här, men var försiktig.', 'Das Jedermannsrecht gilt hier, aber sei vorsichtig.', [['allemansrätten', 'das Jedermannsrecht'], ['gäller', 'gilt'], ['här', 'hier'], ['men', 'aber'], ['var', 'sei'], ['försiktig', 'vorsichtig']], ['c-ca-allemans']),
  s('s-ca-vat1', 'Vi behöver vatten.', 'Wir brauchen Wasser.', [['vi', 'wir'], ['behöver', 'brauchen'], ['vatten', 'Wasser']], ['c-ca-vatten']),
  s('s-ca-vat2', 'Vi behöver vatten innan vi går vidare.', 'Wir brauchen Wasser, bevor wir weitergehen.', [['vi', 'wir'], ['behöver', 'brauchen'], ['vatten', 'Wasser'], ['innan', 'bevor'], ['vi', 'wir'], ['går', 'gehen'], ['vidare', 'weiter']], ['c-ca-vatten']),
  s('s-ca-eld1', 'Elden måste släckas.', 'Das Feuer muss gelöscht werden.', [['elden', 'das Feuer'], ['måste', 'muss'], ['släckas', 'gelöscht werden']], ['c-ca-elden']),
  s('s-ca-eld2', 'Elden måste släckas innan vi sover.', 'Das Feuer muss gelöscht werden, bevor wir schlafen.', [['elden', 'das Feuer'], ['måste', 'muss'], ['släckas', 'gelöscht werden'], ['innan', 'bevor'], ['vi', 'wir'], ['sover', 'schlafen']], ['c-ca-elden']),
  s('s-ca-eld3', 'Elden måste släckas — det är torrt i skogen.', 'Das Feuer muss gelöscht werden — im Wald ist es trocken.', [['elden', 'das Feuer'], ['måste', 'muss'], ['släckas', 'gelöscht werden'], ['det', 'es'], ['är', 'ist'], ['torrt', 'trocken'], ['i', 'in'], ['skogen', 'dem Wald']], ['c-ca-elden']),
  s('s-ca-kall1', 'Det blir kallt i natt.', 'Es wird heute Nacht kalt.', [['det', 'es'], ['blir', 'wird'], ['kallt', 'kalt'], ['i', 'in'], ['natt', 'Nacht']], ['c-ca-kallt']),
  s('s-ca-kall2', 'Det blir kallt i natt, ta en till tröja.', 'Es wird heute Nacht kalt, nimm noch einen Pullover.', [['det', 'es'], ['blir', 'wird'], ['kallt', 'kalt'], ['i', 'in'], ['natt', 'Nacht'], ['ta', 'nimm'], ['en', 'einen'], ['till', 'noch'], ['tröja', 'Pullover']], ['c-ca-kallt']),
  s('s-ca-skr1', 'Vi tar med skräpet hem.', 'Wir nehmen den Müll mit nach Hause.', [['vi', 'wir'], ['tar', 'nehmen'], ['med', 'mit'], ['skräpet', 'den Abfall'], ['hem', 'heim']], ['c-ca-skrap']),
  s('s-ca-skr2', 'Vi tar med skräpet hem, inget lämnas kvar.', 'Wir nehmen den Müll mit nach Hause, nichts bleibt zurück.', [['vi', 'wir'], ['tar', 'nehmen'], ['med', 'mit'], ['skräpet', 'den Abfall'], ['hem', 'heim'], ['inget', 'nichts'], ['lämnas', 'gelassen'], ['kvar', 'zurück']], ['c-ca-skrap']),

  // Musik
  s('s-mu-gil1', 'Vilken musik gillar du?', 'Welche Musik magst du?', [['vilken', 'welche'], ['musik', 'Musik'], ['gillar', 'magst'], ['du', 'du']], ['c-mu-gillar']),
  s('s-mu-gil2', 'Vilken musik gillar du helst?', 'Welche Musik magst du am liebsten?', [['vilken', 'welche'], ['musik', 'Musik'], ['gillar', 'magst'], ['du', 'du'], ['helst', 'am liebsten']], ['c-mu-gillar']),
  s('s-mu-gil3', 'Vilken musik gillar du? Jag spelar gitarr själv.', 'Welche Musik magst du? Ich spiele selbst Gitarre.', [['vilken', 'welche'], ['musik', 'Musik'], ['gillar', 'magst'], ['du', 'du'], ['jag', 'ich'], ['spelar', 'spiele'], ['gitarr', 'Gitarre'], ['själv', 'selbst']], ['c-mu-gillar', 'c-mu-gitarr']),
  s('s-mu-git1', 'Jag spelar gitarr.', 'Ich spiele Gitarre.', [['jag', 'ich'], ['spelar', 'spiele'], ['gitarr', 'Gitarre']], ['c-mu-gitarr']),
  s('s-mu-git2', 'Jag spelar gitarr sedan jag var tolv.', 'Ich spiele Gitarre, seit ich zwölf war.', [['jag', 'ich'], ['spelar', 'spiele'], ['gitarr', 'Gitarre'], ['sedan', 'seit'], ['jag', 'ich'], ['var', 'war'], ['tolv', 'zwölf']], ['c-mu-gitarr']),
  s('s-mu-bor1', 'Konserten börjar åtta.', 'Das Konzert beginnt um acht.', [['konserten', 'das Konzert'], ['börjar', 'beginnt'], ['åtta', 'acht']], ['c-mu-borjar']),
  s('s-mu-bor2', 'Konserten börjar åtta, vi ses kvart i.', 'Das Konzert beginnt um acht, wir sehen uns Viertel vor.', [['konserten', 'das Konzert'], ['börjar', 'beginnt'], ['åtta', 'acht'], ['vi', 'wir'], ['ses', 'sehen uns'], ['kvart', 'Viertel'], ['i', 'in']], ['c-mu-borjar']),
  s('s-mu-bil1', 'Har du biljetterna?', 'Hast du die Karten?', [['har', 'hast'], ['du', 'du'], ['biljetterna', 'die Karten']], ['c-mu-biljetter']),
  s('s-mu-bil2', 'Har du biljetterna i telefonen?', 'Hast du die Karten im Telefon?', [['har', 'hast'], ['du', 'du'], ['biljetterna', 'die Karten'], ['i', 'im'], ['telefonen', 'dem Telefon']], ['c-mu-biljetter']),
  s('s-mu-bil3', 'Har du biljetterna? Konserten börjar åtta.', 'Hast du die Karten? Das Konzert beginnt um acht.', [['har', 'hast'], ['du', 'du'], ['biljetterna', 'die Karten'], ['konserten', 'das Konzert'], ['börjar', 'beginnt'], ['åtta', 'acht']], ['c-mu-biljetter', 'c-mu-borjar']),
  s('s-mu-band1', 'Bandet är jättebra.', 'Die Band ist super.', [['bandet', 'die Band'], ['är', 'ist'], ['jättebra', 'super']], ['c-mu-bandet']),
  s('s-mu-band2', 'Bandet är jättebra live.', 'Die Band ist live super.', [['bandet', 'die Band'], ['är', 'ist'], ['jättebra', 'super'], ['live', 'live']], ['c-mu-bandet']),
  s('s-mu-sju1', 'Kan du sjunga med?', 'Kannst du mitsingen?', [['kan', 'kannst'], ['du', 'du'], ['sjunga', 'singen'], ['med', 'mit']], ['c-mu-sjunga']),
  s('s-mu-sju2', 'Alla kan texten. Kan du sjunga med?', 'Alle können den Text. Kannst du mitsingen?', [['alla', 'alle'], ['kan', 'können'], ['texten', 'den Text'], ['kan', 'kannst'], ['du', 'du'], ['sjunga', 'singen'], ['med', 'mit']], ['c-mu-sjunga']),
  s('s-mu-fram1', 'Vi står långt fram.', 'Wir stehen weit vorne.', [['vi', 'wir'], ['står', 'stehen'], ['långt', 'weit'], ['fram', 'vorne']], ['c-mu-fram']),
  s('s-mu-fram2', 'Vi står långt fram, man ser allt.', 'Wir stehen weit vorne, man sieht alles.', [['vi', 'wir'], ['står', 'stehen'], ['långt', 'weit'], ['fram', 'vorne'], ['man', 'man'], ['ser', 'sieht'], ['allt', 'alles']], ['c-mu-fram']),

  // Nachbarn
  s('s-na-van1', 'Jag bor på tredje våningen.', 'Ich wohne im dritten Stock.', [['jag', 'ich'], ['bor', 'wohne'], ['på', 'auf'], ['tredje', 'dritten'], ['våningen', 'der Etage']], ['c-na-vaning']),
  s('s-na-van2', 'Jag bor på tredje våningen, till vänster.', 'Ich wohne im dritten Stock, links.', [['jag', 'ich'], ['bor', 'wohne'], ['på', 'auf'], ['tredje', 'dritten'], ['våningen', 'der Etage'], ['till', 'zu'], ['vänster', 'links']], ['c-na-vaning']),
  s('s-na-vol1', 'Kan du sänka volymen?', 'Kannst du leiser machen?', [['kan', 'kannst'], ['du', 'du'], ['sänka', 'senken'], ['volymen', 'die Lautstärke']], ['c-na-volym']),
  s('s-na-vol2', 'Kan du sänka volymen lite? Barnen sover.', 'Kannst du etwas leiser machen? Die Kinder schlafen.', [['kan', 'kannst'], ['du', 'du'], ['sänka', 'senken'], ['volymen', 'die Lautstärke'], ['lite', 'wenig'], ['barnen', 'die Kinder'], ['sover', 'schlafen']], ['c-na-volym']),
  s('s-na-tva1', 'Tvättstugan är bokad.', 'Die Waschküche ist gebucht.', [['tvättstugan', 'die Waschküche'], ['är', 'ist'], ['bokad', 'gebucht']], ['c-na-tvattstuga']),
  s('s-na-tva2', 'Tvättstugan är bokad till klockan sex.', 'Die Waschküche ist bis sechs Uhr gebucht.', [['tvättstugan', 'die Waschküche'], ['är', 'ist'], ['bokad', 'gebucht'], ['till', 'zu'], ['klockan', 'die Uhr'], ['sex', 'sechs']], ['c-na-tvattstuga']),
  s('s-na-sop1', 'Soporna töms på fredag.', 'Der Müll wird freitags geleert.', [['soporna', 'der Müll'], ['töms', 'wird geleert'], ['på', 'am'], ['fredag', 'Freitag']], ['c-na-sopor']),
  s('s-na-sop2', 'Soporna töms på fredag, ställ ut dem ikväll.', 'Der Müll wird freitags geleert, stell ihn heute Abend raus.', [['soporna', 'der Müll'], ['töms', 'wird geleert'], ['på', 'am'], ['fredag', 'Freitag'], ['ställ', 'stelle'], ['ut', 'raus'], ['dem', 'sie'], ['ikväll', 'heute Abend']], ['c-na-sopor']),
  s('s-na-stad1', 'Vi har städdag på lördag.', 'Wir haben Putztag am Samstag.', [['vi', 'wir'], ['har', 'haben'], ['städdag', 'Putztag'], ['på', 'am'], ['lördag', 'Samstag']], ['c-na-staddag']),
  s('s-na-stad2', 'Vi har städdag på lördag, alla hjälper till.', 'Wir haben Putztag am Samstag, alle helfen mit.', [['vi', 'wir'], ['har', 'haben'], ['städdag', 'Putztag'], ['på', 'am'], ['lördag', 'Samstag'], ['alla', 'alle'], ['hjälper', 'helfen'], ['till', 'zu']], ['c-na-staddag']),
  s('s-na-gra1', 'Grannen klagade.', 'Der Nachbar hat sich beschwert.', [['grannen', 'der Nachbar'], ['klagade', 'klagte']], ['c-na-grannen']),
  s('s-na-gra2', 'Grannen klagade på musiken igen.', 'Der Nachbar hat sich wieder über die Musik beschwert.', [['grannen', 'der Nachbar'], ['klagade', 'klagte'], ['på', 'über'], ['musiken', 'die Musik'], ['igen', 'wieder']], ['c-na-grannen']),
  s('s-na-gra3', 'Grannen klagade — kan du sänka volymen?', 'Der Nachbar hat sich beschwert — kannst du leiser machen?', [['grannen', 'der Nachbar'], ['klagade', 'klagte'], ['kan', 'kannst'], ['du', 'du'], ['sänka', 'senken'], ['volymen', 'die Lautstärke']], ['c-na-grannen', 'c-na-volym']),
  s('s-na-lan1', 'Får jag låna en borrmaskin?', 'Darf ich eine Bohrmaschine leihen?', [['får', 'darf'], ['jag', 'ich'], ['låna', 'leihen'], ['en', 'eine'], ['borrmaskin', 'Bohrmaschine']], ['c-na-lana']),
  s('s-na-lan2', 'Får jag låna en borrmaskin en stund?', 'Darf ich eine Bohrmaschine kurz leihen?', [['får', 'darf'], ['jag', 'ich'], ['låna', 'leihen'], ['en', 'eine'], ['borrmaskin', 'Bohrmaschine'], ['en', 'eine'], ['stund', 'Weile']], ['c-na-lana']),
];
