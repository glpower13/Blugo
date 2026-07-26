// On-device Sprachausgabe über die Web Speech API (die im Gerät/Browser
// eingebauten Stimmen — auf modernen Systemen KI-Stimmen). Kostenlos, ohne
// Schlüssel, nichts verlässt das Gerät. Standard-Adapter hinter dem
// SpeechSynthesizer-Port (src/modules/content/ports.ts).
//
// Ein herunterladbarer neuronaler Motor (z. B. Kokoro) bleibt bewusst eine
// spätere Entscheidung — er widerspräche „schlank + keine Drittanbieter zur
// Laufzeit" (docs/05-architecture.md, docs/10-open-questions.md).

/** Minimales Stimm-Modell — reicht für die Auswahl und ist ohne DOM testbar. */
export interface VoiceLike {
  lang: string;
  localService?: boolean;
  name?: string;
}

/**
 * Wählt die beste schwedische Stimme nach Präferenz (reine Funktion):
 * sv-SE lokal → sv-SE → irgendeine lokale sv → irgendeine sv. Ohne sv: undefined
 * (dann lieber ehrlich keine erzwingen, als Schwedisch mit falscher Stimme lesen).
 */
export function selectSwedishVoice<T extends VoiceLike>(voices: readonly T[]): T | undefined {
  const sv = voices.filter((v) => v.lang && v.lang.toLowerCase().startsWith('sv'));
  if (sv.length === 0) return undefined;
  const isSvSe = (v: VoiceLike) => v.lang.toLowerCase() === 'sv-se';
  return (
    sv.find((v) => isSvSe(v) && v.localService) ??
    sv.find(isSvSe) ??
    sv.find((v) => v.localService) ??
    sv[0]
  );
}

/**
 * Läuft die gewählte schwedische Stimme WIRKLICH auf dem Gerät?
 *
 * Die Einstellungen behaupteten „Die Stimme kommt vom Gerät, nicht aus dem
 * Netz." — die Auswahl oben fällt aber notfalls auf eine Netz-Stimme zurück
 * (`sv.find(isSvSe)`, `sv[0]`). Eine App, die Ehrlichkeit als Produkt hat, darf
 * das nicht pauschal versprechen (Ehrlichkeits-Audit 2026-07-25).
 *
 * `undefined` = keine schwedische Stimme vorhanden; sonst der echte Zustand.
 */
export function swedishVoiceIsLocal(): boolean | undefined {
  const v = selectSwedishVoice(currentVoices());
  if (!v) return undefined;
  return v.localService === true;
}

export function ttsAvailable(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

// Stimmen werden asynchron geladen: einmal holen und bei "voiceschanged"
// auffrischen, sonst ist die Liste beim ersten Aufruf oft leer (der Bug zuvor).
let voiceCache: SpeechSynthesisVoice[] = [];

function loadVoices(): void {
  if (ttsAvailable()) voiceCache = window.speechSynthesis.getVoices();
}

function currentVoices(): SpeechSynthesisVoice[] {
  if (voiceCache.length === 0) loadVoices();
  return voiceCache;
}

/** Steht (bereits) eine echte schwedische Stimme zur Verfügung? */
export function swedishVoiceAvailable(): boolean {
  return ttsAvailable() && selectSwedishVoice(currentVoices()) !== undefined;
}

/**
 * Weiß das Gerät NACHWEISLICH, dass es keine schwedische Stimme hat?
 *
 * WARUM DIESE FRAGE UND NICHT `!swedishVoiceAvailable()`: Eine leere
 * Stimmenliste heißt „noch nicht geladen", nicht „keine da" — manche
 * Android-Umgebungen liefern erst nach der ersten Nutzergeste etwas. Wer die
 * beiden Fälle verwechselt, schaltet die Sprachausgabe auf Geräten ab, auf
 * denen sie funktioniert.
 *
 * NACHWEISLICH heißt hier: Das Gerät meldet Stimmen — und keine davon ist
 * schwedisch. Nur dann wird geschwiegen (siehe `speakSwedish`).
 */
export function swedishVoiceMissing(): boolean {
  if (!ttsAvailable()) return false;
  const all = currentVoices();
  return all.length > 0 && selectSwedishVoice(all) === undefined;
}

/** Meldet, sobald das Gerät seine Stimmenliste nachgereicht hat. */
export function onVoicesChanged(fn: () => void): () => void {
  if (!ttsAvailable()) return () => {};
  window.speechSynthesis.addEventListener('voiceschanged', fn);
  return () => window.speechSynthesis.removeEventListener('voiceschanged', fn);
}

// Sprechtempo aus den Einstellungen (docs/gremium-einstellungen.md). Eine
// veränderliche Voreinstellung statt eines durchgereichten Werts: Vorlesen wird
// an einem Dutzend Stellen ausgelöst, und keine davon soll die Einstellung
// kennen müssen.
let defaultRate = 0.9;

export function setSpeechRate(rate: number): void {
  defaultRate = rate;
}

/** Das eingestellte Tempo. */
export const speechRate = (): number => defaultRate;

/** Das „langsam"-Tempo — immer deutlich unter dem eingestellten, nie zu langsam. */
export const slowSpeechRate = (): number => Math.max(0.4, defaultRate - 0.3);

/**
 * Liest den Text auf Schwedisch vor. `rate` < 1 = langsamer (Didaktik: Tempo).
 *
 * Erfüllt sich, wenn das Vorlesen ZU ENDE ist — das braucht der freihändige
 * Modus im Sparring: erst ausreden lassen, dann zuhören. Ohne Sprachausgabe
 * erfüllt es sich sofort, damit der Aufrufer nicht hängt.
 */
export function speakSwedish(text: string, rate = defaultRate): Promise<void> {
  if (!ttsAvailable()) return Promise.resolve();
  // BEFUND 2026-07-25: Die Einstellungen versprachen „dann liest die App lieber
  // gar nicht vor, als Schwedisch mit falscher Stimme zu lesen" — gesprochen
  // wurde trotzdem. Ohne schwedische Stimme liest die Engine den schwedischen
  // Satz mit der Standardstimme, also mit deutscher Aussprache. In einer
  // Sprachlern-App ist das nicht bloß unschön: Der Lerner übt eine Aussprache
  // ein, die es nicht gibt. Jetzt hält die App ihr Versprechen.
  if (swedishVoiceMissing()) return Promise.resolve();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'sv-SE'; // auch ohne gelistete Stimme wählen viele Engines darüber sv
  u.rate = rate;
  const voice = selectSwedishVoice(currentVoices());
  if (voice) u.voice = voice;
  window.speechSynthesis.cancel();
  return new Promise<void>((resolve) => {
    // Beide Wege beenden das Warten. Manche Engines melden bei abgebrochener
    // Ausgabe nur `onerror` — ohne das bliebe der freihändige Modus stehen.
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      resolve();
    };
    u.onend = finish;
    u.onerror = finish;
    window.speechSynthesis.speak(u);
  });
}

// Initiales Laden + Nachladen registrieren (nur im Browser).
if (ttsAvailable()) {
  loadVoices();
  window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
}
