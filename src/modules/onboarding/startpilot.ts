// Der Startpilot — Motor und Ablauf. Reine Funktionen, ohne Oberfläche.
//
// DAS PROBLEM: Der Inhalt dieser App begann bei „hur mår du?" und „jag förstår
// inte". Wer noch nie ein schwedisches Wort gesehen hat, steht damit vor einer
// Wand. Es fehlte die erste Stufe — nicht mehr Stoff, sondern ein sanfterer
// Anfang.
//
// DAS VERSPRECHEN, DAS ER HÄLT: In etwa fünf Minuten begegnet man sechzehn
// Wörtern, die man SOFORT sagen kann, und prüft nach jedem Viererblock kurz
// nach, was hängengeblieben ist.
//
// UND DIE GRENZE, DIE ER EINHÄLT (`CLAUDE.md`, die eine Design-Regel): Was hier
// gemessen wird, ist ein WIEDERERKENNEN aus drei Möglichkeiten — der leichteste
// Abruf, den es gibt. Er läuft durch dieselbe Memory-Engine wie alles andere
// (kein zweiter Zähler), aber er kann per Konstruktion nichts „beweisen":
// `provenStableAt` verlangt die Produktions-Stufe nach über neunzig Tagen. Der
// Startpilot verschafft einen Anfang, keinen Fortschritt. Genau das sagt er dem
// Lerner auch am Ende.

import type { Chunk } from '../../domain/chunk';

/** Wie viele Wörter zwischen zwei kleinen Proben liegen. */
export const BLOCK = 4;

/** Wie viele Möglichkeiten eine Probe-Frage anbietet. */
export const OPTIONEN = 3;

/**
 * Ein Schritt des Startpiloten. Der Ablauf ist eine feste Liste — dadurch ist er
 * vollständig testbar, und die Oberfläche muss keine Reihenfolge kennen.
 */
export type Schritt =
  | { art: 'begegnen'; chunkId: string; nummer: number; vonWievielen: number }
  | { art: 'probe'; frage: Frage; blockNr: number; imBlock: number; blockGroesse: number }
  | { art: 'ende' };

export interface Frage {
  /** Die Wendung, die gefragt wird. */
  chunkId: string;
  /** Was auf Deutsch dasteht. */
  de: string;
  /** Die schwedischen Möglichkeiten, in fester Reihenfolge. */
  optionen: string[];
  /** Welche davon stimmt. */
  richtig: string;
}

/** Kurz gesagt: wann sagt man das? Lernerseitig, deutsch. */
export const WANN: Record<string, string> = {
  'c-fw-hej': 'Das Grußwort für alles — Laden, Büro, Freunde. Auch beim Abschied hört man es.',
  'c-fw-tack': 'Danke — und in Schweden sagt man es oft. Auch als höfliches „bitte" beim Bestellen.',
  'c-fw-ja': 'Ja. Klingt fast wie im Deutschen, wird aber kürzer gesprochen.',
  'c-fw-nej': 'Nein. Das „j" spricht man wie ein deutsches „j" in „ja".',
  'c-fw-hallo': 'Wenn man jemanden sucht oder ans Telefon geht — nicht zur Begrüßung.',
  'c-fw-godmorgon': 'Bis etwa zehn Uhr. Danach reicht „hej".',
  'c-fw-godnatt': 'Nur zum Schlafengehen, nicht zum Abschied am Abend.',
  'c-fw-kanske': 'Vielleicht — das freundliche Ausweichen, wenn man sich nicht festlegen will.',
  'c-fw-garna': 'Gern — die schwedische Standardantwort auf ein Angebot.',
  'c-fw-tyvarr': 'Leider. Damit lehnt man ab, ohne unhöflich zu sein.',
  'c-fw-visst': 'Klar, na klar. Lockerer als „ja".',
  'c-fw-vanta': 'Warte. Ein Wort, das im Alltag ständig fällt.',
  'c-fw-titta': 'Schau. Wenn man jemanden auf etwas aufmerksam macht.',
  'c-fw-kom': 'Komm. Kurz und direkt, ohne unfreundlich zu sein.',
  'c-fw-snalla': 'Bitte — aber bittend, nicht als Höflichkeitsfloskel. Dafür nimmt man „tack".',
  'c-fw-jattebra': 'Super. „jätte-" ist die schwedische Verstärkung: jättegod, jättekul, jättestor.',
};

