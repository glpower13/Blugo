// KI-Einstellungen: welcher Anbieter, welcher Schlüssel/welches Modell. Lokal
// gespeichert (localStorage mit In-Memory-Fallback) und auf die Port-Registry
// angewendet (anbieter-agnostisch). Der Schlüssel ist der EIGENE Schlüssel des
// Nutzers, bleibt auf dem Gerät und geht nur an den gewählten Anbieter
// (docs/05-architecture.md §Sicherheit; docs/10-open-questions.md).

import { setAiPorts } from './aiRegistry';
import { seedDecoder, seedGenerator } from './adapters/seed';
import { seedPartner } from './adapters/seedPartner';
import {
  createAnthropicDecoder,
  createAnthropicExplainer,
  createAnthropicGenerator,
  createAnthropicSparringPartner,
} from './adapters/anthropic';

export type AiProvider = 'device' | 'anthropic';

export interface AiSettings {
  provider: AiProvider;
  anthropic: { apiKey: string; model: string };
}

export const DEFAULT_MODEL = 'claude-opus-4-8';

/** Auswahl-Modelle mit Klartext-Beschreibung (Kosten ist Nutzer-Entscheidung). */
export const MODEL_OPTIONS = [
  { id: 'claude-opus-4-8', label: 'Claude Opus 4.8 — höchste Qualität (Standard)' },
  { id: 'claude-sonnet-5', label: 'Claude Sonnet 5 — sehr gut, günstiger' },
  { id: 'claude-haiku-4-5', label: 'Claude Haiku 4.5 — schnell & am günstigsten' },
] as const;

const KEY = 'neurolang.ai.v1';

function defaults(): AiSettings {
  return { provider: 'device', anthropic: { apiKey: '', model: DEFAULT_MODEL } };
}

// localStorage mit In-Memory-Fallback (privater Modus / Node-Tests).
const mem: Record<string, string> = {};
const backend: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'> = (() => {
  try {
    const t = '__nl_ai_test__';
    window.localStorage.setItem(t, '1');
    window.localStorage.removeItem(t);
    return window.localStorage;
  } catch {
    return {
      getItem: (k: string) => (k in mem ? mem[k] : null),
      setItem: (k: string, v: string) => {
        mem[k] = v;
      },
      removeItem: (k: string) => {
        delete mem[k];
      },
    };
  }
})();

/** Normalisiert beliebige gespeicherte Daten auf eine gültige Einstellung (rein). */
export function normalizeSettings(raw: unknown): AiSettings {
  if (!raw || typeof raw !== 'object') return defaults();
  const r = raw as { provider?: unknown; anthropic?: { apiKey?: unknown; model?: unknown } };
  const provider: AiProvider = r.provider === 'anthropic' ? 'anthropic' : 'device';
  const apiKey = typeof r.anthropic?.apiKey === 'string' ? r.anthropic.apiKey : '';
  const model =
    typeof r.anthropic?.model === 'string' && MODEL_OPTIONS.some((m) => m.id === r.anthropic!.model)
      ? r.anthropic.model
      : DEFAULT_MODEL;
  return { provider, anthropic: { apiKey, model } };
}

export function loadSettings(): AiSettings {
  try {
    const raw = backend.getItem(KEY);
    return normalizeSettings(raw ? JSON.parse(raw) : null);
  } catch {
    return defaults();
  }
}

export function saveSettings(s: AiSettings): void {
  try {
    backend.setItem(KEY, JSON.stringify(s));
  } catch {
    /* Speicher voll o. Ä. — bewusst ignoriert. */
  }
}

/** Wendet die Einstellung auf die Port-Registry an (in Schritt C nur den Decoder). */
export function applySettings(s: AiSettings): void {
  if (s.provider === 'anthropic' && s.anthropic.apiKey.trim()) {
    const cfg = { apiKey: s.anthropic.apiKey.trim(), model: s.anthropic.model };
    setAiPorts({
      decoder: createAnthropicDecoder(cfg),
      explainer: createAnthropicExplainer(cfg),
      generator: createAnthropicGenerator(cfg),
      partner: createAnthropicSparringPartner(cfg),
    });
  } else {
    // Zurück zu den kostenlosen Standard-Adaptern (Seed); keine KI-Erklärung.
    // Zurück auf die Standard-Adapter — der Sparringspartner bleibt dabei
    // erhalten, nur eben als Grund-Partner aus kuratiertem Inhalt.
    setAiPorts({
      decoder: seedDecoder,
      explainer: null,
      generator: seedGenerator,
      partner: seedPartner,
    });
  }
}

/** Beim Start: gespeicherte Einstellung laden und anwenden. */
export function initAiSettings(): AiSettings {
  const s = loadSettings();
  applySettings(s);
  return s;
}
