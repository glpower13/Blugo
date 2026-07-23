// Learner's theme focus: which category NEW chunks are preferably drawn from
// (autonomy, docs/06-motivation.md). Stored locally. This biases only the
// INTAKE of new material — due maintenance is never biased, because forgetting
// waits for no one (buildQueue.ts). `null` = no focus (default order).

const KEY = 'neurolang.focus.v1';

// localStorage with in-memory fallback (private mode / Node tests).
const mem: Record<string, string> = {};
const backend: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'> = (() => {
  try {
    const t = '__nl_focus_test__';
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

/** The category id new material is focused on, or null for none. */
export function loadFocus(): string | null {
  try {
    const raw = backend.getItem(KEY);
    return raw && raw.length > 0 ? raw : null;
  } catch {
    return null;
  }
}

/** Persist the focus; passing null clears it. */
export function saveFocus(categoryId: string | null): void {
  try {
    if (categoryId) backend.setItem(KEY, categoryId);
    else backend.removeItem(KEY);
  } catch {
    /* storage full o. Ä. — bewusst ignoriert */
  }
}
