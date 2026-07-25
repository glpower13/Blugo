// Spracheingabe über die Web Speech API — Phase P1 aus `docs/gremium-sprachpartner.md`.
//
// WOFÜR: Der Lerner soll die schwedische Wendung SAGEN können statt sie zu tippen.
// Geprüft wird danach exakt wie bisher (`answerCheck.ts`), gezählt wird exakt wie
// bisher (`schedule()`). Sprechen ist ein zweiter Weg zum selben Beweis — nie ein
// zweiter Maßstab (die eine Design-Regel, CLAUDE.md).
//
// DREI EHRLICHKEITEN, die dieses Modul erzwingt:
//
//   1. WO DAS AUDIO HINGEHT. Chrome und Safari erkennen standardmäßig auf einem
//      Server des Herstellers — das Audio verlässt das Gerät. Es gibt einen echten
//      On-Device-Pfad (`available({ processLocally: true })` + `install()`), der ein
//      Sprachpaket herunterlädt. Wir BEVORZUGEN ihn, und wenn er nicht da ist, sagen
//      wir es (`SpeechMode`), statt es zu verschweigen.
//   2. KEIN TOTER KNOPF. Firefox hat die Erkennung praktisch nicht. Wo sie fehlt,
//      erscheint das Mikrofon gar nicht erst.
//   3. ERKENNUNGSFEHLER SIND KEINE LERNFEHLER. Was verstanden wurde, wird dem
//      Lerner IMMER gezeigt, bevor es als Antwort gilt — sonst bestraft die App
//      einen Hörfehler des Browsers als Sprachfehler des Menschen.
//
// Getestet wird hier, was ohne Browser testbar ist (reine Funktionen); die
// Verdrahtung selbst prüft der e2e-Lauf.

/** Wo die Erkennung rechnet — für die ehrliche Anzeige. */
export type SpeechMode = 'on-device' | 'server';

/** Ergebnis eines Hörvorgangs. */
export interface HeardResult {
  transcript: string;
  confidence?: number;
  mode: SpeechMode;
}

// --- Minimale Typen -----------------------------------------------------------
// `SpeechRecognition` ist nicht in allen TS-DOM-Fassungen enthalten und in Safari
// nur mit `webkit`-Präfix vorhanden. Deshalb eine eigene, kleine Typfläche statt
// `any` — so bleibt der Aufrufcode typsicher.

interface AlternativeLike {
  transcript: string;
  confidence: number;
}
interface ResultLike {
  readonly length: number;
  [index: number]: AlternativeLike;
  isFinal?: boolean;
}
export interface RecognitionEventLike {
  results: { readonly length: number; [index: number]: ResultLike };
}

interface RecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  processLocally?: boolean;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((e: RecognitionEventLike) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
}

interface RecognitionCtor {
  new (): RecognitionLike;
  /** Neu (Chrome): Ist On-Device-Erkennung für diese Sprachen da? */
  available?(opts: { langs: string[]; processLocally?: boolean }): Promise<string>;
  /** Neu (Chrome): Sprachpaket für On-Device-Erkennung holen. */
  install?(opts: { langs: string[]; processLocally?: boolean }): Promise<boolean>;
}

