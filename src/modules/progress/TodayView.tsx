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
import { IconPlay, IconSettings, IconChat, IconSprout } from '../../ui/icons';
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
  onStart: () => void;
  onGoLearn: () => void;
  onGoTalk: () => void;
}

/** Ehrliche Unterzeile zur großen Zahl — beschönigt eine 0 nicht. */
function stageNote(stable: number, maturing: number, total: number): string {
  if (stable > 0) {
    return maturing > 0 ? `von ${total} Wendungen · ${maturing} reifen` : `von ${total} Wendungen`;
  }
  if (maturing > 0) {
    return `${maturing} reifen — „bewiesen" wird erst nach ~3 Monaten daraus`;
  }
  return 'Noch nichts bewiesen — das braucht Wochen, nicht Tage.';
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
  onStart,
  onGoLearn,
  onGoTalk,
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
          <button onClick={onEditName} className="mt-1.5 block text-left">
            <h1 className="font-display text-[1.6rem] font-semibold leading-tight text-paper">
              {name ? (
                <>
                  Hej, <span className="text-brand">{name}</span>!
                </>
              ) : (
                <>
                  Hej! <span className="text-faint">＋ Dein Name</span>
                </>
              )}
            </h1>
          </button>
          {/* Sprachpaar: in Schritt 1 reine Auskunft. Antippbar mit der ehrlichen
              Richtungs-Anzeige wird es in Schritt 4 (gremium-navigation.md §5). */}
          <p className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-line bg-white/[0.04] px-3 py-1 text-[0.7rem] text-muted">
            <span className="font-medium text-paper">Deutsch</span>
            <span className="text-faint">→</span>
            <span className="font-medium text-paper">Schwedisch</span>
          </p>
        </div>
        <button
          onClick={onSettings}
          className="glass-soft flex shrink-0 items-center justify-center rounded-full p-2.5 text-paper"
          aria-label="KI-Einstellungen"
          title="KI-Einstellungen"
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

      {loading ? (
        <div className="shimmer h-[60px] w-full rounded-2xl" />
      ) : (
        <div>
          <button
            onClick={onStart}
            className="btn-gold flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-base font-semibold text-ink"
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
          sub={loading ? 'lädt …' : `${dialogCount} Szenen`}
          onClick={onGoTalk}
        />
      </div>
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
