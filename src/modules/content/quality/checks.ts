// Die Prüfungen des Inhalts — als BIBLIOTHEK, nicht als Werkzeug.
//
// WARUM ES DIESE DATEI GIBT (2026-07-26): Der handgeschriebene Inhalt läuft
// durch vier strenge Prüfungen (Glossen-Vollständigkeit, Kontext-Deckung,
// Zahlen/Verneinung, Glossen-Konflikte). KI-ERZEUGTER Inhalt lief durch
// KEINE — `parseSegment` prüfte nur, ob überhaupt Text zurückkam, und was das
// Modell lieferte, ging so an den Lerner.
//
// Das ist der eigentliche Burggraben: Sätze erzeugen kann jeder. Erzeugte Sätze
// automatisch auf DENSELBEN Stand prüfen wie die kuratierten — das ist der
// Unterschied. Deshalb liegen die Regeln jetzt hier, im Browser lauffähig, und
// die Build-Werkzeuge importieren sie von hier. Eine Regel, ein Ort: Sonst
// driften Bau- und Laufzeit-Prüfung auseinander, und genau dann ist die
// Laufzeit-Prüfung eine Behauptung.

/** Wörter eines schwedischen oder deutschen Satzes — ohne Satzzeichen, ohne Platzhalter. */
export function woerter(s: string): string[] {
  return (s.replace(/\{[a-zA-Z]+\}/g, ' ').toLowerCase().match(/\p{L}+|\d+/gu) ?? []).filter(Boolean);
}

/** Der Namens-Platzhalter ist kein Wort der Sprache. */
export const ohnePlatzhalter = (s: string) => s.replace(/\{[a-zA-Z]+\}/g, ' ');

// ── Zahlen und Verneinung ────────────────────────────────────────────────────
//
// WARUM ES DIESE PRÜFUNG GIBT: Abschnitt D misst die Wort-Deckung zwischen dem
// wörtlichen Rückbau und der freien Übersetzung. Bei 125 Treffern war jeder
// einzelne KORREKT — „smaklig måltid" heißt wörtlich „schmackhaft Mahlzeit" und
// gemeint „Guten Appetit". Die Liste warnte also vor genau dem Effekt, den die
// App bauen will. Eine Warnung, die nur das Produkt anzeigt, ist keine Prüfung.
//
// Zwei Dinge lassen sich dagegen HART prüfen, weil sie in beiden Sprachen
// dasselbe sein MÜSSEN, egal wie idiomatisch übersetzt wird:
//   1. Zahlen — „tre" darf nicht „vier" werden.
//   2. Verneinung — wer `inte` sagt und im Deutschen kein „nicht" hat, hat
//      die Aussage umgedreht. Das ist der teuerste Fehler, den es hier gibt.
export type ZahlNeinBefund = { was: string };

const SV_ZAHL: Record<string, number> = {
  noll: 0, en: 1, ett: 1, två: 2, tre: 3, fyra: 4, fem: 5, sex: 6, sju: 7, åtta: 8,
  nio: 9, tio: 10, tusen: 1000, elva: 11, tolv: 12, tretton: 13, fjorton: 14, femton: 15,
  sexton: 16, sjutton: 17, arton: 18, nitton: 19, tjugo: 20, trettio: 30,
  fyrtio: 40, femtio: 50, sextio: 60, sjuttio: 70, åttio: 80, nittio: 90, hundra: 100,
};
const DE_ZAHL: Record<string, number> = {
  null: 0, ein: 1, eine: 1, einen: 1, eins: 1, zwei: 2, drei: 3, vier: 4, fünf: 5,
  sechs: 6, sieben: 7, acht: 8, neun: 9, zehn: 10, elf: 11, zwölf: 12, dreizehn: 13,
  vierzehn: 14, fünfzehn: 15, sechzehn: 16, siebzehn: 17, achtzehn: 18, neunzehn: 19,
  zwanzig: 20, dreißig: 30, vierzig: 40, fünfzig: 50, sechzig: 60, siebzig: 70,
  achtzig: 80, neunzig: 90, hundert: 100, tausend: 1000,
};
// „en/ett" ist im Schwedischen zugleich der unbestimmte Artikel, „ein" im
// Deutschen auch — als Zahl gezählt gäbe das nur Rauschen. Ebenso Ordnungszahlen.
const ZAHL_IGNORIEREN = new Set(['en', 'ett', 'ein', 'eine', 'einen', 'eins']);

