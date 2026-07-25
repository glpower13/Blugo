// Tests der Einstellungen (docs/gremium-einstellungen.md).
// Kern: eine kaputte gespeicherte Einstellung darf die App nie lahmlegen, und
// die Aufwands-Zahl am Erhalt-Ziel muss stimmen — sonst steht dort ein Gefühl
// statt einer Auskunft.

import { describe, expect, it } from 'vitest';
import {
  defaultPreferences,
  normalizePreferences,
  RETENTION_DEFAULT,
  RETENTION_MAX,
  RETENTION_MIN,
  workloadFactor,
} from './preferences';

describe('normalizePreferences', () => {
  it('fällt bei Müll auf die Voreinstellung zurück', () => {
    expect(normalizePreferences(null)).toEqual(defaultPreferences());
    expect(normalizePreferences('kaputt')).toEqual(defaultPreferences());
    expect(normalizePreferences({ retention: 'viel' })).toEqual(defaultPreferences());
  });

  it('hält das Erhalt-Ziel in seinen Grenzen', () => {
    expect(normalizePreferences({ retention: 0.99 }).retention).toBe(RETENTION_MAX);
    expect(normalizePreferences({ retention: 0.1 }).retention).toBe(RETENTION_MIN);
  });

  it('nimmt „automatisch" (null) für den neuen Stoff ernst', () => {
    expect(normalizePreferences({ newPerSession: null }).newPerSession).toBeNull();
    expect(normalizePreferences({ newPerSession: 3 }).newPerSession).toBe(3);
    expect(normalizePreferences({ newPerSession: 999 }).newPerSession).toBe(20);
  });

  it('behandelt fehlende Felder einzeln, nicht alles-oder-nichts', () => {
    const p = normalizePreferences({ speechRate: 0.7 });
    expect(p.speechRate).toBe(0.7);
    expect(p.retention).toBe(RETENTION_DEFAULT);
  });
});

describe('workloadFactor — die ehrliche Aufwands-Auskunft', () => {
  it('ist bei der Voreinstellung genau 1', () => {
    expect(workloadFactor(RETENTION_DEFAULT)).toBeCloseTo(1, 10);
  });

  it('bedeutet mehr Aufwand, wenn das Ziel steigt', () => {
    expect(workloadFactor(0.95)).toBeGreaterThan(1.5);
  });

  it('bedeutet weniger Aufwand, wenn das Ziel sinkt', () => {
    expect(workloadFactor(0.8)).toBeLessThan(1);
    expect(workloadFactor(0.8)).toBeGreaterThan(0);
  });

  it('steigt streng monoton mit dem Ziel', () => {
    const values = [0.8, 0.85, 0.9, 0.95].map(workloadFactor);
    for (let i = 1; i < values.length; i++) expect(values[i]).toBeGreaterThan(values[i - 1]);
  });
});
