// Registry der KI-Ports (Ports & Adapters). EIN Ort, an dem die App ihre
// KI-Fähigkeiten bezieht — heute die Standard-Adapter (Seed + Web-Speech),
// später ein Anbieter, ohne dass die aufrufenden Stellen sich ändern.
// Das ist der Kern der Zukunftssicherheit (docs/gremium-weltklasse.md §5).

import type {
  ContentGenerator,
  Decoder,
  Explainer,
  SparringPartner,
  SpeechRecognizer,
  SpeechSynthesizer,
} from './ports';
import { seedDecoder, seedGenerator } from './adapters/seed';
import { seedPartner } from './adapters/seedPartner';
import { webSpeechSynthesizer } from './adapters/webSpeech';
import { webSpeechRecognizer } from './adapters/webSpeechRecognizer';

export interface AiPorts {
  generator: ContentGenerator;
  decoder: Decoder;
  synthesizer: SpeechSynthesizer;
  recognizer: SpeechRecognizer | null; // seit P1 belegt (Web Speech); null = kein Adapter
  explainer: Explainer | null; // erst mit Cloud-KI (Feedback-Schritt 2)
  // Seit 2026-07-26 IMMER belegt: Der Grund-Partner spielt kuratierte Gespräche,
  // eine Cloud-KI antwortet frei (`adapters/seedPartner.ts`). `null` gibt es nur
  // noch, wenn jemand ihn ausdrücklich abschaltet.
  partner: SparringPartner | null;
}

/** Die Standard-Belegung: alles, was heute ohne externen Anbieter funktioniert. */
const defaults: AiPorts = {
  generator: seedGenerator,
  decoder: seedDecoder,
  synthesizer: webSpeechSynthesizer,
  recognizer: webSpeechRecognizer,
  explainer: null,
  // Der Sparringspartner war der einzige Modus, den es ohne eigenen Zugang gar
  // nicht gab. Jetzt gibt es ihn — nur eben gescriptet statt frei.
  partner: seedPartner,
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
