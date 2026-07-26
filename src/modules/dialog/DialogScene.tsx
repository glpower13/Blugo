// Dialog-Modus (Szenen-Gespräch) — die im Gremium beschlossene Ausbaustufe.
// Partner-Zeilen = verständlicher Input (hören/aufdecken/dekodieren); „du"-Zeilen =
// echte Produktion, die in die Memory-Engine zurückfließt (die eine Design-Regel:
// Fortschritt = echtes Können). Wiederverwendet TTS, Antwort-Prüfung und Explainer.

import { useEffect, useRef, useState } from 'react';
import type { ReviewResult } from '../../domain/chunk';
import type { Dialog, DialogTurn } from '../../domain/dialog';
import { aiRegistry } from '../content/aiRegistry';
import { analyzeAnswer, type AnswerAnalysis } from '../comprehension/answerCheck';
import { useSpeechInput } from '../comprehension/useSpeechInput';
import { slowSpeechRate } from '../comprehension/tts';
import { SpeakButton } from '../../ui/SpeakButton';
import { fillName } from '../../session/profile';
import { IconBack, IconChat, IconPlay, IconSlow, IconSparkle } from '../../ui/icons';
import { AreaWash } from '../../ui/areaTheme';
import { SceneArt } from '../../ui/SceneArt';
import { VoiceMissingHint } from '../../ui/VoiceHint';

// Farbstimmung der Szene (liegt UNTER dem Szenenbild, gibt ihm Tiefe).
const SCENE_GLOW: Record<Dialog['scene'], string> = {
  cafe: 'radial-gradient(70% 42% at 50% 0%, rgba(231,168,90,.16), transparent 60%)',
  hotel: 'radial-gradient(70% 42% at 50% 0%, rgba(150,130,205,.15), transparent 60%)',
  station: 'radial-gradient(70% 42% at 50% 0%, rgba(120,170,220,.15), transparent 60%)',
  shop: 'radial-gradient(70% 42% at 50% 0%, rgba(95,208,160,.13), transparent 60%)',
  clinic: 'radial-gradient(70% 42% at 50% 0%, rgba(230,137,131,.14), transparent 60%)',
  garage: 'radial-gradient(70% 42% at 50% 0%, rgba(230,160,90,.15), transparent 60%)',
  gaming: 'radial-gradient(70% 42% at 50% 0%, rgba(140,140,235,.16), transparent 60%)',
  track: 'radial-gradient(70% 42% at 50% 0%, rgba(120,190,225,.14), transparent 60%)',
  lake: 'radial-gradient(70% 42% at 50% 0%, rgba(120,190,180,.15), transparent 60%)',
  stadium: 'radial-gradient(70% 42% at 50% 0%, rgba(130,200,140,.15), transparent 60%)',
  office: 'radial-gradient(70% 42% at 50% 0%, rgba(159,182,201,.14), transparent 60%)',
  home: 'radial-gradient(70% 42% at 50% 0%, rgba(231,168,90,.15), transparent 60%)',
  street: 'radial-gradient(70% 42% at 50% 0%, rgba(155,140,150,.15), transparent 60%)',
  school: 'radial-gradient(70% 42% at 50% 0%, rgba(201,183,127,.13), transparent 60%)',
  generic: 'radial-gradient(70% 42% at 50% 0%, rgba(231,192,138,.12), transparent 60%)',
};

interface Props {
  dialog: Dialog;
  backLabel: string;
  areaHue: string; // Kennfarbe des Bereichs (Bereichs-Schimmer, Orientierung)
  learnerName: string; // Vorname des Lerners (personalisiert die Anrede); '' = keiner
  onProduce: (
    turn: DialogTurn,
    result: ReviewResult,
    helpUsed: boolean,
    spoken: boolean,
    exact?: boolean,
  ) => void;
  onExit: () => void;
}

