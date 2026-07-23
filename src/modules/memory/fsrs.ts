// FSRS — Free Spaced Repetition Scheduler (DSR-Modell: Difficulty, Stability,
// Retrievability). Implementiert den FSRS-5-Formelkern mit den offiziellen
// Standard-Parametern. FSRS ist open source (MIT) und in Anki der Standard;
// es erreicht dieselbe Behaltensquote wie SM-2 mit deutlich weniger
// Wiederholungen (docs/gremium-weltklasse.md §5–§6).
//
// Formeln/Parameter per Live-Recherche (Juli 2026) verifiziert:
//   https://github.com/open-spaced-repetition/awesome-fsrs/wiki/The-Algorithm
//
// EHRLICHKEIT: Dies ist der Algorithmus-Kern mit STANDARD-Parametern. Die
// nutzerspezifische Parameter-Optimierung auf echten Review-Logs (der zusätzliche
// Feinschliff von „FSRS-6") braucht Nutzungsdaten und ist ein späterer Schritt
// (docs/10-open-questions.md). Der große Hebel — das DSR-Modell selbst — ist hier.

/** Bewertung wie in FSRS: 1 = Again, 2 = Hard, 3 = Good, 4 = Easy. */
export type FsrsGrade = 1 | 2 | 3 | 4;

/** FSRS-5-Standardparameter w0..w18 (offizielle Defaults). */
export const DEFAULT_W: readonly number[] = [
  0.40255, 1.18385, 3.173, 15.69105, 7.1949, 0.5345, 1.4604, 0.0046, 1.54575,
  0.1192, 1.01925, 1.9395, 0.11, 0.29605, 2.2698, 0.2315, 2.9898, 0.51655, 0.6621,
];

// Vergessenskurve (FSRS-4.5/5): R(t,S) = (1 + FACTOR·t/S)^DECAY, so geeicht,
// dass beim Intervall t = S genau R = 0.9 gilt.
export const DECAY = -0.5;
export const FACTOR = 0.9 ** (1 / DECAY) - 1; // = 19/81 ≈ 0.234568

/** Ziel-Abrufwahrscheinlichkeit im Moment des Fälligwerdens. */
export const DEFAULT_REQUEST_RETENTION = 0.9;

const S_MIN = 0.01;
const S_MAX = 36500; // ~100 Jahre Deckel
const clampD = (d: number): number => Math.min(10, Math.max(1, d));
const clampS = (s: number): number => Math.min(S_MAX, Math.max(S_MIN, s));

/** Abrufwahrscheinlichkeit nach t Tagen bei Stabilität S. */
export function retrievability(t: number, s: number): number {
  return (1 + FACTOR * (t / s)) ** DECAY;
}

/** Intervall (Tage), bis die Abrufwahrscheinlichkeit auf `request` fällt. */
export function intervalForRetention(
  s: number,
  request: number = DEFAULT_REQUEST_RETENTION,
): number {
  return (s / FACTOR) * (request ** (1 / DECAY) - 1);
}

/** Anfangsstabilität nach der allerersten Bewertung. */
export function initialStability(g: FsrsGrade, w: readonly number[] = DEFAULT_W): number {
  return clampS(w[g - 1]);
}

/** Anfangsschwierigkeit nach der allerersten Bewertung, geklemmt auf [1,10]. */
export function initialDifficulty(g: FsrsGrade, w: readonly number[] = DEFAULT_W): number {
  return clampD(w[4] - Math.exp(w[5] * (g - 1)) + 1);
}

/** Ziel der „Rückkehr zur Mitte": Anfangsschwierigkeit bei Grade 4 (Easy). */
function meanReversionTarget(w: readonly number[] = DEFAULT_W): number {
  return w[4] - Math.exp(w[5] * 3) + 1;
}

/** Nächste Schwierigkeit: lineare Dämpfung + Rückkehr zur Mitte, geklemmt [1,10]. */
export function nextDifficulty(
  d: number,
  g: FsrsGrade,
  w: readonly number[] = DEFAULT_W,
): number {
  const delta = -w[6] * (g - 3);
  const damped = d + delta * ((10 - d) / 9);
  const reverted = w[7] * meanReversionTarget(w) + (1 - w[7]) * damped;
  return clampD(reverted);
}

/** Neue Stabilität nach erfolgreichem Abruf (g ≥ 2). Hard bremst, Easy beschleunigt. */
export function nextRecallStability(
  d: number,
  s: number,
  r: number,
  g: FsrsGrade,
  w: readonly number[] = DEFAULT_W,
): number {
  const hardPenalty = g === 2 ? w[15] : 1;
  const easyBonus = g === 4 ? w[16] : 1;
  const inc =
    Math.exp(w[8]) *
    (11 - d) *
    s ** -w[9] *
    (Math.exp(w[10] * (1 - r)) - 1) *
    hardPenalty *
    easyBonus;
  return clampS(s * (1 + inc));
}

/** Neue Stabilität nach Fehlabruf (g = 1). Ein Fehlabruf erhöht die Stabilität nie. */
export function nextForgetStability(
  d: number,
  s: number,
  r: number,
  w: readonly number[] = DEFAULT_W,
): number {
  const sf =
    w[11] * d ** -w[12] * ((s + 1) ** w[13] - 1) * Math.exp(w[14] * (1 - r));
  return clampS(Math.min(sf, s));
}
