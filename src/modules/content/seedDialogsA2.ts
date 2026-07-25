// GESPRÄCHE auf dem Meilenstein A2 — Alltag, den man allein erledigen muss.
//
// ⚠️ EHRLICH: von uns/der KI verfasst, NICHT muttersprachlich geprüft
// (docs/content-review-schwedisch.md).
//
// Jede „du"-Zeile ist WÖRTLICH ihr Chunk — sonst wäre der Abruf nicht prüfbar.

import type { Dialog } from '../../domain/dialog';

export const dialogs: Dialog[] = [
  // ── Bank & Geld ───────────────────────────────────────────────────────────
  {
    id: 'dlg-bank',
    categoryId: 'cat-bank',
    title: 'Auf der Bank',
    blurb: 'Konto eröffnen, Gebühren erfragen — und die Karte streikt.',
    scene: 'office',
    partnerName: 'Bankberater',
    turns: [
      { id: 'bk1', speaker: 'partner', sv: 'God morgon! Vad kan jag hjälpa till med?', de: 'Guten Morgen! Womit kann ich helfen?', listenFirst: true, decoding: [{ sv: 'god', de: 'guten' }, { sv: 'morgon', de: 'Morgen' }, { sv: 'vad', de: 'was' }, { sv: 'kan', de: 'kann' }, { sv: 'jag', de: 'ich' }, { sv: 'hjälpa', de: 'helfen' }, { sv: 'till', de: 'zu' }, { sv: 'med', de: 'mit' }] },
      { id: 'bk2', speaker: 'you', sv: 'jag vill öppna ett konto', de: 'ich möchte ein Konto eröffnen', chunkId: 'c-oppnakonto', suggestions: ['Jag vill öppna ett konto.', 'Jag vill överföra pengar.'] },
      { id: 'bk3', speaker: 'partner', sv: 'Gärna. Har du personnummer och legitimation?', de: 'Gern. Hast du Personennummer und Ausweis?', decoding: [{ sv: 'gärna', de: 'gern' }, { sv: 'har', de: 'hast' }, { sv: 'du', de: 'du' }, { sv: 'personnummer', de: 'Personennummer' }, { sv: 'och', de: 'und' }, { sv: 'legitimation', de: 'Ausweis' }] },
      { id: 'bk4', speaker: 'you', sv: 'vad kostar avgiften?', de: 'was kostet die Gebühr?', chunkId: 'c-vadkostaravgiften', suggestions: ['Vad kostar avgiften?', 'Vad kostar det?'] },
      { id: 'bk5', speaker: 'partner', sv: 'Kontot är gratis. Kortet kostar en liten summa per år.', de: 'Das Konto ist kostenlos. Die Karte kostet einen kleinen Betrag pro Jahr.', decoding: [{ sv: 'kontot', de: 'das Konto' }, { sv: 'är', de: 'ist' }, { sv: 'gratis', de: 'gratis' }, { sv: 'kortet', de: 'die Karte' }, { sv: 'kostar', de: 'kostet' }, { sv: 'en', de: 'eine' }, { sv: 'liten', de: 'kleine' }, { sv: 'summa', de: 'Summe' }, { sv: 'per', de: 'pro' }, { sv: 'år', de: 'Jahr' }] },
      { id: 'bk6', speaker: 'you', sv: 'jag behöver ta ut pengar', de: 'ich muss Geld abheben', chunkId: 'c-tautpengar', suggestions: ['Jag behöver ta ut pengar.', 'Kan jag växla pengar?'] },
      { id: 'bk7', speaker: 'partner', sv: 'Vi har ingen kassa här längre. Allt sköts med kort.', de: 'Wir haben hier keine Kasse mehr. Alles läuft mit Karte.', decoding: [{ sv: 'vi', de: 'wir' }, { sv: 'har', de: 'haben' }, { sv: 'ingen', de: 'keine' }, { sv: 'kassa', de: 'Kasse' }, { sv: 'här', de: 'hier' }, { sv: 'längre', de: 'länger' }, { sv: 'allt', de: 'alles' }, { sv: 'sköts', de: 'wird erledigt' }, { sv: 'med', de: 'mit' }, { sv: 'kort', de: 'Karte' }] },
      { id: 'bk8', speaker: 'you', sv: 'var finns en bankomat?', de: 'wo gibt es einen Geldautomaten?', chunkId: 'c-varbankomat', suggestions: ['Var finns en bankomat?', 'Var är kassan?'] },
      { id: 'bk9', speaker: 'partner', sv: 'Runt hörnet, till höger vid apoteket.', de: 'Um die Ecke, rechts bei der Apotheke.', decoding: [{ sv: 'runt', de: 'um' }, { sv: 'hörnet', de: 'die Ecke' }, { sv: 'till', de: 'zu' }, { sv: 'höger', de: 'rechts' }, { sv: 'vid', de: 'bei' }, { sv: 'apoteket', de: 'der Apotheke' }] },
      { id: 'bk10', speaker: 'you', sv: 'kortet fungerar inte', de: 'die Karte funktioniert nicht', chunkId: 'c-kortetfungerar', suggestions: ['Kortet fungerar inte.', 'Kan jag betala med kort?'] },
      { id: 'bk11', speaker: 'partner', sv: 'Konstigt. Prova igen och tryck in koden långsamt.', de: 'Seltsam. Versuch es noch mal und gib den Code langsam ein.', decoding: [{ sv: 'konstigt', de: 'seltsam' }, { sv: 'prova', de: 'probiere' }, { sv: 'igen', de: 'wieder' }, { sv: 'och', de: 'und' }, { sv: 'tryck', de: 'drücke' }, { sv: 'in', de: 'ein' }, { sv: 'koden', de: 'den Code' }, { sv: 'långsamt', de: 'langsam' }] },
      { id: 'bk12', speaker: 'you', sv: 'jag har glömt koden', de: 'ich habe den Code vergessen', chunkId: 'c-glomtkoden', suggestions: ['Jag har glömt koden.', 'Jag hittar inte min väska.'] },
    ],
  },

  // ── Post & Formulare ──────────────────────────────────────────────────────
  {
    id: 'dlg-post',
    categoryId: 'cat-post',
    title: 'Bei der Post',
    blurb: 'Paket abgeben und abholen, Formular ausfüllen, unterschreiben.',
    scene: 'shop',
    partnerName: 'Postangestellte',
    turns: [
      { id: 'po1', speaker: 'partner', sv: 'Hej! Nästa kund, varsågod.', de: 'Hallo! Nächster Kunde, bitte.', listenFirst: true, decoding: [{ sv: 'hej', de: 'hallo' }, { sv: 'nästa', de: 'nächster' }, { sv: 'kund', de: 'Kunde' }, { sv: 'varsågod', de: 'bitte' }] },
      { id: 'po2', speaker: 'you', sv: 'jag vill skicka ett paket', de: 'ich möchte ein Paket schicken', chunkId: 'c-skickapaket', suggestions: ['Jag vill skicka ett paket.', 'Jag ska hämta ett paket.'] },
      { id: 'po3', speaker: 'partner', sv: 'Lägg det på vågen. Vart ska det?', de: 'Leg es auf die Waage. Wohin soll es?', decoding: [{ sv: 'lägg', de: 'lege' }, { sv: 'det', de: 'es' }, { sv: 'på', de: 'auf' }, { sv: 'vågen', de: 'die Waage' }, { sv: 'vart', de: 'wohin' }, { sv: 'ska', de: 'soll' }, { sv: 'det', de: 'es' }] },
      { id: 'po4', speaker: 'you', sv: 'måste jag fylla i en blankett?', de: 'muss ich ein Formular ausfüllen?', chunkId: 'c-fyllaiblankett', suggestions: ['Måste jag fylla i en blankett?', 'Var ska jag skriva under?'] },
      { id: 'po5', speaker: 'partner', sv: 'Ja, en blankett för tullen. Fyll i namn och adress.', de: 'Ja, ein Formular für den Zoll. Trag Namen und Adresse ein.', decoding: [{ sv: 'ja', de: 'ja' }, { sv: 'en', de: 'ein' }, { sv: 'blankett', de: 'Formular' }, { sv: 'för', de: 'für' }, { sv: 'tullen', de: 'den Zoll' }, { sv: 'fyll', de: 'fülle' }, { sv: 'i', de: 'ein' }, { sv: 'namn', de: 'Name' }, { sv: 'och', de: 'und' }, { sv: 'adress', de: 'Adresse' }] },
      { id: 'po6', speaker: 'you', sv: 'var ska jag skriva under?', de: 'wo soll ich unterschreiben?', chunkId: 'c-skrivaunder', suggestions: ['Var ska jag skriva under?', 'Kan du skriva det?'] },
      { id: 'po7', speaker: 'partner', sv: 'Längst ner till höger, tack.', de: 'Ganz unten rechts, bitte.', decoding: [{ sv: 'längst', de: 'ganz' }, { sv: 'ner', de: 'unten' }, { sv: 'till', de: 'zu' }, { sv: 'höger', de: 'rechts' }, { sv: 'tack', de: 'bitte' }] },
      { id: 'po8', speaker: 'you', sv: 'när kommer brevet fram?', de: 'wann kommt der Brief an?', chunkId: 'c-narkommerbrevet', suggestions: ['När kommer brevet fram?', 'Hur lång tid tar det?'] },
      { id: 'po9', speaker: 'partner', sv: 'Inom en vecka, ofta snabbare än så.', de: 'Innerhalb einer Woche, oft schneller.', decoding: [{ sv: 'inom', de: 'innerhalb' }, { sv: 'en', de: 'einer' }, { sv: 'vecka', de: 'Woche' }, { sv: 'ofta', de: 'oft' }, { sv: 'snabbare', de: 'schneller' }, { sv: 'än', de: 'als' }, { sv: 'så', de: 'so' }] },
      { id: 'po10', speaker: 'you', sv: 'har ni frimärken?', de: 'habt ihr Briefmarken?', chunkId: 'c-harnifrimarken', suggestions: ['Har ni frimärken?', 'Har ni bröd?'] },
      { id: 'po11', speaker: 'partner', sv: 'Visst. Och du hade ett paket att hämta också, {name}.', de: 'Klar. Und du hattest auch ein Paket abzuholen, {name}.', decoding: [{ sv: 'visst', de: 'klar' }, { sv: 'och', de: 'und' }, { sv: 'du', de: 'du' }, { sv: 'hade', de: 'hattest' }, { sv: 'ett', de: 'ein' }, { sv: 'paket', de: 'Paket' }, { sv: 'att', de: 'zu' }, { sv: 'hämta', de: 'holen' }, { sv: 'också', de: 'auch' }] },
      { id: 'po12', speaker: 'you', sv: 'jag ska hämta ett paket', de: 'ich hole ein Paket ab', chunkId: 'c-hamtapaket', suggestions: ['Jag ska hämta ett paket.', 'Jag vill skicka ett paket.'] },
    ],
  },

  // ── Kleidung & Größen ─────────────────────────────────────────────────────
  {
    id: 'dlg-klader',
    categoryId: 'cat-clothes',
    title: 'Jacke anprobieren',
    blurb: 'Zu groß, andere Farbe, passt — und die Frage nach dem Umtausch.',
    scene: 'shop',
    partnerName: 'Verkäuferin',
    turns: [
      { id: 'kl1', speaker: 'partner', sv: 'Hej! Hittar du något du gillar?', de: 'Hallo! Findest du etwas, das dir gefällt?', listenFirst: true, decoding: [{ sv: 'hej', de: 'hallo' }, { sv: 'hittar', de: 'findest' }, { sv: 'du', de: 'du' }, { sv: 'något', de: 'etwas' }, { sv: 'du', de: 'du' }, { sv: 'gillar', de: 'magst' }] },
      { id: 'kl2', speaker: 'you', sv: 'den är för stor', de: 'das ist zu groß', chunkId: 'c-forstor', suggestions: ['Den är för stor.', 'Den är för liten.'] },
      { id: 'kl3', speaker: 'partner', sv: 'Jaså? Jackorna sitter ofta lite löst.', de: 'Ach so? Die Jacken sitzen oft etwas locker.', decoding: [{ sv: 'jaså', de: 'ach so' }, { sv: 'jackorna', de: 'die Jacken' }, { sv: 'sitter', de: 'sitzen' }, { sv: 'ofta', de: 'oft' }, { sv: 'lite', de: 'wenig' }, { sv: 'löst', de: 'locker' }] },
      { id: 'kl4', speaker: 'you', sv: 'har ni en mindre storlek?', de: 'habt ihr eine kleinere Größe?', chunkId: 'c-mindrestorlek', suggestions: ['Har ni en mindre storlek?', 'Vilken storlek?'] },
      { id: 'kl5', speaker: 'partner', sv: 'Jag tittar i lagret. Vi har den i svart och grönt.', de: 'Ich schaue im Lager. Wir haben sie in Schwarz und Grün.', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'tittar', de: 'schaue' }, { sv: 'i', de: 'in' }, { sv: 'lagret', de: 'dem Lager' }, { sv: 'vi', de: 'wir' }, { sv: 'har', de: 'haben' }, { sv: 'den', de: 'sie' }, { sv: 'i', de: 'in' }, { sv: 'svart', de: 'Schwarz' }, { sv: 'och', de: 'und' }, { sv: 'grönt', de: 'Grün' }] },
      { id: 'kl6', speaker: 'you', sv: 'har ni en annan färg?', de: 'habt ihr eine andere Farbe?', chunkId: 'c-annanfarg', suggestions: ['Har ni en annan färg?', 'Har ni den i blått?'] },
      { id: 'kl7', speaker: 'partner', sv: 'Blått kom in i går. Prova gärna den här.', de: 'Blau kam gestern rein. Probier gern diese hier.', decoding: [{ sv: 'blått', de: 'Blau' }, { sv: 'kom', de: 'kam' }, { sv: 'in', de: 'herein' }, { sv: 'i', de: 'am' }, { sv: 'går', de: 'gestern' }, { sv: 'prova', de: 'probiere' }, { sv: 'gärna', de: 'gern' }, { sv: 'den', de: 'die' }, { sv: 'här', de: 'hier' }] },
      { id: 'kl8', speaker: 'you', sv: 'den passar bra', de: 'das passt gut', chunkId: 'c-passarbra', suggestions: ['Den passar bra.', 'Jag tar den.'] },
      { id: 'kl9', speaker: 'partner', sv: 'Den klär dig faktiskt. Något mer i dag?', de: 'Sie steht dir wirklich. Sonst noch etwas heute?', decoding: [{ sv: 'den', de: 'sie' }, { sv: 'klär', de: 'kleidet' }, { sv: 'dig', de: 'dich' }, { sv: 'faktiskt', de: 'tatsächlich' }, { sv: 'något', de: 'etwas' }, { sv: 'mer', de: 'mehr' }, { sv: 'i', de: 'am' }, { sv: 'dag', de: 'Tag' }] },
      { id: 'kl10', speaker: 'you', sv: 'jag behöver ett par skor', de: 'ich brauche ein Paar Schuhe', chunkId: 'c-ettparskor', suggestions: ['Jag behöver ett par skor.', 'Jag tittar bara.'] },
      { id: 'kl11', speaker: 'partner', sv: 'Skorna står längst bak. Behåll kvittot, för säkerhets skull.', de: 'Die Schuhe stehen ganz hinten. Behalte den Bon, sicherheitshalber.', decoding: [{ sv: 'skorna', de: 'die Schuhe' }, { sv: 'står', de: 'stehen' }, { sv: 'längst', de: 'ganz' }, { sv: 'bak', de: 'hinten' }, { sv: 'behåll', de: 'behalte' }, { sv: 'kvittot', de: 'den Bon' }, { sv: 'för', de: 'für' }, { sv: 'säkerhets', de: 'Sicherheits' }, { sv: 'skull', de: 'wegen' }] },
      { id: 'kl12', speaker: 'you', sv: 'kan jag byta den?', de: 'kann ich das umtauschen?', chunkId: 'c-bytaden', suggestions: ['Kan jag byta den?', 'Kan jag få kvittot?'] },
    ],
  },

  // ── In der Apotheke ───────────────────────────────────────────────────────
  {
    id: 'dlg-apotek',
    categoryId: 'cat-pharmacy',
    title: 'In der Apotheke',
    blurb: 'Husten, Fieber, Dosierung — und die Frage nach dem Rezept.',
    scene: 'clinic',
    partnerName: 'Apothekerin',
    turns: [
      { id: 'ap1', speaker: 'partner', sv: 'Hej {name}, hur kan jag hjälpa dig?', de: 'Hallo {name}, wie kann ich dir helfen?', listenFirst: true, decoding: [{ sv: 'hej', de: 'hallo' }, { sv: 'hur', de: 'wie' }, { sv: 'kan', de: 'kann' }, { sv: 'jag', de: 'ich' }, { sv: 'hjälpa', de: 'helfen' }, { sv: 'dig', de: 'dir' }] },
      { id: 'ap2', speaker: 'you', sv: 'jag har hosta', de: 'ich habe Husten', chunkId: 'c-jagharhosta', suggestions: ['Jag har hosta.', 'Jag är sjuk.'] },
      { id: 'ap3', speaker: 'partner', sv: 'Har du haft det länge? Och sover du dåligt?', de: 'Hast du das lange? Und schläfst du schlecht?', decoding: [{ sv: 'har', de: 'hast' }, { sv: 'du', de: 'du' }, { sv: 'haft', de: 'gehabt' }, { sv: 'det', de: 'es' }, { sv: 'länge', de: 'lange' }, { sv: 'och', de: 'und' }, { sv: 'sover', de: 'schläfst' }, { sv: 'du', de: 'du' }, { sv: 'dåligt', de: 'schlecht' }] },
      { id: 'ap4', speaker: 'you', sv: 'har ni något mot feber?', de: 'habt ihr etwas gegen Fieber?', chunkId: 'c-motfeber', suggestions: ['Har ni något mot feber?', 'Har ni något sött?'] },
      { id: 'ap5', speaker: 'partner', sv: 'Ja, det här hjälper mot både feber och värk.', de: 'Ja, das hier hilft gegen Fieber und Schmerzen.', decoding: [{ sv: 'ja', de: 'ja' }, { sv: 'det', de: 'das' }, { sv: 'här', de: 'hier' }, { sv: 'hjälper', de: 'hilft' }, { sv: 'mot', de: 'gegen' }, { sv: 'både', de: 'sowohl' }, { sv: 'feber', de: 'Fieber' }, { sv: 'och', de: 'und' }, { sv: 'värk', de: 'Schmerz' }] },
      { id: 'ap6', speaker: 'you', sv: 'finns det utan recept?', de: 'gibt es das ohne Rezept?', chunkId: 'c-utanrecept', suggestions: ['Finns det utan recept?', 'Har du ett recept?'] },
      { id: 'ap7', speaker: 'partner', sv: 'Det här behöver inget recept. Det starkare gör det.', de: 'Das hier braucht kein Rezept. Das stärkere schon.', decoding: [{ sv: 'det', de: 'das' }, { sv: 'här', de: 'hier' }, { sv: 'behöver', de: 'braucht' }, { sv: 'inget', de: 'kein' }, { sv: 'recept', de: 'Rezept' }, { sv: 'det', de: 'das' }, { sv: 'starkare', de: 'stärkere' }, { sv: 'gör', de: 'tut' }, { sv: 'det', de: 'es' }] },
      { id: 'ap8', speaker: 'you', sv: 'hur många tabletter?', de: 'wie viele Tabletten?', chunkId: 'c-hurmangatabletter', suggestions: ['Hur många tabletter?', 'Hur mycket blir det?'] },
      { id: 'ap9', speaker: 'partner', sv: 'En på morgonen och en på kvällen, med mat.', de: 'Eine morgens und eine abends, mit Essen.', decoding: [{ sv: 'en', de: 'eine' }, { sv: 'på', de: 'am' }, { sv: 'morgonen', de: 'Morgen' }, { sv: 'och', de: 'und' }, { sv: 'en', de: 'eine' }, { sv: 'på', de: 'am' }, { sv: 'kvällen', de: 'Abend' }, { sv: 'med', de: 'mit' }, { sv: 'mat', de: 'Essen' }] },
      { id: 'ap10', speaker: 'you', sv: 'jag behöver plåster', de: 'ich brauche Pflaster', chunkId: 'c-behoverplaster', suggestions: ['Jag behöver plåster.', 'Jag behöver en läkare.'] },
      { id: 'ap11', speaker: 'partner', sv: 'De ligger vid kassan. Något annat innan vi stänger?', de: 'Die liegen an der Kasse. Sonst noch etwas, bevor wir schließen?', decoding: [{ sv: 'de', de: 'sie' }, { sv: 'ligger', de: 'liegen' }, { sv: 'vid', de: 'bei' }, { sv: 'kassan', de: 'der Kasse' }, { sv: 'något', de: 'etwas' }, { sv: 'annat', de: 'anderes' }, { sv: 'innan', de: 'bevor' }, { sv: 'vi', de: 'wir' }, { sv: 'stänger', de: 'schließen' }] },
      { id: 'ap12', speaker: 'you', sv: 'när stänger ni?', de: 'wann schließt ihr?', chunkId: 'c-narstanger', suggestions: ['När stänger ni?', 'När är frukost?'] },
    ],
  },

  // ── Termine machen ────────────────────────────────────────────────────────
  {
    id: 'dlg-tidsbokning',
    categoryId: 'cat-appointment',
    title: 'Einen Termin buchen',
    blurb: 'Anrufen, Termin finden, verschieben, sich verspäten.',
    scene: 'office',
    partnerName: 'Empfang',
    turns: [
      { id: 'tb1', speaker: 'partner', sv: 'Vårdcentralen, god dag!', de: 'Gesundheitszentrum, guten Tag!', listenFirst: true, decoding: [{ sv: 'vårdcentralen', de: 'das Gesundheitszentrum' }, { sv: 'god', de: 'guten' }, { sv: 'dag', de: 'Tag' }] },
      { id: 'tb2', speaker: 'you', sv: 'jag vill boka en tid', de: 'ich möchte einen Termin buchen', chunkId: 'c-bokaentid', suggestions: ['Jag vill boka en tid.', 'Kan vi boka ett möte?'] },
      { id: 'tb3', speaker: 'partner', sv: 'Självklart. Vi har luckor senare i veckan.', de: 'Selbstverständlich. Wir haben später in der Woche Lücken.', decoding: [{ sv: 'självklart', de: 'selbstverständlich' }, { sv: 'vi', de: 'wir' }, { sv: 'har', de: 'haben' }, { sv: 'luckor', de: 'Lücken' }, { sv: 'senare', de: 'später' }, { sv: 'i', de: 'in' }, { sv: 'veckan', de: 'der Woche' }] },
      { id: 'tb4', speaker: 'you', sv: 'passar det på torsdag?', de: 'passt es am Donnerstag?', chunkId: 'c-passarpatorsdag', suggestions: ['Passar det på torsdag?', 'Det passar på måndag.'] },
      { id: 'tb5', speaker: 'partner', sv: 'Torsdag klockan nio är ledigt. Går det bra?', de: 'Donnerstag um neun ist frei. Passt das?', decoding: [{ sv: 'torsdag', de: 'Donnerstag' }, { sv: 'klockan', de: 'die Uhr' }, { sv: 'nio', de: 'neun' }, { sv: 'är', de: 'ist' }, { sv: 'ledigt', de: 'frei' }, { sv: 'går', de: 'geht' }, { sv: 'det', de: 'es' }, { sv: 'bra', de: 'gut' }] },
      { id: 'tb6', speaker: 'you', sv: 'då säger vi så', de: 'dann machen wir es so', chunkId: 'c-dasagervisa', suggestions: ['Då säger vi så.', 'Det låter kul.'] },
      { id: 'tb7', speaker: 'partner', sv: 'Bokat. Vi skickar en påminnelse dagen innan.', de: 'Gebucht. Wir schicken am Tag davor eine Erinnerung.', decoding: [{ sv: 'bokat', de: 'gebucht' }, { sv: 'vi', de: 'wir' }, { sv: 'skickar', de: 'schicken' }, { sv: 'en', de: 'eine' }, { sv: 'påminnelse', de: 'Erinnerung' }, { sv: 'dagen', de: 'den Tag' }, { sv: 'innan', de: 'davor' }] },
      { id: 'tb8', speaker: 'you', sv: 'kan du påminna mig?', de: 'kannst du mich erinnern?', chunkId: 'c-paminnamig', suggestions: ['Kan du påminna mig?', 'Kan du upprepa?'] },
      { id: 'tb9', speaker: 'partner', sv: 'Det gör vi. Ring om något ändras.', de: 'Das machen wir. Ruf an, wenn sich etwas ändert.', decoding: [{ sv: 'det', de: 'das' }, { sv: 'gör', de: 'machen' }, { sv: 'vi', de: 'wir' }, { sv: 'ring', de: 'rufe an' }, { sv: 'om', de: 'wenn' }, { sv: 'något', de: 'etwas' }, { sv: 'ändras', de: 'sich ändert' }] },
      { id: 'tb10', speaker: 'you', sv: 'kan vi flytta tiden?', de: 'können wir den Termin verschieben?', chunkId: 'c-flyttatiden', suggestions: ['Kan vi flytta tiden?', 'Jag måste avboka.'] },
      { id: 'tb11', speaker: 'partner', sv: 'Vi har en tid på fredag i stället. Trafiken är hemsk i dag.', de: 'Wir hätten stattdessen einen Termin am Freitag. Der Verkehr ist heute schrecklich.', decoding: [{ sv: 'vi', de: 'wir' }, { sv: 'har', de: 'haben' }, { sv: 'en', de: 'einen' }, { sv: 'tid', de: 'Termin' }, { sv: 'på', de: 'am' }, { sv: 'fredag', de: 'Freitag' }, { sv: 'i', de: 'an' }, { sv: 'stället', de: 'der Stelle' }, { sv: 'trafiken', de: 'der Verkehr' }, { sv: 'är', de: 'ist' }, { sv: 'hemsk', de: 'schrecklich' }, { sv: 'i', de: 'am' }, { sv: 'dag', de: 'Tag' }] },
      { id: 'tb12', speaker: 'you', sv: 'jag blir lite sen', de: 'ich komme etwas später', chunkId: 'c-blirlitesen', suggestions: ['Jag blir lite sen.', 'Jag är på väg.'] },
    ],
  },

  // ── Einladen & Absagen ────────────────────────────────────────────────────
  {
    id: 'dlg-inbjudan',
    categoryId: 'cat-invitation',
    title: 'Eingeladen werden',
    blurb: 'Danke sagen, zusagen, etwas mitbringen — und höflich absagen.',
    scene: 'home',
    partnerName: 'Johanna',
    turns: [
      { id: 'ib1', speaker: 'partner', sv: 'Hej {name}! Vi firar min flytt på lördag. Kom!', de: 'Hallo {name}! Wir feiern am Samstag meinen Umzug. Komm!', listenFirst: true, decoding: [{ sv: 'hej', de: 'hallo' }, { sv: 'vi', de: 'wir' }, { sv: 'firar', de: 'feiern' }, { sv: 'min', de: 'meinen' }, { sv: 'flytt', de: 'Umzug' }, { sv: 'på', de: 'am' }, { sv: 'lördag', de: 'Samstag' }, { sv: 'kom', de: 'komm' }] },
      { id: 'ib2', speaker: 'you', sv: 'tack för inbjudan', de: 'danke für die Einladung', chunkId: 'c-tackforinbjudan', suggestions: ['Tack för inbjudan.', 'Tack så mycket.'] },
      { id: 'ib3', speaker: 'partner', sv: 'Så du kommer? Det blir många gamla vänner där.', de: 'Also kommst du? Es werden viele alte Freunde da sein.', decoding: [{ sv: 'så', de: 'also' }, { sv: 'du', de: 'du' }, { sv: 'kommer', de: 'kommst' }, { sv: 'det', de: 'es' }, { sv: 'blir', de: 'werden' }, { sv: 'många', de: 'viele' }, { sv: 'gamla', de: 'alte' }, { sv: 'vänner', de: 'Freunde' }, { sv: 'där', de: 'dort' }] },
      { id: 'ib4', speaker: 'you', sv: 'jag kommer gärna', de: 'ich komme gern', chunkId: 'c-jagkommergarna', suggestions: ['Jag kommer gärna.', 'Tyvärr kan jag inte.'] },
      { id: 'ib5', speaker: 'partner', sv: 'Vad kul! Vi börjar tidigt och håller på länge.', de: 'Wie schön! Wir fangen früh an und machen lange weiter.', decoding: [{ sv: 'vad', de: 'wie' }, { sv: 'kul', de: 'schön' }, { sv: 'vi', de: 'wir' }, { sv: 'börjar', de: 'beginnen' }, { sv: 'tidigt', de: 'früh' }, { sv: 'och', de: 'und' }, { sv: 'håller', de: 'halten' }, { sv: 'på', de: 'auf' }, { sv: 'länge', de: 'lange' }] },
      { id: 'ib6', speaker: 'you', sv: 'när börjar festen?', de: 'wann beginnt die Feier?', chunkId: 'c-narborjarfesten', suggestions: ['När börjar festen?', 'När är frukost?'] },
      { id: 'ib7', speaker: 'partner', sv: 'Sex på kvällen. Ingen behöver ta med sig något.', de: 'Sechs am Abend. Niemand muss etwas mitbringen.', decoding: [{ sv: 'sex', de: 'sechs' }, { sv: 'på', de: 'am' }, { sv: 'kvällen', de: 'Abend' }, { sv: 'ingen', de: 'niemand' }, { sv: 'behöver', de: 'braucht' }, { sv: 'ta', de: 'nehmen' }, { sv: 'med', de: 'mit' }, { sv: 'sig', de: 'sich' }, { sv: 'något', de: 'etwas' }] },
      { id: 'ib8', speaker: 'you', sv: 'ska jag ta med något?', de: 'soll ich etwas mitbringen?', chunkId: 'c-tamednagot', suggestions: ['Ska jag ta med något?', 'Kan jag ta med en vän?'] },
      { id: 'ib9', speaker: 'partner', sv: 'Bara dig själv! Fast en efterrätt säger jag inte nej till.', de: 'Nur dich selbst! Obwohl ich zu einem Nachtisch nicht Nein sage.', decoding: [{ sv: 'bara', de: 'nur' }, { sv: 'dig', de: 'dich' }, { sv: 'själv', de: 'selbst' }, { sv: 'fast', de: 'obwohl' }, { sv: 'en', de: 'einen' }, { sv: 'efterrätt', de: 'Nachtisch' }, { sv: 'säger', de: 'sage' }, { sv: 'jag', de: 'ich' }, { sv: 'inte', de: 'nicht' }, { sv: 'nej', de: 'nein' }, { sv: 'till', de: 'zu' }] },
      { id: 'ib10', speaker: 'you', sv: 'kan jag ta med en vän?', de: 'kann ich jemanden mitbringen?', chunkId: 'c-tamedenvan', suggestions: ['Kan jag ta med en vän?', 'Vill du komma?'] },
      { id: 'ib11', speaker: 'partner', sv: 'Ta med vem du vill! Och söndag då, brunch?', de: 'Bring mit, wen du willst! Und Sonntag dann, Brunch?', decoding: [{ sv: 'ta', de: 'nimm' }, { sv: 'med', de: 'mit' }, { sv: 'vem', de: 'wen' }, { sv: 'du', de: 'du' }, { sv: 'vill', de: 'willst' }, { sv: 'och', de: 'und' }, { sv: 'söndag', de: 'Sonntag' }, { sv: 'då', de: 'dann' }, { sv: 'brunch', de: 'Brunch' }] },
      { id: 'ib12', speaker: 'you', sv: 'tyvärr kan jag inte', de: 'leider kann ich nicht', chunkId: 'c-tyvarrkanjaginte', suggestions: ['Tyvärr kan jag inte.', 'Jag kan inte komma.'] },
    ],
  },

  // ── Reise planen ──────────────────────────────────────────────────────────
  {
    id: 'dlg-resa',
    categoryId: 'cat-tripplan',
    title: 'Die Reise planen',
    blurb: 'Tickets, Dauer, Unterkunft, Versicherung — und den Pass nicht vergessen.',
    scene: 'station',
    partnerName: 'Martin',
    turns: [
      { id: 'rs1', speaker: 'partner', sv: 'Så, vi åker norrut i juni. Har du kollat priserna?', de: 'Also, wir fahren im Juni nach Norden. Hast du die Preise geprüft?', listenFirst: true, decoding: [{ sv: 'så', de: 'also' }, { sv: 'vi', de: 'wir' }, { sv: 'åker', de: 'fahren' }, { sv: 'norrut', de: 'nordwärts' }, { sv: 'i', de: 'im' }, { sv: 'juni', de: 'Juni' }, { sv: 'har', de: 'hast' }, { sv: 'du', de: 'du' }, { sv: 'kollat', de: 'geprüft' }, { sv: 'priserna', de: 'die Preise' }] },
      { id: 'rs2', speaker: 'you', sv: 'jag ska boka biljetter', de: 'ich buche Tickets', chunkId: 'c-bokabiljetter', suggestions: ['Jag ska boka biljetter.', 'En biljett, tack.'] },
      { id: 'rs3', speaker: 'partner', sv: 'Bra. Tåget är billigare om vi bokar tidigt.', de: 'Gut. Der Zug ist billiger, wenn wir früh buchen.', decoding: [{ sv: 'bra', de: 'gut' }, { sv: 'tåget', de: 'der Zug' }, { sv: 'är', de: 'ist' }, { sv: 'billigare', de: 'billiger' }, { sv: 'om', de: 'wenn' }, { sv: 'vi', de: 'wir' }, { sv: 'bokar', de: 'buchen' }, { sv: 'tidigt', de: 'früh' }] },
      { id: 'rs4', speaker: 'you', sv: 'hur lång är resan?', de: 'wie lang ist die Reise?', chunkId: 'c-hurlangresan', suggestions: ['Hur lång är resan?', 'Hur lång tid tar det?'] },
      { id: 'rs5', speaker: 'partner', sv: 'Nio timmar, med ett byte i mitten.', de: 'Neun Stunden, mit einem Umstieg in der Mitte.', decoding: [{ sv: 'nio', de: 'neun' }, { sv: 'timmar', de: 'Stunden' }, { sv: 'med', de: 'mit' }, { sv: 'ett', de: 'einem' }, { sv: 'byte', de: 'Wechsel' }, { sv: 'i', de: 'in' }, { sv: 'mitten', de: 'der Mitte' }] },
      { id: 'rs6', speaker: 'you', sv: 'när avgår tåget?', de: 'wann fährt der Zug ab?', chunkId: 'c-naravgartaget', suggestions: ['När avgår tåget?', 'När går tåget?'] },
      { id: 'rs7', speaker: 'partner', sv: 'Kvart över sju på morgonen. Tidigt, jag vet.', de: 'Viertel nach sieben am Morgen. Früh, ich weiß.', decoding: [{ sv: 'kvart', de: 'Viertel' }, { sv: 'över', de: 'über' }, { sv: 'sju', de: 'sieben' }, { sv: 'på', de: 'am' }, { sv: 'morgonen', de: 'Morgen' }, { sv: 'tidigt', de: 'früh' }, { sv: 'jag', de: 'ich' }, { sv: 'vet', de: 'weiß' }] },
      { id: 'rs8', speaker: 'you', sv: 'var ska vi bo?', de: 'wo werden wir wohnen?', chunkId: 'c-varskavibo', suggestions: ['Var ska vi bo?', 'Har ni ett ledigt rum?'] },
      { id: 'rs9', speaker: 'partner', sv: 'En stuga vid vattnet. Min kusin hyr ut den.', de: 'Eine Hütte am Wasser. Mein Cousin vermietet sie.', decoding: [{ sv: 'en', de: 'eine' }, { sv: 'stuga', de: 'Hütte' }, { sv: 'vid', de: 'bei' }, { sv: 'vattnet', de: 'dem Wasser' }, { sv: 'min', de: 'mein' }, { sv: 'kusin', de: 'Cousin' }, { sv: 'hyr', de: 'mietet' }, { sv: 'ut', de: 'aus' }, { sv: 'den', de: 'sie' }] },
      { id: 'rs10', speaker: 'you', sv: 'behöver vi en försäkring?', de: 'brauchen wir eine Versicherung?', chunkId: 'c-behoverforsakring', suggestions: ['Behöver vi en försäkring?', 'Behöver jag ett recept?'] },
      { id: 'rs11', speaker: 'partner', sv: 'Inte inom landet. Men glöm inte passet ändå.', de: 'Nicht innerhalb des Landes. Aber vergiss den Pass trotzdem nicht.', decoding: [{ sv: 'inte', de: 'nicht' }, { sv: 'inom', de: 'innerhalb' }, { sv: 'landet', de: 'des Landes' }, { sv: 'men', de: 'aber' }, { sv: 'glöm', de: 'vergiss' }, { sv: 'inte', de: 'nicht' }, { sv: 'passet', de: 'den Pass' }, { sv: 'ändå', de: 'trotzdem' }] },
      { id: 'rs12', speaker: 'you', sv: 'jag måste packa väskan', de: 'ich muss den Koffer packen', chunkId: 'c-packavaskan', suggestions: ['Jag måste packa väskan.', 'Jag hittar inte min väska.'] },
    ],
  },

  // ── Kinder & Schule ───────────────────────────────────────────────────────
  {
    id: 'dlg-barn',
    categoryId: 'cat-kids',
    title: 'Abends mit den Kindern',
    blurb: 'Hausaufgaben, Essen, Schlafenszeit — der ganz normale Abend.',
    scene: 'home',
    partnerName: 'Kind',
    turns: [
      { id: 'br1', speaker: 'partner', sv: 'Hej! Jag är hemma. Får jag spela lite först?', de: 'Hallo! Ich bin zu Hause. Darf ich zuerst ein bisschen spielen?', listenFirst: true, decoding: [{ sv: 'hej', de: 'hallo' }, { sv: 'jag', de: 'ich' }, { sv: 'är', de: 'bin' }, { sv: 'hemma', de: 'daheim' }, { sv: 'får', de: 'darf' }, { sv: 'jag', de: 'ich' }, { sv: 'spela', de: 'spielen' }, { sv: 'lite', de: 'wenig' }, { sv: 'först', de: 'zuerst' }] },
      { id: 'br2', speaker: 'you', sv: 'har du läxor idag?', de: 'hast du heute Hausaufgaben?', chunkId: 'c-harnilaxor', suggestions: ['Har du läxor idag?', 'Hur gick provet?'] },
      { id: 'br3', speaker: 'partner', sv: 'Bara lite matte. Vi hade prov i går också.', de: 'Nur ein bisschen Mathe. Wir hatten gestern auch einen Test.', decoding: [{ sv: 'bara', de: 'nur' }, { sv: 'lite', de: 'wenig' }, { sv: 'matte', de: 'Mathe' }, { sv: 'vi', de: 'wir' }, { sv: 'hade', de: 'hatten' }, { sv: 'prov', de: 'Test' }, { sv: 'i', de: 'am' }, { sv: 'går', de: 'gestern' }, { sv: 'också', de: 'auch' }] },
      { id: 'br4', speaker: 'you', sv: 'hur gick provet?', de: 'wie lief der Test?', chunkId: 'c-hurgickprovet', suggestions: ['Hur gick provet?', 'Vem är läraren?'] },
      { id: 'br5', speaker: 'partner', sv: 'Ganska bra, tror jag. Läraren var snäll.', de: 'Ziemlich gut, glaube ich. Die Lehrkraft war nett.', decoding: [{ sv: 'ganska', de: 'ziemlich' }, { sv: 'bra', de: 'gut' }, { sv: 'tror', de: 'glaube' }, { sv: 'jag', de: 'ich' }, { sv: 'läraren', de: 'die Lehrkraft' }, { sv: 'var', de: 'war' }, { sv: 'snäll', de: 'nett' }] },
      { id: 'br6', speaker: 'you', sv: 'barnen leker ute', de: 'die Kinder spielen draußen', chunkId: 'c-barnenlekerute', suggestions: ['Barnen leker ute.', 'Vi sover ute i natt.'] },
      { id: 'br7', speaker: 'partner', sv: 'Får jag också gå ut? Maten är väl inte klar än?', de: 'Darf ich auch raus? Das Essen ist doch noch nicht fertig?', decoding: [{ sv: 'får', de: 'darf' }, { sv: 'jag', de: 'ich' }, { sv: 'också', de: 'auch' }, { sv: 'gå', de: 'gehen' }, { sv: 'ut', de: 'hinaus' }, { sv: 'maten', de: 'das Essen' }, { sv: 'är', de: 'ist' }, { sv: 'väl', de: 'wohl' }, { sv: 'inte', de: 'nicht' }, { sv: 'klar', de: 'fertig' }, { sv: 'än', de: 'noch' }] },
      { id: 'br8', speaker: 'you', sv: 'ät upp maten', de: 'iss auf', chunkId: 'c-atuppmaten', suggestions: ['Ät upp maten.', 'Smaklig måltid.'] },
      { id: 'br9', speaker: 'partner', sv: 'Okej, okej. Men jag är inte trött alls!', de: 'Okay, okay. Aber ich bin überhaupt nicht müde!', decoding: [{ sv: 'okej', de: 'okay' }, { sv: 'okej', de: 'okay' }, { sv: 'men', de: 'aber' }, { sv: 'jag', de: 'ich' }, { sv: 'är', de: 'bin' }, { sv: 'inte', de: 'nicht' }, { sv: 'trött', de: 'müde' }, { sv: 'alls', de: 'überhaupt' }] },
      { id: 'br10', speaker: 'you', sv: 'det är dags att sova', de: 'es ist Zeit zu schlafen', chunkId: 'c-dagsattsova', suggestions: ['Det är dags att sova.', 'Skolan börjar klockan åtta.'] },
      { id: 'br11', speaker: 'partner', sv: 'Kan du väcka mig tidigt? Och vem hämtar lillebror?', de: 'Kannst du mich früh wecken? Und wer holt den kleinen Bruder ab?', decoding: [{ sv: 'kan', de: 'kannst' }, { sv: 'du', de: 'du' }, { sv: 'väcka', de: 'wecken' }, { sv: 'mig', de: 'mich' }, { sv: 'tidigt', de: 'früh' }, { sv: 'och', de: 'und' }, { sv: 'vem', de: 'wer' }, { sv: 'hämtar', de: 'holt' }, { sv: 'lillebror', de: 'kleiner Bruder' }] },
      { id: 'br12', speaker: 'you', sv: 'jag hämtar på dagis', de: 'ich hole aus der Kita ab', chunkId: 'c-hamtapadagis', suggestions: ['Jag hämtar på dagis.', 'Skolan börjar klockan åtta.'] },
    ],
  },
];
