// Comprehension-Loop (docs/04-product.md): Begegnung → Verständnishilfen →
// Verständnis-Check → Ergebnis. Hilfen sind abschaltbare "Krücken": der Nutzer
// zieht nur so viel Hilfe, wie er braucht (Autonomie, docs/06-motivation.md).

import { useEffect, useState } from 'react';
import type { Chunk, DecodingToken, ReviewResult, Segment } from '../../domain/chunk';
import { aiRegistry } from '../content/aiRegistry';
import { analyzeAnswer, type AnswerAnalysis } from './answerCheck';
import { pronunciationTips } from './pronunciation';

const GRADE_LABEL: Record<ReviewResult, string> = {
  again: 'Nochmal',
  hard: 'Schwer',
  good: 'Sitzt',
};

interface Props {
  segment: Segment;
  chunk: Chunk;
  stage: 'recognition' | 'production';
  onResult: (result: ReviewResult, helpUsed: boolean) => void;
}

export function ComprehensionLoop({ segment, chunk, stage, onResult }: Props) {
  const [showDecoding, setShowDecoding] = useState(false);
  const [showIdiomatic, setShowIdiomatic] = useState(false);
  const [showPron, setShowPron] = useState(false); // Aussprache-Hinweise (on-device)
  const [revealed, setRevealed] = useState(false);
  const [helpUsed, setHelpUsed] = useState(false); // pulled a hint before answering?
  const [typed, setTyped] = useState(''); // production: the learner's typed answer
  const [autoGrade, setAutoGrade] = useState<ReviewResult | null>(null);
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

  // Reset helpers whenever a new item appears.
  useEffect(() => {
    setShowDecoding(false);
    setShowIdiomatic(false);
    setShowPron(false);
    setRevealed(false);
    setHelpUsed(false);
    setTyped('');
    setAutoGrade(null);
    setFeedback(null);
    setWhy({ state: 'idle', text: '' });
    setAiTokens(null);
    setAiState('idle');
    setAiError('');
  }, [segment.id, chunk.id]);

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

  // Getippte Produktion prüfen: exakt → auflösen; sonst formatives Feedback zeigen.
  function submitTyped() {
    const fb = analyzeAnswer(typed, chunk.sv);
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

  return (
    <section className="rounded-2xl bg-surface p-5 shadow-lg">
      <p className="mb-1 text-xs uppercase tracking-wide text-slate-400">
        Begegnung · Level {segment.level} · {stage === 'production' ? 'Produktion' : 'Wiedererkennen'}
      </p>

      {/* 1. Verständliche Begegnung */}
      <div className="flex items-start justify-between gap-3">
        <p lang="sv" className="text-2xl font-semibold text-slate-100">
          {segment.sv}
        </p>
        {aiRegistry.synthesizer.isAvailable() && (
          <div className="flex shrink-0 gap-2">
            <button
              onClick={() => void aiRegistry.synthesizer.speak({ text: segment.sv })}
              className="rounded-full bg-brand/20 px-3 py-2 text-sm text-brand"
              aria-label="Vorlesen"
            >
              ▶︎ Hören
            </button>
            <button
              onClick={() => void aiRegistry.synthesizer.speak({ text: segment.sv, rate: 0.6 })}
              className="rounded-full bg-brand/20 px-3 py-2 text-sm text-brand"
              aria-label="Langsam vorlesen"
              title="Langsamer"
            >
              🐢
            </button>
          </div>
        )}
      </div>

      {/* 2. Verständnishilfen (gestuft, abschaltbar) */}
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => {
            setShowDecoding((v) => !v);
            setHelpUsed(true);
          }}
          className="rounded-lg border border-slate-600 px-3 py-1.5 text-sm text-slate-200"
        >
          {showDecoding ? 'Dekodierung ausblenden' : 'Dekodierung'}
        </button>
        <button
          onClick={() => {
            setShowIdiomatic((v) => !v);
            setHelpUsed(true);
          }}
          className="rounded-lg border border-slate-600 px-3 py-1.5 text-sm text-slate-200"
        >
          {showIdiomatic ? 'Übersetzung ausblenden' : 'Übersetzung'}
        </button>
        <button
          onClick={() => {
            setShowPron((v) => !v);
            setHelpUsed(true);
          }}
          className="rounded-lg border border-slate-600 px-3 py-1.5 text-sm text-slate-200"
        >
          {showPron ? 'Aussprache ausblenden' : '🗣️ Aussprache'}
        </button>
        {aiActive && (
          <button
            onClick={() => void fetchAiDecoding()}
            disabled={aiState === 'loading'}
            className="rounded-lg border border-brand/60 px-3 py-1.5 text-sm text-brand disabled:opacity-50"
          >
            {aiState === 'loading' ? 'KI übersetzt…' : '🤖 KI-Dekodierung'}
          </button>
        )}
      </div>

      {showDecoding && (
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
          {segment.decoding.map((t, i) => (
            <span key={i} className="inline-flex flex-col items-center">
              <span lang="sv" className="text-slate-100">{t.sv}</span>
              <span className="text-xs text-slate-400">{t.de}</span>
            </span>
          ))}
        </div>
      )}

      {showIdiomatic && <p className="mt-3 italic text-slate-300">{segment.de}</p>}

      {showPron && (
        <div className="mt-3 flex flex-col gap-2">
          {pronTips.length === 0 ? (
            <p className="text-xs text-slate-400">Hier gibt es keine besonderen Aussprache-Stolpersteine.</p>
          ) : (
            pronTips.map((t) => (
              <div key={t.id} className="rounded-lg border border-slate-700 bg-base px-3 py-2">
                <p className="text-xs font-medium text-brand">{t.label}</p>
                <p className="text-sm text-slate-300">{t.hint}</p>
              </div>
            ))
          )}
        </div>
      )}

      {aiState === 'error' && <p className="mt-3 text-xs text-rose-300">🤖 {aiError}</p>}

      {aiTokens && (
        <div className="mt-3">
          <p className="mb-1 text-xs uppercase tracking-wide text-brand">Wort-für-Wort · per KI</p>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {aiTokens.map((t, i) => (
              <span key={i} className="inline-flex flex-col items-center">
                <span lang="sv" className="text-slate-100">{t.sv}</span>
                <span className="text-xs text-slate-400">{t.de}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 3. Verständnis-Check für den Ziel-Chunk */}
      <div className="mt-6 border-t border-slate-700 pt-4">
        <p className="mb-2 text-sm text-slate-400">
          {stage === 'production'
            ? `Wie heißt „${chunk.de}" auf Schwedisch?`
            : `Was bedeutet „${chunk.sv}"?`}
        </p>

        {!revealed ? (
          stage === 'production' ? (
            feedback ? (
              <div>
                <p className="mb-2 text-sm text-amber-300">{feedback.hint}</p>
                <p className="mb-1 text-xs text-slate-500">
                  <span className="text-emerald-400 underline">grün</span> = fehlt ·{' '}
                  <span className="text-rose-400 line-through">rot</span> = zu viel getippt
                </p>
                <div
                  lang="sv"
                  className="mb-3 rounded-lg border border-slate-700 bg-base px-3 py-2 text-lg tracking-wide"
                >
                  {feedback.diff.map((p, i) => (
                    <span
                      key={i}
                      className={
                        p.kind === 'same'
                          ? 'text-slate-100'
                          : p.kind === 'missing'
                            ? 'text-emerald-400 underline'
                            : 'text-rose-400 line-through'
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
                      setWhy({ state: 'idle', text: '' });
                    }}
                    className="rounded-lg bg-brand px-4 py-2 font-medium text-white"
                  >
                    Nochmal versuchen
                  </button>
                  <button
                    onClick={() => setRevealed(true)}
                    className="rounded-lg border border-slate-600 px-4 py-2 text-slate-200"
                  >
                    Auflösen
                  </button>
                  {canExplain && (
                    <button
                      onClick={() => void askWhy()}
                      disabled={why.state === 'loading'}
                      className="rounded-lg border border-brand/60 px-4 py-2 text-sm text-brand disabled:opacity-50"
                    >
                      {why.state === 'loading' ? 'KI denkt…' : '🤖 Warum?'}
                    </button>
                  )}
                </div>

                {why.state === 'ok' && (
                  <div className="mt-3 rounded-lg border border-brand/40 bg-brand/5 p-3">
                    <p className="mb-1 text-xs uppercase tracking-wide text-brand">
                      KI-Hinweis · nicht muttersprachlich geprüft
                    </p>
                    <p className="text-sm text-slate-200">{why.text}</p>
                  </div>
                )}
                {why.state === 'error' && (
                  <p className="mt-2 text-xs text-rose-300">🤖 {why.text}</p>
                )}
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  submitTyped();
                }}
                className="flex gap-2"
              >
                <input
                  lang="sv"
                  value={typed}
                  onChange={(e) => setTyped(e.target.value)}
                  placeholder="auf Schwedisch tippen…"
                  aria-label="Antwort auf Schwedisch"
                  autoCapitalize="off"
                  autoCorrect="off"
                  className="flex-1 rounded-lg border border-slate-600 bg-base px-3 py-2 text-slate-100"
                />
                <button type="submit" className="rounded-lg bg-brand px-4 py-2 font-medium text-white">
                  Prüfen
                </button>
              </form>
            )
          ) : (
            <button
              onClick={() => setRevealed(true)}
              className="rounded-lg bg-brand px-4 py-2 font-medium text-white"
            >
              Auflösen
            </button>
          )
        ) : (
          <>
            <p lang={stage === 'production' ? 'sv' : 'de'} className="mb-1 text-lg text-slate-100">
              {stage === 'production' ? chunk.sv : chunk.de}
            </p>
            {stage === 'production' && autoGrade && (
              <p className="mb-3 text-xs text-slate-400">
                Deine Eingabe: „{typed || '—'}" · Vorschlag: {GRADE_LABEL[autoGrade]}
              </p>
            )}
            <div className="grid grid-cols-3 gap-2">
              <GradeButton label="Nochmal" tone="bg-rose-500/80" onClick={() => onResult('again', helpUsed)} />
              <GradeButton label="Schwer" tone="bg-amber-500/80" onClick={() => onResult('hard', helpUsed)} />
              <GradeButton label="Sitzt" tone="bg-emerald-500/80" onClick={() => onResult('good', helpUsed)} />
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
      className={`rounded-lg py-2.5 text-sm font-medium text-white ${tone}`}
    >
      {label}
    </button>
  );
}
