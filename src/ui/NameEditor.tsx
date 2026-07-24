// Kleines, edles Overlay zum Eintragen des Vornamens (Nutzerwunsch 2026-07-24).
// Bleibt lokal auf dem Gerät; personalisiert Begrüßung & Gespräche.

import { useState } from 'react';
import { cleanName } from '../session/profile';

interface Props {
  initial: string;
  onSave: (name: string) => void;
  onClose: () => void;
}

export function NameEditor({ initial, onSave, onClose }: Props) {
  const [value, setValue] = useState(initial);

  function save() {
    onSave(cleanName(value));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-md">
      <div className="glass rise w-full max-w-sm rounded-2xl p-5">
        <div className="mb-1 flex items-center justify-between">
          <h2 className="text-base font-semibold text-paper">Wie heißt du?</h2>
          <button onClick={onClose} className="text-muted" aria-label="Schließen">
            ✕
          </button>
        </div>
        <p className="mb-4 text-xs text-muted">
          Dein Vorname bleibt auf dem Gerät. Er begrüßt dich und du wirst im Gespräch damit
          angesprochen — sonst nichts.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            save();
          }}
        >
          <label className="flex flex-col gap-1">
            <span className="text-sm text-paper">Dein Vorname</span>
            <input
              autoFocus
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="z. B. Andreas"
              aria-label="Dein Vorname"
              maxLength={24}
              autoComplete="given-name"
              className="rounded-lg border border-line bg-base px-3 py-2 text-paper"
            />
          </label>

          <div className="mt-5 flex gap-2">
            <button
              type="submit"
              className="btn-gold flex-1 rounded-xl px-4 py-2 font-medium text-ink"
            >
              Speichern
            </button>
            {initial && (
              <button
                type="button"
                onClick={() => onSave('')}
                className="rounded-lg border border-line px-4 py-2 text-paper"
              >
                Entfernen
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