/**
 * Wortteile, die eine Zahl begleiten dürfen, ohne selbst eine zu sein:
 * Fugen („fünfUNDdreißig"), Häufigkeit („dreiMAL") und Ordnungsendungen
 * („tjugoNDE", „zwanzigSTE").
 */
// ORDNUNGSZAHLEN BEWUSST NICHT: „andra" heißt im Schwedischen zweite UND andere,
// und wo Deutsch „der Zwölfte" sagt, sagt Schwedisch „den tolfte" — die beiden
// Sprachen bilden Ordnungszahlen zu verschieden, um sie gegeneinander zu prüfen.
// Ohne diese Endungen bleiben Ordnungszahlen auf BEIDEN Seiten unerkannt; das
// ist ehrlicher als eine Prüfung, die nur die eine Seite sieht.
const ZAHL_ANHANG = ['und', 'mal', 'o', 't'];

/**
 * Zerlegt EIN Wort vollständig in Zahlwörter und erlaubte Anhänge — oder gibt
 * `null` zurück, wenn auch nur ein Rest übrig bleibt.
 *
 * WARUM VOLLSTÄNDIG: Der erste Versuch prüfte nur den Wortanfang. Schwedische
 * Zahlwörter sind kurz, also galt „sjuk" (krank) als Sieben, „sjunger" (singt)
 * als Sieben und „trevligt" (nett) als Drei — 44 Falschmeldungen. Ein Wort ist
 * nur dann eine Zahl, wenn NICHTS übrig bleibt.
 */
function zahlWort(wort: string, karte: Record<string, number>): number | null {
  const stichwoerter = Object.keys(karte).sort((a, b) => b.length - a.length);
  const anhaenge = [...ZAHL_ANHANG].sort((a, b) => b.length - a.length);
  let rest = wort;
  let summe = 0;
  let zahlGesehen = false;
  while (rest.length > 0) {
    const z = stichwoerter.find((k) => rest.startsWith(k));
    if (z) {
      // „en/ett" und „ein" sind zugleich unbestimmte Artikel. Sie zählen NICHT
      // als Zahl — sonst wäre jedes „ich wohne in einer Wohnung" ein Befund.
      if (!ZAHL_IGNORIEREN.has(z)) {
        summe += karte[z];
        zahlGesehen = true;
      }
      rest = rest.slice(z.length);
      continue;
    }
    const a = anhaenge.find((k) => rest.startsWith(k));
    if (a) {
      rest = rest.slice(a.length);
      continue;
    }
    return null;
  }
  return zahlGesehen ? summe : null;
}

/**
 * Die Zahlenwerte eines Satzes. Aufeinanderfolgende Zahlwörter zählen als EINE
 * Zahl, damit „tre hundra" (zwei Wörter) und „dreihundert" (eins) dasselbe
 * ergeben. Es geht um Übereinstimmung zwischen den Sprachen, nicht um den
 * absolut richtigen Wert — beide Seiten werden gleich gerechnet.
 */
function zahlen(text: string, karte: Record<string, number>): number[] {
  const gefunden: number[] = [];
  let offen: number | null = null;
  for (const w of woerter(text)) {
    const z = /^\d+$/.test(w) ? Number(w) : zahlWort(w, karte);
    if (z === null) {
      if (offen !== null) gefunden.push(offen);
      offen = null;
    } else {
      offen = (offen ?? 0) + z;
    }
  }
  if (offen !== null) gefunden.push(offen);
  return gefunden.sort((a, b) => a - b);
}

