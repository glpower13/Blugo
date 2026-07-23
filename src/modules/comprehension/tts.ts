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

/** Liest den Text auf Schwedisch vor. `rate` < 1 = langsamer (Didaktik: Tempo). */
export function speakSwedish(text: string, rate = 0.9): void {
  if (!ttsAvailable()) return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'sv-SE'; // auch ohne gelistete Stimme wählen viele Engines darüber sv
  u.rate = rate;
  const voice = selectSwedishVoice(currentVoices());
  if (voice) u.voice = voice;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}

// Initiales Laden + Nachladen registrieren (nur im Browser).
if (ttsAvailable()) {
  loadVoices();
  window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
}
