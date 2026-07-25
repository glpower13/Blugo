// Der Sparringspartner (P4, `docs/gremium-sprachpartner.md` §9).
//
// WAS DAS IST — UND WAS ES NICHT IST:
// Es ist ein freies gesprochenes Gespräch auf Schwedisch, das trotzdem GEMESSEN
// wird. Der Partner bekommt die heute fälligen Wendungen als Auftrag und stellt
// Fragen, auf die sie die natürliche Antwort wären. Sagt der Lerner eine davon
// selbst, ist das ein echter Produktions-Abruf und geht in dieselbe Memory-Engine
// wie jede andere Wiederholung.
//
// Es ist KEINE Redezeit-Messung. Minuten erzeugen hier nichts. Wer zehn Minuten
// plaudert, ohne eine Zielwendung zu produzieren, hat null Fortschritt — und die
// Fläche sagt das auch so. Genau daran hängt die eine Design-Regel.
//
// ZUSAMMENGESETZT AUS DREI VORHANDENEN TEILEN (§9, „Die Anbieterfrage"):
//   Ohr  = Web-Speech-Erkennung (P1)   · Kopf = Claude über den eigenen Schlüssel
//   Mund = Web-Speech-Ausgabe          · kein Backend, keine neuen Kosten

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Chunk } from '../../domain/chunk';
import { aiRegistry } from '../content/aiRegistry';
import type { SparringLine } from '../content/ports';
import { useSpeechInput } from '../comprehension/useSpeechInput';
import { matchedTargets, nearMisses, type NearMiss } from './targets';
import { SETTINGS, type SparringSetting } from './settings';
import { SpeakButton } from '../../ui/SpeakButton';
import { SceneArt } from '../../ui/SceneArt';
import { IconBack, IconChat, IconPlay, IconSparkle } from '../../ui/icons';
import { VoiceMissingHint } from '../../ui/VoiceHint';

/** Modus-Signatur „Gespräch" (Teal) — wie im Dialog-Modus. */
const ACCENT = '#63C9B6';

interface Props {
  targets: Chunk[]; // die heute fälligen Wendungen (schon begegnet)
  learnerName: string;
  /** Eine Zielwendung wurde im Gespräch selbst produziert → echter Abruf. */
  onProduced: (chunk: Chunk, spoken: boolean, helpUsed: boolean) => void;
  /** Die KI-Einstellungen öffnen (ohne Zugang gibt es hier nichts zu tun). */
  onOpenSettings: () => void;
  onExit: () => void;
}

