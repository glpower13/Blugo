// Stufe 2 der Prüfkette (docs/gremium-content-pruefung.md): die HARTEN Regeln
// laufen in der Kaskade mit, damit neuer Inhalt sie nicht unbemerkt bricht.
// Die weichen Verdachtslisten (C/D) gehören in den Bericht, nicht in einen Test —
// sie sind Lesehilfe für einen Menschen, kein Urteil.

import { describe, expect, it } from 'vitest';
import {
  nurBeugung,
  istBedeutungsKonflikt,
  CONTEXT_FLOOR,
  collectLines,
  findConflicts,
  findContextBreaks,
  findContextCoverage,
  findDrift,
  findGaps,
  looseMatch,
  tokens,
  type Line,
} from './backtranslation';

const line = (o: Partial<Line>): Line => ({
  where: 'Test',
  sv: '',
  de: '',
  decoding: [],
  ...o,
});

describe('Hilfsfunktionen', () => {
  it('tokens lässt den Namens-Platzhalter weg', () => {
    expect(tokens('Hej {name}, välkommen!')).toEqual(['hej', 'välkommen']);
  });

  it('looseMatch toleriert Beugung und Zusammensetzung', () => {
    expect(looseMatch('buss', 'bussen')).toBe(true); // bestimmte Form
    expect(looseMatch('apoteket', 'apotek')).toBe(true); // andere Richtung
    expect(looseMatch('gott', 'jättegott')).toBe(true); // Zusammensetzung
  });

  it('looseMatch matcht Kurzwörter NICHT versehentlich in langen', () => {
    // sonst gälte „var" als in „varsågod" enthalten und Prüfung B würde blind
    expect(looseMatch('var', 'varsågod')).toBe(false);
    expect(looseMatch('och', 'kokosnöt')).toBe(false);
  });
});

describe('A — Glossen-Lücken', () => {
  it('findet ein schwedisches Wort ohne Wort-für-Wort-Glosse', () => {
    const gaps = findGaps([
      line({ sv: 'jag heter Anna', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'heter', de: 'heiße' }] }),
    ]);
    expect(gaps).toHaveLength(1);
    expect(gaps[0].missing).toEqual(['anna']);
  });

  it('akzeptiert Mehrwort-Glossen als Ganzes', () => {
    expect(
      findGaps([line({ sv: 'smaklig måltid', decoding: [{ sv: 'smaklig måltid', de: 'guten Appetit' }] })]),
    ).toHaveLength(0);
  });

  it('der echte Seed hat keine einzige Glossen-Lücke', () => {
    const gaps = findGaps(collectLines());
    expect(gaps.map((g) => `${g.where}: ${g.missing.join(',')}`)).toEqual([]);
  });
});

describe('B — Kontext-Deckung', () => {
  it('im echten Seed ist jede Wendung in ihrem Segment wiederzuerkennen', () => {
    const breaks = findContextBreaks();
    expect(breaks.map((b) => `${b.segment} → ${b.chunk} (${b.missing.join(',')})`)).toEqual([]);
  });

  it('jede Deckung liegt zwischen 0 und 1', () => {
    for (const c of findContextCoverage()) {
      expect(c.score, `${c.segment} → ${c.chunk}`).toBeGreaterThanOrEqual(0);
      expect(c.score, `${c.segment} → ${c.chunk}`).toBeLessThanOrEqual(1);
    }
  });

  it('die Schwelle lässt echte Kontextvariation zu', () => {
    // „jag har ont här" → „Det gör ont här." behält 2 von 4 Wörtern: erwünscht.
    expect(CONTEXT_FLOOR).toBeLessThanOrEqual(0.5);
  });
});

