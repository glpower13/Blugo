// Die zähe Wendung. Der wichtigste Test hier ist der erste: Er baut die alte
// Falle nach und zeigt, dass sie zu ist.

import { describe, expect, it } from 'vitest';
import type { ChunkState, ReviewResult } from '../domain/chunk';
import { initialState, schedule } from '../modules/memory/memoryEngine';
import {
  darfNochmal,
  fehlschlaegeAmStueck,
  istZaeh,
  mindestAbstandTage,
  NACHHOLUNGEN,
  ZAEH_AB,
} from './zaeh';

const TAG = 86_400_000;
const T0 = Date.UTC(2026, 0, 1);

const mitVerlauf = (ergebnisse: ReviewResult[]): ChunkState => ({
  ...initialState('c'),
  history: ergebnisse.map((result, i) => ({ at: T0 + i * TAG, result, segmentId: 's' })),
});

describe('Die Falle: eine Sitzung, die nie endet', () => {
  it('endet jetzt, auch wenn der Lerner die Wendung nie hinbekommt', () => {
    // NACHBAU DES ALTEN VERHALTENS: Warteschlange und Position wuchsen bei
    // jedem „Nochmal" gleichzeitig um eins — der Abstand blieb konstant, und
    // „Sitzung erledigt." konnte nie erscheinen.
    let queue = ['a', 'b'];
    let pos = 0;
    let schritte = 0;
    while (pos < queue.length) {
      schritte++;
      // Der Lerner scheitert IMMER an 'a' — der Fall, um den es geht.
      if (queue[pos] === 'a' && darfNochmal(queue, 'a')) queue = [...queue, 'a'];
      pos++;
      // Reißleine: Ohne den Deckel liefe das hier bis zum Zeitlimit.
      if (schritte > 50) break;
    }
    expect(pos).toBeGreaterThanOrEqual(queue.length); // Sitzung ist WIRKLICH zu Ende
    expect(schritte).toBeLessThan(10);
  });

  it('gibt genau NACHHOLUNGEN zweite Chancen — nicht null, nicht endlos', () => {
    const queue = ['a'];
    expect(darfNochmal(queue, 'a')).toBe(true); // 1. Nachholung erlaubt
    expect(darfNochmal([...queue, 'a'], 'a')).toBe(true); // 2. auch
    expect(darfNochmal([...queue, 'a', 'a'], 'a')).toBe(false); // danach Schluss
    expect(NACHHOLUNGEN).toBe(2);
  });

  it('lässt andere Wendungen davon unberührt', () => {
    expect(darfNochmal(['a', 'a', 'a', 'b'], 'b')).toBe(true);
  });
});

describe('Zäh erkennen', () => {
  it('zählt nur Fehlschläge AM STÜCK', () => {
    expect(fehlschlaegeAmStueck(mitVerlauf(['again', 'good', 'again', 'again']))).toBe(2);
  });

  it('setzt bei einem Erfolg zurück', () => {
    expect(fehlschlaegeAmStueck(mitVerlauf(['again', 'again', 'again', 'good']))).toBe(0);
    expect(istZaeh(mitVerlauf(['again', 'again', 'again', 'again', 'good']))).toBe(false);
  });

  it('gilt erst ab vier hintereinander — drei können ein schlechter Tag sein', () => {
    expect(istZaeh(mitVerlauf(['again', 'again', 'again']))).toBe(false);
    expect(istZaeh(mitVerlauf(Array(ZAEH_AB).fill('again')))).toBe(true);
  });
});

describe('Der Mindestabstand', () => {
  it('greift gar nicht, solange die Wendung nicht zäh ist', () => {
    expect(mindestAbstandTage(mitVerlauf(['again', 'again']))).toBe(0);
  });

  it('wächst mit den Fehlschlägen und ist gedeckelt', () => {
    const nach = (n: number) => mindestAbstandTage(mitVerlauf(Array(n).fill('again')));
    expect(nach(4)).toBe(1);
    expect(nach(5)).toBe(2);
    expect(nach(6)).toBe(4);
    expect(nach(7)).toBe(8);
    expect(nach(12)).toBe(14); // Deckel: nie mehr als zwei Wochen beiseite
  });
});

describe('Die Engine setzt den Abstand wirklich', () => {
  it('legt eine viermal durchgefallene Wendung nicht mehr für heute vor', () => {
    let s = initialState('zaeh', T0);
    let t = T0;
    for (let i = 0; i < 4; i++) {
      s = schedule(s, 'again', 'seg', t, { retention: 0.9 });
      t += 60_000; // der Lerner probiert es gleich noch mal
    }
    // Vorher: dueAt === now, also sofort wieder fällig — jeden Tag, für immer.
    expect(s.dueAt).toBeGreaterThan(t);
  });

  it('lässt den ERSTEN Fehlschlag sofort zurückkommen — da hilft der zweite Anlauf', () => {
    const s = schedule(initialState('a', T0), 'again', 'seg', T0, { retention: 0.9 });
    expect(s.dueAt).toBe(T0);
  });

  it('nimmt den Abstand nach einem Erfolg sofort wieder weg', () => {
    let s = initialState('a', T0);
    let t = T0;
    for (let i = 0; i < 5; i++) {
      s = schedule(s, 'again', 'seg', t, { retention: 0.9 });
      t += TAG;
    }
    const nachErfolg = schedule(s, 'good', 'seg', t, { retention: 0.9 });
    // Der Erfolg setzt die Kette zurück; ab jetzt plant wieder FSRS allein.
    expect(fehlschlaegeAmStueck(nachErfolg)).toBe(0);
    expect(mindestAbstandTage(nachErfolg)).toBe(0);
  });
});
