// Die Einstellungs-Fläche (docs/gremium-einstellungen.md).
//
// WARUM SIE ANDERS AUSSIEHT ALS ÜBERALL SONST:
// In dieser Branche sind Einstellungen eine Resterampe — bei Duolingo im Kern
// „Ton aus" und „Hörübungen aus". Der Grund ist nicht Faulheit: Wer nichts
// Ehrliches zu zeigen hat, kann hier auch nichts anbieten. Ein Anbieter, dessen
// Fortschritt aus XP besteht, kann keinen Regler für die Wiederholungs-Menge
// geben — dann würde sichtbar, dass die Zahl beliebig ist.
//
// Wir haben eine echte Gedächtnis-Maschine und Daten, die auf DEM GERÄT liegen.
// Daraus werden drei Dinge, die es woanders nicht gibt:
//   · „Deine Daten" — dein Gedächtnis als Datei, mitnehmbar aufs zweite Gerät.
//   · „Erhalt-Ziel" — der Regler, der den Aufwand steuert, ohne den Maßstab
//     anzufassen (der Beweis bleibt derselbe empirische Beweis).
//   · „Prüfstand" statt „Über" — was die App über sich selbst weiß, inklusive
//     der unbequemen 0.
//
// KEINE EINSTELLUNG DARF DIE EHRLICHKEIT ABSCHALTEN. Es gibt hier kein
// „Fortschritt großzügiger anzeigen" und keinen Motivationsmodus. Wer so etwas
// anbietet, hat die eine Design-Regel schon gebrochen.

import { useEffect, useRef, useState } from 'react';
import type { ChunkState } from '../../domain/chunk';
import { AiSettingsSection } from '../content/AiSettings';
import {
  NEW_PER_SESSION_OPTIONS,
  RETENTION_MAX,
  RETENTION_MIN,
  SPEECH_RATE_MAX,
  SPEECH_RATE_MIN,
  workloadFactor,
  type Preferences,
} from '../../session/preferences';
import { installOnDevice, onDeviceStatus, speechInputAvailable } from '../comprehension/speech';
import { speakSwedish } from '../comprehension/tts';
import { VERIFICATION_META } from '../content/verification.generated';
import { backupFilename, buildBackup, mergeStates, parseBackup } from '../../storage/transfer';
import { IconBack, IconMic, IconSparkle, IconWave } from '../../ui/icons';

interface Props {
  name: string;
  onName: (name: string) => void;
  prefs: Preferences;
  onPrefs: (p: Preferences) => void;
  states: ChunkState[];
  totalChunks: number;
  /** Eingelesene Stände übernehmen (schreiben + in den Zustand spiegeln). */
  onImport: (states: ChunkState[], name: string, prefs: Preferences) => Promise<void>;
  /** Alles löschen. */
  onWipe: () => Promise<void>;
  onClose: () => void;
}

export function SettingsScreen({
  name,
  onName,
  prefs,
  onPrefs,
  states,
  totalChunks,
  onImport,
  onWipe,
  onClose,
}: Props) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-ink/95 backdrop-blur-md">
      <div className="mx-auto w-full max-w-xl px-4 pb-[calc(3rem+env(safe-area-inset-bottom))] pt-[calc(1rem+env(safe-area-inset-top))]">
        <nav className="flex items-center justify-between gap-3 py-2">
          <button
            onClick={onClose}
            className="glass-soft flex items-center gap-1.5 rounded-full py-1.5 pl-2.5 pr-3.5 text-sm text-paper"
            aria-label="Einstellungen schließen"
          >
            <IconBack className="h-4 w-4" /> Fertig
          </button>
        </nav>

        <header className="px-1 pb-1 pt-2">
          <h1 className="font-display text-[1.6rem] font-semibold leading-tight text-paper">
            Einstellungen
          </h1>
          <p className="mt-1 text-xs leading-relaxed text-faint">
            Alles bleibt auf diesem Gerät. Es gibt keinen Server und kein Konto.
          </p>
        </header>

        <div className="mt-4 flex flex-col gap-3">
          <YouSection name={name} onName={onName} />
          <LearningSection prefs={prefs} onPrefs={onPrefs} />
          <VoiceSection prefs={prefs} onPrefs={onPrefs} />
          <SpeechSection prefs={prefs} onPrefs={onPrefs} />
          <Section label="KI & Sparringspartner" title="Wer denkt für die App mit?">
            <AiSettingsSection />
          </Section>
          <DataSection
            name={name}
            prefs={prefs}
            states={states}
            onImport={onImport}
            onWipe={onWipe}
          />
          <AboutSection totalChunks={totalChunks} />
        </div>
      </div>
    </div>
  );
}

