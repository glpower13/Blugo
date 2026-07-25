// React-Anbindung der Spracheingabe (Phase P2, `docs/gremium-sprachpartner.md` §9).
//
// Hält genau einen Hörvorgang und dessen Zustand. Die Regel dahinter: Das Gehörte
// wird IMMER an den Aufrufer gereicht, nie direkt als Antwort gewertet — der
// Aufrufer zeigt es an, damit ein Hörfehler des Browsers nicht als Sprachfehler
// des Menschen durchgeht (`speech.ts`, Ehrlichkeit 3).

import { useCallback, useEffect, useRef, useState } from 'react';
import { listenOnce, speechInputAvailable, type ListenHandle, type SpeechMode } from './speech';

export type MicState = 'idle' | 'listening' | 'error';

interface Options {
  lang?: string;
  /** Wird mit dem Gehörten aufgerufen — der Aufrufer entscheidet, was daraus wird. */
  onHeard: (transcript: string, mode: SpeechMode) => void;
}

export interface SpeechInput {
  /** Kann dieses Gerät zuhören? Wenn nein: kein Mikrofon zeigen (kein toter Knopf). */
  supported: boolean;
  state: MicState;
  /** Deutsche Fehlermeldung, falls `state === 'error'`. */
  error: string;
  /** Wo zuletzt erkannt wurde — für die ehrliche Anzeige. */
  mode: SpeechMode | null;
  start: () => void;
  /** Aufnahme beenden; das bisher Gehörte zählt. */
  stop: () => void;
  /** Fehlermeldung wegklicken. */
  clearError: () => void;
}

export function useSpeechInput({ lang = 'sv-SE', onHeard }: Options): SpeechInput {
  const [state, setState] = useState<MicState>('idle');
  const [error, setError] = useState('');
  const [mode, setMode] = useState<SpeechMode | null>(null);
  const handle = useRef<ListenHandle | null>(null);
  // Damit ein spät eintreffendes Ergebnis nach dem Ausbauen nichts mehr setzt.
  const alive = useRef(true);
  // Frische Rückrufe ohne die Hörschleife neu aufzubauen.
  const heardRef = useRef(onHeard);
  heardRef.current = onHeard;

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      handle.current?.abort();
      handle.current = null;
    };
  }, []);

  const start = useCallback(() => {
    if (handle.current) return; // läuft schon
    setError('');
    setState('listening');
    const h = listenOnce(lang);
    handle.current = h;
    h.result
      .then(({ transcript, mode: m }) => {
        if (!alive.current) return;
        setMode(m);
        setState('idle');
        heardRef.current(transcript, m);
      })
      .catch((e: unknown) => {
        if (!alive.current) return;
        const msg = e instanceof Error ? e.message : 'Die Spracherkennung hat nicht funktioniert.';
        // Ein selbst ausgelöster Abbruch ist kein Fehler, den man anzeigen muss.
        if (msg.startsWith('Aufnahme abgebrochen')) setState('idle');
        else {
          setError(msg);
          setState('error');
        }
      })
      .finally(() => {
        handle.current = null;
      });
  }, [lang]);

  const stop = useCallback(() => {
    handle.current?.stop();
  }, []);

  const clearError = useCallback(() => {
    setError('');
    setState('idle');
  }, []);

  return { supported: speechInputAvailable(), state, error, mode, start, stop, clearError };
}
