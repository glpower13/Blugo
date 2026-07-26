// „Heute" — der Verteiler (docs/gremium-navigation.md, Schritt 1).
//
// Die alte Startseite machte sechs Dinge auf einmal: Logo, Name, Einstellungen,
// Ring, Gedächtnisfeld, Knopf, die komplette Bereichsliste, Installieren,
// Copyright. Dieser Raum beantwortet stattdessen EINE Frage — „was mache ich
// jetzt?" — und reicht alles andere an die anderen Reiter weiter.
//
// EHRLICHKEIT (die eine Design-Regel): Die große Zahl ist `stable`, also
// BEWIESEN stabil (`07-measurement.md`) — kein Punktestand, keine Anwesenheit.
// Steht sie auf 0, wird das gesagt statt kaschiert: „bewiesen" braucht Monate.
// Genau dafür steht die zweite Zahl „reift" daneben.

import type { ReactNode } from 'react';
import { IconPlay, IconSettings, IconChat, IconMic, IconSprout } from '../../ui/icons';
import { useCountUp } from '../../ui/useCountUp';

interface Props {
  name: string;
  stable: number;
  maturing: number;
  sessionSize: number; // was die nächste Sitzung WIRKLICH enthält
  dueNow: number;
  totalChunks: number;
  areaCount: number;
  dialogCount: number;
  loading: boolean;
  onEditName: () => void;
  onSettings: () => void;
  onOpenPair: () => void;
  onStart: () => void;
  onGoLearn: () => void;
  onGoTalk: () => void;
  onGoSparring: () => void;
  /** Ist ein eigener KI-Zugang hinterlegt? Sonst kann der Partner nicht denken. */
  sparringReady: boolean;
  /** Wie viele fällige Wendungen der Partner hervorlocken würde. */
  sparringTargets: number;
  /** Startpilot noch nicht gelaufen? Dann führt der erste Weg dorthin. */
  startpilotOffen: boolean;
  onStartpilot: () => void;
}

/** Ehrliche Unterzeile zur großen Zahl — beschönigt eine 0 nicht. */
function stageNote(stable: number, maturing: number, total: number): string {
  if (stable > 0) {
    return maturing > 0 ? `von ${total} Wendungen · ${maturing} reifen` : `von ${total} Wendungen`;
  }
  if (maturing > 0) {
    return `${maturing} reifen — „bewiesen" wird daraus erst nach über 90 Tagen`;
  }
  return 'Noch nichts bewiesen — der Beweis braucht über 90 Tage.';
}

