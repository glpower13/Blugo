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
  saveSettings({ provider: 'device', anthropic: { apiKey: '', model: DEFAULT_MODEL } });
});

describe('normalizeSettings — robust gegen Müll', () => {
  it('gibt Standard bei leer/kaputt', () => {
    expect(normalizeSettings(null).provider).toBe('device');
    expect(normalizeSettings(42).anthropic.model).toBe(DEFAULT_MODEL);
  });

  it('erzwingt gültigen Anbieter und ein bekanntes Modell', () => {
    const s = normalizeSettings({ provider: 'anthropic', anthropic: { apiKey: 'k', model: 'unbekannt' } });
    expect(s.provider).toBe('anthropic');
    expect(s.anthropic.apiKey).toBe('k');
    expect(s.anthropic.model).toBe(DEFAULT_MODEL); // unbekanntes Modell → Standard
  });
});

describe('save/load — Rundlauf', () => {
  it('speichert und lädt dieselbe Einstellung', () => {
    const s: AiSettings = { provider: 'anthropic', anthropic: { apiKey: 'geheim', model: 'claude-haiku-4-5' } };
    saveSettings(s);
    expect(loadSettings()).toEqual(s);
  });
});

describe('applySettings — wirkt auf die Port-Registry', () => {
  it('Gerät → Standard-Adapter (seed), keine KI-Erklärung', () => {
    applySettings({ provider: 'device', anthropic: { apiKey: '', model: DEFAULT_MODEL } });
    expect(aiRegistry.decoder.id).toBe('seed');
    expect(aiRegistry.generator.id).toBe('seed');
    expect(aiRegistry.explainer).toBeNull();
  });

  it('Claude mit Schlüssel → Anthropic-Dekoder + Explainer + Generator', () => {
    applySettings({ provider: 'anthropic', anthropic: { apiKey: 'k', model: 'claude-opus-4-8' } });
    expect(aiRegistry.decoder.id).toBe('anthropic:claude-opus-4-8');
    expect(aiRegistry.explainer?.id).toBe('anthropic:claude-opus-4-8');
    expect(aiRegistry.generator.id).toBe('anthropic:claude-opus-4-8');
  });

  it('Claude ohne Schlüssel → bleibt beim Standard-Dekoder, kein Explainer', () => {
    applySettings({ provider: 'anthropic', anthropic: { apiKey: '   ', model: 'claude-opus-4-8' } });
    expect(aiRegistry.decoder.id).toBe('seed');
    expect(aiRegistry.explainer).toBeNull();
  });
});
