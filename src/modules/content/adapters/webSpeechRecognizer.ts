// ASR-Adapter über die Web Speech API — füllt den `SpeechRecognizer`-Port, der seit
// Juli 2026 leer stand (`ports.ts`). Phase P1, `docs/gremium-sprachpartner.md` §9.
//
// Kapselt die Implementierung in ../../comprehension/speech hinter dem Port, genau
// wie `webSpeech.ts` das für die Sprachausgabe tut. Ein echter Erkennungs-Dienst
// (Laut-Bewertung, Cloud) kann später denselben Port belegen, ohne dass eine
// aufrufende Stelle sich ändert.

import type { RecognitionResult, SpeechRecognizer } from '../ports';
import { listenOnce, speechInputAvailable } from '../../comprehension/speech';

export const webSpeechRecognizer: SpeechRecognizer = {
  id: 'web-speech',
  isAvailable: speechInputAvailable,
  async recognizeOnce(lang = 'sv-SE'): Promise<RecognitionResult> {
    const { transcript, confidence } = await listenOnce(lang).result;
    return { transcript, confidence };
  },
};