const SV_NEIN = new Set([
  'inte', 'aldrig', 'ingen', 'inget', 'inga', 'ingenting', 'utan', 'knappt', 'knappast',
]);
const DE_NEIN = new Set([
  'nicht', 'nie', 'niemals', 'kein', 'keine', 'keinen', 'keinem', 'keiner', 'keins',
  'nichts', 'ohne', 'niemand', 'nirgends', 'weder', 'kaum',
]);

/**
 * Redewendungen, bei denen die Verneinung ABSICHTLICH nur auf einer Seite steht.
 * „Här ligger en hund begraven" verneint nichts, heißt aber „da stimmt etwas
 * NICHT" — das ist der Birkenbihl-Effekt und kein Übersetzungsfehler.
 *
 * Bewusst als geschlossene Liste von Wendungs-Kennungen statt als Wortregel:
 * Eine Regel („`fehl` im Wort zählt als Verneinung") traf beim ersten Versuch
 * auch „empfehlen" und „Fehler" — und `^un` sogar „Und". Wer die Ausnahme nicht
 * benennen kann, hat sie nicht verstanden.
 */
// Erkannt am schwedischen Wortlaut, nicht an der Kennung: Dieselbe Wendung
// steht als Wendung, in drei Segmenten und in Gesprächen — eine Liste von
// Kennungen wäre schon beim ersten neuen Segment wieder unvollständig.
/**
 * Zeilen, in denen die Zahl auf beiden Seiten anders GEBAUT wird, ohne dass
 * sich der Wert ändert. Auch hier am Wortlaut erkannt, mit Begründung.
 */
const ZAHL_ASYMMETRIE_OK = [
  'var tjugonde', // „jede zwanzigste Minute" heißt auf Deutsch „alle zwanzig Minuten"
];

const NEIN_ASYMMETRIE_OK = [
  'en hund begraven', // „hier liegt ein Hund begraben" = da stimmt etwas nicht
];

/**
 * Stimmen Zahlen und Verneinung zwischen schwedischem Satz und Bedeutung?
 * Rein und ohne Datenmodell — damit dieselbe Regel für den Seed (über
 * `backtranslation.ts`) und für einen frisch erzeugten Satz gilt.
 */
export function zahlUndVerneinung(svRoh: string, deRoh: string): ZahlNeinBefund[] {
  const befunde: ZahlNeinBefund[] = [];
  const sv = ohnePlatzhalter(svRoh);
  const de = ohnePlatzhalter(deRoh);

  const zsv = zahlen(sv, SV_ZAHL);
  const zde = zahlen(de, DE_ZAHL);
  const zahlOk = ZAHL_ASYMMETRIE_OK.some((w) => sv.toLowerCase().includes(w));
  if (zsv.join(',') !== zde.join(',') && !zahlOk) {
    befunde.push({ was: `Zahlen: schwedisch [${zsv.join(', ')}] · deutsch [${zde.join(', ')}]` });
  }

  const nsv = woerter(sv).some((w) => SV_NEIN.has(w));
  const nde = woerter(de).some((w) => DE_NEIN.has(w));
  const neinOk = NEIN_ASYMMETRIE_OK.some((w) => sv.toLowerCase().includes(w));
  if (nsv !== nde && !neinOk) {
    befunde.push({
      was: nsv
        ? 'verneint auf Schwedisch, nicht auf Deutsch'
        : 'verneint auf Deutsch, nicht auf Schwedisch',
    });
  }
  return befunde;
}

// ── Glossen-Vollständigkeit ──────────────────────────────────────────────────
//
// Die Dekodierung wird interlinear gerendert: ein schwedisches Wort, darunter
// seine wörtliche Bedeutung, in der Reihenfolge des Satzes. Fehlt ein Wort,
// verschiebt sich die Zuordnung und der Lerner ordnet die deutsche Bedeutung
// dem FALSCHEN schwedischen Wort zu — genau das, was Dekodieren verhindern
// soll. Wiederholungen zählen doppelt: „det är kallt ute men det är varmt inne"
// braucht zweimal `det` und zweimal `är`.

