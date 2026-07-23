import { describe, expect, it } from 'vitest';
import { pronunciationTips } from './pronunciation';

const ids = (sv: string) => pronunciationTips(sv).map((t) => t.id);

describe('pronunciationTips — knifflige Laut-Muster', () => {
  it('erkennt den sje-Laut (sj, sk+weich, -tion)', () => {
    expect(ids('sjö')).toContain('sje');
    expect(ids('sked')).toContain('sje'); // sk + e
    expect(ids('station')).toContain('sje'); // -tion
  });

  it('erkennt den tje-Laut (tj, k+weich)', () => {
    expect(ids('tjugo')).toContain('tje');
    expect(ids('köpa')).toContain('tje'); // k + ö
  });

  it('erkennt weiches g, rs und Retroflexe', () => {
    expect(ids('göra')).toContain('g-soft'); // g + ö
    expect(ids('kurs')).toContain('rs');
    expect(ids('bord')).toContain('retroflex'); // r + d
  });

  it('erkennt Vokal-Fallen (o≈u, rundes u, å, y)', () => {
    expect(ids('bok')).toContain('o-u');
    expect(ids('hus')).toContain('u');
    expect(ids('på')).toContain('aa');
    expect(ids('ny')).toContain('y');
  });
});

describe('pronunciationTips — Wort-Reduktionen & Grenzen', () => {
  it('erkennt häufige stumme/reduzierte Wörter', () => {
    expect(ids('jag heter')).toContain('red:jag');
    expect(ids('det är bra')).toContain('red:det');
  });

  it('Reduktionen kommen zuerst', () => {
    expect(pronunciationTips('jag köper')[0].id).toBe('red:jag');
  });

  it('gibt nichts zurück, wenn nichts Kniffliges vorkommt', () => {
    expect(pronunciationTips('hej')).toEqual([]);
  });

  it('begrenzt die Anzahl (kein Überfrachten)', () => {
    const many = pronunciationTips('jag och sjön köper stjärnor på kusten', 5);
    expect(many.length).toBeLessThanOrEqual(5);
  });
});