// Modus-Signatur „Gespräch" (Teal) — unterscheidet den Dialog klar vom Üben-Modus.
const DIALOG_ACCENT = '#63C9B6';

export function DialogScene({ dialog, backLabel, areaHue, learnerName, onProduce, onExit }: Props) {
  const [step, setStep] = useState(0);
  // Was der Lerner in DIESEM Gespräch wirklich geschafft hat. Die Schlusszeile
  // zählte vorher alle „du"-Zeilen der Szene — also auch die, die er dreimal
  // nicht konnte (Ehrlichkeits-Audit 2026-07-25).
  const [graded, setGraded] = useState<{ good: number; total: number }>({ good: 0, total: 0 });
  const bottomRef = useRef<HTMLDivElement>(null);

  const turns = dialog.turns;
  const current = turns[step];
  const done = step >= turns.length;
  const ttsOn = aiRegistry.synthesizer.isAvailable();

  // Immer ans Ende scrollen, wenn eine neue Zeile dran ist.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [step, done]);

  return (
    <div className="relative isolate mx-auto flex w-full max-w-xl flex-col gap-4">
      <AreaWash hue={areaHue} />
      {/* Kopf: Zurück (Thema benannt) + Fortschritt */}
      <nav className="flex items-center justify-between gap-2 px-1">
        <button
          onClick={onExit}
          className="glass-soft flex items-center gap-1.5 rounded-full py-1.5 pl-2.5 pr-3.5 text-sm"
          aria-label={`${backLabel} — Gespräch verlassen`}
        >
          <IconBack className="h-4 w-4 text-paper" />
          <span style={{ color: areaHue }} className="font-medium">
            {backLabel}
          </span>
        </button>
        {!done && (
          <span className="whitespace-nowrap text-xs font-medium uppercase tracking-wide text-muted">
            {Math.min(step + 1, turns.length)} / {turns.length}
          </span>
        )}
      </nav>

      <section className="glass relative overflow-hidden rounded-2xl">
        {/* Farbstimmung über der ganzen Karte … */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ background: SCENE_GLOW[dialog.scene] }}
        />
        {/* … und ein eigenes Bildband für die Kulisse: so ist die Szene wirklich
            ERKENNBAR (Dual Coding) und der Text darunter bleibt gestochen scharf. */}
        <SceneArt scene={dialog.scene} hue={areaHue} />
        <div className="relative px-5 pb-5 pt-4">
          {/* Modus-Abzeichen: unverkennbar ein GESPRÄCH (nicht der Üben-Modus). */}
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.1em]"
            style={{
              color: DIALOG_ACCENT,
              background: `${DIALOG_ACCENT}1f`,
              border: `1px solid ${DIALOG_ACCENT}66`,
            }}
          >
            <IconChat className="h-3.5 w-3.5" /> Gespräch
          </span>
          <p className="mt-2 text-[0.66rem] font-medium uppercase tracking-[0.16em] text-faint">
            {dialog.partnerName}
          </p>
          <h1 className="mt-0.5 font-display text-xl font-semibold leading-tight text-paper">
            {dialog.title}
          </h1>

          {/* Verlauf: erledigte Zeilen kompakt */}
          <div className="mt-4 flex flex-col gap-3">
            {turns.slice(0, step).map((t) => (
              <DoneBubble key={t.id} turn={t} partnerName={dialog.partnerName} name={learnerName} />
            ))}

            {/* Aktive Zeile */}
            {/* Die aktive Zeile gleitet von ihrer Seite herein — das Gespräch baut
                sich auf, statt zu springen (reduced-motion: sofort da). */}
            {!done && current.speaker === 'partner' && (
              <div key={current.id} className="turn-in-left">
                <PartnerTurn
                  turn={current}
                  partnerName={dialog.partnerName}
                  name={learnerName}
                  ttsOn={ttsOn}
                  onNext={() => setStep((s) => s + 1)}
                />
              </div>
            )}
            {!done && current.speaker === 'you' && (
              <div key={current.id} className="turn-in-right">
                <YouTurn
                  turn={current}
                  ttsOn={ttsOn}
                  onGrade={(result, helpUsed, spoken, exact) => {
                    onProduce(current, result, helpUsed, spoken, exact);
                    setGraded((g) => ({
                      good: g.good + (result === 'good' ? 1 : 0),
                      total: g.total + 1,
                    }));
                    setStep((s) => s + 1);
                  }}
                />
              </div>
            )}

            {done && (
              <div className="rounded-2xl border border-success/30 bg-success/10 p-5 text-center">
                <p className="font-display text-lg font-semibold text-success">Gespräch geschafft.</p>
                <p className="mt-1 text-sm text-muted">
                  {graded.good} von {graded.total}{' '}
                  {graded.total === 1 ? 'Wendung' : 'Wendungen'} saßen. Alle {graded.total}{' '}
                  fließen in deinen Erhalt ein — die, die nicht saßen, kommen früher wieder.
                </p>
                <button
                  onClick={onExit}
                  className="btn-gold mt-4 rounded-xl px-5 py-2.5 font-medium text-ink"
                >
                  Fertig
                </button>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </div>
      </section>
    </div>
  );
}

