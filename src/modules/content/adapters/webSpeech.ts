// TTS-Adapter über die Web Speech API (browser-eigene Stimmen). Standard-Stecker,
// bis ein natürlicheres schwedisches TTS angebunden wird (Schritt C / post-M1).
// Kapselt die vorhandene Implementierung in ../../comprehension/tts hinter dem Port.

import type { SpeakRequest, SpeechSynthesizer } from '../ports';
import { speakSwedish, ttsAvailable } from '../../comprehension/tts';

export const webSpeechSynthesizer: SpeechSynthesizer = {
  id: 'web-speech',
  isAvailable: ttsAvailable,
  // Erfüllt sich erst, wenn wirklich fertig gesprochen ist — darauf baut der
  // freihändige Sparring-Modus auf (erst ausreden lassen, dann zuhören).
  speak(req: SpeakRequest): Promise<void> {
    return speakSwedish(req.text, req.rate);
  },
};
