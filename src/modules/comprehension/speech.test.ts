// Tests der reinen Teile der Spracheingabe (P1). Der Hörvorgang selbst braucht
// einen Browser und wird im e2e-Lauf geprüft — hier steht das, was ohne Browser
// beweisbar ist, und vor allem die EHRLICHKEITS-Regeln:
//   · ohne Erkennung im Browser meldet sich das Modul als „nicht verfügbar"
//     (sonst entstünde ein toter Knopf),
//   · jeder Fehlercode bekommt einen Satz, der einem Menschen hilft.

import { describe, expect, it } from 'vitest';
import {
  bestTranscript,
  onDeviceStatus,
  installOnDevice,
  speechErrorMessage,
  speechInputAvailable,
  type RecognitionEventLike,
} from './speech';

/** Baut ein Ereignis in der Form, die die Web Speech API liefert. */
function event(parts: Array<{ transcript: string; confidence?: number }>): RecognitionEventLike {
  const results = parts.map((p) => {
    const alt = { transcript: p.transcript, confidence: p.confidence ?? 0 };
    return Object.assign([alt], { length: 1 });
  });
  return { results: Object.assign(results, { length: results.length }) } as RecognitionEventLike;
}

describe('bestTranscript', () => {
  it('nimmt die erste Deutung je Ergebnis', () => {
    expect(bestTranscript(event([{ transcript: 'hej hej' }])).transcript).toBe('hej hej');
  });

  it('setzt mehrere Teile mit genau einem Leerzeichen zusammen', () => {
    const r = bestTranscript(event([{ transcript: '  jag heter ' }, { transcript: ' Anna ' }]));
    expect(r.transcript).toBe('jag heter Anna');
  });

  it('nimmt die SCHWÄCHSTE Sicherheit — das Ganze ist nur so sicher wie sein wackeligster Teil', () => {
    const r = bestTranscript(
      event([
        { transcript: 'jag', confidence: 0.9 },
        { transcript: 'heter', confidence: 0.4 },
      ]),
    );
    expect(r.confidence).toBe(0.4);
  });

  it('lässt die Sicherheit weg, wenn der Browser keine liefert', () => {
    expect(bestTranscript(event([{ transcript: 'hej' }])).confidence).toBeUndefined();
  });

  it('liefert leeren Text, wenn nichts gehört wurde', () => {
    expect(bestTranscript(event([])).transcript).toBe('');
  });
});

describe('speechErrorMessage', () => {
  it('erklärt eine fehlende Mikrofon-Erlaubnis und nennt den Ausweg', () => {
    const m = speechErrorMessage('not-allowed');
    expect(m).toContain('Mikrofon');
    expect(m).toContain('tippen');
  });

  it('behandelt „nichts gehört" freundlich statt als Fehler des Lerners', () => {
    expect(speechErrorMessage('no-speech')).toContain('nichts gehört');
  });

  it('sagt beim Netzfehler ehrlich, dass die Erkennung Internet braucht', () => {
    expect(speechErrorMessage('network')).toContain('Internet');
  });

  it('hat für jeden unbekannten Code einen brauchbaren Satz', () => {
    expect(speechErrorMessage('irgendwas-neues').length).toBeGreaterThan(10);
  });

  it('weist NIE dem Lerner die Schuld zu', () => {
    for (const code of ['not-allowed', 'no-speech', 'audio-capture', 'network', 'xyz']) {
      expect(speechErrorMessage(code).toLowerCase()).not.toContain('falsch');
    }
  });
});

describe('Verfügbarkeit', () => {
  it('meldet ohne Browser „nicht verfügbar" (kein toter Knopf)', () => {
    expect(speechInputAvailable()).toBe(false);
  });

  it('meldet ohne Browser auch keine On-Device-Erkennung', async () => {
    await expect(onDeviceStatus('sv-SE')).resolves.toBe('no');
  });

  it('installiert ohne Browser nichts und behauptet es auch nicht', async () => {
    await expect(installOnDevice('sv-SE')).resolves.toBe(false);
  });
});