export interface GlossenLuecke {
  fehlend: string[];
  ueberzaehlig: string[];
}

export function glossenLuecke(
  sv: string,
  decoding: { sv: string; de: string }[],
): GlossenLuecke {
  const want = woerter(sv);
  const pool = decoding.flatMap((t) => woerter(t.sv));
  const fehlend: string[] = [];
  for (const w of want) {
    const i = pool.indexOf(w);
    if (i === -1) fehlend.push(w);
    else pool.splice(i, 1);
  }
  return { fehlend, ueberzaehlig: pool };
}

// ── Kontext-Deckung ──────────────────────────────────────────────────────────
//
// Ein Segment muss die Wendung nicht wörtlich enthalten — Kontextvariation ist
// erwünscht (Schritt 4 des Loops). Unter dieser Deckung ist sie aber nicht mehr
// wiederzuerkennen, und der Abruf ginge ins Leere.
export const DECKUNG_MINIMUM = 0.5;

/** Toleriert Beugung und Zusammensetzung: buss/bussen, gott/jättegott. */
export function lockerGleich(a: string, b: string): boolean {
  if (a === b) return true;
  const [kurz, lang] = a.length <= b.length ? [a, b] : [b, a];
  return kurz.length >= 4 && lang.includes(kurz);
}

/** Wie viel der Wendung im Satz wiederzuerkennen ist (0 … 1). */
export function deckung(wendungSv: string, satzSv: string): number {
  const want = [...new Set(woerter(wendungSv))];
  if (!want.length) return 1;
  const imSatz = woerter(satzSv);
  const drin = want.filter((t) => imSatz.some((h) => lockerGleich(t, h))).length;
  return drin / want.length;
}

// ── Wortstellung: die zwei Fehler, die ein deutsches Modell wirklich macht ────
//
// WARUM DIESE PRÜFUNG (offener Punkt aus `docs/08-content-pipeline.md`: „Wort-
// existenz ist maschinell abgedeckt, Wortfolgen noch nicht"): Schwedisch ist
// eine V2-Sprache — im Hauptsatz steht das gebeugte Verb an zweiter Stelle, und
// die Verneinung steht DAHINTER. Deutsch tut an beiden Stellen etwas anderes.
// Ein Modell, das aus dem Deutschen heraus formuliert, produziert deshalb
// „jag inte förstår" statt „jag förstår inte" und „imorgon jag kommer" statt
// „imorgon kommer jag". Beides ist echtes Falsch-Lernen, kein Stilfehler.
//
// WAS DIESE PRÜFUNG AUSDRÜCKLICH NICHT IST: eine Grammatikprüfung. Sie kennt
// GENAU ZWEI Muster. Alles andere an der Wortfolge bleibt ungeprüft und wird
// auch nicht behauptet.
//
// WIE DIE LISTEN ENTSTANDEN SIND: gegen alle 17.794 schwedischen Zeichenketten
// des geprüften Inhalts laufen gelassen, bis NULL Fehltreffer blieben. Was dabei
// herausfiel, steht als Ausnahme unten — jede mit Grund. Eine Regel, die
// richtiges Schwedisch anmeckert, ist schlimmer als keine: Sie wirft gute Sätze
// weg und kostet den Lerner Geld auf dem eigenen Zugang.

export type WortstellungBefund = { was: string; satz: string };

/** Subjekt-Fürwörter, an denen sich der Satzbau festmachen lässt. */
const SUBJEKT = ['jag', 'du', 'han', 'hon', 'vi', 'ni', 'de', 'det', 'den', 'man'];

