// Tests der KI-Einstellungen: Normalisierung, Speichern/Laden, Anwenden auf die Registry.

import { afterEach, describe, expect, it } from 'vitest';
import {
  DEFAULT_MODEL,
  applySettings,
  loadSettings,
  normalizeSettings,
  saveSettings,
  type AiSettings,
} from './aiSettings';
import { aiRegistry, resetAiPorts } from './aiRegistry';

afterEach(() => {
  resetAiPorts();
  saveSettings({ provider: 'device', anthropic: { apiKey: '', model: DEFAULT_MODEL }, openai: { baseUrl: '', apiKey: '', model: '' } });
});

describe('normalizeSettings — robust gegen Müll', () => {
  it('gibt Standard bei leer/kaputt', () => {
    expect(normalizeSettings(null).provider).toBe('device');
    expect(normalizeSettings(42).anthropic.model).toBe(DEFAULT_MODEL);
  });

  it('erzwingt gültigen Anbieter und ein bekanntes Modell', () => {
    const s = normalizeSettings({ provider: 'anthropic', anthropic: { apiKey: 'k', model: 'unbekannt' }, openai: { baseUrl: '', apiKey: '', model: '' } });
    expect(s.provider).toBe('anthropic');
    expect(s.anthropic.apiKey).toBe('k');
    expect(s.anthropic.model).toBe(DEFAULT_MODEL); // unbekanntes Modell → Standard
  });
});

describe('save/load — Rundlauf', () => {
  it('speichert und lädt dieselbe Einstellung', () => {
    const s: AiSettings = { provider: 'anthropic', anthropic: { apiKey: 'geheim', model: 'claude-haiku-4-5' }, openai: { baseUrl: '', apiKey: '', model: '' } };
    saveSettings(s);
    expect(loadSettings()).toEqual(s);
  });
});

describe('applySettings — wirkt auf die Port-Registry', () => {
  it('Gerät → Standard-Adapter (seed), keine KI-Erklärung', () => {
    applySettings({ provider: 'device', anthropic: { apiKey: '', model: DEFAULT_MODEL }, openai: { baseUrl: '', apiKey: '', model: '' } });
    expect(aiRegistry.decoder.id).toBe('seed');
    expect(aiRegistry.generator.id).toBe('seed');
    expect(aiRegistry.explainer).toBeNull();
  });

  it('Claude mit Schlüssel → Anthropic-Dekoder + Explainer + Generator', () => {
    applySettings({ provider: 'anthropic', anthropic: { apiKey: 'k', model: 'claude-opus-4-8' }, openai: { baseUrl: '', apiKey: '', model: '' } });
    expect(aiRegistry.decoder.id).toBe('anthropic:claude-opus-4-8');
    expect(aiRegistry.explainer?.id).toBe('anthropic:claude-opus-4-8');
    expect(aiRegistry.generator.id).toBe('anthropic:claude-opus-4-8');
  });

  it('Claude ohne Schlüssel → bleibt beim Standard-Dekoder, kein Explainer', () => {
    applySettings({ provider: 'anthropic', anthropic: { apiKey: '   ', model: 'claude-opus-4-8' }, openai: { baseUrl: '', apiKey: '', model: '' } });
    expect(aiRegistry.decoder.id).toBe('seed');
    expect(aiRegistry.explainer).toBeNull();
  });
});

describe('Der dritte Anbieter: beliebig, nicht Claude', () => {
  it('merkt sich Adresse, Modell und Zugang', () => {
    const s = normalizeSettings({
      provider: 'openai',
      openai: { baseUrl: 'https://x.test/v1', apiKey: 'k', model: 'm' },
    });
    expect(s.provider).toBe('openai');
    expect(s.openai).toEqual({ baseUrl: 'https://x.test/v1', apiKey: 'k', model: 'm' });
  });

  it('belegt ALLE vier Ports — auch den Sparringspartner', () => {
    applySettings({
      provider: 'openai',
      anthropic: { apiKey: '', model: DEFAULT_MODEL },
      openai: { baseUrl: 'https://x.test/v1', apiKey: '', model: 'm' },
    });
    expect(aiRegistry.decoder.id).toBe('openai:m');
    expect(aiRegistry.generator.id).toBe('openai:m');
    expect(aiRegistry.explainer?.id).toBe('openai:m');
    expect(aiRegistry.partner?.id).toBe('openai:m');
  });

  it('braucht KEINEN Schlüssel — ein Server auf dem eigenen Rechner hat keinen', () => {
    applySettings({
      provider: 'openai',
      anthropic: { apiKey: '', model: DEFAULT_MODEL },
      openai: { baseUrl: 'http://localhost:11434/v1', apiKey: '', model: 'llama3.1' },
    });
    expect(aiRegistry.partner?.id).toBe('openai:llama3.1');
  });

  it('fällt ohne Adresse oder Modell auf die Grund-Adapter zurück', () => {
    applySettings({
      provider: 'openai',
      anthropic: { apiKey: '', model: DEFAULT_MODEL },
      openai: { baseUrl: '', apiKey: '', model: '' },
    });
    expect(aiRegistry.generator.id).toBe('seed');
    // Der Sparringspartner bleibt trotzdem da — als Grund-Partner.
    expect(aiRegistry.partner?.id).toBe('seed');
  });

  it('macht aus einer alten gespeicherten Datei keinen Unsinn', () => {
    // Wer die App vor diesem Tag benutzt hat, hat kein `openai` gespeichert.
    const s = normalizeSettings({ provider: 'anthropic', anthropic: { apiKey: 'k' } });
    expect(s.provider).toBe('anthropic');
    expect(s.openai).toEqual({ baseUrl: '', apiKey: '', model: '' });
  });
});
