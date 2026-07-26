// Einstellungen des Lerners (docs/gremium-einstellungen.md).
//
// Jede Einstellung hier hat eine ECHTE Wirkung — Regler, die nichts tun, fliegen
// raus. Und keine davon verändert den MASSSTAB: „bewiesen stabil" bleibt in jeder
// Stellung derselbe empirische Beweis (ein gelungener Produktions-Abruf nach einer
// tatsächlich vergangenen langen Pause). Die Regler ändern den AUFWAND, nicht die
// Wahrheit — das ist die Bedingung, unter der es sie überhaupt geben darf
// (die eine Design-Regel, CLAUDE.md).
//
// Lokal gespeichert, wie alles in dieser App. Es gibt keinen Server.

export interface Preferences {
  /**
   * Erhalt-Ziel (FSRS „desired retention"): Auf welche Erinnerungs-Wahrschein-
   * lichkeit hin geplant wird. 0,90 ist der belegte Kompromiss; höher heißt
   * überproportional mehr Wiederholungen, niedriger heißt weniger Aufwand und
   * öfter vergessen.
   */
  retention: number;
  /**
   * Obergrenze für NEUE Wendungen pro Sitzung. `null` = die Engine entscheidet
   * anhand deiner Erfolgsquote (Voreinstellung, Anti-Klippe).
   */
  newPerSession: number | null;
  /** Sprechtempo der Vorlesestimme (1 = normal). */
  speechRate: number;
  /**
   * Spracherkennung NUR auf dem Gerät zulassen. Aus = wenn kein Sprachpaket da
   * ist, erkennt der Browser-Hersteller (das Audio verlässt das Gerät). An =
   * lieber gar keine Erkennung als gesendetes Audio.
   */
  speechLocalOnly: boolean;
  /**
   * Ergebnis der EINMALIGEN, ausdrücklich angestoßenen Prüfung, ob dieses Gerät
   * Schwedisch selbst erkennen kann. Wird nicht von allein gesetzt — die Abfrage
   * kann in manchen Browser-Fassungen die Seite abschießen und läuft deshalb nur
   * auf Knopfdruck (siehe `speech.ts`).
   */
  speechOnDeviceReady: boolean;
  /**
   * Wann zuletzt eine Sicherung geschrieben wurde — und wie viele Wendungen
   * damals bewiesen stabil waren.
   *
   * WOZU: Der ganze Lernstand liegt in einem Browser. Wer ihn löscht, löscht
   * auch 90 Tage bewiesene Stabilität. Das steht ehrlich in den Einstellungen —
   * aber wer dort nie hinsieht, erfährt es nie. Aus diesen beiden Zahlen lässt
   * sich die einzige Aussage bilden, die WAHR ist und nicht nörgelt: „So viele
   * bewiesene Wendungen stehen in keiner Sicherung." Ist die Zahl null,
   * erscheint gar nichts.
   */
  lastBackupAt: number | null;
  lastBackupProven: number;
}

export const RETENTION_MIN = 0.8;
export const RETENTION_MAX = 0.95;
export const RETENTION_DEFAULT = 0.9;

/** Erlaubte Obergrenzen für neuen Stoff — plus `null` für „automatisch". */
export const NEW_PER_SESSION_OPTIONS: (number | null)[] = [null, 1, 2, 3, 5, 8];

export const SPEECH_RATE_MIN = 0.6;
export const SPEECH_RATE_MAX = 1.1;
export const SPEECH_RATE_DEFAULT = 0.9;

const KEY = 'neurolang.prefs.v1';

export function defaultPreferences(): Preferences {
  return {
    retention: RETENTION_DEFAULT,
    newPerSession: null,
    speechRate: SPEECH_RATE_DEFAULT,
    speechLocalOnly: false,
    speechOnDeviceReady: false,
    lastBackupAt: null,
    lastBackupProven: 0,
  };
}

const clamp = (v: number, lo: number, hi: number): number => Math.min(hi, Math.max(lo, v));