export function TodayView({
  name,
  stable,
  maturing,
  sessionSize,
  dueNow,
  totalChunks,
  areaCount,
  dialogCount,
  loading,
  onEditName,
  onSettings,
  onOpenPair,
  onStart,
  onGoLearn,
  onGoTalk,
  onGoSparring,
  sparringReady,
  sparringTargets,
  startpilotOffen,
  onStartpilot,
}: Props) {
  const shown = useCountUp(stable);

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-4 md:max-w-xl">
      <header className="flex items-start justify-between gap-3 px-1 pt-1">
        <div className="min-w-0">
          {/* Der Name der App bleibt sichtbar — leise, aber vorhanden: die erste
              Ansicht muss auch beantworten, wo man überhaupt ist. */}
          <p className="wordmark font-display text-[0.82rem] font-semibold uppercase tracking-[0.24em] text-faint">
            neuro<span className="font-light text-brand">lang</span>
          </p>
          {/* Die Überschrift lag vorher IN einem Knopf. ARIA wertet Knopf-Inhalte
              als darstellend — die Startseite hatte damit für die
              Überschriften-Navigation faktisch keine h1
              (Barrierefreiheits-Audit 2026-07-25). Jetzt steht die Überschrift
              für sich, das Bearbeiten ist ein eigenes Ziel daneben. */}
          <div className="mt-1.5 flex flex-wrap items-center gap-x-2">
            <h1 className="font-display text-[1.6rem] font-semibold leading-tight text-paper">
              <span lang="sv">Hej</span>
              {name ? (
                <>
                  , <span className="text-brand">{name}</span>
                </>
              ) : null}
              !
            </h1>
            <button
              onClick={onEditName}
              className="min-h-11 rounded-full px-2 text-sm text-faint underline underline-offset-4"
            >
              {name ? 'Namen ändern' : '＋ Dein Name'}
            </button>
          </div>
          {/* Antippbar: dahinter steht die ehrliche Richtungs-Auskunft statt eines
              Schalters (gremium-navigation.md §5, LanguagePair.tsx). */}
          <button
            onClick={onOpenPair}
            className="mt-2 inline-flex min-h-11 items-center gap-1.5 rounded-full border border-line bg-white/[0.04] px-4 text-[0.72rem] text-muted transition-colors hover:bg-white/[0.08]"
          >
            <span className="font-medium text-paper">Deutsch</span>
            <span className="text-paper">→</span>
            <span className="font-medium text-paper">Schwedisch</span>
            <span className="text-muted">⌄</span>
          </button>
        </div>
        <button
          onClick={onSettings}
          className="glass-soft flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-paper"
          aria-label="Einstellungen"
          title="Einstellungen"
        >
          <IconSettings className="h-5 w-5" />
        </button>
      </header>

      {/* Die Bühne: EINE gemessene Zahl, groß. */}
      <section className="glass relative overflow-hidden rounded-2xl px-5 py-7 text-center">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-24 h-48"
          style={{ background: 'radial-gradient(50% 100% at 50% 100%, #E7C08A2E, transparent 70%)' }}
        />
        <div className="relative">
          <div className="tnum font-sans text-[3.4rem] font-extrabold leading-none tracking-tight text-success glow-success">
            {shown}
          </div>
          <p className="mt-2.5 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted">
            bewiesen stabil
          </p>
          <p className="mx-auto mt-2 max-w-[26ch] text-xs leading-relaxed text-faint">
            {stageNote(stable, maturing, totalChunks)}
          </p>
        </div>
      </section>

      {/* DER ERSTE WEG. Der bisherige Inhalt begann bei „hur mår du?" — für
          jemanden ohne ein einziges schwedisches Wort ist das eine Wand. Solange
          der Startpilot offen ist, steht er ÜBER dem normalen Knopf; danach
          verschwindet er ganz. Ein Angebot, das nach dem Annehmen stehen bleibt,
          ist kein Angebot mehr, sondern Möbel. */}
      {!loading && startpilotOffen && (
        <section className="glass rounded-2xl border border-brand/30 p-5">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-brand">
            Fang hier an
          </p>
          <h2 className="mt-2 font-display text-xl font-semibold leading-tight text-paper">
            Die ersten sechzehn Wörter
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Kurze Wörter, die man wirklich sagt — <span lang="sv">hej</span>,{' '}
            <span lang="sv">tack</span>, <span lang="sv">kanske</span>. Eines nach dem
            anderen, mit Ton, und nach jeweils vier eine kleine Probe. Etwa fünf Minuten.
          </p>
          <button
            onClick={onStartpilot}
            className="btn-gold mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-4 font-semibold text-ink"
          >
            <IconSprout className="h-4 w-4" /> Startpilot starten
          </button>
        </section>
      )}

      {loading ? (
        <div className="shimmer h-[60px] w-full rounded-2xl" />
      ) : (
        <div>
          {/* Solange der Startpilot offen ist, tritt dieser Knopf ZURÜCK. Zwei
              gleich laute Goldknöpfe übereinander sind für jemanden, der noch
              kein Wort kann, zwei erste Schritte — also keiner. */}
          <button
            onClick={onStart}
            className={
              startpilotOffen
                ? 'flex w-full items-center justify-center gap-2 rounded-2xl border border-line py-3.5 text-sm font-medium text-paper'
                : 'btn-gold flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-base font-semibold text-ink'
            }
          >
            <IconPlay className="h-4 w-4" />
            {sessionSize > 0
              ? `Weiterlernen · ${sessionSize} ${sessionSize === 1 ? 'Wendung' : 'Wendungen'}`
              : 'Weiterlernen'}
          </button>
          {/* Der Rest ist nicht verschwiegen — nur nicht als Drohung auf dem Knopf.
              „Wartet" statt „offen": nichts geht verloren, nichts zerbricht. */}
          {dueNow > sessionSize && (
            <p className="mt-2 text-center text-[0.7rem] text-faint">
              {dueNow - sessionSize} weitere warten — bewusst auf die nächsten Sitzungen verteilt.
            </p>
          )}
        </div>
      )}

      {/* Türen in die anderen Räume — Einstiege, nicht deren Inhalt. Solange der
          Inhalt lädt, steht dort KEINE Zahl: eine kurz aufblitzende „0 Bereiche"
          wäre schlicht falsch. */}
      <div className="grid grid-cols-2 gap-3">
        <Tile
          Icon={IconSprout}
          title="Lernen"
          sub={loading ? 'lädt …' : `${areaCount} Bereiche`}
          onClick={onGoLearn}
        />
        <Tile
          Icon={IconChat}
          title="Gespräche"
          sub={loading ? 'lädt …' : `${dialogCount} Gespräche`}
          onClick={onGoTalk}
        />
      </div>

      {/* Sprechen ist der schwerste und wertvollste Abruf — er gehört auf die
          erste Seite, und zwar IMMER.

          Erster Entwurf versteckte diesen Einstieg, solange kein eigener
          KI-Zugang hinterlegt war — „kein toter Knopf". Der Nutzer hat ihn
          daraufhin schlicht nicht gefunden (2026-07-25). Ein Knopf, der ehrlich
          sagt, was ihm fehlt, und den Weg dorthin zeigt, ist kein toter Knopf;
          ein unsichtbarer Modus ist dagegen ein Modus, den es nicht gibt. */}
      {!loading && (
        <button
          onClick={onGoSparring}
          className={
            'flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left ' +
            (sparringReady
              ? 'border border-[#63C9B6]/45 bg-[#63C9B6]/10'
              : 'border border-line bg-white/[0.04]')
          }
        >
          <IconMic
            className={'h-5 w-5 shrink-0 ' + (sparringReady ? 'text-[#63C9B6]' : 'text-muted')}
          />
          <span className="min-w-0">
            <span className="block font-display text-[0.95rem] font-semibold text-paper">
              Sparring · sprechen
            </span>
            <span className="block text-[0.72rem] leading-relaxed text-muted">
              {!sparringReady
                ? 'Braucht deinen eigenen KI-Zugang — hier steht, wie das geht'
                : sparringTargets > 0
                  ? `${sparringTargets} fällige ${
                      sparringTargets === 1 ? 'Wendung' : 'Wendungen'
                    } im Gespräch selbst sagen`
                  : 'Gerade nichts fällig — reden geht, gemessen wird nichts'}
            </span>
          </span>
        </button>
      )}

    </div>
  );
}

function Tile({
  Icon,
  title,
  sub,
  onClick,
}: {
  Icon: (p: { className?: string }) => ReactNode;
  title: string;
  sub: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="glass-soft flex flex-col items-start gap-2 rounded-2xl p-4 text-left transition-colors hover:bg-white/[0.08]"
    >
      <Icon className="h-5 w-5 text-brand" />
      <span className="font-display text-[0.95rem] font-semibold text-paper">{title}</span>
      <span className="text-[0.68rem] text-faint">{sub}</span>
    </button>
  );
}
