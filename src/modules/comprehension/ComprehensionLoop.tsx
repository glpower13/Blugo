// Comprehension-Loop (docs/04-product.md): Begegnung → Verständnishilfen →
// Verständnis-Check → Ergebnis. Hilfen sind abschaltbare "Krücken": der Nutzer
// zieht nur so viel Hilfe, wie er braucht (Autonomie, docs/06-motivation.md).

import { useEffect, useState } from 'react';
import type { Chunk, ChunkState, DecodingToken, ReviewResult, Segment } from '../../domain/chunk';
import { aiRegistry } from '../content/aiRegistry';
import { VERIFICATION, VERIFICATION_REASON } from '../content/verification.generated';
import type { KnownPhrase } from '../content/ports';
import { analyzeAnswer, type AnswerAnalysis } from './answerCheck';
import { pronunciationTips } from './pronunciation';
import { useSpeechInput } from './useSpeechInput';
import { slowSpeechRate } from './tts';
import { explainSchedule, whyNowSentence } from '../memory/explain';
import { SpeakButton } from '../../ui/SpeakButton';
import { IconPlay, IconSlow, IconWave, IconSparkle } from '../../ui/icons';
import { VoiceMissingHint } from '../../ui/VoiceHint';
import { andereBedeutungen, mehrdeutigeInDekodierung } from '../content/polysemy';

const GRADE_LABEL: Record<ReviewResult, string> = {
  again: 'Nochmal',
  hard: 'Fast',
  good: 'Sitzt',
};

/**
 * Sagt es, wenn ein Wort im Satz mehr als eine Bedeutung hat.
 *
 * WARUM: Ohne diesen Hinweis lernt jemand `kort` als „Karte", trifft es später
 * als „kurz" und hält die App für widersprüchlich — oder schlimmer: sich selbst
 * für vergesslich. Die zweite Bedeutung ist kein Fehler, sie ist der Stoff.
 *
 * Höchstens zwei auf einmal: Drei Erklärkästen unter einem Satz erschlagen die
 * Begegnung, die hier eigentlich stattfinden soll.
 */
