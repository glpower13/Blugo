// Test des Produktions-Lückentexts (docs/gremium-darstellung.md): der Ziel-Chunk
// wird im Satz ausgeblendet, der Kontext bleibt, die Lösung wird nicht verraten.

import { describe, expect, it } from 'vitest';
import { clozeSentence } from './ComprehensionLoop';

describe('clozeSentence', () => {
  it('findet den Ziel-Chunk (auch groß geschrieben) und blendet ihn aus', () => {
    const c = clozeSentence('Jag heter Anna.', 'jag heter');
    expect(c.found).toBe(true);
    expect(c.before).toBe('');
    expect(c.after).toBe(' Anna.');
  });

  it('lässt den Kontext vor UND nach der Lücke stehen', () => {
    const c = clozeSentence('Hej, hur mår du idag?', 'hur mår du');
    expect(c.found).toBe(true);
    expect(c.before).toBe('Hej, ');
    expect(c.after).toBe(' idag?');
  });

  it('ist ehrlich: kommt der Chunk nicht wörtlich vor, keine erfundene Lücke', () => {
    expect(clozeSentence('Vad heter du?', 'jag heter').found).toBe(false);
  });
});