/**
 * Die Ablenker für eine Frage: andere Wörter DIESES Startpiloten.
 *
 * Bewusst aus dem eigenen Vorrat und nicht zufällig aus dem ganzen Inhalt: Wer
 * gerade „tack" gelernt hat, soll es von „hej" und „ja" unterscheiden — nicht
 * von einem Wort, das er nie gesehen hat. Eine Frage, die man ohne Wissen lösen
 * kann, misst nichts.
 *
 * `versatz` ersetzt den Zufall: Die App muss bei gleichem Stand denselben
 * Ablauf erzeugen (sonst ist nichts reproduzierbar prüfbar), und ein fester
 * Versatz je Frage streut trotzdem sichtbar.
 */
export function ablenker(alle: Chunk[], ziel: Chunk, versatz: number): string[] {
  const andere = alle.filter((c) => c.id !== ziel.id).map((c) => c.sv);
  if (andere.length === 0) return [];
  const raus: string[] = [];
  for (let i = 0; raus.length < OPTIONEN - 1 && i < andere.length; i++) {
    const kandidat = andere[(versatz * 7 + i * 5) % andere.length];
    if (!raus.includes(kandidat)) raus.push(kandidat);
  }
  return raus;
}

/** Baut eine Probe-Frage — mit fester, aber je Frage anderer Position der Lösung. */
export function frageFuer(alle: Chunk[], ziel: Chunk, versatz: number): Frage {
  const falsche = ablenker(alle, ziel, versatz);
  const optionen = [...falsche];
  optionen.splice(versatz % (optionen.length + 1), 0, ziel.sv);
  return { chunkId: ziel.id, de: ziel.de, optionen, richtig: ziel.sv };
}

/**
 * Der ganze Ablauf: je `BLOCK` Wörter begegnen, dann dieselben `BLOCK` Wörter
 * abfragen. Am Ende ein Abschluss.
 *
 * Warum erst begegnen und dann prüfen, statt Wort für Wort abwechselnd: Zwischen
 * Begegnung und Abruf muss etwas liegen, sonst prüft man das Kurzzeitgedächtnis
 * und nicht das Behalten (Testing Effect, `02-science.md`).
 */
export function ablauf(woerter: Chunk[]): Schritt[] {
  const schritte: Schritt[] = [];
  for (let start = 0; start < woerter.length; start += BLOCK) {
    const block = woerter.slice(start, start + BLOCK);
    const blockNr = Math.floor(start / BLOCK);
    for (const [i, c] of block.entries()) {
      schritte.push({
        art: 'begegnen',
        chunkId: c.id,
        nummer: start + i + 1,
        vonWievielen: woerter.length,
      });
    }
    for (const [i, c] of block.entries()) {
      schritte.push({
        art: 'probe',
        frage: frageFuer(woerter, c, start + i),
        blockNr,
        imBlock: i + 1,
        blockGroesse: block.length,
      });
    }
  }
  schritte.push({ art: 'ende' });
  return schritte;
}

/**
 * Der ehrliche Abschluss-Satz.
 *
 * Er darf NICHT feiern. „16 von 16!" wäre eine Zahl, die nach Können aussieht
 * und keines ist — ein Wiedererkennen aus drei Möglichkeiten, Minuten nach der
 * Begegnung. Deshalb steht hier, was wirklich passiert ist, und was noch fehlt.
 */
export function abschluss(richtig: number, gesamt: number): { titel: string; text: string } {
  const titel =
    richtig === gesamt
      ? 'Alle sechzehn wiedererkannt.'
      : `${richtig} von ${gesamt} auf Anhieb wiedererkannt.`;
  return {
    titel,
    text:
      'Das war ein Wiedererkennen — der leichteste Abruf, den es gibt, und Minuten ' +
      'nach der Begegnung. Es zählt als Anfang, nicht als Beweis. Ob die Wörter ' +
      'wirklich sitzen, zeigt sich erst, wenn sie in ein paar Tagen wiederkommen — ' +
      'und dafür sind sie ab jetzt eingeplant.',
  };
}