/**
 * Macht aus beliebigen gespeicherten Daten eine gültige Einstellung (rein).
 * Bewusst großzügig: eine kaputte Datei darf die App nicht lahmlegen, sie fällt
 * still auf die Voreinstellung zurück.
 */
export function normalizePreferences(raw: unknown): Preferences {
  const d = defaultPreferences();
  if (!raw || typeof raw !== 'object') return d;
  const r = raw as Partial<Record<keyof Preferences, unknown>>;
  return {
    retention:
      typeof r.retention === 'number' && Number.isFinite(r.retention)
        ? clamp(r.retention, RETENTION_MIN, RETENTION_MAX)
        : d.retention,
    newPerSession:
      typeof r.newPerSession === 'number' && Number.isFinite(r.newPerSession)
        ? clamp(Math.round(r.newPerSession), 1, 20)
        : null,
    speechRate:
      typeof r.speechRate === 'number' && Number.isFinite(r.speechRate)
        ? clamp(r.speechRate, SPEECH_RATE_MIN, SPEECH_RATE_MAX)
        : d.speechRate,
    speechLocalOnly: r.speechLocalOnly === true,
    speechOnDeviceReady: r.speechOnDeviceReady === true,
    lastBackupAt:
      typeof r.lastBackupAt === 'number' && Number.isFinite(r.lastBackupAt) && r.lastBackupAt > 0
        ? r.lastBackupAt
        : null,
    lastBackupProven:
      typeof r.lastBackupProven === 'number' && Number.isFinite(r.lastBackupProven)
        ? Math.max(0, Math.round(r.lastBackupProven))
        : 0,
  };
}

/**
 * Wie viele bewiesen stabile Wendungen in keiner Sicherung stehen.
 *
 * Rein und bewusst schlicht: Die Zahl darf nie größer sein als das, was
 * tatsächlich bewiesen ist, und nie negativ — sonst behauptet der Hinweis
 * einen Verlust, den es nicht gibt. Genau null heißt: nichts anzeigen.
 */
export function ungesicherteBeweise(proven: number, p: Preferences): number {
  return Math.max(0, proven - (p.lastBackupAt ? p.lastBackupProven : 0));
}

/**
 * Wie sich das Erhalt-Ziel auf die Wiederholungs-Menge auswirkt — als Faktor
 * gegenüber der Voreinstellung 0,90. Rein, damit die Fläche eine ehrliche Zahl
 * zeigen kann statt eines Gefühls.
 *
 * Herleitung: Das Intervall wächst, wenn das Ziel sinkt; die Menge der fälligen
 * Wiederholungen verhält sich umgekehrt zum Intervall. Aus der FSRS-Formel
 * (Potenz-Vergessenskurve mit DECAY = −0,5) folgt für das Intervall der Faktor
 * (r^(1/DECAY) − 1), also (1/r² − 1).
 */
export function workloadFactor(retention: number): number {
  const interval = (r: number) => 1 / (r * r) - 1;
  return interval(RETENTION_DEFAULT) / interval(clamp(retention, RETENTION_MIN, RETENTION_MAX));
}

// --- Speicher (localStorage mit In-Memory-Ersatz für private Modi/Tests) -------

const mem: Record<string, string> = {};
const backend: Pick<Storage, 'getItem' | 'setItem'> = (() => {
  try {
    const t = '__nl_prefs_test__';
    window.localStorage.setItem(t, '1');
    window.localStorage.removeItem(t);
    return window.localStorage;
  } catch {
    return {
      getItem: (k: string) => (k in mem ? mem[k] : null),
      setItem: (k: string, v: string) => {
        mem[k] = v;
      },
    };
  }
})();

export function loadPreferences(): Preferences {
  try {
    const raw = backend.getItem(KEY);
    return normalizePreferences(raw ? JSON.parse(raw) : null);
  } catch {
    return defaultPreferences();
  }
}

export function savePreferences(p: Preferences): void {
  try {
    backend.setItem(KEY, JSON.stringify(p));
  } catch {
    /* Speicher voll o. Ä. — bewusst ignoriert, die App läuft weiter. */
  }
}