/** Erledigte Zeile — kompakte Sprechblase (Partner links, du rechts). */
function DoneBubble({
  turn,
  partnerName,
  name,
}: {
  turn: DialogTurn;
  partnerName: string;
  name: string;
}) {
  if (turn.speaker === 'you') {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-br-md border border-brand/40 bg-brand/15 px-3.5 py-2">
          <p lang="sv" className="font-medium text-paper">
            {turn.sv}
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="glass-soft max-w-[88%] rounded-2xl rounded-bl-md px-3.5 py-2.5">
      <p className="mb-0.5 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-faint">
        {partnerName}
      </p>
      <p lang="sv" className="font-medium text-paper">
        {fillName(turn.sv, name)}
      </p>
      <p className="mt-0.5 text-xs text-muted">{fillName(turn.de, name)}</p>
    </div>
  );
}

/** Aktive Partner-Zeile: hören (ggf. erst hören → aufdecken), dekodieren, weiter. */
function PartnerTurn({
  turn,
  partnerName,
  name,
  ttsOn,
  onNext,
}: {
  turn: DialogTurn;
  partnerName: string;
  name: string;
  ttsOn: boolean;
  onNext: () => void;
}) {
  const [revealed, setRevealed] = useState(!turn.listenFirst);
  const [showDecode, setShowDecode] = useState(false);
  const [showTr, setShowTr] = useState(false);
  const sv = fillName(turn.sv, name); // Anrede personalisieren (z. B. „Hej Andreas, …")
  const de = fillName(turn.de, name);

  return (
    <div className="glass-soft max-w-[92%] rounded-2xl rounded-bl-md p-4">
      <p className="mb-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-faint">
        {partnerName}
      </p>

      {!revealed ? (
        // Hör-zuerst: nur Klang, Text verdeckt, auf Tipp aufdecken (Dual Coding).
        <div className="flex flex-col items-start gap-3">
          <p className="max-w-full select-none break-words text-[min(1.4rem,6.5vw)] font-semibold leading-tight text-paper blur-[6px]">
            {sv}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {ttsOn && (
              <button
                onClick={() => void aiRegistry.synthesizer.speak({ text: sv })}
                className="btn-gold flex min-h-11 items-center gap-1.5 rounded-full px-4 text-sm font-medium text-ink"
                aria-label="Hören"
              >
                <IconPlay className="h-3.5 w-3.5" /> Hören
              </button>
            )}
            <button
              onClick={() => setRevealed(true)}
              className="min-h-11 rounded-full border border-line px-4 text-sm text-paper"
            >
              Aufdecken
            </button>
          </div>
          {ttsOn && <VoiceMissingHint className="mt-2" />}
          <p className="text-xs text-faint">Erst hören — verstehst du es?</p>
        </div>
      ) : (
        <>
          {/* `flex-wrap` + `min-w-0`: sonst schob die Knopfgruppe „Hören"
              bis zu 63 px aus dem Bild und `overflow-hidden` schnitt sie ab
              (Layout-Audit 2026-07-25). */}
          <div className="flex flex-col items-start gap-2 sm:flex-row sm:justify-between sm:gap-x-3">
            <p
              lang="sv"
              className="w-full min-w-0 break-words text-[min(1.4rem,6.5vw)] font-semibold leading-tight text-paper sm:flex-1"
            >
              {sv}
            </p>
            {ttsOn && (
              <div className="flex shrink-0 flex-wrap gap-2">
                <button
                  onClick={() => void aiRegistry.synthesizer.speak({ text: sv })}
                  className="flex min-h-11 items-center gap-1.5 rounded-full bg-brand/20 px-4 text-sm text-brand"
                  aria-label="Hören"
                >
                  <IconPlay className="h-3 w-3" /> Hören
                </button>
                <button
                  onClick={() => void aiRegistry.synthesizer.speak({ text: sv, rate: slowSpeechRate() })}
                  className="flex min-h-11 min-w-11 items-center justify-center rounded-full bg-brand/20 px-3 text-brand"
                  aria-label="Langsam hören"
                  title="Langsamer"
                >
                  <IconSlow className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {turn.decoding && turn.decoding.length > 0 && (
              <button
                onClick={() => setShowDecode((v) => !v)}
                className="glass-soft min-h-11 rounded-full px-4 text-sm text-paper"
              >
                {showDecode ? 'Dekodierung ausblenden' : 'Dekodierung'}
              </button>
            )}
            <button
              onClick={() => setShowTr((v) => !v)}
              className="glass-soft min-h-11 rounded-full px-4 text-sm text-paper"
            >
              {showTr ? 'Übersetzung ausblenden' : 'Übersetzung'}
            </button>
          </div>

          {showDecode && turn.decoding && (
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
              {turn.decoding.map((t, i) => (
                <span key={i} className="inline-flex flex-col items-center">
                  <span lang="sv" className="text-paper">
                    {t.sv}
                  </span>
                  <span className="text-xs text-muted">{t.de}</span>
                </span>
              ))}
            </div>
          )}
          {showTr && <p className="mt-3 italic text-muted">{de}</p>}

          <button
            onClick={onNext}
            className="btn-gold mt-4 rounded-xl px-5 py-2 font-medium text-ink"
          >
            Weiter
          </button>
        </>
      )}
    </div>
  );
}

/** Aktive „du"-Zeile: produzieren (Vorschläge = Krücke), prüfen, ehrlich bewerten. */
function YouTurn({
  turn,
  ttsOn,
  onGrade,
}: {
  turn: DialogTurn;
  ttsOn: boolean;
  onGrade: (result: ReviewResult, helpUsed: boolean, spoken: boolean, exact?: boolean) => void;
}) {
  const [typed, setTyped] = useState('');
  const [heard, setHeard] = useState(''); // was die Spracheingabe verstanden hat
  const [spokenOk, setSpokenOk] = useState(false); // gesprochen UND exakt erkannt
  const [exactHit, setExactHit] = useState(false); // objektiver Volltreffer der Prüfung
  const [helpUsed, setHelpUsed] = useState(false);
  const [phase, setPhase] = useState<'input' | 'feedback' | 'revealed'>('input');
  const [feedback, setFeedback] = useState<AnswerAnalysis | null>(null);
  const [why, setWhy] = useState<{ state: 'idle' | 'loading' | 'ok' | 'error'; text: string }>({
    state: 'idle',
    text: '',
  });

  const canExplain = aiRegistry.explainer !== null;

  // Getippt ODER gesprochen — dieselbe Prüfung gegen denselben geprüften Chunk
  // (docs/gremium-sprachpartner.md §3: zweiter Weg, kein zweiter Maßstab).
  function check(value: string = typed, fromSpeech = false) {
    const fb = analyzeAnswer(value, turn.sv);
    setSpokenOk(fromSpeech && fb.correct);
    // Der objektive Treffer, getrennt vom Selbsteinschätzungs-Knopf.
    setExactHit(fb.correct);
    if (fb.correct) {
      setFeedback(null);
      setPhase('revealed');
    } else {
      setFeedback(fb);
      setHelpUsed(true); // korrektives Feedback ist eine gezogene Hilfe (Ehrlichkeit)
      setPhase('feedback');
    }
  }

  // Im Gespräch ist Sprechen der natürlichste Weg — hier zählt es genauso (P2).
  const mic = useSpeechInput({
    onHeard: (text) => {
      setHeard(text);
      setTyped(text);
      check(text, true);
    },
  });

  async function askWhy() {
    const explainer = aiRegistry.explainer;
    if (!explainer) return;
    setHelpUsed(true);
    setWhy({ state: 'loading', text: '' });
    try {
      const text = await explainer.explain({ target: turn.sv, typed, meaning: turn.de });
      setWhy({ state: 'ok', text });
    } catch (e) {
      setWhy({ state: 'error', text: e instanceof Error ? e.message : 'Erklärung fehlgeschlagen.' });
    }
  }

  return (
    <div className="ml-auto max-w-[92%] rounded-2xl rounded-br-md border border-brand/40 bg-brand/10 p-4">
      <p className="mb-1 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-brand-soft">
        Du bist dran
      </p>
      <p className="mb-3 text-sm text-muted">
        Sag auf Schwedisch: „<span className="text-paper">{turn.de}</span>"
      </p>

      {phase === 'input' && (
        <>
          {turn.suggestions && turn.suggestions.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {turn.suggestions.map((s) => (
                <button
                  key={s}
                  lang="sv"
                  onClick={() => {
                    setTyped(s);
                    setHelpUsed(true); // Vorschlag genutzt = Krücke gezogen
                  }}
                  className="glass-soft min-h-11 rounded-full px-4 text-sm text-paper"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              check();
            }}
            /* Knopf UNTER dem Feld, nicht daneben: nebeneinander lief die Zeile
               über den Kartenrand hinaus (flex-1 schrumpft nicht unter die
               Textbreite des Platzhalters), der Knopf war rechts abgeschnitten.
               Untereinander ist er nie abschneidbar, voll breit anzutippen und
               liegt tief genug für den Daumen. */
            className="flex flex-col gap-2"
          >
            <input
              lang="sv"
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              placeholder="auf Schwedisch tippen …"
              aria-label="Antwort auf Schwedisch"
              autoCapitalize="off"
              autoCorrect="off"
              className="w-full min-w-0 rounded-lg border border-line bg-base px-3 py-2 text-paper"
            />
            <button
              type="submit"
              className="btn-gold w-full rounded-xl px-4 py-2.5 font-medium text-ink"
            >
              Prüfen
            </button>
            {mic.supported && (
              <>
                <div className="flex items-center gap-3 pt-0.5" aria-hidden="true">
                  <span className="h-px flex-1 bg-line" />
                  <span className="text-[0.66rem] uppercase tracking-[0.16em] text-faint">oder</span>
                  <span className="h-px flex-1 bg-line" />
                </div>
                <SpeakButton mic={mic} heard={heard} label="Sprich es auf Schwedisch" />
              </>
            )}
          </form>
        </>
      )}

      {phase === 'feedback' && feedback && (
        <div>
          <p className="mb-2 text-sm text-warn">{feedback.hint}</p>
          {heard && (
            <p className="mb-2 text-xs text-faint">
              Gesprochen · verstanden wurde{' '}
              <span lang="sv" className="text-muted">
                „{heard}"
              </span>
              . War das nicht deine Aussprache, sprich noch einmal.
            </p>
          )}
          <p className="mb-1 text-xs text-faint">
            <span className="text-success underline">unterstrichen</span> = fehlt ·{' '}
            <span className="text-danger line-through">durchgestrichen</span> = zu viel
          </p>
          <div
            lang="sv"
            className="mb-3 rounded-lg border border-line bg-base px-3 py-2 text-lg tracking-wide"
          >
            {feedback.diff.map((p, i) => (
              <span
                key={i}
                className={
                  p.kind === 'same'
                    ? 'text-paper'
                    : p.kind === 'missing'
                      ? 'text-success underline'
                      : 'text-danger line-through'
                }
              >
                {p.text}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setFeedback(null);
                setTyped('');
                setHeard('');
                setWhy({ state: 'idle', text: '' });
                setPhase('input');
              }}
              className="btn-gold rounded-xl px-4 py-2 font-medium text-ink"
            >
              Nochmal versuchen
            </button>
            <button
              onClick={() => setPhase('revealed')}
              className="glass-soft rounded-xl px-4 py-2 text-paper"
            >
              Auflösen
            </button>
            {canExplain && (
              <button
                onClick={() => void askWhy()}
                disabled={why.state === 'loading'}
                className="flex items-center gap-1.5 rounded-full border border-brand/50 bg-brand/10 px-4 py-2 text-sm text-brand disabled:opacity-50"
              >
                <IconSparkle className="h-3.5 w-3.5" />
                {why.state === 'loading' ? 'KI denkt …' : 'Warum?'}
              </button>
            )}
          </div>
          {why.state === 'ok' && (
            <div className="mt-3 rounded-lg border border-brand/40 bg-brand/5 p-3">
              <p className="mb-1 text-xs uppercase tracking-wide text-brand">
                KI-Hinweis · nicht muttersprachlich geprüft
              </p>
              <p className="text-sm text-paper">{why.text}</p>
            </div>
          )}
          {why.state === 'error' && (
            <p className="mt-2 flex items-center gap-1.5 text-xs text-danger">
              <IconSparkle className="h-3 w-3" /> {why.text}
            </p>
          )}
        </div>
      )}

      {phase === 'revealed' && (
        <>
          <div className="mb-3 flex items-center justify-between gap-3">
            <p lang="sv" className="font-sans text-xl font-bold text-paper">
              {turn.sv}
            </p>
            {ttsOn && (
              <button
                onClick={() => void aiRegistry.synthesizer.speak({ text: turn.sv })}
                className="flex shrink-0 items-center gap-1.5 rounded-full bg-brand/20 px-3 py-1.5 text-sm text-brand"
                aria-label="Hören"
              >
                <IconPlay className="h-3 w-3" /> Hören
              </button>
            )}
          </div>
          {spokenOk && (
            <p className="mb-2 text-xs text-[#63C9B6]">Laut gesagt und richtig erkannt.</p>
          )}
          <p className="mb-2 text-sm text-muted">Wie saß es?</p>
          <div className="grid grid-cols-3 gap-2">
            <GradeButton
              label="Nochmal"
              tone="bg-danger"
              onClick={() => onGrade('again', helpUsed, spokenOk, exactHit)}
            />
            <GradeButton
              label="Fast"
              tone="bg-warn"
              onClick={() => onGrade('hard', helpUsed, spokenOk, exactHit)}
            />
            <GradeButton
              label="Sitzt"
              tone="bg-success"
              onClick={() => onGrade('good', helpUsed, spokenOk, exactHit)}
            />
          </div>
        </>
      )}
    </div>
  );
}

function GradeButton({ label, tone, onClick }: { label: string; tone: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={`Selbsteinschätzung: ${label}`}
      className={`rounded-lg py-2.5 text-sm font-medium text-ink ${tone}`}
    >
      {label}
    </button>
  );
}
