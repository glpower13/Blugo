// Wörter, die im Schwedischen mehr als eine Bedeutung tragen.
//
// WARUM ES DIESE DATEI GIBT: Der Rückübersetzungs-Bericht führt 38 Wörter, die
// im Inhalt mit verschiedenen deutschen Bedeutungen glossiert sind. Die meisten
// davon sind KEIN Fehler — `kort` heißt wirklich „Karte" und „kurz", `mycket`
// wirklich „viel" und „sehr". Für den Lerner sah es trotzdem aus wie einer: Er
// lernt eine Bedeutung, trifft später die andere und hält die App für
// widersprüchlich oder sich selbst für vergesslich.
//
// Statt eine Bedeutung zu erzwingen (und damit falsch zu werden), sagt die App
// es jetzt. Aus dem scheinbaren Widerspruch wird der Moment, in dem man etwas
// über die Sprache lernt.
//
// WAS HIER NICHT REINGEHÖRT:
// - Beugungen derselben Bedeutung („wer"/„wen", „sehen"/„sieh").
// - Synonyme, die dasselbe meinen („nett"/„angenehm" für `trevlig`) — das ist
//   Glossen-Schwankung und wird im Inhalt vereinheitlicht, nicht erklärt.
// Aufgenommen wird nur, was ein Lerner als ZWEI Bedeutungen lernen muss.
//
// Der Test `polysemy.test.ts` hält die Liste ehrlich: Jedes Wort hier muss im
// Inhalt vorkommen und dort tatsächlich mit mehr als einer Bedeutung glossiert
// sein. Eine Behauptung ohne Deckung im Inhalt lässt den Lauf scheitern.

export type Mehrdeutig = {
  /** Das schwedische Wort, klein, genau wie in der Dekodierung. */
  sv: string;
  /** Die Bedeutungen, die ein Lerner auseinanderhalten muss. */
  bedeutungen: string[];
  /** Ein Satz, der zeigt, woran man erkennt, welche gerade gemeint ist. */
  hinweis: string;
};

export const MEHRDEUTIGE_WOERTER: Mehrdeutig[] = [
  {
    sv: 'andra',
    bedeutungen: ['andere', 'zweite'],
    hinweis: '„den andra sidan" ist die andere Seite, „den andra gången" das zweite Mal.',
  },
  {
    sv: 'ansökan',
    bedeutungen: ['Bewerbung', 'Antrag'],
    hinweis: 'Beim Arbeitgeber ist es die Bewerbung, bei der Behörde der Antrag.',
  },
  {
    sv: 'att',
    bedeutungen: ['zu', 'dass'],
    hinweis: 'Vor einem Verb heißt es „zu", nach „sagen" oder „glauben" heißt es „dass".',
  },
  {
    sv: 'borta',
    bedeutungen: ['weg', 'drüben'],
    hinweis: 'Allein heißt es „weg", nach „där" heißt „där borta" da drüben.',
  },
  {
    sv: 'där',
    bedeutungen: ['dort', 'wo'],
    hinweis: 'Am Satzanfang zeigt es hin („dort"), im Nebensatz verbindet es („wo").',
  },
  {
    sv: 'fel',
    bedeutungen: ['Fehler', 'falsch'],
    hinweis: 'Mit Artikel ist es das Ding („ein Fehler"), ohne beschreibt es („falsch").',
  },
  {
    sv: 'flyttar',
    bedeutungen: ['zieht um', 'verlegt'],
    hinweis: '„flytta" bewegt beides: den Wohnort und einen Termin.',
  },
  {
    sv: 'framme',
    bedeutungen: ['angekommen', 'bereit'],
    hinweis: 'Vom Weg her heißt es angekommen, auf dem Tisch heißt es bereitgestellt.',
  },
  {
    sv: 'gång',
    bedeutungen: ['Mal', 'Gang'],
    hinweis: '„en gång till" ist noch einmal, „gången" ist der Flur.',
  },
  {
    sv: 'gott',
    bedeutungen: ['gut', 'lecker'],
    hinweis: 'Beim Essen heißt „gott" lecker, sonst einfach gut.',
  },
  {
    sv: 'högt',
    bedeutungen: ['hoch', 'laut'],
    hinweis: 'Beim Preis oder Berg heißt es hoch, beim Reden laut.',
  },
  {
    sv: 'ifrån',
    bedeutungen: ['her', 'davon'],
    hinweis: '„var kommer du ifrån" fragt woher; sonst zeigt es weg von etwas.',
  },
  {
    sv: 'kort',
    bedeutungen: ['Karte', 'kurz'],
    hinweis: '„med kort" ist mit Karte, „kort sagt" heißt kurz gesagt.',
  },
  {
    sv: 'lager',
    bedeutungen: ['Lager', 'Schicht'],
    hinweis: 'Im Geschäft ist es das Lager, bei Kleidung oder Erde eine Schicht.',
  },
  {
    sv: 'mitt',
    bedeutungen: ['mein', 'Mitte'],
    hinweis: 'Vor einem Wort heißt es „mein", in „mitt i" heißt es mitten in.',
  },
  {
    sv: 'mycket',
    bedeutungen: ['viel', 'sehr'],
    hinweis: 'Vor einem Hauptwort heißt es viel, vor einem Eigenschaftswort sehr.',
  },
  {
    sv: 'mål',
    bedeutungen: ['Tor', 'Ziel'],
    hinweis: 'Im Sport ist es das Tor, sonst das Ziel — „i mål" heißt am Ziel.',
  },
  {
    sv: 'när',
    bedeutungen: ['wann', 'wenn'],
    hinweis: 'In der Frage heißt es wann, im Nebensatz wenn oder als.',
  },
  {
    sv: 'precis',
    bedeutungen: ['genau', 'gerade'],
    hinweis: 'Als Antwort heißt es genau, vor einem Verb gerade eben.',
  },
  {
    sv: 'ringde',
    bedeutungen: ['klingelte', 'rief an'],
    hinweis: '„ringa" ist beides: Es klingelt, und man ruft an.',
  },
  {
    sv: 'runt',
    bedeutungen: ['rund', 'um'],
    hinweis: 'Allein heißt es rund, vor einem Ort heißt es um … herum.',
  },
  {
    sv: 'skulle',
    bedeutungen: ['würde', 'sollte'],
    hinweis: 'Höflich gemeint heißt es würde, als Auftrag sollte.',
  },
  {
    sv: 'stannade',
    bedeutungen: ['hielt an', 'blieb'],
    hinweis: '„stanna" ist beides: anhalten und bleiben.',
  },
  {
    sv: 'så',
    bedeutungen: ['so', 'also'],
    hinweis: 'Vor einem Eigenschaftswort heißt es so, am Satzanfang also.',
  },
  {
    sv: 'tid',
    bedeutungen: ['Zeit', 'Termin'],
    hinweis: '„ingen tid" ist keine Zeit, „boka en tid" heißt einen Termin machen.',
  },
  {
    sv: 'utanför',
    bedeutungen: ['außerhalb', 'draußen vor'],
    hinweis: '„utanför budgeten" ist außerhalb, „utanför dörren" draußen vor der Tür.',
  },
  {
    sv: 'vad',
    bedeutungen: ['was', 'wie'],
    hinweis: 'In der Frage heißt es was, im Ausruf „vad roligt!" heißt es wie schön!',
  },
  {
    sv: 'vägen',
    bedeutungen: ['Weg', 'Straße'],
    hinweis: '„på vägen" kann beides sein — der Weg dorthin oder die Straße selbst.',
  },
  {
    sv: 'visst',
    bedeutungen: ['klar', 'wohl'],
    hinweis: 'Als Antwort heißt es klar, mitten im Satz „wohl" oder „anscheinend".',
  },
];