function MehrdeutigHinweis({ decoding }: { decoding: DecodingToken[] }) {
  const treffer = mehrdeutigeInDekodierung(decoding)
    .map(({ eintrag, hier }) => ({ eintrag, hier, andere: andereBedeutungen(eintrag, hier) }))
    .filter((t) => t.andere.length > 0)
    .slice(0, 2);
  if (treffer.length === 0) return null;
  return (
    <div className="mt-3 flex flex-col gap-1.5">
      {treffer.map(({ eintrag, hier, andere }) => (
        <p key={eintrag.sv} className="text-[0.7rem] leading-relaxed text-muted">
          <span lang="sv" className="font-medium text-paper">
            {eintrag.sv}
          </span>{' '}
          heißt hier „{hier}" — es heißt auch {andere.map((b) => `„${b}"`).join(' oder ')}.{' '}
          <span className="text-faint">{eintrag.hinweis}</span>
        </p>
      ))}
    </div>
  );
}

/**
 * Blendet den Ziel-Chunk im schwedischen Satz aus (Lückentext für die Produktion,
 * docs/gremium-darstellung.md): der Kontext bleibt, die Lösung nicht. Rein.
 */
export function clozeSentence(
  sv: string,
  target: string,
): { found: boolean; before: string; after: string } {
  const i = sv.toLowerCase().indexOf(target.trim().toLowerCase());
  if (i === -1) return { found: false, before: '', after: '' };
  return { found: true, before: sv.slice(0, i), after: sv.slice(i + target.trim().length) };
}

interface Props {
  segment: Segment;
  chunk: Chunk;
  stage: 'recognition' | 'production';
  /** Gedächtnis-Zustand dieser Wendung — für die Selbstauskunft „Warum jetzt?". */
  state?: ChunkState;
  /** Erhalt-Ziel des Lerners, damit die Vorschau dieselbe Zahl nennt wie die Planung. */
  retention?: number;
  // `spoken` = die Antwort kam GESPROCHEN und wurde exakt als der geprüfte Chunk
  // erkannt (P3). Nur dieser enge Fall wird vermerkt — siehe ReviewEvent.spoken.
  // `exact` = die Prüfung hat einen normalisierten Volltreffer festgestellt.
  // Getrennt von `result`, weil die Messung nicht am Selbsteinschätzungs-Knopf
  // hängen darf (siehe ReviewMeta.exact in der Memory-Engine).
  onResult: (result: ReviewResult, helpUsed: boolean, spoken: boolean, exact?: boolean) => void;
  known?: KnownPhrase[]; // Wendungen, die der Lerner schon kann (für echtes i+1)
  // Neuer Chunk? Dann Bedeutung/Dekodierung SOFORT zeigen (verständlicher Input,
  // docs/gremium-darstellung.md). Bei bekanntem Chunk bleibt die Stütze zu (Abruf).
  scaffoldOpen?: boolean;
}

export function ComprehensionLoop({
  segment,
  chunk,
  stage,
  state,
  retention,
  onResult,
  known,
  scaffoldOpen = false,
}: Props) {
  // „Warum jetzt?" — die App legt ihre eigene Entscheidung offen (explain.ts).
  const [showWhy, setShowWhy] = useState(false);
  const [showDecoding, setShowDecoding] = useState(scaffoldOpen);
  const [showIdiomatic, setShowIdiomatic] = useState(scaffoldOpen);
  const [showPron, setShowPron] = useState(false); // Aussprache-Hinweise (on-device)
  const [revealed, setRevealed] = useState(false);
  const [helpUsed, setHelpUsed] = useState(false); // pulled a hint before answering?
  const [typed, setTyped] = useState(''); // production: the learner's typed answer
  const [heard, setHeard] = useState(''); // was die Spracheingabe verstanden hat
  const [spokenOk, setSpokenOk] = useState(false); // gesprochen UND exakt erkannt
  const [autoGrade, setAutoGrade] = useState<ReviewResult | null>(null);
  // Hat die Prüfung einen exakten Treffer gesehen? Nur in der Produktion gibt es
  // überhaupt etwas objektiv zu prüfen; beim Wiedererkennen deckt der Lerner auf
  // und bewertet sich selbst — dort bleibt es beim Knopf.
  const [exactHit, setExactHit] = useState(false);
  // Formatives Feedback bei Produktion (Abweichung + Hinweis, docs/gremium-feedback.md).
  const [feedback, setFeedback] = useState<AnswerAnalysis | null>(null);
  // Optionale KI-Erklärung „Warum?" (nur bei aktiver Cloud-KI; Feedback-Schritt 2).
  const [why, setWhy] = useState<{ state: 'idle' | 'loading' | 'ok' | 'error'; text: string }>({
    state: 'idle',
    text: '',
  });
  // On-demand KI-Dekodierung (nur bei aktivem Cloud-Anbieter).
  const [aiTokens, setAiTokens] = useState<DecodingToken[] | null>(null);
  const [aiState, setAiState] = useState<'idle' | 'loading' | 'error'>('idle');
  const [aiError, setAiError] = useState('');
  // KI-Content-Generierung: neuer i+1-Kontext auf Wunsch (der Moat, opt-in).
  const [genSegment, setGenSegment] = useState<Segment | null>(null);
  const [genState, setGenState] = useState<'idle' | 'loading' | 'error'>('idle');
  const [genError, setGenError] = useState('');

  // Reset helpers whenever a new item appears. Bei NEUEM Chunk ist die Stütze
  // (Dekodierung + Übersetzung) sofort offen — damit der Input verständlich ist.
  useEffect(() => {
    setShowWhy(false);
    setShowDecoding(scaffoldOpen);
    setShowIdiomatic(scaffoldOpen);
    setShowPron(false);
    setRevealed(false);
    setHelpUsed(false);
    setTyped('');
    setHeard('');
    setSpokenOk(false);
    setAutoGrade(null);
    setExactHit(false);
    setFeedback(null);
    setWhy({ state: 'idle', text: '' });
    setAiTokens(null);
    setAiState('idle');
    setAiError('');
    setGenSegment(null);
    setGenState('idle');
    setGenError('');
  }, [segment.id, chunk.id, scaffoldOpen]);

  // Hat der Nutzer eine echte Cloud-KI eingerichtet? (Standard-Dekoder = 'seed'.)
  const aiActive = aiRegistry.decoder.id !== 'seed';
  // Aussprache-Hinweise (deterministisch aus der Schreibung des Segments).
  const pronTips = pronunciationTips(segment.sv);

  async function fetchAiDecoding() {
    setHelpUsed(true); // KI-Hilfe ist auch eine gezogene Krücke (Ehrlichkeit)
    setAiState('loading');
    setAiError('');
    try {
      const tokens = await aiRegistry.decoder.decode(segment.sv);
      setAiTokens(tokens);
      setAiState('idle');
    } catch (e) {
      setAiState('error');
      setAiError(e instanceof Error ? e.message : 'KI-Dekodierung fehlgeschlagen.');
    }
  }

  // Nutzt der Nutzer eine echte Cloud-KI, die Inhalte erzeugen kann? (Seed erzeugt nichts Neues.)
  const canGenerate = aiRegistry.generator.id !== 'seed';

  async function generateContext() {
    setHelpUsed(true);
    setGenState('loading');
    setGenError('');
    try {
      const seg = await aiRegistry.generator.generate({
        chunkId: chunk.id,
        sv: chunk.sv,
        de: chunk.de,
        level: segment.level + 1,
        avoidSegmentIds: [segment.id],
        known, // aus schon bekannten Wörtern bauen → nur die Ziel-Wendung ist neu
      });
      setGenSegment(seg);
      setGenState('idle');
    } catch (e) {
      setGenState('error');
      setGenError(e instanceof Error ? e.message : 'Erzeugung fehlgeschlagen.');
    }
  }

  // Produktion prüfen: exakt → auflösen; sonst formatives Feedback zeigen.
  // `value` kommt getippt ODER gesprochen herein — GENAU dieselbe Prüfung, damit
  // Sprechen ein zweiter Weg zum selben Beweis ist und kein zweiter Maßstab
  // (docs/gremium-sprachpartner.md §3).
  function submitTyped(value: string = typed, fromSpeech = false) {
    const fb = analyzeAnswer(value, chunk.sv);
    // Vermerk nur, wenn GESPROCHEN und exakt getroffen. Ein Tipp-Versuch danach
    // löscht ihn wieder — sonst stünde am Ende „gesprochen" an einer Wendung,
    // die getippt wurde.
    setSpokenOk(fromSpeech && fb.correct);
    setExactHit(fb.correct);
    setAutoGrade(fb.grade);
    setWhy({ state: 'idle', text: '' });
    if (fb.correct) {
      setFeedback(null);
      setRevealed(true);
    } else {
      setFeedback(fb);
      setHelpUsed(true); // korrektives Feedback ist auch eine gezogene Hilfe
    }
  }

  // Sprechen statt Tippen (P2): das Gehörte landet sichtbar im Feld UND geht sofort
  // durch dieselbe Prüfung — freihändig, aber nachvollziehbar.
  const mic = useSpeechInput({
    onHeard: (text) => {
      setHeard(text);
      setTyped(text);
      submitTyped(text, true);
    },
  });

  // Kann die KI eine Erklärung liefern? (Nur bei eingerichtetem Cloud-Anbieter.)
  const canExplain = aiRegistry.explainer !== null;

  async function askWhy() {
    const explainer = aiRegistry.explainer;
    if (!explainer) return;
    setHelpUsed(true);
    setWhy({ state: 'loading', text: '' });
    try {
      const text = await explainer.explain({ target: chunk.sv, typed, meaning: chunk.de });
      setWhy({ state: 'ok', text });
    } catch (e) {
      setWhy({ state: 'error', text: e instanceof Error ? e.message : 'Erklärung fehlgeschlagen.' });
    }
  }

  // Volltext (Schwedisch) + Hilfen erst zeigen, wenn NICHT produziert wird oder
  // schon aufgelöst ist. In der Produktion (Deutsch → Schwedisch) verrät der
  // Volltext die Lösung — dort steht der Satz mit Lücke (docs/gremium-darstellung.md).
  const showFull = stage !== 'production' || revealed;
  const cloze = clozeSentence(segment.sv, chunk.sv);

  return (
    <section className="glass rounded-2xl p-5">
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <p className="text-[0.68rem] font-medium uppercase tracking-[0.16em] text-faint">
          Begegnung · Level {segment.level} ·{' '}
          {stage === 'production' ? 'selbst sagen' : 'verstehen'}
        </p>
        {state && (
          <button
            onClick={() => setShowWhy((v) => !v)}
            className="inline-flex min-h-11 items-center text-[0.7rem] text-muted underline underline-offset-2"
          >
            {showWhy ? 'Warum jetzt? ausblenden' : 'Warum jetzt?'}
          </button>
        )}
      </div>

      {/* Die Selbstauskunft. Keine Lern-App sagt dir, warum ausgerechnet diese
          Karte vor dir liegt — man soll dem Algorithmus glauben. Bei einer App,
          deren Versprechen „unsere Zahlen sind wahr" lautet, wäre das ein
          Widerspruch: Was man nicht nachvollziehen kann, ist eine Behauptung. */}
      {showWhy && state && <WhyNow state={state} retention={retention} />}

      {/* 1. Verständliche Begegnung (der Hero-Moment).
          `flex-wrap` + `min-w-0`: Ohne beides drückte die Knopfgruppe (shrink-0)
          bei 320 px und großer Systemschrift „Langsam vorlesen" bis zu 70 px aus
          dem Bild — nicht mehr antippbar (Layout-Audit 2026-07-25). */}
      <div className="flex flex-col items-start gap-2 sm:flex-row sm:justify-between sm:gap-x-3">
        {showFull ? (
          <p
            lang="sv"
            className="w-full min-w-0 hyphens-auto break-words font-sans text-[min(1.9rem,8.5vw)] font-bold leading-[1.14] tracking-[-0.015em] text-paper sm:flex-1"
          >
            {segment.sv}
          </p>
        ) : cloze.found ? (
          // Produktion: Satz mit Lücke an der Stelle des Ziel-Chunks (Kontext ohne Lösung).
          <p
            lang="sv"
            className="w-full min-w-0 hyphens-auto break-words font-sans text-[min(1.9rem,8.5vw)] font-bold leading-[1.14] tracking-[-0.015em] text-paper sm:flex-1"
          >
            {cloze.before}
            <span
              className="mx-1 inline-block min-w-[3.5rem] border-b-2 border-dashed border-brand/70 align-middle"
              aria-label="Lücke"
            >
              &nbsp;
            </span>
            {cloze.after}
          </p>
        ) : (
          <p className="w-full min-w-0 font-display text-xl font-semibold leading-snug text-muted sm:flex-1">
            Bilde den Satz auf Schwedisch.
          </p>
        )}
        {showFull && aiRegistry.synthesizer.isAvailable() && (
          <div className="flex shrink-0 flex-wrap gap-2">
            <button
              onClick={() => void aiRegistry.synthesizer.speak({ text: segment.sv })}
              className="flex min-h-11 items-center gap-1.5 rounded-full bg-brand/20 px-4 text-sm text-brand"
              aria-label="Hören — vorlesen"
            >
              <IconPlay className="h-3 w-3" /> Hören
            </button>
            <button
              onClick={() => void aiRegistry.synthesizer.speak({ text: segment.sv, rate: slowSpeechRate() })}
              className="flex min-h-11 min-w-11 items-center justify-center rounded-full bg-brand/20 px-3 text-brand"
              aria-label="Langsam vorlesen"
              title="Langsamer"
            >
              <IconSlow className="h-4 w-4" />
            </button>
          </div>
        )}
        {/* Ohne schwedische Stimme bleiben die Knöpfe oben stumm — dann muss
            hier stehen, warum. Ein stummer Knopf lässt den Lerner den Fehler
            bei sich suchen. */}
        {showFull && aiRegistry.synthesizer.isAvailable() && <VoiceMissingHint className="mt-2" />}
      </div>

      {/* 2. Verständnishilfen — nur wenn der Volltext ohnehin sichtbar ist (sonst
          würden Dekodierung/Übersetzung die Produktions-Lösung verraten). */}
      {showFull && (
      <>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => {
            setShowDecoding((v) => !v);
            setHelpUsed(true);
          }}
          className="glass-soft min-h-11 rounded-full px-4 text-sm text-paper"
        >
          {showDecoding ? 'Dekodierung ausblenden' : 'Dekodierung'}
        </button>
        <button
          onClick={() => {
            setShowIdiomatic((v) => !v);
            setHelpUsed(true);
          }}
          className="glass-soft min-h-11 rounded-full px-4 text-sm text-paper"
        >
          {showIdiomatic ? 'Übersetzung ausblenden' : 'Übersetzung'}
        </button>
        <button
          onClick={() => {
            setShowPron((v) => !v);
            setHelpUsed(true);
          }}
          className="glass-soft flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm text-paper"
        >
          <IconWave className="h-3.5 w-3.5" />
          {showPron ? 'Aussprache ausblenden' : 'Aussprache'}
        </button>
        {aiActive && (
          <button
            onClick={() => void fetchAiDecoding()}
            disabled={aiState === 'loading'}
            className="flex min-h-11 items-center gap-1.5 rounded-full border border-brand/50 bg-brand/10 px-4 text-sm text-brand disabled:opacity-50"
          >
            <IconSparkle className="h-3.5 w-3.5" />
            {aiState === 'loading' ? 'KI übersetzt …' : 'KI-Dekodierung'}
          </button>
        )}
        {canGenerate && (
          <button
            onClick={() => void generateContext()}
            disabled={genState === 'loading'}
            className="flex min-h-11 items-center gap-1.5 rounded-full border border-brand/50 bg-brand/10 px-4 text-sm text-brand disabled:opacity-50"
          >
            <IconSparkle className="h-3.5 w-3.5" />
            {genState === 'loading' ? 'KI schreibt …' : 'Neuer Kontext'}
          </button>
        )}
      </div>
      {/* Die drei goldenen Knöpfe kosten echtes Geld auf dem Zugang des Nutzers.
          Das stand nirgends an der Stelle, wo man sie drückt (Ehrlichkeits-Audit). */}
      {(aiActive || canGenerate) && (
        <p className="mt-1.5 text-[0.68rem] text-faint">
          Die goldenen KI-Knöpfe laufen über deinen eigenen Zugang und kosten dort je
          Nutzung ein paar Cent.
        </p>
      )}

      {showDecoding && (
        <>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
            {segment.decoding.map((t, i) => (
              <span key={i} className="inline-flex flex-col items-center">
                <span lang="sv" className="text-paper">{t.sv}</span>
                <span className="text-xs text-muted">{t.de}</span>
              </span>
            ))}
          </div>
          <MehrdeutigHinweis decoding={segment.decoding} />
        </>
      )}

      {showIdiomatic && <p className="mt-3 italic text-muted">{segment.de}</p>}

      {showPron && (
        <div className="mt-3 flex flex-col gap-2">
          {pronTips.length === 0 ? (
            <p className="text-xs text-muted">Hier gibt es keine besonderen Aussprache-Stolpersteine.</p>
          ) : (
            pronTips.map((t) => (
              <div key={t.id} className="rounded-lg border border-line bg-base px-3 py-2">
                <p className="text-xs font-medium text-brand">{t.label}</p>
                <p className="text-sm text-muted">{t.hint}</p>
              </div>
            ))
          )}
        </div>
      )}

      {aiState === 'error' && (
        <p className="mt-3 flex items-center gap-1.5 text-xs text-danger">
          <IconSparkle className="h-3 w-3" /> {aiError}
        </p>
      )}

      {aiTokens && (
        <div className="mt-3">
          <p className="mb-1 text-xs uppercase tracking-wide text-brand">Wort-für-Wort · per KI</p>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {aiTokens.map((t, i) => (
              <span key={i} className="inline-flex flex-col items-center">
                <span lang="sv" className="text-paper">{t.sv}</span>
                <span className="text-xs text-muted">{t.de}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {genState === 'error' && (
        <p className="mt-3 flex items-center gap-1.5 text-xs text-danger">
          <IconSparkle className="h-3 w-3" /> {genError}
        </p>
      )}

      {/* Neuer, KI-erzeugter Kontext (Kontextvariation, i+1). Ehrlich als ungeprüft
          gekennzeichnet — echtes Können, nicht Schein (die eine Design-Regel). */}
      {genSegment && (
        <div className="mt-4 rounded-xl border border-brand/40 bg-brand/5 p-4">
          <p className="mb-2 flex items-center gap-1.5 text-xs uppercase tracking-wide text-brand">
            <IconSparkle className="h-3.5 w-3.5" /> Neuer Kontext · KI-erzeugt · nicht geprüft
          </p>
          <div className="flex flex-col items-start gap-2 sm:flex-row sm:justify-between sm:gap-x-3">
            <p lang="sv" className="w-full min-w-0 break-words text-lg font-medium text-paper sm:flex-1">
              {genSegment.sv}
            </p>
            {aiRegistry.synthesizer.isAvailable() && (
              <button
                onClick={() => void aiRegistry.synthesizer.speak({ text: genSegment.sv })}
                className="flex min-h-11 shrink-0 items-center gap-1.5 rounded-full bg-brand/20 px-4 text-sm text-brand"
                aria-label="Hören — neuen Kontext vorlesen"
              >
                <IconPlay className="h-3 w-3" /> Hören
              </button>
            )}
          </div>
          <p className="mt-1 italic text-muted">{genSegment.de}</p>
          {genSegment.decoding.length > 0 && (
            <>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
                {genSegment.decoding.map((t, i) => (
                  <span key={i} className="inline-flex flex-col items-center">
                    <span lang="sv" className="text-paper">{t.sv}</span>
                    <span className="text-xs text-muted">{t.de}</span>
                  </span>
                ))}
              </div>
              <MehrdeutigHinweis decoding={genSegment.decoding} />
            </>
          )}
        </div>
      )}
      </>
      )}

      {/* 3. Verständnis-Check für den Ziel-Chunk */}
      <div className="mt-6 border-t border-line pt-4">
        {/* Die Warnung stand nur in der Themenliste — genau dort NICHT, wo die
            Wendung tatsächlich gelernt wird (Ehrlichkeits-Audit 2026-07-25).
            Wer eine auffällige Wendung übt, muss das im Moment des Übens wissen. */}
        {VERIFICATION[chunk.id] === 'unchecked' && (
          <p className="mb-2 text-[0.7rem] leading-snug text-warn">
            ⚠ {VERIFICATION_REASON[chunk.id] ?? 'maschinell auffällig'} — bitte mit Vorsicht
            lernen
          </p>
        )}
        <p className="mb-2 text-sm text-muted">
          {stage === 'production'
            ? `Wie heißt „${chunk.de}" auf Schwedisch?`
            : `Was bedeutet „${chunk.sv}"`}
        </p>

        {!revealed ? (
          stage === 'production' ? (
            feedback ? (
              <div>
                <p className="mb-2 text-sm text-warn">{feedback.hint}</p>
                {/* Kam die Antwort gesprochen, muss der Lerner sehen, WAS verstanden
                    wurde — sonst wird ein Hörfehler der Technik als sein Fehler
                    verbucht (docs/gremium-sprachpartner.md, Ehrlichkeit 3). */}
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
                    }}
                    className="btn-gold rounded-xl px-4 py-2 font-medium text-ink"
                  >
                    Nochmal versuchen
                  </button>
                  <button
                    onClick={() => setRevealed(true)}
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
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  submitTyped();
                }}
                /* Wie im Gespräch: Knopf UNTER dem Feld. Nebeneinander lief die
                   Zeile auf schmalen Geräten über den Rand hinaus. */
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
                {/* Sprechen ist der zweite gleichwertige Weg — nicht die Notlösung.
                    Ohne Erkennung im Browser erscheint hier nichts (P2). */}
                {mic.supported && (
                  <>
                    <div className="flex items-center gap-3 pt-0.5" aria-hidden="true">
                      <span className="h-px flex-1 bg-line" />
                      <span className="text-[0.66rem] uppercase tracking-[0.16em] text-faint">
                        oder
                      </span>
                      <span className="h-px flex-1 bg-line" />
                    </div>
                    <SpeakButton mic={mic} heard={heard} />
                  </>
                )}
              </form>
            )
          ) : (
            <button
              onClick={() => setRevealed(true)}
              className="btn-gold rounded-xl px-4 py-2 font-medium text-ink"
            >
              Auflösen
            </button>
          )
        ) : (
          <>
            <p
              lang={stage === 'production' ? 'sv' : 'de'}
              className="mb-1 font-sans text-xl font-bold text-paper"
            >
              {stage === 'production' ? chunk.sv : chunk.de}
            </p>
            {stage === 'production' && autoGrade && (
              <p className="mb-3 text-xs text-muted">
                Deine Eingabe: „{typed || '—'}" · Vorschlag: {GRADE_LABEL[autoGrade]}
              </p>
            )}
            {/* Die Selbsteinschätzung bleibt beim Lerner — ein Tippfehler ist kein
                Gedächtnisfehler, und die Prüfung ist nicht unfehlbar. Aber wenn
                sie „nicht getroffen" GEMESSEN hat, darf die Fläche das nicht
                verschweigen (Ehrlichkeits-Audit 2026-07-25). */}
            {stage === 'production' && autoGrade === 'again' && (
              <p className="mb-3 text-xs leading-relaxed text-warn">
                Die Prüfung sagt: nicht getroffen. Du entscheidest trotzdem selbst — nur
                zählt „Sitzt" hier gegen eine Messung, und der Beweis am Ende ist nur so
                viel wert wie deine Ehrlichkeit hier.
              </p>
            )}
            {spokenOk && (
              <p className="mb-2 text-xs text-[#63C9B6]">
                Laut gesagt und richtig erkannt.
              </p>
            )}
            <div className="grid grid-cols-3 gap-2">
              <GradeButton
                label="Nochmal"
                tone="bg-danger"
                onClick={() => onResult('again', helpUsed, spokenOk, exactHit)}
              />
              <GradeButton
                label="Fast"
                tone="bg-warn"
                onClick={() => onResult('hard', helpUsed, spokenOk, exactHit)}
              />
              <GradeButton
                label="Sitzt"
                tone="bg-success"
                onClick={() => onResult('good', helpUsed, spokenOk, exactHit)}
              />
            </div>
          </>
        )}
      </div>
    </section>
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