// --- Bausteine ------------------------------------------------------------------

function Section({
  label,
  title,
  children,
}: {
  label: string;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="glass rounded-2xl p-5">
      <h2 className="text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-brand">
        {label}
      </h2>
      {title && (
        <p className="mb-3 mt-1 font-display text-[1.05rem] font-semibold leading-tight text-paper">
          {title}
        </p>
      )}
      {children}
    </section>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={
        active
          ? 'btn-gold rounded-full px-3.5 py-1.5 text-sm font-medium text-ink'
          : 'rounded-full border border-line px-3.5 py-1.5 text-sm text-paper'
      }
    >
      {children}
    </button>
  );
}

function Slider({
  value,
  min,
  max,
  step,
  onChange,
  label,
}: {
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  label: string;
}) {
  return (
    <input
      type="range"
      aria-label={label}
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full accent-[#E7C08A]"
    />
  );
}

// --- Abschnitte -----------------------------------------------------------------

function YouSection({ name, onName }: { name: string; onName: (n: string) => void }) {
  return (
    <Section label="Du">
      <label className="flex flex-col gap-1.5">
        <span className="text-sm text-paper">Vorname</span>
        <input
          value={name}
          onChange={(e) => onName(e.target.value)}
          placeholder="wie sollen wir dich ansprechen?"
          className="w-full rounded-lg border border-line bg-base px-3 py-2 text-paper"
        />
        <span className="text-xs text-faint">
          Wird in Begrüßungen und in Gesprächen benutzt. Leer lassen geht auch.
        </span>
      </label>

      <div className="mt-4 rounded-xl border border-line bg-white/[0.03] p-3">
        <p className="text-sm text-paper">
          Deutsch <span className="text-faint">→</span> Schwedisch
        </p>
        <p className="mt-1 text-xs leading-relaxed text-faint">
          Die Richtung ist hier bewusst keine Einstellung, sondern ein Messwert: Jede
          Wendung wandert von „verstehst du" zu „sagst du selbst", sobald du sie wirklich
          abrufen kannst.
        </p>
      </div>
    </Section>
  );
}

function LearningSection({
  prefs,
  onPrefs,
}: {
  prefs: Preferences;
  onPrefs: (p: Preferences) => void;
}) {
  const [advanced, setAdvanced] = useState(false);
  const factor = workloadFactor(prefs.retention);
  const pct = Math.round(prefs.retention * 100);

  return (
    <Section label="Lernen" title="Wie viel kommt neu dazu?">
      <div className="flex flex-wrap gap-2">
        {NEW_PER_SESSION_OPTIONS.map((n) => (
          <Chip
            key={String(n)}
            active={prefs.newPerSession === n}
            onClick={() => onPrefs({ ...prefs, newPerSession: n })}
          >
            {n === null ? 'automatisch' : `höchstens ${n}`}
          </Chip>
        ))}
      </div>
      <p className="mt-2 text-xs leading-relaxed text-faint">
        „Automatisch" richtet sich nach deiner Erfolgsquote und hält dich im Erfolgsband —
        das ist die Voreinstellung und in fast allen Fällen die beste. Eine Obergrenze
        bremst nur den NEUEN Stoff; fällige Wiederholungen kommen immer.
      </p>

      <button
        onClick={() => setAdvanced((v) => !v)}
        className="mt-4 text-xs text-muted underline underline-offset-2"
      >
        {advanced ? 'Für Fortgeschrittene ausblenden' : 'Für Fortgeschrittene …'}
      </button>

      {advanced && (
        <div className="mt-3 rounded-xl border border-line bg-white/[0.03] p-4">
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-sm font-medium text-paper">Erhalt-Ziel</span>
            <span className="tnum text-lg font-bold text-brand">{pct} %</span>
          </div>
          <Slider
            label="Erhalt-Ziel"
            value={prefs.retention}
            min={RETENTION_MIN}
            max={RETENTION_MAX}
            step={0.01}
            onChange={(v) => onPrefs({ ...prefs, retention: v })}
          />
          <p className="mt-1 text-xs text-muted">
            Auf diese Erinnerungs-Wahrscheinlichkeit hin wird geplant. Aufwand gegenüber der
            Voreinstellung (90 %):{' '}
            <span className="text-paper">
              {factor === 1 ? 'unverändert' : `${factor > 1 ? '×' : '×'}${factor.toFixed(2)}`}
            </span>
            .
          </p>
          <p className="mt-2 text-xs leading-relaxed text-faint">
            Höher heißt überproportional mehr Wiederholungen — von 95 % auf 97 % kann den
            Aufwand fast verdoppeln. Niedriger heißt weniger Wiederholungen, aber du
            vergisst öfter.
          </p>
          <p className="mt-2 text-xs leading-relaxed text-faint">
            <span className="text-paper">Wichtig:</span> Dieser Regler ändert den Aufwand,
            nicht den Maßstab. „Bewiesen stabil" verlangt weiter einen gelungenen Abruf nach
            einer <em>tatsächlich</em> vergangenen langen Pause — er wird dadurch nicht
            leichter, nur seltener.
          </p>
        </div>
      )}
    </Section>
  );
}

function VoiceSection({
  prefs,
  onPrefs,
}: {
  prefs: Preferences;
  onPrefs: (p: Preferences) => void;
}) {
  return (
    <Section label="Stimme" title="Wie schnell wird vorgelesen?">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-sm text-muted">langsam</span>
        <span className="tnum text-lg font-bold text-brand">
          {Math.round(prefs.speechRate * 100)} %
        </span>
        <span className="text-sm text-muted">normal</span>
      </div>
      <Slider
        label="Sprechtempo"
        value={prefs.speechRate}
        min={SPEECH_RATE_MIN}
        max={SPEECH_RATE_MAX}
        step={0.05}
        onChange={(v) => onPrefs({ ...prefs, speechRate: v })}
      />
      <button
        onClick={() => void speakSwedish('Hej! Vad kul att träffas.', prefs.speechRate)}
        className="mt-3 flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-paper"
      >
        <IconWave className="h-4 w-4 text-brand" /> Probe hören
      </button>
      <p className="mt-2 text-xs leading-relaxed text-faint">
        Die Stimme kommt vom Gerät, nicht aus dem Netz. Der „🐢 langsam"-Knopf im Lernen
        bleibt immer deutlich langsamer als diese Einstellung.
      </p>
    </Section>
  );
}

function SpeechSection({
  prefs,
  onPrefs,
}: {
  prefs: Preferences;
  onPrefs: (p: Preferences) => void;
}) {
  const [status, setStatus] = useState<'ready' | 'downloadable' | 'no' | 'checking'>('checking');
  const [busy, setBusy] = useState(false);
  const supported = speechInputAvailable();

  useEffect(() => {
    let alive = true;
    void onDeviceStatus('sv-SE').then((s) => {
      if (alive) setStatus(s);
    });
    return () => {
      alive = false;
    };
  }, []);

  if (!supported) {
    return (
      <Section label="Sprechen">
        <p className="text-sm leading-relaxed text-muted">
          Dieser Browser kann nicht zuhören (Firefox zum Beispiel). Tippen funktioniert
          überall — es fehlt dir nichts außer der Bequemlichkeit.
        </p>
      </Section>
    );
  }

  return (
    <Section label="Sprechen" title="Wo wird deine Stimme erkannt?">
      <label className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={prefs.speechLocalOnly}
          onChange={(e) => onPrefs({ ...prefs, speechLocalOnly: e.target.checked })}
          className="mt-1 h-4 w-4 accent-[#E7C08A]"
        />
        <span className="min-w-0">
          <span className="block text-sm text-paper">Nur auf dem Gerät erkennen</span>
          <span className="block text-xs leading-relaxed text-faint">
            Ohne diesen Haken schickt der Browser dein Audio zur Erkennung an seinen
            Hersteller, wenn kein Sprachpaket da ist. Mit Haken passiert das nie — dafür
            geht die Spracheingabe dann gar nicht.
          </span>
        </span>
      </label>

      <div className="mt-4 rounded-xl border border-line bg-white/[0.03] p-3">
        <p className="text-xs text-muted">
          Schwedisch auf diesem Gerät:{' '}
          <span className="text-paper">
            {status === 'checking'
              ? 'wird geprüft …'
              : status === 'ready'
                ? 'Sprachpaket vorhanden ✓'
                : status === 'downloadable'
                  ? 'Sprachpaket ist verfügbar, aber noch nicht geladen'
                  : 'kein Sprachpaket — die Erkennung läuft beim Hersteller'}
          </span>
        </p>
        {status === 'downloadable' && (
          <button
            onClick={() => {
              setBusy(true);
              void installOnDevice('sv-SE').then((ok) => {
                setBusy(false);
                setStatus(ok ? 'ready' : 'downloadable');
              });
            }}
            disabled={busy}
            className="mt-2 flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-paper disabled:opacity-50"
          >
            <IconMic className="h-4 w-4 text-brand" />
            {busy ? 'lädt …' : 'Sprachpaket holen'}
          </button>
        )}
      </div>
    </Section>
  );
}

function DataSection({
  name,
  prefs,
  states,
  onImport,
  onWipe,
}: {
  name: string;
  prefs: Preferences;
  states: ChunkState[];
  onImport: (states: ChunkState[], name: string, prefs: Preferences) => Promise<void>;
  onWipe: () => Promise<void>;
}) {
  const file = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);
  const [confirmWipe, setConfirmWipe] = useState(false);

  function save() {
    const now = new Date();
    const backup = buildBackup(states, name, prefs, now.getTime());
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = backupFilename(now);
    a.click();
    URL.revokeObjectURL(url);
    setMsg({ kind: 'ok', text: `Gesichert: ${states.length} Wendungen.` });
  }

  async function read(f: File) {
    setMsg(null);
    try {
      const backup = parseBackup(await f.text());
      const r = mergeStates(states, backup.states);
      await onImport(r.merged, backup.name || name, backup.preferences);
      setMsg({
        kind: 'ok',
        text: `Eingelesen: ${r.added} neu · ${r.updated} weitergeführt · ${r.kept} eigener Stand behalten.`,
      });
    } catch (e) {
      setMsg({ kind: 'err', text: e instanceof Error ? e.message : 'Einlesen fehlgeschlagen.' });
    }
  }

  return (
    <Section label="Deine Daten" title="Mitnehmen, sichern, löschen">
      <p className="text-xs leading-relaxed text-muted">
        Dein Lernstand liegt nur auf diesem Gerät. Damit er nicht mit dem Gerät verschwindet
        — und damit du auf einem zweiten weitermachen kannst — kannst du ihn als Datei
        mitnehmen. Das kann keine App, die deinen Fortschritt auf ihrem Server hält.
      </p>

      <div className="mt-4 flex flex-col gap-2">
        <button
          onClick={save}
          className="btn-gold w-full rounded-xl px-4 py-2.5 font-medium text-ink"
        >
          Sichern ({states.length} Wendungen)
        </button>
        <button
          onClick={() => file.current?.click()}
          className="w-full rounded-xl border border-line px-4 py-2.5 text-paper"
        >
          Sicherung einlesen
        </button>
        <input
          ref={file}
          type="file"
          accept="application/json,.json"
          className="hidden"
          aria-label="Sicherungsdatei wählen"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void read(f);
            e.target.value = '';
          }}
        />
      </div>

      <p className="mt-2 text-xs leading-relaxed text-faint">
        Einlesen <span className="text-paper">führt zusammen</span> statt zu überschreiben:
        Bei jeder Wendung gewinnt der weiter fortgeschrittene Stand. Du kannst also auf zwei
        Geräten lernen und beide Seiten behalten. Der KI-Schlüssel wandert bewusst
        <span className="text-paper"> nicht </span>mit — er hätte in einer Datei nichts zu
        suchen.
      </p>

      {msg && (
        <p className={`mt-3 text-xs leading-relaxed ${msg.kind === 'ok' ? 'text-success' : 'text-danger'}`}>
          {msg.text}
        </p>
      )}

      <div className="mt-5 rounded-xl border border-danger/30 bg-danger/5 p-3">
        {!confirmWipe ? (
          <button
            onClick={() => setConfirmWipe(true)}
            className="text-sm text-danger underline underline-offset-2"
          >
            Alles löschen
          </button>
        ) : (
          <div>
            <p className="text-sm text-danger">
              Wirklich alles löschen? Jeder Lernstand ist dann weg — ohne Papierkorb.
            </p>
            <p className="mt-1 text-xs text-faint">
              Tipp: erst sichern, dann löschen. Dann kannst du es zurückholen.
            </p>
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => void onWipe().then(() => setConfirmWipe(false))}
                className="rounded-lg bg-danger px-4 py-2 text-sm font-medium text-ink"
              >
                Ja, alles löschen
              </button>
              <button
                onClick={() => setConfirmWipe(false)}
                className="rounded-lg border border-line px-4 py-2 text-sm text-paper"
              >
                Abbrechen
              </button>
            </div>
          </div>
        )}
      </div>
    </Section>
  );
}