describe('C — Glossen-Konflikte', () => {
  it('meldet dasselbe Wort mit zwei Bedeutungen', () => {
    const c = findConflicts([
      line({ where: 'A', decoding: [{ sv: 'tack', de: 'danke' }] }),
      line({ where: 'B', decoding: [{ sv: 'tack', de: 'bitte' }] }),
    ]);
    expect(c).toHaveLength(1);
    expect(c[0].glosses.map((g) => g.de).sort()).toEqual(['bitte', 'danke']);
  });

  it('ignoriert Groß-/Kleinschreibung (kein Schein-Konflikt)', () => {
    expect(
      findConflicts([
        line({ decoding: [{ sv: 'hej', de: 'Hallo' }] }),
        line({ decoding: [{ sv: 'hej', de: 'hallo' }] }),
      ]),
    ).toHaveLength(0);
  });

  it('vergleicht nur Ein-Wort-Glossen (feste Formeln sind keine Konflikte)', () => {
    expect(
      findConflicts([
        line({ decoding: [{ sv: 'ha det bra', de: 'alles Gute' }] }),
        line({ decoding: [{ sv: 'ha det bra', de: 'machs gut' }] }),
      ]),
    ).toHaveLength(0);
  });
});

describe('D — Bedeutungsdrift', () => {
  it('deckungsgleiche Sätze tauchen nicht in der Verdachtsliste auf', () => {
    expect(
      findDrift([
        line({ sv: 'jag heter', de: 'ich heiße', decoding: [{ sv: 'jag', de: 'ich' }, { sv: 'heter', de: 'heiße' }] }),
      ]),
    ).toHaveLength(0);
  });

  it('meldet, wenn der wörtliche Rückbau die Bedeutung nicht deckt', () => {
    const d = findDrift([
      line({
        sv: 'smaklig måltid',
        de: 'guten Appetit',
        decoding: [{ sv: 'smaklig måltid', de: 'schmackhaft Mahlzeit' }],
      }),
    ]);
    expect(d).toHaveLength(1);
    expect(d[0].score).toBe(0);
  });

  it('zählt Beugungsformen als Treffer (kein Fehlalarm)', () => {
    // „helfen" vs. „hilf" wäre ein Fehlalarm; gemeinsamer Stamm zählt.
    const d = findDrift([
      line({ sv: 'hjälp mig', de: 'helfe mir', decoding: [{ sv: 'hjälp', de: 'helfen' }, { sv: 'mig', de: 'mir' }] }),
    ]);
    expect(d).toHaveLength(0);
  });
});


// Die Trennung „nur Beugung" / „andere Bedeutung" ist der Grund, warum die
// Konfliktliste überhaupt lesbar ist (248 Zeilen → 84). Wenn sie zu großzügig
// wird, verschwinden echte Fehler still — deshalb diese Tests.
describe('Beugung von Bedeutung trennen', () => {
  it('erkennt deutsche Beugung als dieselbe Bedeutung', () => {
    expect(nurBeugung('ist', 'bin')).toBe(true); // unregelmäßig, per Familie
    expect(nurBeugung('hältst', 'halte')).toBe(true); // Umlaut gefaltet
    expect(nurBeugung('der Bon', 'den Bon')).toBe(true); // Artikel ignoriert
    expect(nurBeugung('gehe', 'gehen')).toBe(true); // gemeinsamer Stamm
    // Der Fehler im Klassifikator selbst: die Familienlisten standen
    // ungefaltet da, „konnen" traf „können" nie — und `kan` landete
    // fälschlich in der Prüfliste.
    expect(nurBeugung('kann', 'können')).toBe(true);
    expect(nurBeugung('muss', 'müssen')).toBe(true);
    expect(nurBeugung('ha', 'haben')).toBe(true);
  });

  it('lässt wirklich verschiedene Bedeutungen stehen', () => {
    expect(nurBeugung('Karte', 'kurz')).toBe(false);
    expect(nurBeugung('wo', 'war')).toBe(false);
    expect(nurBeugung('Tor', 'Ziel')).toBe(false);
    // Der Fall, der den Anstoß gab: „hallo" ist nicht „tschüss".
    expect(nurBeugung('hallo', 'tschüss')).toBe(false);
  });

  it('meldet ein Wort erst, wenn sich ZWEI Glossen wirklich unterscheiden', () => {
    const beugung = { sv: 'är', glosses: [{ de: 'ist', where: 'a' }, { de: 'bin', where: 'b' }] };
    const bedeutung = { sv: 'kort', glosses: [{ de: 'Karte', where: 'a' }, { de: 'kurz', where: 'b' }] };
    expect(istBedeutungsKonflikt(beugung)).toBe(false);
    expect(istBedeutungsKonflikt(bedeutung)).toBe(true);
  });
});
