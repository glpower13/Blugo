// KI-Einstellungen: welcher Anbieter, welcher Schlüssel/welches Modell. Lokal
// gespeichert (localStorage mit In-Memory-Fallback) und auf die Port-Registry
// angewendet (anbieter-agnostisch). Der Schlüssel ist der EIGENE Schlüssel des
// Nutzers, bleibt auf dem Gerät und geht nur an den gewählten Anbieter
// (docs/05-architecture.md §Sicherheit; docs/10-open-questions.md).

import { setAiPorts } from './aiRegistry';
import { seedDecoder, seedGenerator } from './adapters/seed';
import { seedPartner } from './adapters/seedPartner';
import {
  createOpenAiDecoder,
  createOpenAiExplainer,
  createOpenAiGenerator,
  createOpenAiSparringPartner,
} from './adapters/openaiCompatible';
import {
  createAnthropicDecoder,
  createAnthropicExplainer,
  createAnthropicGenerator,
  createAnthropicSparringPartner,
} from './adapters/anthropic';

/**
 * Wer für die App denkt.
 *
 * `openai` heißt NICHT „die Firma OpenAI", sondern „spricht deren
 * Chat-Schnittstelle" — und das tun inzwischen fast alle: Groq, Mistral,
 * DeepSeek, OpenRouter, Together, und lokale Server wie Ollama oder LM Studio.
 * Ein einziger Adapter deckt sie alle ab (`adapters/openaiCompatible.ts`).
 */
export type AiProvider = 'device' | 'anthropic' | 'openai';

export interface AiSettings {
  provider: AiProvider;
  anthropic: { apiKey: string; model: string };
  /** Beliebiger OpenAI-kompatibler Dienst — Adresse, Zugang, Modellname. */
  openai: { baseUrl: string; apiKey: string; model: string };
}

export const DEFAULT_MODEL = 'claude-opus-4-8';

/** Auswahl-Modelle mit Klartext-Beschreibung (Kosten ist Nutzer-Entscheidung). */
export const MODEL_OPTIONS = [
  { id: 'claude-opus-4-8', label: 'Claude Opus 4.8 — höchste Qualität (Standard)' },
  { id: 'claude-sonnet-5', label: 'Claude Sonnet 5 — sehr gut, günstiger' },
  { id: 'claude-haiku-4-5', label: 'Claude Haiku 4.5 — schnell & am günstigsten' },
] as const;

const KEY = 'neurolang.ai.v1';

/** Vorschläge für die Adresse — Klartext statt Rätselraten. */
export const OPENAI_BEISPIELE = [
  { label: 'OpenAI', url: 'https://api.openai.com/v1', modell: 'gpt-4o' },
  { label: 'Groq', url: 'https://api.groq.com/openai/v1', modell: 'llama-3.3-70b-versatile' },
  { label: 'Mistral', url: 'https://api.mistral.ai/v1', modell: 'mistral-large-latest' },
  { label: 'OpenRouter', url: 'https://openrouter.ai/api/v1', modell: 'openai/gpt-4o' },
  { label: 'Ollama (auf diesem Rechner)', url: 'http://localhost:11434/v1', modell: 'llama3.1' },
] as const;

function defaults(): AiSettings {
  return {
    provider: 'device',
    anthropic: { apiKey: '', model: DEFAULT_MODEL },
    openai: { baseUrl: '', apiKey: '', model: '' },
  };
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
  const r = raw as {
    provider?: unknown;
    anthropic?: { apiKey?: unknown; model?: unknown };
    openai?: { baseUrl?: unknown; apiKey?: unknown; model?: unknown };
  };
  const provider: AiProvider =
    r.provider === 'anthropic' ? 'anthropic' : r.provider === 'openai' ? 'openai' : 'device';
  const apiKey = typeof r.anthropic?.apiKey === 'string' ? r.anthropic.apiKey : '';
  const model =
    typeof r.anthropic?.model === 'string' && MODEL_OPTIONS.some((m) => m.id === r.anthropic!.model)
      ? r.anthropic.model
      : DEFAULT_MODEL;
  const text = (v: unknown): string => (typeof v === 'string' ? v : '');
  return {
    provider,
    anthropic: { apiKey, model },
    openai: {
      baseUrl: text(r.openai?.baseUrl),
      apiKey: text(r.openai?.apiKey),
      model: text(r.openai?.model),
    },
  };
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
  if (s.provider === 'openai' && s.openai.baseUrl.trim() && s.openai.model.trim()) {
    // Bewusst OHNE Schlüssel-Pflicht: Lokale Server (Ollama, LM Studio) brauchen
    // keinen, und sie sind der einzige Weg, eine Cloud-KI zu nutzen, ohne dass
    // etwas das Gerät verlässt.
    const cfg = {
      baseUrl: s.openai.baseUrl.trim(),
      apiKey: s.openai.apiKey.trim(),
      model: s.openai.model.trim(),
    };
    setAiPorts({
      decoder: createOpenAiDecoder(cfg),
      explainer: createOpenAiExplainer(cfg),
      generator: createOpenAiGenerator(cfg),
      partner: createOpenAiSparringPartner(cfg),
    });
    return;
  }
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
