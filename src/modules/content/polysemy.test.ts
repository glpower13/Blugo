// Hält die Mehrdeutigkeits-Liste ehrlich.
//
// Eine Behauptung über die Sprache darf nicht davon leben, dass ich sie
// hingeschrieben habe. Jedes Wort in `MEHRDEUTIGE_WOERTER` muss im Inhalt
// vorkommen UND dort tatsächlich mit mehr als einer Bedeutung glossiert sein.
// Sonst erzählt die App dem Lerner etwas, das sie ihm nie zeigt.

import { describe, expect, it } from 'vitest';
import { andereBedeutungen, MEHRDEUTIGE_WOERTER, mehrdeutigeInDekodierung } from './polysemy';
import { seedChunks, seedSegments } from './seedSegments';
import { seedDialogs } from './seedDialogs';

/** sv-Wort → alle deutschen Glossen, die im Inhalt dafür stehen. */
function glossenImInhalt(): Map<string, Set<string>> {
  const karte = new Map<string, Set<string>>();
  const eintragen = (d?: { sv: string; de: string }[]) => {
    for (const t of d ?? []) {
      const w = t.sv.toLowerCase();
      if (!karte.has(w)) karte.set(w, new Set());
      karte.get(w)!.add(t.de.toLowerCase().trim());
    }
  };
  for (const c of seedChunks) eintragen(c.decoding);
  for (const s of seedSegments) eintragen(s.decoding);
  for (const d of seedDialogs) for (const t of d.turns) eintragen(t.decoding);
  return karte;
}

describe('Mehrdeutige Wörter', () => {
  const inhalt = glossenImInhalt();

  it('jedes gelistete Wort kommt im Inhalt vor', () => {
    const fehlend = MEHRDEUTIGE_WOERTER.filter((m) => !inhalt.has(m.sv)).map((m) => m.sv);
    expect(fehlend, 'nicht im Inhalt — die App erklärt etwas, das sie nie zeigt').toEqual([]);
  });

  it('jedes gelistete Wort ist im Inhalt wirklich mehrdeutig glossiert', () => {
    const nurEine = MEHRDEUTIGE_WOERTER.filter((m) => (inhalt.get(m.sv)?.size ?? 0) < 2).map(
      (m) => m.sv,
    );
    expect(nurEine, 'nur eine Bedeutung im Inhalt — der Hinweis geht ins Leere').toEqual([]);
  });

  it('jeder Eintrag nennt mindestens zwei Bedeutungen und einen Hinweis', () => {
    for (const m of MEHRDEUTIGE_WOERTER) {
      expect(m.bedeutungen.length, `„${m.sv}" nennt zu wenige Bedeutungen`).toBeGreaterThanOrEqual(
        2,
      );
      expect(m.hinweis.length, `„${m.sv}" hat keinen Hinweis`).toBeGreaterThan(20);
    }
  });

  it('kein Wort steht doppelt in der Liste', () => {
    const woerter = MEHRDEUTIGE_WOERTER.map((m) => m.sv);
    expect(new Set(woerter).size).toBe(woerter.length);
  });

  it('findet die mehrdeutigen Wörter einer Dekodierung, jedes nur einmal', () => {
    const treffer = mehrdeutigeInDekodierung([
      { sv: 'jag', de: 'ich' },
      { sv: 'betalar', de: 'zahle' },
      { sv: 'med', de: 'mit' },
      { sv: 'Kort', de: 'Karte' },
      { sv: 'kort', de: 'Karte' },
    ]);
    expect(treffer).toHaveLength(1);
    expect(treffer[0].eintrag.sv).toBe('kort');
    expect(treffer[0].hier).toBe('Karte');
  });

  it('nennt die gebeugte Form nicht als andere Bedeutung', () => {
    const flyttar = MEHRDEUTIGE_WOERTER.find((m) => m.sv === 'flyttar')!;
    // Im Satz steht „verlegen", in der Liste „verlegt" — dasselbe Wort.
    expect(andereBedeutungen(flyttar, 'verlegen')).toEqual(['zieht um']);
    expect(andereBedeutungen(flyttar, 'zieht')).toEqual(['verlegt']);
  });

  it('hält echte Bedeutungspaare auseinander', () => {
    const kort = MEHRDEUTIGE_WOERTER.find((m) => m.sv === 'kort')!;
    expect(andereBedeutungen(kort, 'Karte')).toEqual(['kurz']);
    const naer = MEHRDEUTIGE_WOERTER.find((m) => m.sv === 'när')!;
    expect(andereBedeutungen(naer, 'wann')).toEqual(['wenn']);
    const precis = MEHRDEUTIGE_WOERTER.find((m) => m.sv === 'precis')!;
    expect(andereBedeutungen(precis, 'genau')).toEqual(['gerade']);
  });

  it('jeder Eintrag hat an jeder eigenen Bedeutung noch etwas zu sagen', () => {
    for (const m of MEHRDEUTIGE_WOERTER) {
      for (const b of m.bedeutungen) {
        expect(
          andereBedeutungen(m, b).length,
          `„${m.sv}" hätte bei „${b}" nichts mehr zu melden`,
        ).toBeGreaterThan(0);
      }
    }
  });

  it('meldet nichts, wenn kein Wort mehrdeutig ist', () => {
    expect(mehrdeutigeInDekodierung([{ sv: 'hej', de: 'hallo' }])).toEqual([]);
  });
});
