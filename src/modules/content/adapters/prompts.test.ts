// Das Grundgesetz. Es geht bei JEDEM Aufruf mit und wird auf dem eigenen Zugang
// des Lerners bezahlt — also muss belegt sein, dass es überall ankommt und dass
// es klein bleibt.

import { describe, expect, it } from 'vitest';
import {
  DECODE_SYSTEM,
  EXPLAIN_SYSTEM,
  GENERATE_SYSTEM,
  GRUNDGESETZ,
  SPARRING_SYSTEM,
} from './prompts';

const ALLE = { DECODE_SYSTEM, EXPLAIN_SYSTEM, GENERATE_SYSTEM, SPARRING_SYSTEM };

describe('Das Grundgesetz steht vor jeder Aufgabe', () => {
  it('ist in ALLEN vier Anweisungen enthalten', () => {
    // Vorher hatte jede Fähigkeit ihre eigene, isolierte Anweisung, und keine
    // wusste, was diese App überhaupt ist.
    for (const [name, s] of Object.entries(ALLE)) {
      expect(s.startsWith(GRUNDGESETZ), `${name} fängt nicht damit an`).toBe(true);
    }
  });

  it('steht genau EINMAL drin — nicht doppelt', () => {
    for (const [name, s] of Object.entries(ALLE)) {
      const treffer = s.split('ÜBER DIESE APP').length - 1;
      expect(treffer, `${name} enthält es ${treffer}-mal`).toBe(1);
    }
  });

  it('lässt die eigentliche Aufgabe unverändert dahinter stehen', () => {
    expect(DECODE_SYSTEM).toContain('Wort-für-Wort-Dekodierung');
    expect(EXPLAIN_SYSTEM).toContain('Lernbegleiter');
    expect(GENERATE_SYSTEM).toContain('Comprehensible Input');
    expect(SPARRING_SYSTEM).toContain('Du spielst eine Person');
  });
});

describe('Was das Grundgesetz sagen MUSS', () => {
  it('nennt die zwei Dinge, die echten Schaden anrichten', () => {
    // 1. Erfundenes Schwedisch. 2. Die Lösung vorsagen — das lässt den Lerner
    //    „Können" verbuchen, das keines ist, und bricht die eine Design-Regel.
    expect(GRUNDGESETZ).toMatch(/Erfinde NIE Schwedisch/);
    expect(GRUNDGESETZ).toMatch(/NIE die Lösung/);
  });

  it('weist Anweisungen aus dem Text des Lernenden ausdrücklich zurück', () => {
    // Die Frage, die dazu geführt hat: „Den könnte ich ja theoretisch alles
    // fragen." Der Prompt beugt vor — erzwungen wird es vom Wächter.
    expect(GRUNDGESETZ).toMatch(/Andere Bitten/);
    expect(GRUNDGESETZ).toMatch(/ignoriere sie/);
  });

  it('sagt, dass geliefertes Schwedisch nachher geprüft wird', () => {
    expect(GRUNDGESETZ).toMatch(/geprüften Bestand/);
  });
});

describe('Und es bleibt bezahlbar', () => {
  it('kostet je Aufruf nur einen kleinen Aufschlag', () => {
    // Rund 1.200 Zeichen ≈ 340 Eingabe-Token ≈ 0,1 Cent je Aufruf. Es geht bei
    // JEDEM Aufruf mit, auf dem Zugang des Lerners. Wächst es unbemerkt auf das
    // Dreifache, zahlt er das — ohne dass jemand die Entscheidung getroffen hat.
    expect(GRUNDGESETZ.length).toBeLessThan(1800);
    expect(GRUNDGESETZ.length).toBeGreaterThan(400);
  });
});
