// Der Startpilot muss zwei Dinge sicher können: einen vollständigen Ablauf
// bauen, und Fragen stellen, die man ohne Wissen NICHT lösen kann.

import { describe, expect, it } from 'vitest';
import { ablauf, ablenker, abschluss, BLOCK, frageFuer, OPTIONEN, WANN } from './startpilot';
import { seedChunks } from '../content/seedSegments';

const woerter = seedChunks.filter((c) => c.categoryId === 'cat-first-words');

describe('Startpilot-Ablauf', () => {
  const schritte = ablauf(woerter);

  it('nimmt genau die sechzehn ersten Wörter', () => {
    expect(woerter).toHaveLength(16);
  });

  it('erklärt zu jedem Wort, wann man es sagt', () => {
    for (const c of woerter) {
      expect(WANN[c.id], `kein „wann sagt man das" für ${c.id}`).toBeTruthy();
      expect(WANN[c.id].length).toBeGreaterThan(20);
    }
  });

  it('führt jedes Wort genau einmal vor und fragt es genau einmal ab', () => {
    for (const c of woerter) {
      const begegnet = schritte.filter((s) => s.art === 'begegnen' && s.chunkId === c.id);
      const gefragt = schritte.filter((s) => s.art === 'probe' && s.frage.chunkId === c.id);
      expect(begegnet, `Begegnung für ${c.id}`).toHaveLength(1);
      expect(gefragt, `Probe für ${c.id}`).toHaveLength(1);
    }
  });

  it('legt zwischen Begegnung und Abruf immer andere Wörter', () => {
    // Sonst prüft die Probe das Kurzzeitgedächtnis statt das Behalten.
    for (const c of woerter) {
      const b = schritte.findIndex((s) => s.art === 'begegnen' && s.chunkId === c.id);
      const p = schritte.findIndex((s) => s.art === 'probe' && s.frage.chunkId === c.id);
      expect(p - b, `${c.id} wird zu schnell abgefragt`).toBeGreaterThan(1);
    }
  });

  it('endet mit genau einem Abschluss', () => {
    expect(schritte.filter((s) => s.art === 'ende')).toHaveLength(1);
    expect(schritte[schritte.length - 1].art).toBe('ende');
  });

  it('prüft nach jedem Viererblock', () => {
    const proben = schritte.filter((s) => s.art === 'probe');
    expect(proben).toHaveLength(woerter.length);
    expect(woerter.length % BLOCK).toBe(0);
  });
});

describe('Probe-Fragen', () => {
  it('bietet immer drei verschiedene Möglichkeiten an', () => {
    for (const [i, c] of woerter.entries()) {
      const f = frageFuer(woerter, c, i);
      expect(f.optionen).toHaveLength(OPTIONEN);
      expect(new Set(f.optionen).size, `doppelte Möglichkeit bei ${c.id}`).toBe(OPTIONEN);
    }
  });

  it('enthält immer genau eine richtige Antwort', () => {
    for (const [i, c] of woerter.entries()) {
      const f = frageFuer(woerter, c, i);
      expect(f.optionen.filter((o) => o === f.richtig)).toHaveLength(1);
      expect(f.richtig).toBe(c.sv);
    }
  });

  it('nimmt die Ablenker aus demselben Vorrat', () => {
    // Ein Ablenker, den der Lerner nie gesehen hat, ist als falsch erkennbar,
    // ohne dass er das richtige Wort kennt — die Frage würde nichts messen.
    const vorrat = new Set(woerter.map((c) => c.sv));
    for (const [i, c] of woerter.entries()) {
      for (const o of frageFuer(woerter, c, i).optionen) expect(vorrat.has(o)).toBe(true);
    }
  });

  it('setzt die Lösung nicht immer an dieselbe Stelle', () => {
    const stellen = new Set(
      woerter.map((c, i) => frageFuer(woerter, c, i).optionen.indexOf(c.sv)),
    );
    expect(stellen.size, 'die Lösung stünde immer an derselben Stelle').toBeGreaterThan(1);
  });

  it('ist bei gleichem Stand reproduzierbar', () => {
    const a = frageFuer(woerter, woerter[3], 3);
    const b = frageFuer(woerter, woerter[3], 3);
    expect(a).toEqual(b);
  });

  it('kommt auch mit einem einzigen Wort klar', () => {
    expect(ablenker([woerter[0]], woerter[0], 0)).toEqual([]);
    expect(frageFuer([woerter[0]], woerter[0], 0).optionen).toEqual([woerter[0].sv]);
  });
});

describe('Abschluss', () => {
  it('nennt das Ergebnis, ohne es zu einem Beweis zu erklären', () => {
    const a = abschluss(16, 16);
    expect(a.titel).toMatch(/wiedererkannt/);
    expect(a.text).toMatch(/nicht als Beweis/);
    expect(a.text).not.toMatch(/stabil|bewiesen stabil/);
  });

  it('beschönigt ein schwaches Ergebnis nicht', () => {
    expect(abschluss(9, 16).titel).toContain('9 von 16');
  });
});
