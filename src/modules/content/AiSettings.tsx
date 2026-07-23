// Einstellungs-/Login-Fläche für die KI-Auswahl (Nutzerwunsch, docs/10-open-questions.md).
// Anbieter wählen → Zugang hinterlegen → Verbindung testen → speichern. Alles
// anbieter-agnostisch über die Port-Registry; nichts anderes in der App ändert sich.

import { useState } from 'react';
import { aiRegistry } from './aiRegistry';
import {
  applySettings,
  loadSettings,
  saveSettings,
  MODEL_OPTIONS,
  type AiProvider,
  type AiSettings as AiSettingsData,
} from './aiSettings';

type TestState = 'idle' | 'running' | 'ok' | 'error';

export function AiSettings({ onClose }: { onClose: () => void }) {
  const [settings, setSettings] = useState<AiSettingsData>(() => loadSettings());
  const [test, setTest] = useState<{ state: TestState; msg: string }>({ state: 'idle', msg: '' });

  function setProvider(provider: AiProvider) {
    setSettings((s) => ({ ...s, provider }));
    setTest({ state: 'idle', msg: '' });
  }

  function setKey(apiKey: string) {
    setSettings((s) => ({ ...s, anthropic: { ...s.anthropic, apiKey } }));
    setTest({ state: 'idle', msg: '' });
  }

  function setModel(model: string) {
    setSettings((s) => ({ ...s, anthropic: { ...s.anthropic, model } }));
  }

  function close() {
    // Registry auf den GESPEICHERTEN Stand zurücksetzen (Test war nur temporär).
    applySettings(loadSettings());
    onClose();
  }

  function save() {
    saveSettings(settings);
    applySettings(settings);
    onClose();
  }

  async function testConnection() {
    setTest({ state: 'running', msg: '' });
    applySettings(settings); // aktuelle (noch ungespeicherte) Wahl anwenden
    try {
      const tokens = await aiRegistry.decoder.decode('hur mår du?');
      setTest({ state: 'ok', msg: tokens.map((t) => `${t.sv} = ${t.de}`).join(' · ') });
    } catch (e) {
      setTest({ state: 'error', msg: e instanceof Error ? e.message : 'Unbekannter Fehler' });
    }
  }

  const isCloud = settings.provider === 'anthropic';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-md">
      <div className="glass rise max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold text-paper">KI-Einstellungen</h2>
          <button onClick={close} className="text-muted" aria-label="Schließen">
            ✕
          </button>
        </div>

        <p className="mb-3 text-xs text-muted">
          Wähle, welche KI die App nutzt. Deine Auswahl bleibt auf dem Gerät.
        </p>

        {/* Anbieter-Wahl */}
        <div className="flex flex-col gap-2">
          <ProviderCard
            active={!isCloud}
            title="Auf dem Gerät"
            desc="Kostenlos, kein Schlüssel, nichts verlässt das Gerät."
            onClick={() => setProvider('device')}
          />
          <ProviderCard
            active={isCloud}
            title="Claude (Cloud)"
            desc="Automatische Wort-für-Wort-Übersetzung. Braucht deinen Schlüssel; Text geht an Anthropic."
            onClick={() => setProvider('anthropic')}
          />
        </div>

        {/* Login + Modell (nur bei Cloud) */}
        {isCloud && (
          <div className="mt-4 flex flex-col gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-sm text-paper">Dein Claude-Zugangs-Schlüssel</span>
              <input
                type="password"
                value={settings.anthropic.apiKey}
                onChange={(e) => setKey(e.target.value)}
                placeholder="sk-ant-…"
                autoComplete="off"
                spellCheck={false}
                className="rounded-lg border border-line bg-base px-3 py-2 text-paper"
              />
              <span className="text-xs text-faint">
                Schlüssel bekommst du bei console.anthropic.com. Er bleibt lokal gespeichert.
              </span>
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-sm text-paper">Modell (Qualität ↔ Kosten)</span>
              <select
                value={settings.anthropic.model}
                onChange={(e) => setModel(e.target.value)}
                className="rounded-lg border border-line bg-base px-3 py-2 text-paper"
              >
                {MODEL_OPTIONS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.label}
                  </option>
                ))}
              </select>
            </label>

            <button
              onClick={() => void testConnection()}
              disabled={test.state === 'running' || !settings.anthropic.apiKey.trim()}
              className="rounded-lg border border-line px-3 py-2 text-sm text-paper disabled:opacity-50"
            >
              {test.state === 'running' ? 'Teste…' : 'Verbindung testen'}
            </button>

            {test.state === 'ok' && (
              <p className="text-xs leading-snug text-success">✓ Klappt: {test.msg}</p>
            )}
            {test.state === 'error' && (
              <p className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm leading-snug text-danger">
                ✕ {test.msg}
              </p>
            )}

            <p className="text-xs text-faint">
              Hinweis: Beim Übersetzen verlässt der schwedische Text dein Gerät Richtung Anbieter.
            </p>
          </div>
        )}

        <div className="mt-5 flex gap-2">
          <button
            onClick={save}
            className="btn-gold flex-1 rounded-xl px-4 py-2 font-medium text-ink"
          >
            Speichern
          </button>
          <button
            onClick={close}
            className="rounded-lg border border-line px-4 py-2 text-paper"
          >
            Abbrechen
          </button>
        </div>
      </div>
    </div>
  );
}

function ProviderCard({
  active,
  title,
  desc,
  onClick,
}: {
  active: boolean;
  title: string;
  desc: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl border p-3 text-left ${
        active ? 'border-brand bg-brand/10' : 'border-line'
      }`}
    >
      <div className="text-sm font-medium text-paper">{title}</div>
      <div className="text-xs text-muted">{desc}</div>
    </button>
  );
}