const NACH_WORT = new Map(MEHRDEUTIGE_WOERTER.map((m) => [m.sv, m]));

/**
 * Die Bedeutungen, die an DIESER Stelle nicht gemeint sind.
 *
 * Im Satz steht die Glosse gebeugt: `ansökan` als „der Bewerbung", `flyttar`
 * als „verlegen". Das ist nicht die andere Bedeutung, sondern dieselbe in
 * anderer Form — sie darf nicht als Gegensatz erscheinen.
 *
 * Zwei Regeln, beide nötig:
 * 1. GANZE Wörter, nicht Zeichenketten. „der Bewerbung" deckt „Bewerbung",
 *    aber „also" deckt NICHT „so" — sonst hätte `så` an seiner eigenen
 *    Bedeutung „so" plötzlich nichts mehr zu sagen (im Test aufgefallen).
 * 2. Vier gemeinsame Anfangsbuchstaben fangen die Beugung: „verlegen"/
 *    „verlegt" fallen zusammen, „Karte"/„kurz", „wann"/„wenn" und
 *    „genau"/„gerade" bleiben getrennt.
 */
export function andereBedeutungen(eintrag: Mehrdeutig, hier: string): string[] {
  const woerter = (s: string) => s.toLowerCase().split(/[^\p{L}]+/u).filter(Boolean);
  const h = hier.toLowerCase().trim();
  const hw = woerter(h);
  return eintrag.bedeutungen.filter((b) => {
    const l = b.toLowerCase();
    const lw = woerter(l);
    if (lw.length && lw.every((w) => hw.includes(w))) return false;
    if (hw.length && hw.every((w) => lw.includes(w))) return false;
    let gleich = 0;
    while (gleich < Math.min(h.length, l.length) && h[gleich] === l[gleich]) gleich++;
    return gleich < 4;
  });
}

/**
 * Die mehrdeutigen Wörter dieser Dekodierung — mit der Bedeutung, die HIER
 * benutzt wird, damit der Hinweis die aktuelle Stelle einordnet statt sie zu
 * wiederholen.
 */
export function mehrdeutigeInDekodierung(
  decoding: { sv: string; de: string }[],
): { eintrag: Mehrdeutig; hier: string }[] {
  const gesehen = new Set<string>();
  const treffer: { eintrag: Mehrdeutig; hier: string }[] = [];
  for (const t of decoding) {
    const wort = t.sv.toLowerCase();
    const eintrag = NACH_WORT.get(wort);
    if (!eintrag || gesehen.has(wort)) continue;
    gesehen.add(wort);
    treffer.push({ eintrag, hier: t.de });
  }
  return treffer;
}
