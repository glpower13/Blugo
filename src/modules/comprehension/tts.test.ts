// Tests der schwedischen Stimm-Auswahl (reine Funktion, ohne DOM).

import { describe, expect, it } from 'vitest';
import { selectSwedishVoice, speakSwedish, type VoiceLike } from './tts';

describe('selectSwedishVoice — Präferenz-Reihenfolge', () => {
  it('bevorzugt eine lokale sv-SE-Stimme', () => {
    const voices: VoiceLike[] = [
      { lang: 'en-US', localService: true, name: 'Alex' },
      { lang: 'sv-SE', localService: false, name: 'Cloud-Sven' },
      { lang: 'sv-SE', localService: true, name: 'Lokal-Astrid' },
    ];
    expect(selectSwedishVoice(voices)?.name).toBe('Lokal-Astrid');
  });

  it('nimmt sv-SE auch ohne lokale Variante', () => {
    const voices: VoiceLike[] = [
      { lang: 'sv-SE', localService: false, name: 'Cloud-Sven' },
      { lang: 'sv-FI', localService: true, name: 'Finnlandschwedisch' },
    ];
    expect(selectSwedishVoice(voices)?.name).toBe('Cloud-Sven');
  });

  it('fällt auf irgendeine schwedische Stimme zurück (lokal bevorzugt)', () => {
    const voices: VoiceLike[] = [
      { lang: 'sv-FI', localService: false, name: 'sv-fi-cloud' },
      { lang: 'sv-FI', localService: true, name: 'sv-fi-lokal' },
    ];
    expect(selectSwedishVoice(voices)?.name).toBe('sv-fi-lokal');
  });

  it('ist ehrlich: ohne schwedische Stimme → undefined (statt falscher Sprache)', () => {
    const voices: VoiceLike[] = [
      { lang: 'en-US', localService: true, name: 'Alex' },
      { lang: 'de-DE', localService: true, name: 'Anna' },
    ];
    expect(selectSwedishVoice(voices)).toBeUndefined();
  });

  it('kommt mit leerer Liste klar', () => {
    expect(selectSwedishVoice([])).toBeUndefined();
  });
});

// Der freihändige Sparring-Modus wartet auf das Ende der Sprachausgabe, bevor
// er zuhört. Ohne Sprachausgabe darf dieses Warten NIE hängen bleiben — sonst
// steht das Gespräch auf einem Gerät ohne Stimme für immer still.
describe('speakSwedish — das Warten endet immer', () => {
  it('erfüllt sich sofort, wenn das Gerät gar nicht sprechen kann', async () => {
    await expect(speakSwedish('hej')).resolves.toBeUndefined();
  });
});