export function SparringScene({
  targets: dueTargets,
  learnerName,
  onProduced,
  onOpenSettings,
  onExit,
}: Props) {
  const [setting, setSetting] = useState<SparringSetting | null>(null);
  // P5: freies Gespräch — ausdrücklich OHNE Messung. Es ist kein zweiter
  // Schwierigkeitsgrad, sondern der ehrliche Verzicht auf eine Zahl: wer einfach
  // reden will, soll das dürfen, ohne dass die App so tut, als messe sie dabei
  // etwas (docs/gremium-sprachpartner.md §3).
  const [free, setFree] = useState(false);
  const [lines, setLines] = useState<SparringLine[]>([]);
  const [de, setDe] = useState<Record<number, string>>({}); // Übersetzung je Partner-Zeile
  const [showDe, setShowDe] = useState<Record<number, boolean>>({});
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [typed, setTyped] = useState('');
  const [heard, setHeard] = useState('');
  const [openTargets, setOpenTargets] = useState(false); // Zielliste aufgedeckt = Krücke
  const [done, setDone] = useState<string[]>([]); // schon produzierte chunk-Ids
  // Freihändig: nach jeder Partner-Zeile geht das Mikrofon von selbst an. Das ist
  // der Unterschied zwischen „ich bediene eine App" und „ich telefoniere".
  // Bewusst AUS als Voreinstellung — ein Mikrofon, das ungefragt zuhört, wäre
  // ein Übergriff, kein Komfort.
  const [handsFree, setHandsFree] = useState(false);
  const [finished, setFinished] = useState(false); // Gespräch bewusst beendet
  // Fast-Treffer der letzten Äußerung: ein Hinweis an den Menschen, KEIN Eintrag
  // in der Messung (`nearMisses` in targets.ts).
  const [near, setNear] = useState<NearMiss[]>([]);
  const bottom = useRef<HTMLDivElement>(null);
  // Die Hörschleife wird erst weiter unten gebaut; über diese Refs erreicht sie
  // die Antwort-Funktion, ohne dass beide voneinander abhängen.
  const listen = useRef<() => void>(() => {});
  const handsFreeRef = useRef(false);
  handsFreeRef.current = handsFree;
  const finishedRef = useRef(false);
  const partner = aiRegistry.partner;
  const ttsOn = aiRegistry.synthesizer.isAvailable();
  // Im freien Modus gibt es keine Ziele — und damit nichts zu messen.
  const targets = useMemo(() => (free ? [] : dueTargets), [free, dueTargets]);

  const open = targets.filter((t) => !done.includes(t.id));
  const lastPartnerLine = [...lines].reverse().find((l) => l.who === 'partner')?.sv ?? '';

  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [lines, pending]);

  /**
   * Nächste Partner-Zeile holen (und vorlesen).
   *
   * `remaining` wird ausdrücklich HEREINGEREICHT statt aus dem Zustand gelesen:
   * Wer gerade eine Wendung produziert hat, hat sie in dieser Runde noch nicht im
   * Zustand — der Partner hätte sonst eine Runde lang weiter nach etwas gefragt,
   * das schon gesagt war.
   */
  const nextPartnerLine = useCallback(
    async (history: SparringLine[], s: SparringSetting, remaining: Chunk[]) => {
      if (!partner) return;
      setPending(true);
      setError('');
      try {
        const reply = await partner.reply({
          scene: s.brief,
          partner: s.partner,
          learnerName,
          targets: remaining.map((t) => ({ sv: t.sv, de: t.de })),
          history,
        });
        setLines((prev) => {
          const next = [...prev, { who: 'partner' as const, sv: reply.sv }];
          setDe((d) => ({ ...d, [next.length - 1]: reply.de }));
          return next;
        });
        // Erst ausreden lassen, dann zuhören — sonst hört das Mikrofon die
        // eigene Stimme des Geräts. `speak` erfüllt sich am Ende der Ausgabe.
        if (ttsOn) await aiRegistry.synthesizer.speak({ text: reply.sv });
        if (handsFreeRef.current && !finishedRef.current) listen.current();
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Der Sparringspartner antwortet gerade nicht.');
      } finally {
        setPending(false);
      }
    },
    [partner, learnerName, ttsOn],
  );

  /** Eine eigene Äußerung abschicken — hier wird gemessen. */
  const say = useCallback(
    (text: string, spoken: boolean) => {
      const utterance = text.trim();
      if (!utterance || !setting || pending) return;
      // Der Abgleich läuft gegen die letzte Partner-Zeile: Nachgeplappertes zählt
      // nicht (docs/gremium-sprachpartner.md, `matchedTargets`).
      const hits = matchedTargets(
        utterance,
        open.map((t) => ({ sv: t.sv, de: t.de })),
        lastPartnerLine,
      );
      // AUFGEDECKTE ZIELLISTE ZÄHLT NICHT. Wer die Wendungen vor sich liegen hat
      // und sie abliest, hat nichts abgerufen — das wäre der schnellste Weg zu
      // „reift" und damit genau der Goodhart-Fall, den der Nachplapper-Filter an
      // anderer Stelle verhindert (Ehrlichkeits-Audit 2026-07-25).
      if (!openTargets) {
        for (const hit of hits) {
          const chunk = open.find((t) => t.sv === hit.sv);
          if (chunk) onProduced(chunk, spoken, false);
        }
      }
      const hitIds = hits.map((h) => open.find((t) => t.sv === h.sv)!.id);
      if (hitIds.length > 0) setDone((d) => [...d, ...hitIds]);
      // Knapp daneben? Dann sagen wir es — schweigen wäre die schlechteste
      // Rückmeldung. Gezählt wird trotzdem nichts.
      setNear(nearMisses(utterance, open.map((t) => ({ sv: t.sv, de: t.de }))));
      const history = [...lines, { who: 'you' as const, sv: utterance }];
      setLines(history);
      setTyped('');
      setHeard('');
      void nextPartnerLine(
        history,
        setting,
        open.filter((t) => !hitIds.includes(t.id)),
      );
    },
    [setting, pending, open, lastPartnerLine, openTargets, lines, onProduced, nextPartnerLine],
  );

  const mic = useSpeechInput({
    onHeard: (text) => {
      setHeard(text);
      say(text, true);
    },
  });
  listen.current = mic.start;

  // Alle Ziele gesagt → das Gespräch hat sein Ziel erreicht und darf enden.
  // Es läuft NICHT endlos weiter, damit „fertig" ein echter Moment bleibt.
  const allDone = targets.length > 0 && done.length >= targets.length;
  const ended = finished || allDone;
  // Ein beendetes Gespräch hört nicht weiter zu — auch nicht freihändig.
  finishedRef.current = ended;

  // Ohne eingerichtete Cloud-KI gibt es diesen Modus nicht — und er behauptet
  // auch nicht, es gäbe ihn (kein toter Knopf).
  if (!partner) {
    return (
      <div className="mx-auto w-full max-w-xl">
        <BackBar onExit={onExit} />
        <section className="glass mt-4 rounded-2xl p-6">
          <p className="font-display text-lg font-semibold text-paper">
            Dafür brauchst du deinen eigenen KI-Zugang.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Der Sparringspartner denkt sich seine Antworten aus — das kann keine Rechenregel,
            das macht eine Cloud-KI. Sie läuft über einen Zugang, der dir gehört und den
            du selbst bezahlst; wir speichern nichts davon auf einem Server, weil es
            keinen gibt.
          </p>
          <ol className="mt-4 space-y-2 text-sm leading-relaxed text-muted">
            <li>
              <span className="text-paper">1.</span> Unten auf „Einstellungen öffnen" antippen.
            </li>
            <li>
              <span className="text-paper">2.</span> Bei „Anbieter" <em>Claude (Cloud)</em>{' '}
              wählen.
            </li>
            <li>
              <span className="text-paper">3.</span> Deinen KI-Zugang eintragen (beginnt mit
              „sk-ant-…") und speichern.
            </li>
          </ol>
          <button
            onClick={onOpenSettings}
            className="btn-gold mt-5 w-full rounded-xl px-5 py-3 font-medium text-ink"
          >
            Einstellungen öffnen
          </button>
          <p className="mt-3 text-[0.7rem] leading-relaxed text-faint">
            Alles andere in dieser App läuft ohne Zugang weiter — Lernen, Gespräche,
            Sprechen statt Tippen. Nur der Sparringspartner braucht ihn.
          </p>
        </section>
      </div>
    );
  }

  // --- Kulisse wählen ---------------------------------------------------------
  if (!setting) {
    return (
      <div className="mx-auto flex w-full max-w-xl flex-col gap-4">
        <BackBar onExit={onExit} />
        <header className="px-1">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.1em]"
            style={{ color: ACCENT, background: `${ACCENT}1f`, border: `1px solid ${ACCENT}66` }}
          >
            <IconChat className="h-3.5 w-3.5" /> Sparring
          </span>
          <h1 className="mt-2 font-display text-[1.5rem] font-semibold leading-tight text-paper">
            Wo soll geredet werden?
          </h1>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            {free ? (
              <>
                Freies Gespräch: Rede, worüber du willst. Hier wird <b>nichts gemessen</b> —
                und deshalb steht hinterher auch keine Zahl da.
              </>
            ) : dueTargets.length > 0 ? (
              <>
                Der Sparringspartner versucht, dir {dueTargets.length}{' '}
                {dueTargets.length === 1 ? 'fällige Wendung' : 'fällige Wendungen'} zu entlocken.
                Was du selbst sagst, zählt — was er dir vorsagt, nicht.
              </>
            ) : (
              <>
                Gerade ist nichts fällig. Reden darfst du trotzdem — es wird dann aber
                nichts gemessen, und das sagen wir dir lieber, als eine Zahl zu erfinden.
              </>
            )}
          </p>

          {/* P5: Der freie Modus ist eine bewusste Wahl, keine Belohnung und keine
              Strafe. Er steht gleichberechtigt daneben und sagt klar, was er nicht
              kann — messen. */}
          {dueTargets.length > 0 && (
            <div className="mt-3 flex gap-2" role="group" aria-label="Art des Gesprächs">
              <ModeChip active={!free} onClick={() => setFree(false)} label="Mit Zielen · zählt" />
              <ModeChip active={free} onClick={() => setFree(true)} label="Frei · zählt nicht" />
            </div>
          )}
        </header>

        <ul className="flex flex-col gap-3">
          {SETTINGS.map((s) => (
            <li key={s.id}>
              <button
                onClick={() => {
                  setSetting(s);
                  void nextPartnerLine([], s, targets);
                }}
                className="group relative block w-full overflow-hidden rounded-2xl border border-line text-left"
                style={{ backgroundColor: '#080B12' }}
              >
                {/* `SceneArt` bringt seine eigene Höhe mit (h-44) — ohne diesen
                    beschneidenden Rahmen lief das Bild über die Beschriftung.
                    Beschnitten wird oben: unten stehen die Menschen, und die
                    machen aus einer Kulisse einen Ort. */}
                <div className="relative h-28 w-full overflow-hidden">
                  <div className="absolute inset-x-0 bottom-0">
                    <SceneArt scene={s.id} hue={ACCENT} />
                  </div>
                  <span className="grain-soft" aria-hidden="true" />
                </div>
                <div className="px-4 pb-3 pt-2.5">
                  <p className="font-display text-[1.05rem] font-semibold text-paper">{s.title}</p>
                  <p className="mt-0.5 text-xs text-muted">{s.partner}</p>
                </div>
              </button>
            </li>
          ))}
        </ul>

        <p className="px-1 text-[0.7rem] leading-relaxed text-faint">
          Jede Antwort des Sparringspartners läuft über deinen eigenen KI-Zugang und kostet
          dich dort ein paar Cent. Die Stimme kommt vom Gerät. Schwedisch aus einer KI ist
          nicht muttersprachlich geprüft.
        </p>
      </div>
    );
  }

  // --- Das Gespräch -----------------------------------------------------------
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-4">
      <BackBar onExit={onExit} label={setting.title} />

      <section className="glass relative overflow-hidden rounded-2xl">
        <SceneArt scene={setting.id} hue={ACCENT} />
        <div className="relative px-5 pb-5 pt-4">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.1em]"
            style={{ color: ACCENT, background: `${ACCENT}1f`, border: `1px solid ${ACCENT}66` }}
          >
            <IconChat className="h-3.5 w-3.5" /> Sparring
          </span>
          <p className="mt-2 text-[0.66rem] font-medium uppercase tracking-[0.16em] text-faint">
            {setting.partner}
          </p>

          {/* Freihändig + Beenden. Der Schalter steht offen da statt versteckt:
              wer ihn nicht will, soll ihn sehen und ignorieren können. */}
          {!ended && (
            <div className="mt-2.5 flex flex-wrap items-center gap-2">
              {mic.supported && (
                <button
                  onClick={() => setHandsFree((v) => !v)}
                  aria-pressed={handsFree}
                  className={
                    handsFree
                      ? 'rounded-full px-3 py-1 text-[0.7rem] font-medium'
                      : 'rounded-full border border-line px-3 py-1 text-[0.7rem] text-muted'
                  }
                  style={
                    handsFree
                      ? { color: ACCENT, background: `${ACCENT}1f`, border: `1px solid ${ACCENT}66` }
                      : undefined
                  }
                >
                  {handsFree ? 'Freihändig an' : 'Freihändig'}
                </button>
              )}
              <button
                onClick={() => setFinished(true)}
                className="rounded-full border border-line px-3 py-1 text-[0.7rem] text-muted"
              >
                Gespräch beenden
              </button>
            </div>
          )}

          {/* Der ehrliche Zähler: Wendungen, nicht Minuten. */}
          {targets.length > 0 && (
            <div className="mt-3 rounded-xl border border-line bg-white/[0.03] p-3">
              <div className="flex items-baseline justify-between gap-2">
                <p className="text-xs text-muted">
                  <span className="text-paper">{done.length}</span> von {targets.length} selbst
                  gesagt
                  {openTargets && <span className="text-warn"> · aufgedeckt, zählt nicht</span>}
                </p>
                <button
                  onClick={() => setOpenTargets((v) => !v)}
                  className="text-[0.7rem] text-muted underline underline-offset-2"
                >
                  {openTargets ? 'wieder verstecken' : 'verraten (zählt dann nicht)'}
                </button>
              </div>
              {openTargets && (
                <ul className="mt-2 flex flex-col gap-1">
                  {targets.map((t) => (
                    <li key={t.id} className="text-xs">
                      <span
                        lang="sv"
                        className={done.includes(t.id) ? 'text-success line-through' : 'text-paper'}
                      >
                        {t.sv}
                      </span>{' '}
                      <span className="text-faint">— {t.de}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <div className="mt-4 flex flex-col gap-3">
            {lines.map((l, i) =>
              l.who === 'partner' ? (
                <div key={i} className="glass-soft max-w-[90%] rounded-2xl rounded-bl-md px-3.5 py-2.5">
                  <p lang="sv" className="font-medium text-paper">
                    {l.sv}
                  </p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    {ttsOn && (
                      <button
                        onClick={() => void aiRegistry.synthesizer.speak({ text: l.sv })}
                        className="flex items-center gap-1.5 rounded-full bg-brand/20 px-3 py-1 text-xs text-brand"
                        aria-label="Zeile hören"
                      >
                        <IconPlay className="h-3 w-3" /> Hören
                      </button>
                    )}
                    {/* Ohne schwedische Stimme bleibt „Hören" still — und der
                        freihändige Modus wartet dann auf eine Ausgabe, die es
                        nicht gibt. Also sagen, warum. */}
                    {ttsOn && <VoiceMissingHint className="w-full" />}
                    <button
                      onClick={() => setShowDe((s) => ({ ...s, [i]: !s[i] }))}
                      className="rounded-full border border-line px-3 py-1 text-xs text-muted"
                    >
                      {showDe[i] ? 'Übersetzung aus' : 'Übersetzung'}
                    </button>
                  </div>
                  {showDe[i] && <p className="mt-1.5 text-xs italic text-muted">{de[i]}</p>}
                </div>
              ) : (
                <div key={i} className="flex justify-end">
                  <div className="max-w-[85%] rounded-2xl rounded-br-md border border-brand/40 bg-brand/15 px-3.5 py-2">
                    <p lang="sv" className="font-medium text-paper">
                      {l.sv}
                    </p>
                  </div>
                </div>
              ),
            )}

            {/* Fast-Treffer: steht unter der eigenen Zeile, in der Farbe von
                „noch nicht", und sagt ausdrücklich, dass es nicht zählt. */}
            {near.length > 0 && !ended && (
              <div className="ml-auto max-w-[92%] rounded-xl border border-warn/40 bg-warn/10 px-3 py-2">
                {near.map((m) => (
                  <p key={m.target.sv} className="text-xs leading-relaxed text-warn">
                    Fast — du hast{' '}
                    <span lang="sv" className="text-paper">
                      „{m.said}"
                    </span>{' '}
                    gesagt, gemeint ist{' '}
                    <span lang="sv" className="text-paper">
                      „{m.target.sv}"
                    </span>{' '}
                    ({m.target.de}).
                  </p>
                ))}
                <p className="mt-1 text-[0.66rem] text-faint">
                  Zählt noch nicht — sag es noch einmal genau so, dann schon.
                </p>
              </div>
            )}

            {pending && (
              <p className="flex items-center gap-1.5 text-xs text-faint">
                <IconSparkle className="h-3 w-3" /> {setting.partner.split(',')[0]} überlegt …
              </p>
            )}
            {error && (
              <div className="rounded-xl border border-danger/40 bg-danger/10 p-3">
                <p className="text-xs text-danger">{error}</p>
                <button
                  onClick={() => void nextPartnerLine(lines, setting, open)}
                  className="mt-2 rounded-full border border-line px-3 py-1 text-xs text-paper"
                >
                  Noch einmal versuchen
                </button>
              </div>
            )}
            <div ref={bottom} />
          </div>

          {/* Der Abschluss. Ehrlich in beide Richtungen: was du selbst gesagt
              hast, steht namentlich da — und was nicht vorkam, wird nicht
              verschwiegen. Keine Zeitangabe, kein Lob fürs Dabeisein. */}
          {ended ? (
            <div className="mt-4 rounded-2xl border border-success/30 bg-success/10 p-5">
              <p className="font-display text-lg font-semibold text-success">
                {allDone ? 'Alles gesagt.' : 'Gespräch beendet.'}
              </p>
              {targets.length === 0 ? (
                <p className="mt-1.5 text-sm leading-relaxed text-muted">
                  Geübt, nicht gemessen — hier gab es keine fälligen Wendungen, also gibt
                  es auch keine Zahl.
                </p>
              ) : (
                <>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">
                    <span className="text-paper">{done.length}</span> von {targets.length}{' '}
                    {targets.length === 1 ? 'Wendung' : 'Wendungen'} hast du selbst gesagt —
                    das zählt für deinen Erhalt.
                  </p>
                  <ul className="mt-3 flex flex-col gap-1.5">
                    {targets.map((t) => (
                      <li key={t.id} className="flex items-start gap-2 text-xs">
                        <span
                          aria-hidden="true"
                          className={
                            done.includes(t.id)
                              ? 'mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-success'
                              : 'mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-line'
                          }
                        />
                        <span>
                          <span lang="sv" className={done.includes(t.id) ? 'text-paper' : 'text-muted'}>
                            {t.sv}
                          </span>{' '}
                          <span className="text-faint">
                            — {done.includes(t.id) ? 'selbst gesagt' : 'kam nicht vor'}
                          </span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={onExit}
                  className="btn-gold rounded-xl px-5 py-2.5 font-medium text-ink"
                >
                  Fertig
                </button>
                {!allDone && (
                  <button
                    onClick={() => setFinished(false)}
                    className="glass-soft rounded-xl px-4 py-2.5 text-paper"
                  >
                    Weiterreden
                  </button>
                )}
              </div>
            </div>
          ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              say(typed, false);
            }}
            className="mt-4 flex flex-col gap-2"
          >
            <input
              lang="sv"
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              placeholder="auf Schwedisch antworten…"
              aria-label="Deine Antwort auf Schwedisch"
              autoCapitalize="off"
              autoCorrect="off"
              disabled={pending}
              className="w-full min-w-0 rounded-lg border border-line bg-base px-3 py-2 text-paper disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={pending || !typed.trim()}
              className="btn-gold w-full rounded-xl px-4 py-2.5 font-medium text-ink disabled:opacity-40"
            >
              Sagen
            </button>
            {mic.supported && <SpeakButton mic={mic} heard={heard} label="Antworte auf Schwedisch" />}
            {handsFree && (
              <p className="text-[0.68rem] leading-relaxed text-faint">
                Freihändig: Nach jeder Antwort des Sparringspartners geht das Mikrofon von
                selbst an. Ausschalten geht oben jederzeit.
              </p>
            )}
          </form>
          )}

          {targets.length === 0 && !ended && (
            <p className="mt-3 text-[0.7rem] leading-relaxed text-faint">
              Übung, kein Beweis:{' '}
              {free
                ? 'Du hast das freie Gespräch gewählt — an diesem Gespräch wird nichts gemessen.'
                : 'Hier ist gerade nichts fällig, deshalb wird an diesem Gespräch auch nichts gemessen.'}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

function ModeChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={
        active
          ? 'rounded-full px-3.5 py-1.5 text-xs font-medium'
          : 'rounded-full border border-line px-3.5 py-1.5 text-xs text-muted'
      }
      style={
        active
          ? { color: ACCENT, background: `${ACCENT}1f`, border: `1px solid ${ACCENT}66` }
          : undefined
      }
    >
      {label}
    </button>
  );
}

function BackBar({ onExit, label = 'Zurück' }: { onExit: () => void; label?: string }) {
  return (
    <nav className="flex items-center px-1">
      <button
        onClick={onExit}
        className="glass-soft flex items-center gap-1.5 rounded-full py-1.5 pl-2.5 pr-3.5 text-sm"
        aria-label="Sparring verlassen"
      >
        <IconBack className="h-4 w-4 text-paper" />
        <span style={{ color: ACCENT }} className="font-medium">
          {label}
        </span>
      </button>
    </nav>
  );
}
