// Tests des Fokus-Speichers: Rundlauf, Standard (kein Fokus), Aufheben.

import { afterEach, describe, expect, it } from 'vitest';
import { loadFocus, saveFocus } from './focus';

afterEach(() => saveFocus(null));

describe('focus store', () => {
  it('Standard ist kein Fokus (null)', () => {
    expect(loadFocus()).toBeNull();
  });

  it('speichert und lädt eine Kategorie', () => {
    saveFocus('cat-cafe');
    expect(loadFocus()).toBe('cat-cafe');
  });

  it('null hebt den Fokus wieder auf', () => {
    saveFocus('cat-greet');
    saveFocus(null);
    expect(loadFocus()).toBeNull();
  });
});
