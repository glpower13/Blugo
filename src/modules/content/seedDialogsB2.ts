// GESPRÄCHE auf dem Meilenstein B2 — abwägen, verhandeln, erzählen, Nuancen.
//
// ⚠️ EHRLICH — und hier besonders: Auf B2 entscheidet der TON, und genau den
// prüft in diesem Projekt niemand. Maschinell belegt ist nur, dass jedes Wort
// echtes Schwedisch ist (docs/content-review-schwedisch.md).
//
// Jede „du"-Zeile ist WÖRTLICH ihr Chunk — sonst wäre der Abruf nicht prüfbar.

import type { Dialog } from '../../domain/dialog';

export const dialogs: Dialog[] = [
  // ── Diskutieren & Abwägen ─────────────────────────────────────────────────
  {
    id: 'dlg-debatt',
    categoryId: 'cat-debate',
    title: 'Zwei Seiten einer Sache',
    blurb: 'Einerseits, andererseits — und trotzdem zu einem Schluss kommen.',
    scene: 'office',
    partnerName: 'Karin',
    turns: [
      { id: 'db1', speaker: 'partner', sv: 'Vi måste välja leverantör i dag. Den billiga eller den kända?', de: 'Wir müssen heute den Lieferanten wählen. Den billigen oder den bekannten?', listenFirst: true, decoding: [{ sv: 'vi', de: 'wir' }, { sv: 'måste', de: 'müssen' }, { sv: 'välja', de: 'wählen' }, { sv: 'leverantör', de: 'Lieferant' }, { sv: 'i', de: 'am' }, { sv: 'dag', de: 'Tag' }, { sv: 'den', de: 'den' }, { sv: 'billiga', de: 'billigen' }, { sv: 'eller', de: 'oder' }, { sv: 'den', de: 'den' }, { sv: 'kända', de: 'bekannten' }] },
      { id: 'db2', speaker: 'you', sv: 'å ena sidan är det billigt', de: 'einerseits ist es billig', chunkId: 'c-aenasidan', suggestions: ['Å ena sidan är det billigt.', 'Å andra sidan tar det tid.'] },
      { id: 'db3', speaker: 'partner', sv: 'Precis, och budgeten är redan spänd i år.', de: 'Genau, und das Budget ist dieses Jahr schon knapp.', decoding: [{ sv: 'precis', de: 'genau' }, { sv: 'och', de: 'und' }, { sv: 'budgeten', de: 'das Budget' }, { sv: 'är', de: 'ist' }, { sv: 'redan', de: 'schon' }, { sv: 'spänd', de: 'gespannt' }, { sv: 'i', de: 'in' }, { sv: 'år', de: 'Jahr' }] },
      { id: 'db4', speaker: 'you', sv: 'å andra sidan tar det tid', de: 'andererseits dauert es', chunkId: 'c-aandrasidan', suggestions: ['Å andra sidan tar det tid.', 'Å ena sidan är det billigt.'] },
      { id: 'db5', speaker: 'partner', sv: 'De levererar snabbt, står det i offerten.', de: 'Sie liefern schnell, steht im Angebot.', decoding: [{ sv: 'de', de: 'sie' }, { sv: 'levererar', de: 'liefern' }, { sv: 'snabbt', de: 'schnell' }, { sv: 'står', de: 'steht' }, { sv: 'det', de: 'es' }, { sv: 'i', de: 'in' }, { sv: 'offerten', de: 'dem Angebot' }] },
      { id: 'db6', speaker: 'you', sv: 'det stämmer delvis', de: 'das stimmt teilweise', chunkId: 'c-stammerdelvis', suggestions: ['Det stämmer delvis.', 'Så enkelt är det inte.'] },
      { id: 'db7', speaker: 'partner', sv: 'Delvis? Antingen står det där eller så gör det inte det.', de: 'Teilweise? Entweder steht es da oder nicht.', decoding: [{ sv: 'delvis', de: 'teilweise' }, { sv: 'antingen', de: 'entweder' }, { sv: 'står', de: 'steht' }, { sv: 'det', de: 'es' }, { sv: 'där', de: 'dort' }, { sv: 'eller', de: 'oder' }, { sv: 'så', de: 'so' }, { sv: 'gör', de: 'macht' }, { sv: 'det', de: 'es' }, { sv: 'inte', de: 'nicht' }, { sv: 'det', de: 'das' }] },
      { id: 'db8', speaker: 'you', sv: 'låt mig förklara', de: 'lass mich erklären', chunkId: 'c-latmigforklara', suggestions: ['Låt mig förklara.', 'Anledningen är enkel.'] },
      { id: 'db9', speaker: 'partner', sv: 'Varsågod. Men vi har bara tio minuter kvar.', de: 'Bitte. Aber wir haben nur noch zehn Minuten.', decoding: [{ sv: 'varsågod', de: 'bitte' }, { sv: 'men', de: 'aber' }, { sv: 'vi', de: 'wir' }, { sv: 'har', de: 'haben' }, { sv: 'bara', de: 'nur' }, { sv: 'tio', de: 'zehn' }, { sv: 'minuter', de: 'Minuten' }, { sv: 'kvar', de: 'übrig' }] },
      { id: 'db10', speaker: 'you', sv: 'kan vi återkomma till det?', de: 'können wir darauf zurückkommen?', chunkId: 'c-aterkommatilldet', suggestions: ['Kan vi återkomma till det?', 'Jag måste tänka på saken.'] },
      { id: 'db11', speaker: 'partner', sv: 'Låt oss ta den billiga nu och utvärdera i höst.', de: 'Nehmen wir jetzt den billigen und bewerten im Herbst.', decoding: [{ sv: 'låt', de: 'lass' }, { sv: 'oss', de: 'uns' }, { sv: 'ta', de: 'nehmen' }, { sv: 'den', de: 'den' }, { sv: 'billiga', de: 'billigen' }, { sv: 'nu', de: 'jetzt' }, { sv: 'och', de: 'und' }, { sv: 'utvärdera', de: 'bewerten' }, { sv: 'i', de: 'im' }, { sv: 'höst', de: 'Herbst' }] },
      { id: 'db12', speaker: 'you', sv: 'då är vi överens', de: 'dann sind wir uns einig', chunkId: 'c-daarvioverens', suggestions: ['Då är vi överens.', 'Då säger vi så.'] },
    ],
  },

  // ── Umwelt & Gesellschaft ─────────────────────────────────────────────────
  {
    id: 'dlg-miljo',
    categoryId: 'cat-environment',
    title: 'Klima am Küchentisch',
    blurb: 'Über Umwelt, Steuern und Verantwortung reden, ohne zu predigen.',
    scene: 'home',
    partnerName: 'Gunnar',
    turns: [
      { id: 'mj1', speaker: 'partner', sv: 'Det snöade knappt i vintras. Så var det inte förr.', de: 'Diesen Winter hat es kaum geschneit. So war es früher nicht.', listenFirst: true, decoding: [{ sv: 'det', de: 'es' }, { sv: 'snöade', de: 'schneite' }, { sv: 'knappt', de: 'kaum' }, { sv: 'i', de: 'im' }, { sv: 'vintras', de: 'vergangenen Winter' }, { sv: 'så', de: 'so' }, { sv: 'var', de: 'war' }, { sv: 'det', de: 'es' }, { sv: 'inte', de: 'nicht' }, { sv: 'förr', de: 'früher' }] },
      { id: 'mj2', speaker: 'you', sv: 'klimatet förändras snabbt', de: 'das Klima verändert sich schnell', chunkId: 'c-klimatetforandras', suggestions: ['Klimatet förändras snabbt.', 'Samhället förändras hela tiden.'] },
      { id: 'mj3', speaker: 'partner', sv: 'Kanske. Men vad kan en liten by göra åt saken?', de: 'Vielleicht. Aber was kann ein kleines Dorf dagegen tun?', decoding: [{ sv: 'kanske', de: 'vielleicht' }, { sv: 'men', de: 'aber' }, { sv: 'vad', de: 'was' }, { sv: 'kan', de: 'kann' }, { sv: 'en', de: 'ein' }, { sv: 'liten', de: 'kleines' }, { sv: 'by', de: 'Dorf' }, { sv: 'göra', de: 'tun' }, { sv: 'åt', de: 'gegen' }, { sv: 'saken', de: 'die Sache' }] },
      { id: 'mj4', speaker: 'you', sv: 'utsläppen måste minska', de: 'die Emissionen müssen sinken', chunkId: 'c-utslappenmasteminska', suggestions: ['Utsläppen måste minska.', 'Vi måste tänka på miljön.'] },
      { id: 'mj5', speaker: 'partner', sv: 'Lätt att säga. Bilen behöver jag till jobbet varje dag.', de: 'Leicht gesagt. Das Auto brauche ich jeden Tag für die Arbeit.', decoding: [{ sv: 'lätt', de: 'leicht' }, { sv: 'att', de: 'zu' }, { sv: 'säga', de: 'sagen' }, { sv: 'bilen', de: 'das Auto' }, { sv: 'behöver', de: 'brauche' }, { sv: 'jag', de: 'ich' }, { sv: 'till', de: 'zu' }, { sv: 'jobbet', de: 'der Arbeit' }, { sv: 'varje', de: 'jeden' }, { sv: 'dag', de: 'Tag' }] },
      { id: 'mj6', speaker: 'you', sv: 'vi tar cykeln i stället', de: 'wir nehmen stattdessen das Fahrrad', chunkId: 'c-vitarcykeln', suggestions: ['Vi tar cykeln i stället.', 'Vi måste tänka på miljön.'] },
      { id: 'mj7', speaker: 'partner', sv: 'I juli, ja. I januari är det mörkt och halt.', de: 'Im Juli, ja. Im Januar ist es dunkel und glatt.', decoding: [{ sv: 'i', de: 'im' }, { sv: 'juli', de: 'Juli' }, { sv: 'ja', de: 'ja' }, { sv: 'i', de: 'im' }, { sv: 'januari', de: 'Januar' }, { sv: 'är', de: 'ist' }, { sv: 'det', de: 'es' }, { sv: 'mörkt', de: 'dunkel' }, { sv: 'och', de: 'und' }, { sv: 'halt', de: 'glatt' }] },
      { id: 'mj8', speaker: 'you', sv: 'det är inte hållbart i längden', de: 'das ist auf Dauer nicht tragfähig', chunkId: 'c-intehallbart', suggestions: ['Det är inte hållbart i längden.', 'Utsläppen måste minska.'] },
      { id: 'mj9', speaker: 'partner', sv: 'Och vem betalar? Vi betalar redan höga skatter.', de: 'Und wer zahlt? Wir zahlen schon hohe Steuern.', decoding: [{ sv: 'och', de: 'und' }, { sv: 'vem', de: 'wer' }, { sv: 'betalar', de: 'zahlt' }, { sv: 'vi', de: 'wir' }, { sv: 'betalar', de: 'zahlen' }, { sv: 'redan', de: 'schon' }, { sv: 'höga', de: 'hohe' }, { sv: 'skatter', de: 'Steuern' }] },
      { id: 'mj10', speaker: 'you', sv: 'skatterna är höga här', de: 'die Steuern sind hier hoch', chunkId: 'c-skatternaarhoga', suggestions: ['Skatterna är höga här.', 'Det är för dyrt.'] },
      { id: 'mj11', speaker: 'partner', sv: 'Just det. Kommunen skyller på staten och tvärtom.', de: 'Eben. Die Gemeinde schiebt es auf den Staat und umgekehrt.', decoding: [{ sv: 'just', de: 'gerade' }, { sv: 'det', de: 'das' }, { sv: 'kommunen', de: 'die Gemeinde' }, { sv: 'skyller', de: 'schiebt' }, { sv: 'på', de: 'auf' }, { sv: 'staten', de: 'den Staat' }, { sv: 'och', de: 'und' }, { sv: 'tvärtom', de: 'umgekehrt' }] },
      { id: 'mj12', speaker: 'you', sv: 'vem tar ansvar för det?', de: 'wer übernimmt dafür die Verantwortung?', chunkId: 'c-vemtaransvar', suggestions: ['Vem tar ansvar för det?', 'Vem kan jag prata med?'] },
    ],
  },

  // ── Verhandeln ────────────────────────────────────────────────────────────
  {
    id: 'dlg-forhandling',
    categoryId: 'cat-negotiate',
    title: 'Über den Preis verhandeln',
    blurb: 'Bedingungen klären, Budget nennen, sich Bedenkzeit nehmen.',
    scene: 'office',
    partnerName: 'Verkäufer',
    turns: [
      { id: 'fh1', speaker: 'partner', sv: 'Här är vår offert. Priset gäller i två veckor.', de: 'Hier ist unser Angebot. Der Preis gilt zwei Wochen.', listenFirst: true, decoding: [{ sv: 'här', de: 'hier' }, { sv: 'är', de: 'ist' }, { sv: 'vår', de: 'unser' }, { sv: 'offert', de: 'Angebot' }, { sv: 'priset', de: 'der Preis' }, { sv: 'gäller', de: 'gilt' }, { sv: 'i', de: 'für' }, { sv: 'två', de: 'zwei' }, { sv: 'veckor', de: 'Wochen' }] },
      { id: 'fh2', speaker: 'you', sv: 'kan vi förhandla om priset?', de: 'können wir über den Preis verhandeln?', chunkId: 'c-forhandlaompriset', suggestions: ['Kan vi förhandla om priset?', 'Det är för dyrt.'] },
      { id: 'fh3', speaker: 'partner', sv: 'Det beror på volymen. Hur mycket behöver ni?', de: 'Das hängt von der Menge ab. Wie viel braucht ihr?', decoding: [{ sv: 'det', de: 'das' }, { sv: 'beror', de: 'beruht' }, { sv: 'på', de: 'auf' }, { sv: 'volymen', de: 'der Menge' }, { sv: 'hur', de: 'wie' }, { sv: 'mycket', de: 'viel' }, { sv: 'behöver', de: 'braucht' }, { sv: 'ni', de: 'ihr' }] },
      { id: 'fh4', speaker: 'you', sv: 'under vilka villkor?', de: 'unter welchen Bedingungen?', chunkId: 'c-vilkavillkor', suggestions: ['Under vilka villkor?', 'Vad kostar avgiften?'] },
      { id: 'fh5', speaker: 'partner', sv: 'Tio procent rabatt om ni beställer för hela året.', de: 'Zehn Prozent Rabatt, wenn ihr für das ganze Jahr bestellt.', decoding: [{ sv: 'tio', de: 'zehn' }, { sv: 'procent', de: 'Prozent' }, { sv: 'rabatt', de: 'Rabatt' }, { sv: 'om', de: 'wenn' }, { sv: 'ni', de: 'ihr' }, { sv: 'beställer', de: 'bestellt' }, { sv: 'för', de: 'für' }, { sv: 'hela', de: 'das ganze' }, { sv: 'året', de: 'Jahr' }] },
      { id: 'fh6', speaker: 'you', sv: 'det ligger utanför budgeten', de: 'das liegt außerhalb des Budgets', chunkId: 'c-utanforbudgeten', suggestions: ['Det ligger utanför budgeten.', 'Det är för dyrt.'] },
      { id: 'fh7', speaker: 'partner', sv: 'Vad har ni tänkt er då? Säg en siffra.', de: 'Woran habt ihr dann gedacht? Nenn eine Zahl.', decoding: [{ sv: 'vad', de: 'was' }, { sv: 'har', de: 'habt' }, { sv: 'ni', de: 'ihr' }, { sv: 'tänkt', de: 'gedacht' }, { sv: 'er', de: 'euch' }, { sv: 'då', de: 'dann' }, { sv: 'säg', de: 'sage' }, { sv: 'en', de: 'eine' }, { sv: 'siffra', de: 'Zahl' }] },
      { id: 'fh8', speaker: 'you', sv: 'jag föreslår en kompromiss', de: 'ich schlage einen Kompromiss vor', chunkId: 'c-foreslarkompromiss', suggestions: ['Jag föreslår en kompromiss.', 'Det går jag med på.'] },
      { id: 'fh9', speaker: 'partner', sv: 'Halva året, full rabatt? Det kan jag nog ordna.', de: 'Halbes Jahr, voller Rabatt? Das bekomme ich wohl hin.', decoding: [{ sv: 'halva', de: 'halbes' }, { sv: 'året', de: 'Jahr' }, { sv: 'full', de: 'voller' }, { sv: 'rabatt', de: 'Rabatt' }, { sv: 'det', de: 'das' }, { sv: 'kan', de: 'kann' }, { sv: 'jag', de: 'ich' }, { sv: 'nog', de: 'wohl' }, { sv: 'ordna', de: 'regeln' }] },
      { id: 'fh10', speaker: 'you', sv: 'när kan ni leverera?', de: 'wann könnt ihr liefern?', chunkId: 'c-narkannileverera', suggestions: ['När kan ni leverera?', 'När kommer brevet fram?'] },
      { id: 'fh11', speaker: 'partner', sv: 'Tre veckor efter beställning. Skriver vi under i dag?', de: 'Drei Wochen nach Bestellung. Unterschreiben wir heute?', decoding: [{ sv: 'tre', de: 'drei' }, { sv: 'veckor', de: 'Wochen' }, { sv: 'efter', de: 'nach' }, { sv: 'beställning', de: 'Bestellung' }, { sv: 'skriver', de: 'schreiben' }, { sv: 'vi', de: 'wir' }, { sv: 'under', de: 'unter' }, { sv: 'i', de: 'am' }, { sv: 'dag', de: 'Tag' }] },
      { id: 'fh12', speaker: 'you', sv: 'jag måste tänka på saken', de: 'ich muss darüber nachdenken', chunkId: 'c-mastetankapasaken', suggestions: ['Jag måste tänka på saken.', 'Det går jag med på.'] },
    ],
  },

  // ── Erzählen & Zusammenfassen ─────────────────────────────────────────────
  {
    id: 'dlg-berattelse',
    categoryId: 'cat-story',
    title: 'Erzähl, was passiert ist',
    blurb: 'Eine Geschichte der Reihe nach — und am Ende auf den Punkt.',
    scene: 'cafe',
    partnerName: 'Malin',
    turns: [
      { id: 'be1', speaker: 'partner', sv: 'Alla pratar om vad som hände på tåget. Var du med?', de: 'Alle reden davon, was im Zug passiert ist. Warst du dabei?', listenFirst: true, decoding: [{ sv: 'alla', de: 'alle' }, { sv: 'pratar', de: 'reden' }, { sv: 'om', de: 'über' }, { sv: 'vad', de: 'was' }, { sv: 'som', de: 'das' }, { sv: 'hände', de: 'geschah' }, { sv: 'på', de: 'auf' }, { sv: 'tåget', de: 'dem Zug' }, { sv: 'var', de: 'warst' }, { sv: 'du', de: 'du' }, { sv: 'med', de: 'dabei' }] },
      { id: 'be2', speaker: 'you', sv: 'det började helt vanligt', de: 'es fing ganz normal an', chunkId: 'c-borjadehelvanligt', suggestions: ['Det började helt vanligt.', 'Jag minns att det regnade.'] },
      { id: 'be3', speaker: 'partner', sv: 'Och sedan? Berätta ordentligt nu.', de: 'Und dann? Erzähl jetzt ordentlich.', decoding: [{ sv: 'och', de: 'und' }, { sv: 'sedan', de: 'dann' }, { sv: 'berätta', de: 'erzähle' }, { sv: 'ordentligt', de: 'ordentlich' }, { sv: 'nu', de: 'jetzt' }] },
      { id: 'be4', speaker: 'you', sv: 'plötsligt hände något', de: 'plötzlich passierte etwas', chunkId: 'c-plotsligthande', suggestions: ['Plötsligt hände något.', 'Det visade sig vara fel.'] },
      { id: 'be5', speaker: 'partner', sv: 'Vad då? Stannade tåget mitt ute på spåret?', de: 'Was denn? Hielt der Zug mitten auf der Strecke?', decoding: [{ sv: 'vad', de: 'was' }, { sv: 'då', de: 'denn' }, { sv: 'stannade', de: 'hielt' }, { sv: 'tåget', de: 'der Zug' }, { sv: 'mitt', de: 'mitten' }, { sv: 'ute', de: 'draußen' }, { sv: 'på', de: 'auf' }, { sv: 'spåret', de: 'dem Gleis' }] },
      { id: 'be6', speaker: 'you', sv: 'samtidigt som det hände', de: 'während das geschah', chunkId: 'c-samtidigtsomdethande', suggestions: ['Samtidigt som det hände.', 'Plötsligt hände något.'] },
      { id: 'be7', speaker: 'partner', sv: 'Ringde du polisen? Många trodde att det var allvarligt.', de: 'Hast du die Polizei gerufen? Viele dachten, es sei ernst.', decoding: [{ sv: 'ringde', de: 'riefst an' }, { sv: 'du', de: 'du' }, { sv: 'polisen', de: 'die Polizei' }, { sv: 'många', de: 'viele' }, { sv: 'trodde', de: 'glaubten' }, { sv: 'att', de: 'dass' }, { sv: 'det', de: 'es' }, { sv: 'var', de: 'war' }, { sv: 'allvarligt', de: 'ernst' }] },
      { id: 'be8', speaker: 'you', sv: 'det visade sig vara fel', de: 'es stellte sich als falsch heraus', chunkId: 'c-detvisadesigvarafel', suggestions: ['Det visade sig vara fel.', 'Det stämmer delvis.'] },
      { id: 'be9', speaker: 'partner', sv: 'Vilken tur. Hur länge stod ni där?', de: 'Was für ein Glück. Wie lange standet ihr dort?', decoding: [{ sv: 'vilken', de: 'welch' }, { sv: 'tur', de: 'Glück' }, { sv: 'hur', de: 'wie' }, { sv: 'länge', de: 'lange' }, { sv: 'stod', de: 'standet' }, { sv: 'ni', de: 'ihr' }, { sv: 'där', de: 'dort' }] },
      { id: 'be10', speaker: 'you', sv: 'till slut löste det sig', de: 'am Ende hat es sich gelöst', chunkId: 'c-tillslutlostedetsig', suggestions: ['Till slut löste det sig.', 'Kort sagt gick det bra.'] },
      { id: 'be11', speaker: 'partner', sv: 'Skönt. Säg det kort, jag ska vidare om en minut.', de: 'Beruhigend. Sag es kurz, ich muss in einer Minute weiter.', decoding: [{ sv: 'skönt', de: 'schön' }, { sv: 'säg', de: 'sage' }, { sv: 'det', de: 'es' }, { sv: 'kort', de: 'kurz' }, { sv: 'jag', de: 'ich' }, { sv: 'ska', de: 'soll' }, { sv: 'vidare', de: 'weiter' }, { sv: 'om', de: 'in' }, { sv: 'en', de: 'einer' }, { sv: 'minut', de: 'Minute' }] },
      { id: 'be12', speaker: 'you', sv: 'för att sammanfatta', de: 'um es zusammenzufassen', chunkId: 'c-forattsammanfatta', suggestions: ['För att sammanfatta.', 'Kort sagt gick det bra.'] },
    ],
  },

  // ── Nuancen ───────────────────────────────────────────────────────────────
  {
    id: 'dlg-nyanser',
    categoryId: 'cat-nuance',
    title: 'Wenn der Ton daneben liegt',
    blurb: 'Sich korrigieren, den feinen Unterschied benennen, nachfragen.',
    scene: 'school',
    partnerName: 'Jonas',
    turns: [
      { id: 'ny1', speaker: 'partner', sv: 'Du lät ganska skarp på mötet. Var du arg?', de: 'Du klangst im Meeting ziemlich scharf. Warst du wütend?', listenFirst: true, decoding: [{ sv: 'du', de: 'du' }, { sv: 'lät', de: 'klangst' }, { sv: 'ganska', de: 'ziemlich' }, { sv: 'skarp', de: 'scharf' }, { sv: 'på', de: 'auf' }, { sv: 'mötet', de: 'dem Treffen' }, { sv: 'var', de: 'warst' }, { sv: 'du', de: 'du' }, { sv: 'arg', de: 'wütend' }] },
      { id: 'ny2', speaker: 'you', sv: 'det låter hårdare än jag menar', de: 'das klingt härter, als ich es meine', chunkId: 'c-laterhardare', suggestions: ['Det låter hårdare än jag menar.', 'Jag uttrycker mig kanske fel.'] },
      { id: 'ny3', speaker: 'partner', sv: 'Okej. Så du tycker inte att förslaget är dåligt?', de: 'Okay. Du findest den Vorschlag also nicht schlecht?', decoding: [{ sv: 'okej', de: 'okay' }, { sv: 'så', de: 'also' }, { sv: 'du', de: 'du' }, { sv: 'tycker', de: 'findest' }, { sv: 'inte', de: 'nicht' }, { sv: 'att', de: 'dass' }, { sv: 'förslaget', de: 'der Vorschlag' }, { sv: 'är', de: 'ist' }, { sv: 'dåligt', de: 'schlecht' }] },
      { id: 'ny4', speaker: 'you', sv: 'jag menar snarare tvärtom', de: 'ich meine eher das Gegenteil', chunkId: 'c-menarsnarare', suggestions: ['Jag menar snarare tvärtom.', 'Tvärtom, det tror jag inte.'] },
      { id: 'ny5', speaker: 'partner', sv: 'Då förstod jag dig fel. Svenska kan vara lurigt så.', de: 'Dann habe ich dich falsch verstanden. Schwedisch kann da tückisch sein.', decoding: [{ sv: 'då', de: 'dann' }, { sv: 'förstod', de: 'verstand' }, { sv: 'jag', de: 'ich' }, { sv: 'dig', de: 'dich' }, { sv: 'fel', de: 'falsch' }, { sv: 'svenska', de: 'Schwedisch' }, { sv: 'kan', de: 'kann' }, { sv: 'vara', de: 'sein' }, { sv: 'lurigt', de: 'tückisch' }, { sv: 'så', de: 'so' }] },
      { id: 'ny6', speaker: 'you', sv: 'jag uttrycker mig kanske fel', de: 'ich drücke mich vielleicht falsch aus', chunkId: 'c-uttryckermigfel', suggestions: ['Jag uttrycker mig kanske fel.', 'Jag är nybörjare.'] },
      { id: 'ny7', speaker: 'partner', sv: 'Ingen fara. Vad är skillnaden mellan „kanske" och „nog"?', de: 'Kein Problem. Was ist der Unterschied zwischen „vielleicht" und „wohl"?', decoding: [{ sv: 'ingen', de: 'keine' }, { sv: 'fara', de: 'Gefahr' }, { sv: 'vad', de: 'was' }, { sv: 'är', de: 'ist' }, { sv: 'skillnaden', de: 'der Unterschied' }, { sv: 'mellan', de: 'zwischen' }, { sv: 'kanske', de: 'vielleicht' }, { sv: 'och', de: 'und' }, { sv: 'nog', de: 'wohl' }] },
      { id: 'ny8', speaker: 'you', sv: 'skillnaden är liten men viktig', de: 'der Unterschied ist klein, aber wichtig', chunkId: 'c-skillnadenarliten', suggestions: ['Skillnaden är liten men viktig.', 'Uttrycket betyder något annat.'] },
      { id: 'ny9', speaker: 'partner', sv: 'Håller med. Chefen sa „vi får se" i dag. Vad betydde det?', de: 'Sehe ich auch so. Der Chef sagte heute „mal sehen". Was hieß das?', decoding: [{ sv: 'håller', de: 'halte' }, { sv: 'med', de: 'mit' }, { sv: 'chefen', de: 'der Chef' }, { sv: 'sa', de: 'sagte' }, { sv: 'vi', de: 'wir' }, { sv: 'får', de: 'dürfen' }, { sv: 'se', de: 'sehen' }, { sv: 'i', de: 'am' }, { sv: 'dag', de: 'Tag' }, { sv: 'vad', de: 'was' }, { sv: 'betydde', de: 'bedeutete' }, { sv: 'det', de: 'es' }] },
      { id: 'ny10', speaker: 'you', sv: 'man får läsa mellan raderna', de: 'man muss zwischen den Zeilen lesen', chunkId: 'c-lasamellanraderna', suggestions: ['Man får läsa mellan raderna.', 'Det beror på hur man säger det.'] },
      { id: 'ny11', speaker: 'partner', sv: 'Ha! Precis. Han sa nej, fast han sa inte nej.', de: 'Ha! Genau. Er sagte Nein, obwohl er nicht Nein sagte.', decoding: [{ sv: 'ha', de: 'ha' }, { sv: 'precis', de: 'genau' }, { sv: 'han', de: 'er' }, { sv: 'sa', de: 'sagte' }, { sv: 'nej', de: 'nein' }, { sv: 'fast', de: 'obwohl' }, { sv: 'han', de: 'er' }, { sv: 'sa', de: 'sagte' }, { sv: 'inte', de: 'nicht' }, { sv: 'nej', de: 'nein' }] },
      { id: 'ny12', speaker: 'you', sv: 'det beror på hur man säger det', de: 'es kommt darauf an, wie man es sagt', chunkId: 'c-berorpahurmansager', suggestions: ['Det beror på hur man säger det.', 'Det beror på situationen.'] },
    ],
  },

  // ── Redewendungen ─────────────────────────────────────────────────────────
  {
    id: 'dlg-uttryck',
    categoryId: 'cat-idioms',
    title: 'Redewendungen im Alltag',
    blurb: 'Feste Wendungen an der richtigen Stelle — nicht Wort für Wort.',
    scene: 'cafe',
    partnerName: 'Bosse',
    turns: [
      { id: 'ut1', speaker: 'partner', sv: 'Jag är sen med allt den här veckan. Stressig tid.', de: 'Ich bin diese Woche mit allem spät dran. Stressige Zeit.', listenFirst: true, decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'är', de: 'bin' }, { sv: 'sen', de: 'spät' }, { sv: 'med', de: 'mit' }, { sv: 'allt', de: 'allem' }, { sv: 'den', de: 'die' }, { sv: 'här', de: 'hier' }, { sv: 'veckan', de: 'Woche' }, { sv: 'stressig', de: 'stressig' }, { sv: 'tid', de: 'Zeit' }] },
      { id: 'ut2', speaker: 'you', sv: 'det är ingen ko på isen', de: 'es eilt nicht', chunkId: 'c-ingenkopaisen', suggestions: ['Det är ingen ko på isen.', 'Ingen fara på taket.'] },
      { id: 'ut3', speaker: 'partner', sv: 'Va? Kor och is? Var lärde du dig det?', de: 'Was? Kühe und Eis? Wo hast du das gelernt?', decoding: [{ sv: 'va', de: 'was' }, { sv: 'kor', de: 'Kühe' }, { sv: 'och', de: 'und' }, { sv: 'is', de: 'Eis' }, { sv: 'var', de: 'wo' }, { sv: 'lärde', de: 'lerntest' }, { sv: 'du', de: 'du' }, { sv: 'dig', de: 'dich' }, { sv: 'det', de: 'das' }] },
      { id: 'ut4', speaker: 'you', sv: 'övning ger färdighet', de: 'Übung macht den Meister', chunkId: 'c-ovninggerfardighet', suggestions: ['Övning ger färdighet.', 'Jag övar varje dag.'] },
      { id: 'ut5', speaker: 'partner', sv: 'Imponerande. Du kom sent i dag, men du kom.', de: 'Beeindruckend. Du kamst heute spät, aber du kamst.', decoding: [{ sv: 'imponerande', de: 'beeindruckend' }, { sv: 'du', de: 'du' }, { sv: 'kom', de: 'kamst' }, { sv: 'sent', de: 'spät' }, { sv: 'i', de: 'am' }, { sv: 'dag', de: 'Tag' }, { sv: 'men', de: 'aber' }, { sv: 'du', de: 'du' }, { sv: 'kom', de: 'kamst' }] },
      { id: 'ut6', speaker: 'you', sv: 'bättre sent än aldrig', de: 'besser spät als nie', chunkId: 'c-battresentanaldrig', suggestions: ['Bättre sent än aldrig.', 'Det var droppen.'] },
      { id: 'ut7', speaker: 'partner', sv: 'Precis så säger min mamma. Hur var resan förresten?', de: 'Genau so sagt meine Mutter. Wie war die Reise übrigens?', decoding: [{ sv: 'precis', de: 'genau' }, { sv: 'så', de: 'so' }, { sv: 'säger', de: 'sagt' }, { sv: 'min', de: 'meine' }, { sv: 'mamma', de: 'Mutter' }, { sv: 'hur', de: 'wie' }, { sv: 'var', de: 'war' }, { sv: 'resan', de: 'die Reise' }, { sv: 'förresten', de: 'übrigens' }] },
      { id: 'ut8', speaker: 'you', sv: 'borta bra men hemma bäst', de: 'daheim ist es doch am schönsten', chunkId: 'c-bortabrahemmabast', suggestions: ['Borta bra men hemma bäst.', 'Lagom är bäst.'] },
      { id: 'ut9', speaker: 'partner', sv: 'Ha ha! Och hotellet var billigt, sa du. Misstänkt billigt.', de: 'Ha ha! Und das Hotel war billig, sagtest du. Verdächtig billig.', decoding: [{ sv: 'ha', de: 'ha' }, { sv: 'ha', de: 'ha' }, { sv: 'och', de: 'und' }, { sv: 'hotellet', de: 'das Hotel' }, { sv: 'var', de: 'war' }, { sv: 'billigt', de: 'billig' }, { sv: 'sa', de: 'sagtest' }, { sv: 'du', de: 'du' }, { sv: 'misstänkt', de: 'verdächtig' }, { sv: 'billigt', de: 'billig' }] },
      { id: 'ut10', speaker: 'you', sv: 'här ligger en hund begraven', de: 'da stimmt etwas nicht', chunkId: 'c-hundbegraven', suggestions: ['Här ligger en hund begraven.', 'Det stämmer delvis.'] },
      { id: 'ut11', speaker: 'partner', sv: 'Du använder dem helt rätt nu. Inte för mycket, inte för lite.', de: 'Du benutzt sie jetzt völlig richtig. Nicht zu viel, nicht zu wenig.', decoding: [{ sv: 'du', de: 'du' }, { sv: 'använder', de: 'benutzt' }, { sv: 'dem', de: 'sie' }, { sv: 'helt', de: 'ganz' }, { sv: 'rätt', de: 'richtig' }, { sv: 'nu', de: 'jetzt' }, { sv: 'inte', de: 'nicht' }, { sv: 'för', de: 'zu' }, { sv: 'mycket', de: 'viel' }, { sv: 'inte', de: 'nicht' }, { sv: 'för', de: 'zu' }, { sv: 'lite', de: 'wenig' }] },
      { id: 'ut12', speaker: 'you', sv: 'lagom är bäst', de: 'das rechte Maß ist am besten', chunkId: 'c-lagomarbast', suggestions: ['Lagom är bäst.', 'Borta bra men hemma bäst.'] },
    ],
  },
];
