// Der Startpilot als Fläche — die erste halbe Stunde mit dieser App.
//
// Aufbau: vier Wörter begegnen, dieselben vier abfragen, viermal. Am Ende ein
// ehrlicher Abschluss. Die Regeln stehen in `startpilot.ts`; hier steht nur,
// wie es aussieht und wie es sich anfühlt.
//
// DREI ENTSCHEIDUNGEN, DIE HIER FESTLIEGEN:
//
//   1. EIN WORT PRO BILDSCHIRM. Kein Raster, keine Liste. Wer noch nichts kann,
//      soll nicht vor sechzehn Zeilen sitzen, sondern vor einer.
//   2. DIE PROBE HAT KEINEN PUNKTESTAND. Nach jeder Antwort steht da, ob es
//      stimmte — nicht, wie viele Punkte es gab. Der Zähler am Ende nennt
//      wiedererkannte Wörter und sagt im selben Atemzug, dass das kein Beweis ist.
//   3. FALSCH IST KEINE STRAFE. Bei einer falschen Antwort erscheint das richtige
//      Wort mit seiner Bedeutung, und es geht weiter. Die Engine bekommt ein
//      „Nochmal" — die Wendung kommt also von selbst früher wieder.

import { useEffect, useMemo, useState } from 'react';
import type { Chunk, ReviewResult } from '../../domain/chunk';
import { speakSwedish } from '../comprehension/tts';
import { aiRegistry } from '../content/aiRegistry';
import { VoiceMissingHint } from '../../ui/VoiceHint';
import { IconBack, IconPlay, IconSprout } from '../../ui/icons';
import { ablauf, abschluss, WANN, type Schritt } from './startpilot';

interface Props {
  /** Die Wendungen des Themas „Die ersten Wörter", in ihrer Reihenfolge. */
  woerter: Chunk[];
  /** Ein Abruf im Startpiloten — speist dieselbe Memory-Engine wie alles andere. */
  onErgebnis: (chunkId: string, result: ReviewResult) => void;
  /** Der Startpilot ist durch (oder wurde abgebrochen). */
  onFertig: (durchgelaufen: boolean) => void;
}

