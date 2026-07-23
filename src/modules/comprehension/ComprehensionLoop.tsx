// Comprehension-Loop (docs/04-product.md): Begegnung → Verständnishilfen →
// Verständnis-Check → Ergebnis. Hilfen sind abschaltbare "Krücken": der Nutzer
// zieht nur so viel Hilfe, wie er braucht (Autonomie, docs/06-motivation.md).

import { useEffect, useState } from 'react';
import type { Chunk, ReviewResult, Segment } from '../../domain/chunk';
import { speakSwedish, ttsAvailable } from './tts';
import { gradeTyped } from './answerCheck';

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
  const [revealed, setRevealed] = useState(false);
  const [helpUsed, setHelpUsed] = useState(false); // pulled a hint before answering?
  const [typed, setTyped] = useState(''); // production: the learner's typed answer
  const [autoGrade, setAutoGrade] = useState<ReviewResult | null>(null);

  // Reset helpers whenever a new item appears.
  useEffect(() => {
    setShowDecoding(false);
    setShowIdiomatic(false);
    setRevealed(false);
    setHelpUsed(false);
    setTyped('');
    setAutoGrade(null);
  }, [segment.id, chunk.id]);

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
        {ttsAvailable() && (
          <button
            onClick={() => speakSwedish(segment.sv)}
            className="shrink-0 rounded-full bg-brand/20 px-3 py-2 text-sm text-brand"
            aria-label="Vorlesen"
          >
            ▶︎ Hören
          </button>
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

      {/* 3. Verständnis-Check für den Ziel-Chunk */}
      <div className="mt-6 border-t border-slate-700 pt-4">
        <p className="mb-2 text-sm text-slate-400">
          {stage === 'production'
            ? `Wie heißt „${chunk.de}" auf Schwedisch?`
            : `Was bedeutet „${chunk.sv}"?`}
        </p>

        {!revealed ? (
          stage === 'production' ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setAutoGrade(gradeTyped(typed, chunk.sv));
                setRevealed(true);
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
