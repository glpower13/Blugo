// Tests der Namens-Personalisierung: Säubern, Speichern/Laden, Platzhalter füllen.
// Wichtig: OHNE Namen muss der Satz natürlich bleiben (kein „Hej , välkommen!").

import { afterEach, describe, expect, it } from 'vitest';
import { cleanName, fillName, loadName, saveName } from './profile';

afterEach(() => saveName(''));

describe('cleanName', () => {
  it('trimmt, macht einzeilig und begrenzt die Länge', () => {
    expect(cleanName('  Andreas  ')).toBe('Andreas');
    expect(cleanName('An\n dreas')).toBe('An dreas');
    expect(cleanName('x'.repeat(50)).length).toBe(24);
  });

  it('leer bleibt leer', () => {
    expect(cleanName('   ')).toBe('');
  });
});

describe('save/load — Rundlauf', () => {
  it('speichert und lädt denselben Namen', () => {
    saveName('  Andreas ');
    expect(loadName()).toBe('Andreas');
  });

  it('leerer Name löscht ihn wieder', () => {
    saveName('Andreas');
    saveName('');
    expect(loadName()).toBe('');
  });
});

describe('fillName — der Platzhalter', () => {
  it('setzt den Namen ein', () => {
    expect(fillName('Hej {name}, välkommen!', 'Andreas')).toBe('Hej Andreas, välkommen!');
    expect(fillName('Guten Abend {name}! Willkommen.', 'Andreas')).toBe(
      'Guten Abend Andreas! Willkommen.',
    );
  });

  it('entfernt den Platzhalter sauber, wenn kein Name gesetzt ist', () => {
    // Kein doppeltes Leerzeichen, kein „Hej , …" — der Satz bleibt natürlich.
    expect(fillName('Hej {name}, välkommen!', '')).toBe('Hej, välkommen!');
    expect(fillName('God kväll {name}! Välkommen.', '')).toBe('God kväll! Välkommen.');
    expect(fillName('Ha en trevlig kväll {name}!', '')).toBe('Ha en trevlig kväll!');
  });

  it('lässt Texte ohne Platzhalter unverändert', () => {
    expect(fillName('Ett bord för två?', 'Andreas')).toBe('Ett bord för två?');
    expect(fillName('Ett bord för två?', '')).toBe('Ett bord för två?');
  });

  it('ersetzt mehrere Vorkommen', () => {
    expect(fillName('{name}, hej {name}!', 'Eva')).toBe('Eva, hej Eva!');
  });
});
