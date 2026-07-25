// Der Mikrofon-Knopf (Phase P2, `docs/gremium-sprachpartner.md` §9).
//
// Eine Stelle für alle Sprech-Eingaben — im Lern-Loop wie im Gespräch. Drei Regeln
// stecken in dieser Datei, damit sie nirgends vergessen werden können:
//
//   1. KEIN TOTER KNOPF. Ohne Erkennung im Browser erscheint hier gar nichts;
//      Tippen bleibt vollwertig, nicht als Notlösung.
//   2. DAS GEHÖRTE WIRD GEZEIGT. Was der Browser verstanden hat, steht sichtbar
//      da, bevor es als Antwort gilt — ein Hörfehler der Technik darf nicht als
//      Sprachfehler des Menschen durchgehen.
//   3. WO DAS AUDIO HINGEHT, WIRD GESAGT. Nach dem ersten Versuch steht dort, ob
//      auf dem Gerät oder beim Browser-Hersteller erkannt wurde. Einmal ruhig
//      hingeschrieben, nicht als Warnung inszeniert.

import type { SpeechInput } from '../modules/comprehension/useSpeechInput';
import { IconMic } from './icons';

interface Props {
  mic: SpeechInput;
  /** Was zuletzt verstanden wurde ('' = noch nichts). */
  heard?: string;
  /** Beschriftung im Ruhezustand. */
  label?: string;
}

export function SpeakButton({ mic, heard = '', label = 'Sprich es auf Schwedisch' }: Props) {
  if (!mic.supported) return null;
  const listening = mic.state === 'listening';

  return (
    <div className="flex flex-col gap-1.5">
      <button
        type="button"
        onClick={() => (listening ? mic.stop() : mic.start())}
        aria-label={listening ? 'Aufnahme beenden' : label}
        className={
          listening
            ? 'mic-live flex w-full items-center justify-center gap-2 rounded-xl border border-[#63C9B6] bg-[#63C9B6]/15 px-4 py-2.5 font-medium text-[#63C9B6]'
            : 'flex w-full items-center justify-center gap-2 rounded-xl border border-line bg-white/[0.04] px-4 py-2.5 font-medium text-paper'
        }
      >
        <IconMic className="h-4 w-4" />
        {listening ? 'Ich höre zu … tippen zum Beenden' : label}
      </button>

      {heard && (
        <p className="text-xs leading-relaxed text-muted">
          Verstanden: <span lang="sv" className="text-paper">„{heard}"</span>{' '}
          <span className="text-faint">— falsch gehört? Noch mal sprechen oder tippen.</span>
        </p>
      )}

      {mic.state === 'error' && (
        <p className="text-xs leading-relaxed text-warn">
          {mic.error}{' '}
          <button onClick={mic.clearError} className="underline underline-offset-2">
            ok
          </button>
        </p>
      )}

      {mic.mode && (
        <p className="text-[0.68rem] leading-relaxed text-faint">
          {mic.mode === 'on-device'
            ? 'Auf deinem Gerät erkannt — nichts wurde gesendet.'
            : 'Zur Erkennung an den Browser-Hersteller gesendet (so arbeitet dieser Browser).'}
        </p>
      )}
    </div>
  );
}