/** Selbstauskunft der Engine zu genau dieser Wendung (docs/07-measurement.md). */
function WhyNow({ state, retention }: { state: ChunkState; retention?: number }) {
  const e = explainSchedule(state, Date.now(), retention);
  return (
    <div className="mb-3 rounded-xl border border-line bg-white/[0.03] p-3">
      <p className="text-xs leading-relaxed text-paper">{whyNowSentence(e)}</p>
      <dl className="mt-2 space-y-1 text-[0.7rem] leading-relaxed text-faint">
        {!e.isNew && (
          <div>
            <dt className="inline text-muted">Zuletzt: </dt>
            <dd className="inline">
              vor {e.sinceLastDays} {e.sinceLastDays === 1 ? 'Tag' : 'Tagen'}
            </dd>
          </div>
        )}
        <div>
          <dt className="inline text-muted">Stufe: </dt>
          <dd className="inline">
            {e.stage === 'production' ? 'du sagst sie selbst' : 'du erkennst sie'}
            {e.successStreak > 0 && ` · ${e.successStreak}× in Folge gekonnt`}
          </dd>
        </div>
        <div>
          <dt className="inline text-muted">Wenn es jetzt sitzt: </dt>
          <dd className="inline">
            wieder in {e.nextIfGoodDays} {e.nextIfGoodDays === 1 ? 'Tag' : 'Tagen'}
          </dd>
        </div>
        <div>
          <dt className="inline text-muted">Bewiesen stabil: </dt>
          <dd className="inline">
            {e.proven ? 'ja — nach echter langer Pause selbst gesagt' : 'noch nicht'}
          </dd>
        </div>
      </dl>
      {!e.proven && e.missingForProof.length > 0 && (
        <ul className="mt-2 list-inside list-disc text-[0.7rem] leading-relaxed text-faint">
          {e.missingForProof.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
