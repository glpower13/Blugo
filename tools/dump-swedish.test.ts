// Die Wortprüfung darf nie wieder an der SCHREIBWEISE einer Inhaltsdatei
// vorbeilaufen (Befund 2026-07-26).
//
// Vorher las sie den Quelltext mit dem Muster `sv: '…'`. Dateien, die ihre
// Wendungen über eine Hilfsfunktion bauen, haben kein `sv:` im Text — ihre
// Sätze wurden nie geprüft, und der Bericht meldete trotzdem „unbelegt 0".
// Diese Tests halten fest, dass wirklich ALLES erfasst wird.

import { describe, expect, it } from 'vitest';
import { sammle } from './dump-swedish';
import { seedChunks, seedSegments } from '../src/modules/content/seedSegments';
import { seedDialogs } from '../src/modules/content/seedDialogs';

describe('gesammelte schwedische Zeichenketten', () => {
  const alle = new Set(sammle().map((e) => e.sv));

  it('enthält jede Wendung', () => {
    const fehlend = seedChunks.filter((c) => !alle.has(c.sv)).map((c) => c.id);
    expect(fehlend).toEqual([]);
  });

  it('enthält jeden Kontext-Satz', () => {
    const fehlend = seedSegments.filter((s) => !alle.has(s.sv)).map((s) => s.id);
    expect(fehlend).toEqual([]);
  });

  it('enthält jede Gesprächszeile', () => {
    const fehlend: string[] = [];
    for (const d of seedDialogs) {
      for (const t of d.turns) if (!alle.has(t.sv)) fehlend.push(`${d.id}/${t.id}`);
    }
    expect(fehlend).toEqual([]);
  });

  it('enthält auch jedes einzelne Wort der Dekodierung', () => {
    // Ein Glossen-Wort, das im Satz nicht getrennt vorkommt, wäre sonst
    // ungeprüft — genau dort standen die Fehler der letzten Runden.
    const fehlend: string[] = [];
    for (const c of seedChunks) {
      for (const g of c.decoding) if (!alle.has(g.sv)) fehlend.push(`${c.id}:${g.sv}`);
    }
    expect(fehlend.slice(0, 10)).toEqual([]);
  });

  it('erfasst deutlich mehr als der alte Quelltext-Griff fand', () => {
    // Sperrklinke: Fällt die Zahl je unter diesen Stand, prüft jemand weniger.
    expect(sammle().length).toBeGreaterThan(14000);
  });
});