function AboutSection({ totalChunks }: { totalChunks: number }) {
  return (
    <Section label="Über" title="Was diese App über sich selbst weiß">
      <dl className="space-y-2.5 text-xs leading-relaxed">
        <div>
          <dt className="font-semibold text-paper">{totalChunks} Wendungen im Vorrat</dt>
          <dd className="text-faint">
            {VERIFICATION_META.machine} maschinell vorgeprüft ·{' '}
            {VERIFICATION_META.unchecked} auffällig markiert
          </dd>
        </div>
        <div>
          <dt className="font-semibold text-danger">0 muttersprachlich geprüft</dt>
          <dd className="text-faint">
            Keine Wendung hat bisher eine schwedischsprachige Person gegengelesen. Wir prüfen
            jedes Wort gegen ein Wörterbuch mit{' '}
            {VERIFICATION_META.dictionaryEntries.toLocaleString('de-DE')} Einträgen — Satzbau,
            Idiomatik und Ton kann das nicht ersetzen.
          </dd>
        </div>
        <div>
          <dt className="font-semibold text-paper">Kein Konto, kein Server</dt>
          <dd className="text-faint">
            Alles läuft auf deinem Gerät. Nur wenn du selbst eine Cloud-KI einrichtest,
            verlässt Text dein Gerät — und dann zu deinem eigenen Anbieter.
          </dd>
        </div>
      </dl>
      <p className="mt-4 flex items-center gap-1.5 text-[0.7rem] text-faint">
        <IconSparkle className="h-3 w-3" /> © 2026 Andreas Fink · neurolang
      </p>
    </Section>
  );
}
