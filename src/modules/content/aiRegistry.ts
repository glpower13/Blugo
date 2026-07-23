// Registry der KI-Ports (Ports & Adapters). EIN Ort, an dem die App ihre
// KI-Fähigkeiten bezieht — heute die Standard-Adapter (Seed + Web-Speech),
// später ein Anbieter, ohne dass die aufrufenden Stellen sich ändern.
// Das ist der Kern der Zukunftssicherheit (docs/gremium-weltklasse.md §5).

import type {
  ContentGenerator,
  Decoder,
  Explainer,
  SpeechRecognizer,
  SpeechSynthesizer,
} from './ports';
import { seedDecoder, seedGenerator } from './adapters/seed';
import { webSpeechSynthesizer } from './adapters/webSpeech';

export interface AiPorts {
  generator: ContentGenerator;
  decoder: Decoder;
  synthesizer: SpeechSynthesizer;
  recognizer: SpeechRecognizer | null; // erst post-M1 ein Adapter
  explainer: Explainer | null; // erst mit Cloud-KI (Feedback-Schritt 2)
}

/** Die Standard-Belegung: alles, was heute ohne externen Anbieter funktioniert. */
const defaults: AiPorts = {
  generator: seedGenerator,
  decoder: seedDecoder,
  synthesizer: webSpeechSynthesizer,
  recognizer: null,
  explainer: null,
};

/** Aktuelle Belegung. Aufrufer lesen z. B. `aiRegistry.synthesizer.speak(...)`. */
export const aiRegistry: AiPorts = { ...defaults };

/** Adapter zur Laufzeit tauschen (sobald ein Anbieter angebunden ist, Schritt C). */
export function setAiPorts(overrides: Partial<AiPorts>): void {
  Object.assign(aiRegistry, overrides);
}

/** Auf die Standard-Adapter zurücksetzen (vor allem für Tests). */
export function resetAiPorts(): void {
  Object.assign(aiRegistry, defaults);
}