export function StartpilotScene({ woerter, onErgebnis, onFertig }: Props) {
  const schritte = useMemo(() => ablauf(woerter), [woerter]);
  const nachId = useMemo(() => new Map(woerter.map((c) => [c.id, c])), [woerter]);
  const [i, setI] = useState(0);
  const [gewaehlt, setGewaehlt] = useState<string | null>(null);
  const [richtig, setRichtig] = useState(0);

  const schritt: Schritt = schritte[Math.min(i, schritte.length - 1)];

  // Bei jedem neuen Wort einmal vorlesen — der erste Kontakt soll auch ein
  // Höreindruck sein, nicht nur ein Schriftbild.
  useEffect(() => {
    if (schritt.art !== 'begegnen') return;
    const c = nachId.get(schritt.chunkId);
    if (c) void speakSwedish(c.sv);
  }, [schritt, nachId]);

  const kannHoeren = aiRegistry.synthesizer.isAvailable();

  function antworte(option: string) {
    if (schritt.art !== 'probe' || gewaehlt !== null) return;
    setGewaehlt(option);
    const stimmt = option === schritt.frage.richtig;
    if (stimmt) setRichtig((n) => n + 1);
    onErgebnis(schritt.frage.chunkId, stimmt ? 'good' : 'again');
    void speakSwedish(schritt.frage.richtig);
  }

  function weiter() {
    setGewaehlt(null);
    setI((n) => n + 1);
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-4 md:max-w-xl">
      <h1 className="sr-only">Startpilot — die ersten Wörter</h1>

      <nav className="flex items-center justify-between gap-2 px-1">
        <button
          onClick={() => onFertig(false)}
          className="glass-soft flex min-h-11 items-center gap-1 rounded-full pl-2.5 pr-4 text-sm text-paper"
          aria-label="Startpilot verlassen"
        >
          <IconBack className="h-4 w-4" /> Später
        </button>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-brand/40 bg-brand/10 px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.1em] text-brand">
          <IconSprout className="h-3.5 w-3.5" /> Startpilot
        </span>
      </nav>

      {schritt.art === 'begegnen' && <Begegnung
        chunk={nachId.get(schritt.chunkId)}
        nummer={schritt.nummer}
        vonWievielen={schritt.vonWievielen}
        kannHoeren={kannHoeren}
        onWeiter={weiter}
      />}

      {schritt.art === 'probe' && (
        <section className="glass rounded-2xl p-5">
          <p className="text-[0.68rem] font-medium uppercase tracking-[0.14em] text-muted">
            Kleine Probe · {schritt.imBlock} von {schritt.blockGroesse}
          </p>
          <p className="mt-3 text-sm text-muted">Wie sagt man das auf Schwedisch?</p>
          <p className="mt-1 font-display text-[min(2rem,9vw)] font-bold leading-tight text-paper">
            {schritt.frage.de}
          </p>

          <div className="mt-5 flex flex-col gap-2">
            {schritt.frage.optionen.map((o) => {
              const istLoesung = o === schritt.frage.richtig;
              const gepickt = gewaehlt === o;
              const zeigen = gewaehlt !== null;
              const stil = !zeigen
                ? 'border-line text-paper'
                : istLoesung
                  ? 'border-success/60 bg-success/15 text-paper'
                  : gepickt
                    ? 'border-warn/60 bg-warn/10 text-muted'
                    : 'border-line text-faint';
              return (
                <button
                  key={o}
                  lang="sv"
                  onClick={() => antworte(o)}
                  disabled={zeigen}
                  className={`min-h-12 w-full rounded-xl border px-4 text-left text-lg ${stil}`}
                >
                  {o}
                  {zeigen && istLoesung && <span className="ml-2 text-sm text-success">richtig</span>}
                </button>
              );
            })}
          </div>

          {gewaehlt !== null && (
            <>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                {gewaehlt === schritt.frage.richtig ? (
                  'Sitzt — vorerst.'
                ) : (
                  <>
                    <span lang="sv" className="font-medium text-paper">
                      {schritt.frage.richtig}
                    </span>{' '}
                    heißt „{schritt.frage.de}". Kein Problem: Dieses Wort kommt jetzt früher
                    wieder.
                  </>
                )}
              </p>
              <button
                onClick={weiter}
                className="btn-gold mt-4 min-h-11 w-full rounded-xl px-4 font-medium text-ink"
              >
                Weiter
              </button>
            </>
          )}
        </section>
      )}

      {schritt.art === 'ende' && (
        <section className="glass rounded-2xl p-6">
          <p className="font-display text-2xl font-semibold leading-tight text-paper">
            {abschluss(richtig, woerter.length).titel}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {abschluss(richtig, woerter.length).text}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Diese sechzehn Wörter stehen ab jetzt im Thema{' '}
            <span className="text-paper">„Die ersten Wörter"</span> — mit Sätzen und zwei
            Gesprächen, in denen du sie sofort benutzt.
          </p>
          <button
            onClick={() => onFertig(true)}
            className="btn-gold mt-5 min-h-11 w-full rounded-xl px-4 font-medium text-ink"
          >
            Los geht's
          </button>
        </section>
      )}

      <VoiceMissingHint className="px-1" />
    </div>
  );
}

function Begegnung({
  chunk,
  nummer,
  vonWievielen,
  kannHoeren,
  onWeiter,
}: {
  chunk: Chunk | undefined;
  nummer: number;
  vonWievielen: number;
  kannHoeren: boolean;
  onWeiter: () => void;
}) {
  if (!chunk) return null;
  return (
    <section className="glass rounded-2xl p-5">
      <p className="text-[0.68rem] font-medium uppercase tracking-[0.14em] text-muted">
        Wort {nummer} von {vonWievielen}
      </p>
      <p
        lang="sv"
        className="mt-3 font-sans text-[min(3rem,14vw)] font-bold leading-none tracking-[-0.02em] text-paper"
      >
        {chunk.sv}
      </p>
      <p className="mt-2 font-display text-xl text-brand">{chunk.de}</p>

      {kannHoeren && (
        <button
          onClick={() => void speakSwedish(chunk.sv)}
          className="mt-4 flex min-h-11 items-center gap-1.5 rounded-full bg-brand/20 px-4 text-sm text-brand"
          aria-label="Hören — vorlesen"
        >
          <IconPlay className="h-3 w-3" /> Noch einmal hören
        </button>
      )}

      <p className="mt-4 text-sm leading-relaxed text-muted">{WANN[chunk.id]}</p>

      <button
        onClick={onWeiter}
        className="btn-gold mt-5 min-h-11 w-full rounded-xl px-4 font-medium text-ink"
      >
        Verstanden
      </button>
    </section>
  );
}
