// Reiter „Fortschritt" (docs/gremium-navigation.md, Schritt 1).
//
// Alles, was bisher auf der Startseite klebte und dort um Aufmerksamkeit
// konkurrierte, bekommt hier seinen eigenen Raum: der Ring, das Gedächtnisfeld,
// die Abdeckung, das Erfolgsband.
//
// EHRLICHKEIT (`07-measurement.md`): „bewiesen" zählt nur nach echtem langem
// Intervall in der Produktions-Richtung; „reift" ist die zweite gemessene Zone.
// „aktiv" ist bewusst nur eine nüchterne Textzahl — bloße Anwesenheit darf nie
// wie Fortschritt aussehen.

import type { ChunkState } from '../../domain/chunk';
import { MemoryRing } from './MemoryRing';
import { MemoryField } from './MemoryField';
import { bandStatus } from '../memory/difficulty';
import { VERIFICATION_META } from '../content/verification.generated';

interface Props {
  states: ChunkState[];
  stable: number;
  maturing: number;
  active: number;
  dueNow: number;
  coverage: number;
  coverageBase: number;
  totalChunks: number;
  successRate: number | null;
  spoken: number; // Wendungen, die laut gesagt und richtig erkannt wurden (P3)
}

export function ProgressView({
  states,
  stable,
  maturing,
  active,
  dueNow,
  coverage,
  coverageBase,
  totalChunks,
  successRate,
  spoken,
}: Props) {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-4 md:max-w-xl">
      <header className="px-1 pt-1">
        <h1 className="font-display text-[1.5rem] font-semibold leading-tight text-paper">
          Fortschritt
        </h1>
        <p className="mt-1 text-xs text-faint">Was du wirklich behalten hast — nichts anderes.</p>
      </header>

      <section className="glass rounded-2xl p-5">
        {/* Umbruchfähig: Bei 320 px und großer Systemschrift standen „reift" und
            „stabil" komplett außerhalb der Karte — von drei Kennzahlen war eine
            sichtbar (Layout-Audit 2026-07-25). Jetzt rutscht die Zahlenreihe
            unter den Ring, statt aus dem Bild zu laufen. */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-4">
          <MemoryRing stable={stable} maturing={maturing} total={totalChunks} />
          <div className="flex min-w-0 flex-1 basis-48 items-baseline justify-between gap-3">
            <Stat value={active} label="aktiv" quiet />
            <Stat value={maturing} label="reift" />
            <Stat value={stable} label="bewiesen" accent />
          </div>
        </div>
        {/* Beide Zahlen, weil eine allein irreführt: „100 %" bei drei angefassten
            Wendungen ist wahr und trotzdem eine Lüge (Ehrlichkeits-Audit). */}
        <p className="mt-3 text-xs text-muted">
          {/* „0 % von 0 begonnenen" ist keine Auskunft, sondern eine Formel ohne
              Inhalt. Solange nichts begonnen ist, sagen wir das schlicht. */}
          {coverageBase === 0 ? (
            <>Noch nichts begonnen — {totalChunks} Wendungen warten.</>
          ) : (
            <>
              {dueNow} jetzt fällig · Trefferquote {Math.round(coverage * 100)} % von{' '}
              {coverageBase} begonnenen ({totalChunks} insgesamt)
            </>
          )}
        </p>
        {successRate !== null && (
          <p className="mt-1 text-xs text-faint">
            Erfolgsband: {bandStatus(successRate)} ({Math.round(successRate * 100)} % zuletzt)
          </p>
        )}
        {/* Gesprochenes bekommt bewusst KEINE große Zahl: es ist eine Eigenschaft
            der Abrufe, keine zweite Währung neben „stabil" (P3). Erst sichtbar,
            wenn es sie wirklich gibt — eine 0 wäre eine Aufforderung. */}
        {spoken > 0 && (
          <p className="mt-1 text-xs text-[#63C9B6]">
            {spoken} {spoken === 1 ? 'Wendung' : 'Wendungen'} schon laut gesagt und richtig erkannt
          </p>
        )}
        <div className="mt-3">
          <MemoryField states={states} />
        </div>
      </section>

      <section className="glass-soft rounded-2xl p-4">
        <h2 className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-muted">
          Was die Zahlen bedeuten
        </h2>
        <dl className="mt-3 space-y-2.5 text-xs leading-relaxed">
          <div>
            <dt className="font-semibold text-success">bewiesen</dt>
            <dd className="text-faint">
              Nach über 90 Tagen Pause selbst gesagt — und es saß. Das ist der Beweis.
              Fällst du später wieder durch, zählt sie nicht mehr mit, bis der Beweis
              erneut gelingt.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-paper">reift</dt>
            <dd className="text-faint">
              Eine Pause von über 21 Tagen überstanden und selbst produziert — aber die
              90-Tage-Prüfung steht noch aus.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-muted">Trefferquote</dt>
            <dd className="text-faint">
              Wie sicher die Wendungen sitzen, die du schon angefangen hast. Sie sagt
              nichts darüber, wie viel vom Stoff du schon kennst — dafür steht die zweite
              Zahl daneben.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-muted">aktiv</dt>
            <dd className="text-faint">
              Schon einmal begegnet. Kein Fortschritt — nur der Umfang deines Repertoires.
            </dd>
          </div>
          {spoken > 0 && (
            <div>
              <dt className="font-semibold text-[#63C9B6]">laut gesagt</dt>
              <dd className="text-faint">
                Du hast sie gesprochen und die Erkennung hat genau diese Wendung verstanden.
                Über die Aussprache-Qualität sagt das nichts — dafür bräuchte es eine
                Lautbewertung, die es hier ehrlich noch nicht gibt.
              </dd>
            </div>
          )}
        </dl>
      </section>

      {/* Woher der Inhalt kommt und wie weit er geprüft ist (Stufe 4 der
          Prüfkette, docs/gremium-content-pruefung.md). Steht bewusst im Reiter
          „Fortschritt": Wer wissen will, was seine Zahlen wert sind, muss auch
          wissen, was der Stoff dahinter wert ist. */}
      <section className="glass-soft rounded-2xl p-4">
        <h2 className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-muted">
          Wie geprüft ist der Inhalt?
        </h2>
        <dl className="mt-3 space-y-2.5 text-xs leading-relaxed">
          <div>
            <dt className="font-semibold text-paper">
              {VERIFICATION_META.machine} maschinell vorgeprüft
            </dt>
            <dd className="text-faint">
              Jedes Wort ist belegtes Schwedisch — gegen ein Wörterbuch mit{' '}
              {VERIFICATION_META.dictionaryEntries.toLocaleString('de-DE')} Einträgen und
              gegen Korpus-Häufigkeiten.
            </dd>
          </div>
          {VERIFICATION_META.unchecked > 0 && (
            <div>
              <dt className="font-semibold text-warn">
                {VERIFICATION_META.unchecked} auffällig
              </dt>
              <dd className="text-faint">
                Enthält ein seltenes Wort. Im Thema stehen sie markiert — sie sind nicht
                zwingend falsch, aber ungeprüft.
              </dd>
            </div>
          )}
          <div>
            <dt className="font-semibold text-danger">0 muttersprachlich geprüft</dt>
            <dd className="text-faint">
              Keine einzige Wendung hat bisher eine schwedischsprachige Person gegengelesen.
              Wortstellung, Idiomatik und Ton kann keine Maschine bestätigen — deshalb steht
              hier eine 0 und keine Beschönigung.
            </dd>
          </div>
        </dl>
      </section>
    </div>
  );
}

/**
 * `quiet` ist kein Schmuck, sondern die eine Design-Regel in Typografie: „aktiv"
 * zählt bloße Anwesenheit. Vorher stand es genauso groß und genauso hell da wie
 * die beiden GEMESSENEN Zahlen daneben — das Auge liest die drei dann als drei
 * gleichwertige Erfolge (Ehrlichkeits-Audit 2026-07-25).
 */
function Stat({
  value,
  label,
  accent,
  quiet,
}: {
  value: number;
  label: string;
  accent?: boolean;
  quiet?: boolean;
}) {
  return (
    <div>
      <div
        className={`tnum font-sans font-bold leading-none ${
          quiet ? 'text-[min(1.6rem,7.5vw)] text-muted' : 'text-[min(2.4rem,11vw)]'
        } ${accent ? 'text-success glow-success' : quiet ? '' : 'text-paper'}`}
      >
        {value}
      </div>
      <div className="mt-1.5 text-[0.68rem] font-medium uppercase tracking-[0.14em] text-muted">
        {label}
      </div>
    </div>
  );
}