/**
 * Satzadverbien, die im Hauptsatz NIE vor dem gebeugten Verb stehen.
 *
 * Bewusst ohne die Modalpartikeln `nog`, `väl` und `bara`: „det bara händer"
 * kommt gesprochen vor, und eine Regel, die Umgangssprache als Fehler meldet,
 * ist keine Regel, sondern eine Meinung.
 */
const SATZADVERB = ['inte', 'aldrig', 'alltid', 'ofta', 'redan'];

/**
 * Wörter, nach denen im Vorfeld ZWINGEND das Verb folgt (Inversion).
 *
 * Bewusst NICHT dabei, jedes mit Grund:
 *   `kanske` — die berühmte Ausnahme: „kanske jag kan" ist zulässig.
 *   `sedan`  — auch Nebensatz-Einleiter: „sedan jag kom hit" = seit ich herkam.
 *   `då`     — auch „als": „då jag var liten".
 *   `där`    — auch Relativ-Anschluss: „där jag bor".
 */
const VORFELD = [
  'idag', 'imorgon', 'igår', 'nu', 'alltid', 'aldrig', 'ofta', 'ibland',
  'snart', 'tyvärr', 'förresten', 'äntligen', 'dessutom', 'därför', 'här',
];

/** Satzweise zerlegen: Beide Regeln gelten am ANFANG, nicht irgendwo mittendrin. */
function saetze(sv: string): string[] {
  return sv
    .split(/[.!?;:]+|\s—\s/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Verstößt der Satz gegen eines der zwei Muster? Rein.
 *
 * Die Regeln greifen nur am Satzanfang. Ein Nebensatz mitten im Satz („…att jag
 * inte förstår") ist damit außen vor — dort ist genau diese Stellung richtig,
 * und das ist der Grund, warum die Regeln nicht einfach nach Wortpaaren suchen.
 */
export function wortstellung(sv: string): WortstellungBefund[] {
  const befunde: WortstellungBefund[] = [];
  for (const satz of saetze(sv)) {
    const w = woerter(satz);
    if (w.length < 3) continue;

    if (SUBJEKT.includes(w[0]) && SATZADVERB.includes(w[1])) {
      befunde.push({
        satz,
        was: `„${w[0]} ${w[1]} …" — im Hauptsatz steht „${w[1]}" HINTER dem Verb`,
      });
    }

    // Ein Komma nach dem ersten Wort macht daraus einen Einschub statt eines
    // Vorfelds: „Tyvärr, jag kan inte" ist richtig, „Tyvärr jag kan inte" nicht.
    // Im eigenen Inhalt steht genau diese Bauform fünfmal — ohne die Ausnahme
    // hätte die Regel den geprüften Bestand angemeckert.
    const einschub = new RegExp(`^\\s*${w[0]}\\s*,`, 'iu').test(satz);
    if (!einschub && VORFELD.includes(w[0]) && SUBJEKT.includes(w[1])) {
      befunde.push({
        satz,
        was: `„${w[0]} ${w[1]} …" — nach „${w[0]}" am Satzanfang kommt erst das Verb, dann „${w[1]}"`,
      });
    }
  }
  return befunde;
}

// ── Beugung: zwei Formen desselben deutschen Wortes ──────────────────────────
//
// WARUM ES DIESE REGEL GIBT (Befund 2026-07-25): Die Konfliktliste des
// Rückübersetzungs-Berichts hatte 248 Zeilen, und fast jede war harmlos — `är`
// als „ist/bin/bist/sind/seid" ist keine Uneinheitlichkeit, sondern deutsche
// Grammatik. Eine Liste, in der ein echter Fehler zwischen 240 Nicht-Fehlern
// steht, wird nicht gelesen.
//
// WARUM SIE HIER STEHT UND NICHT IM WERKZEUG (2026-07-26): Dieselbe Frage
// entscheidet jetzt an zwei Stellen — im Bericht, ob eine Zeile ein Mensch
// ansehen muss, und im Tor, ob ein erzeugter Satz überhaupt gezeigt wird. Zwei
// Kopien derselben Regel driften; dann prüft die Laufzeit anders als der Bau,
// und die Laufzeit-Prüfung ist eine Behauptung.

/**
 * Deutsche Beugungsfamilien der Funktionswörter. Bewusst NUR unregelmäßige:
 * bei allem anderen reicht der gemeinsame Wortstamm weiter unten.
 */
const BEUGUNG: string[][] = [
  ['bin', 'bist', 'ist', 'sind', 'seid', 'war', 'warst', 'waren', 'sei', 'wäre', 'sein'],
  ['ha', 'habe', 'hab', 'hast', 'hat', 'haben', 'habt', 'hatte', 'hattest', 'hatten'],
  ['werde', 'wirst', 'wird', 'werden', 'werdet', 'wurde', 'wurden'],
  ['kann', 'kannst', 'können', 'könnt', 'konnte', 'könnte'],
  ['muss', 'musst', 'müssen', 'müsst', 'musste'],
  ['soll', 'sollst', 'sollen', 'sollt', 'sollte', 'sollten'],
  ['will', 'willst', 'wollen', 'wollt', 'wollte', 'wollten'],
  ['darf', 'darfst', 'dürfen', 'dürft'],
  ['mag', 'magst', 'mögen', 'mögt'],
  ['der', 'die', 'das', 'den', 'dem', 'des'],
  ['ein', 'eine', 'einen', 'einem', 'einer', 'eines', 'eins'],
  ['mein', 'meine', 'meinen', 'meinem', 'meiner', 'meins'],
  ['dein', 'deine', 'deinen', 'deinem', 'deiner', 'deins'],
  ['gut', 'gute', 'guter', 'gutes', 'guten', 'gutem'],
  ['sehe', 'siehst', 'sieht', 'sehen', 'seht', 'sieh', 'sah', 'sahen', 'gesehen'],
  ['wer', 'wen', 'wem', 'wessen'],
  ['helfe', 'hilfst', 'hilft', 'helfen', 'helft', 'hilf', 'half', 'geholfen'],
  ['gebe', 'gibst', 'gibt', 'geben', 'gebt', 'gab', 'gib'],
  ['nehme', 'nimmst', 'nimmt', 'nehmen', 'nehmt', 'nimm'],
  ['esse', 'isst', 'essen', 'esst', 'iss', 'aß'],
  ['spreche', 'sprichst', 'spricht', 'sprechen', 'sprecht', 'sprich'],
  ['komme', 'kommst', 'kommt', 'kommen', 'komm', 'kam', 'kamst', 'kamt', 'kamen'],
  ['weiss', 'weisst', 'wissen', 'wisst', 'wusste'],
  ['fahre', 'fahrst', 'fahrt', 'fahren', 'fuhr', 'fuhren'],
];

// Nach Name statt nach Index: Eine neue Familie in der Liste darf nicht
// stillschweigend aus Artikeln Fürwörter machen.
const familie = (kopf: string) => BEUGUNG.find((f) => f[0] === kopf) ?? [];
const ARTIKEL = new Set([...familie('der'), ...familie('ein')]);

/** Nur Umlaute falten — dieselbe Regel wie in `kern`. */
const falten = (w: string) =>
  w.replace(/ä/g, 'a').replace(/ö/g, 'o').replace(/ü/g, 'u').replace(/ß/g, 'ss');

/**
 * BEFUND beim Gegenlesen 2026-07-25: `kern` faltet Umlaute, die Familienlisten
 * standen ungefaltet da — „konnen" traf „können" also nie, und `kan`
 * (kann/kannst/können/könnt) landete als angeblicher Bedeutungs-Konflikt in der
 * Prüfliste. Beide Seiten durch dieselbe Faltung, sonst prüft man Luft.
 */
const BEUGUNG_GEFALTET = BEUGUNG.map((f) => new Set(f.map(falten)));

/** Glosse auf ihren Kern: Artikel weg, klein, getrimmt, Umlaute gefaltet. */
export function kern(de: string): string {
  const w = de.toLowerCase().trim().split(/\s+/).filter((x) => !ARTIKEL.has(x));
  return falten((w.length ? w : [de.toLowerCase().trim()]).join(' '));
}

/** Sind zwei Glossen nur zwei Formen DESSELBEN deutschen Wortes? */
export function nurBeugung(a: string, b: string): boolean {
  const x = kern(a);
  const y = kern(b);
  if (x === y) return true;
  if (BEUGUNG_GEFALTET.some((f) => f.has(x) && f.has(y))) return true;
  // Gemeinsamer Stamm: „gehe/gehst/gehen", „meine/meinst".
  const n = Math.min(x.length, y.length);
  if (n < 3) return false;
  let gleich = 0;
  while (gleich < n && x[gleich] === y[gleich]) gleich++;
  return gleich >= 3;
}

// ── Glossen-Konflikte gegen den geprüften Bestand ────────────────────────────
//
// Erzeugt das Modell für ein Wort eine Bedeutung, die dem widerspricht, was der
// Lerner im geprüften Inhalt bereits gelernt hat, ist das für ihn schlimmer als
// gar kein Satz: Er hält entweder die App für widersprüchlich oder sich selbst
// für vergesslich. Beugungen desselben deutschen Wortes zählen NICHT als
// Widerspruch — die Regel dafür steht in `nurBeugung` (dieselbe wie im Bericht).

export interface GlossenKonflikt {
  sv: string;
  neu: string;
  bekannt: string[];
}

/**
 * Wörter, deren deutsche Entsprechung KEINE feste Größe ist, sondern vom Satz
 * gebildet wird. `på` heißt auf/an/am/im/über/bei — das ist keine
 * Uneinheitlichkeit, das ist der Unterschied zwischen zwei Sprachen. Genau
 * deshalb steht das Dekodieren daneben: es zeigt die fremde Struktur.
 *
 * Die Liste stand ursprünglich im Rückübersetzungs-Bericht, wo sie sortiert,
 * WELCHE Zeilen ein Mensch ansehen muss. Sie steht seit 2026-07-26 hier, weil
 * das Tor sonst STRENGER wäre als die Bauprüfung — und zwar ausgerechnet bei
 * der Wortklasse, bei der die Bauprüfung gelernt hat, dass Strenge falsch ist.
 * Ein Tor, das gute Sätze wegwirft, kostet den Lerner Geld und Vertrauen.
 */
export const KONTEXTABHAENGIG = new Set([
  // Ursprünglich aus `content-review-schwedisch.md`
  'till', 'om', 'med', 'få', 'tack',
  // Präpositionen und Partikeln
  'i', 'på', 'för', 'av', 'ut', 'in', 'upp', 'åt', 'vid', 'ur', 'efter', 'under',
  'från', 'innan', 'än', 'ändå', 'först', 'mot', 'hos', 'genom', 'mellan', 'utan', 'ner',
  // „kvar" heißt übrig UND zurück — „stannade kvar" ist zurückbleiben.
  'kvar',
  // Hilfsverben und echte Homographen (var = wo/war, går = geht/gestern)
  'har', 'ska', 'får', 'var', 'går', 'gör', 'är',
  // Pronomen und Artikelwörter — Genus und Kasus kommen aus dem DEUTSCHEN Satz
  'det', 'den', 'de', 'dem', 'som', 'en', 'ett', 'ingen', 'inget',
  'mig', 'dig', 'sig', 'oss', 'er', 'henne', 'honom',
  // Satz-Adverbien: „sedan" heißt seit/dann/danach, „då" dann/denn — die Nuance
  // steht im deutschen Satz, nicht im schwedischen Wort.
  'sedan', 'sen', 'då', 'ju', 'nog', 'väl', 'bara', 'redan', 'nu',
]);

/**
 * `ausnahmen` sind Wörter, bei denen eine abweichende Glosse KEIN Widerspruch
 * ist: Funktionswörter (oben) und die Wörter, deren zweite Bedeutung die App dem
 * Lerner selbst erklärt (`polysemy.ts`). Bei ihnen etwas zu verwerfen hieße,
 * genau den Stoff wegzuwerfen, den die App an anderer Stelle als Lernmoment
 * herausstellt.
 */
export function glossenKonflikte(
  decoding: { sv: string; de: string }[],
  bekannt: Record<string, string[]>,
  istBeugung: (a: string, b: string) => boolean,
  ausnahmen: ReadonlySet<string> = KONTEXTABHAENGIG,
): GlossenKonflikt[] {
  const raus: GlossenKonflikt[] = [];
  for (const t of decoding) {
    const w = woerter(t.sv);
    if (w.length !== 1) continue; // Mehrwort-Glossen sind feste Formeln
    if (ausnahmen.has(w[0])) continue;
    const alt = bekannt[w[0]];
    if (!alt || alt.length === 0) continue;
    const neu = t.de.trim().toLowerCase();
    if (alt.some((a) => a === neu || istBeugung(a, neu))) continue;
    raus.push({ sv: w[0], neu: t.de.trim(), bekannt: alt });
  }
  return raus;
}

// ── Stufe: ist der Satz wirklich i+1? ────────────────────────────────────────
//
// WARUM ES DIESE PRÜFUNG GIBT (offener Punkt aus `09-roadmap.md`, Pipeline-
// Schritt 2 „Grading/Leveling", und aus `10-open-questions.md`): Der Prompt BAT
// das Modell, den Satz aus schon bekannten Wörtern zu bauen. Geprüft wurde es
// nie. Die App behauptete i+1 und maß es nicht.
//
// Verständlicher Input verlangt GENAU EIN neues Element pro Begegnung
// (`03-method.md`). Ein Satz mit sechs unbekannten Wörtern ist kein i+1, sondern
// eine Wand — und eine Wand ist als Lernmaterial kaputt, egal wie korrekt ihr
// Schwedisch ist.
//
// DIE LATTE KOMMT AUS DEM EIGENEN INHALT, nicht aus dem Bauch. Über 2.291
// simulierte Begegnungen mit dem handgeschriebenen Bestand gemessen:
//
//     0 neue Wörter  72,2 %
//   ≤ 1 neue Wörter  93,4 %
//   ≤ 2 neue Wörter  99,3 %
//   ≤ 4 neue Wörter  100 %   ← das Maximum, das je vorkommt
//
// Deshalb steht die harte Grenze bei 4: Alles darüber liegt außerhalb dessen,
// was der kuratierte Bestand in 2.291 Begegnungen je getan hat.

/** Mehr neue Wörter als das hat kein handgeschriebenes Segment je gehabt. */
export const STUFE_MAX = 4;

/**
 * Die Wörter des Satzes, die der Lerner noch nicht kennt — ohne die
 * Ziel-Wendung, denn die IST das erlaubte „+1". Rein.
 */
export function neueWoerter(sv: string, zielSv: string, bekannt: ReadonlySet<string>): string[] {
  const ziel = new Set(woerter(zielSv));
  return [...new Set(woerter(sv))].filter(
    (w) => !/^\d+$/.test(w) && !ziel.has(w) && !bekannt.has(w),
  );
}

// ── Wörter, die im geprüften Bestand nie vorkamen ────────────────────────────
//
// KEIN harter Fehler: Neue Wörter sind der Sinn von neuem Stoff. Aber sie sind
// der Punkt, an dem die App aufhört, etwas über die Richtigkeit sagen zu
// können — und genau das muss sie dem Lerner sagen können.
export function unbekannteWoerter(sv: string, bekannt: Set<string>): string[] {
  return [...new Set(woerter(sv))].filter((w) => !/^\d+$/.test(w) && !bekannt.has(w));
}
