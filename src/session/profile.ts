// Lerner-Profil: der VORNAME des Lerners (Nutzerwunsch 2026-07-24). Rein lokal,
// bleibt auf dem Gerät. Zweck ist NICHT Belohnung, sondern personalisierter,
// persönlich relevanter Input — der wird nachweislich besser behalten
// (Selbstbezugs-Effekt, Evidenz: stark). Damit bleibt die eine Design-Regel gewahrt.

const KEY = 'neurolang.name.v1';
const MAX = 24;

// localStorage mit In-Memory-Fallback (privater Modus / Node-Tests).
const mem: Record<string, string> = {};
const backend: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'> = (() => {
  try {
    const t = '__nl_name_test__';
    window.localStorage.setItem(t, '1');
    window.localStorage.removeItem(t);
    return window.localStorage;
  } catch {
    return {
      getItem: (k: string) => (k in mem ? mem[k] : null),
      setItem: (k: string, v: string) => {
        mem[k] = v;
      },
      removeItem: (k: string) => {
        delete mem[k];
      },
    };
  }
})();

/** Kürzt/säubert eine Namenseingabe (rein): getrimmt, einzeilig, begrenzt. */
export function cleanName(raw: string): string {
  return raw.replace(/\s+/g, ' ').trim().slice(0, MAX);
}

/** Der gespeicherte Vorname, oder '' wenn keiner gesetzt ist. */
export function loadName(): string {
  try {
    return cleanName(backend.getItem(KEY) ?? '');
  } catch {
    return '';
  }
}

/** Speichert den Vornamen; leer = löschen. */
export function saveName(name: string): void {
  const n = cleanName(name);
  try {
    if (n) backend.setItem(KEY, n);
    else backend.removeItem(KEY);
  } catch {
    /* Speicher voll o. Ä. — bewusst ignoriert */
  }
}

/**
 * Ersetzt den Platzhalter „{name}" (rein). Mit Namen → eingesetzt; ohne Namen
 * wird der Platzhalter samt vorangehendem Leerzeichen sauber entfernt, sodass der
 * Satz natürlich bleibt: „Hej {name}, välkommen!" → „Hej, välkommen!".
 */
export function fillName(text: string, name: string): string {
  if (name) return text.replace(/\{name\}/g, name);
  return text
    .replace(/\s*\{name\}/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}