function ctor(): RecognitionCtor | undefined {
  if (typeof window === 'undefined') return undefined;
  const w = window as unknown as {
    SpeechRecognition?: RecognitionCtor;
    webkitSpeechRecognition?: RecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition;
}

/** Kann dieses Gerät überhaupt zuhören? (Firefox: nein — dann kein Mikrofon zeigen.) */
export function speechInputAvailable(): boolean {
  return ctor() !== undefined;
}

/**
 * Steht die On-Device-Erkennung für die Sprache bereit?
 * `'ready'` = ja · `'downloadable'` = Paket ließe sich holen · `'no'` = nur Server.
 * Fehler werden zu `'no'` — eine kaputte Abfrage darf das Mikrofon nicht blockieren
 * (es gibt dokumentierte Fehler in aktuellen Chrome-Fassungen).
 */
export async function onDeviceStatus(lang = 'sv-SE'): Promise<'ready' | 'downloadable' | 'no'> {
  const C = ctor();
  if (!C?.available) return 'no';
  try {
    const s = await C.available({ langs: [lang], processLocally: true });
    if (s === 'available' || s === 'ready') return 'ready';
    if (s === 'downloadable' || s === 'downloading') return 'downloadable';
    return 'no';
  } catch {
    return 'no';
  }
}

/**
 * Holt das Sprachpaket für die On-Device-Erkennung (nur auf ausdrücklichen Wunsch —
 * es ist ein Download). Gibt zurück, ob es danach bereitsteht.
 */
export async function installOnDevice(lang = 'sv-SE'): Promise<boolean> {
  const C = ctor();
  if (!C?.install) return false;
  try {
    await C.install({ langs: [lang], processLocally: true });
    return (await onDeviceStatus(lang)) === 'ready';
  } catch {
    return false;
  }
}

// --- Reine Helfer (testbar ohne Browser) --------------------------------------

/** Pflückt die beste Deutung aus dem Ereignis-Wirrwarr der API. Rein. */
export function bestTranscript(e: RecognitionEventLike): { transcript: string; confidence?: number } {
  let text = '';
  let conf: number | undefined;
  for (let i = 0; i < e.results.length; i++) {
    const r = e.results[i];
    if (r.length === 0) continue;
    const alt = r[0];
    if (!alt?.transcript) continue;
    text += (text ? ' ' : '') + alt.transcript.trim();
    // Die schwächste Sicherheit der Teile ist die Sicherheit des Ganzen.
    if (typeof alt.confidence === 'number' && alt.confidence > 0) {
      conf = conf === undefined ? alt.confidence : Math.min(conf, alt.confidence);
    }
  }
  return { transcript: text.trim(), confidence: conf };
}

/**
 * Übersetzt die Fehlercodes der API in einen Satz, der einem Menschen hilft. Rein.
 * Bewusst ohne Schuldzuweisung: die häufigste Ursache ist Technik, nicht der Lerner.
 */
export function speechErrorMessage(code: string): string {
  switch (code) {
    case 'not-allowed':
    case 'service-not-allowed':
      return 'Das Mikrofon ist für diese Seite nicht erlaubt. Du kannst es in den Browser-Einstellungen freigeben — tippen geht natürlich weiter.';
    case 'no-speech':
      return 'Ich habe nichts gehört. Näher ans Mikrofon und noch mal?';
    case 'audio-capture':
      return 'Kein Mikrofon gefunden.';
    case 'network':
      return 'Die Erkennung braucht auf diesem Gerät gerade Internet — offline geht nur Tippen.';
    case 'language-not-supported':
      return 'Dieses Gerät erkennt kein Schwedisch. Tippen bleibt der Weg.';
    case 'aborted':
      return 'Aufnahme abgebrochen.';
    default:
      return 'Die Spracherkennung hat nicht funktioniert. Tippen geht weiter.';
  }
}

// --- Der eigentliche Hörvorgang ------------------------------------------------

/** Ein laufender Hörvorgang: Ergebnis abwarten, vorzeitig beenden, abbrechen. */
export interface ListenHandle {
  /** Erfüllt sich mit dem Gehörten oder wirft mit einer deutschen Meldung. */
  result: Promise<HeardResult>;
  /** Aufnahme beenden — das bisher Gehörte zählt. */
  stop(): void;
  /** Verwerfen — es kommt kein Ergebnis. */
  abort(): void;
}

/** Sicherheitsnetz: ohne Ende von selbst nach dieser Zeit schließen. */
const MAX_MS = 12_000;

// Einstellung „nur auf dem Gerät erkennen" (docs/gremium-einstellungen.md).
// Wer sie setzt, sagt: lieber gar keine Erkennung als gesendetes Audio. Das ist
// eine Haltung, keine Bequemlichkeit — deshalb wird sie hart durchgesetzt und
// nicht still unterlaufen, wenn kein Sprachpaket da ist.
let localOnly = false;

export function setSpeechLocalOnly(v: boolean): void {
  localOnly = v;
}

export const speechLocalOnly = (): boolean => localOnly;

// Ob die On-Device-Erkennung bereitsteht, wird NICHT mehr von selbst abgefragt.
//
// WARUM: `SpeechRecognition.available({ processLocally: true })` hat in aktuellen
// Chromium-Fassungen dokumentierte Fehler — in unserer CI hat der Aufruf den
// ganzen Renderer zum Absturz gebracht, sobald die Einstellungs-Fläche ihn beim
// Aufbau ausgelöst hat. Eine Abfrage, die im Vorbeigehen die Seite abschießen
// kann, darf nicht im Hintergrund laufen. Sie passiert jetzt nur noch auf
// ausdrücklichen Wunsch (Knopf in den Einstellungen); das Ergebnis wird
// gespeichert und von hier aus benutzt.
let onDeviceReady = false;

export function setOnDeviceReady(v: boolean): void {
  onDeviceReady = v;
}

export const isOnDeviceReady = (): boolean => onDeviceReady;

/**
 * Hört EINEN Satz mit. Bevorzugt On-Device, fällt sonst auf die Server-Erkennung
 * zurück — und meldet über `mode`, was es geworden ist.
 */
export function listenOnce(lang = 'sv-SE'): ListenHandle {
  const C = ctor();
  if (!C) {
    return {
      result: Promise.reject(new Error(speechErrorMessage('not-supported'))),
      stop() {},
      abort() {},
    };
  }

  const rec = new C();
  rec.lang = lang;
  rec.continuous = false;
  rec.interimResults = false;
  rec.maxAlternatives = 1;

  let mode: SpeechMode = 'server';
  let heard: { transcript: string; confidence?: number } | null = null;
  let failure: string | null = null;
  let settled = false;
  let timer: ReturnType<typeof setTimeout> | undefined;

  const result = new Promise<HeardResult>((resolve, reject) => {
    const finish = () => {
      if (settled) return;
      settled = true;
      if (timer) clearTimeout(timer);
      if (failure) reject(new Error(failure));
      else if (heard && heard.transcript) resolve({ ...heard, mode });
      else reject(new Error(speechErrorMessage('no-speech')));
    };

    rec.onresult = (e) => {
      heard = bestTranscript(e);
    };
    rec.onerror = (e) => {
      failure = speechErrorMessage(e.error);
    };
    rec.onend = finish;

    // On-Device nur setzen, wenn es NACHWEISLICH bereitsteht (einmal in den
    // Einstellungen geprüft): `processLocally = true` ohne vorhandenes
    // Sprachpaket lässt `start()` scheitern.
    if (onDeviceReady) {
      rec.processLocally = true;
      mode = 'on-device';
    } else if (localOnly) {
      failure =
        'Du hast „nur auf dem Gerät erkennen" eingestellt, aber für Schwedisch ist noch kein ' +
        'Sprachpaket geprüft. Schau in den Einstellungen unter „Sprechen" nach.';
    }

    if (failure) {
      finish();
    } else {
      try {
        rec.start();
        timer = setTimeout(() => {
          try {
            rec.stop();
          } catch {
            finish();
          }
        }, MAX_MS);
      } catch {
        failure = speechErrorMessage('audio-capture');
        finish();
      }
    }
  });

  return {
    result,
    stop() {
      try {
        rec.stop();
      } catch {
        rec.abort();
      }
    },
    abort() {
      failure = speechErrorMessage('aborted');
      try {
        rec.abort();
      } catch {
        /* egal — `onend` schließt ab */
      }
    },
  };
}
