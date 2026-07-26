// Der Vorrat in den Einstellungen: einschalten, nachsehen, wegwerfen.
//
// WARUM ES DIESEN ABSCHNITT ÜBERHAUPT GIBT: Der Vorrat ist die einzige Stelle
// der App, an der Geld ohne Klick ausgegeben wird. Ein Schalter allein wäre zu
// wenig — wer nicht sehen kann, was passiert ist, kann auch nicht beurteilen,
// ob er es weiter will. Deshalb steht hier die echte Zahl aus der Ablage, nicht
// eine Schätzung, und daneben der Knopf, der sie auf null setzt.

import { useCallback, useEffect, useState } from 'react';
import { vorratAnzahl, vorratLeeren } from '../../storage/db';
import { NACHSCHUB_PRO_SITZUNG, VORRAT_MAX } from './vorrat';
import type { Preferences } from '../../session/preferences';

export function VorratSettings({
  prefs,
  onPrefs,
  cloudAktiv,
}: {
  prefs: Preferences;
  onPrefs: (p: Preferences) => void;
  cloudAktiv: boolean;
}) {
  const [anzahl, setAnzahl] = useState<number | null>(null);

  const zaehlen = useCallback(() => {
    vorratAnzahl()
      .then(setAnzahl)
      .catch(() => setAnzahl(null));
  }, []);

  useEffect(zaehlen, [zaehlen]);

  return (
    <div className="mt-4 border-t border-line pt-4">
      <p className="text-sm font-medium text-paper">Sätze auf Vorrat schreiben</p>
      <p className="mt-1 text-xs leading-relaxed text-muted">
        Normalerweise schreibt die KI erst, wenn du „Neuer Kontext" drückst — du wartest
        ein paar Sekunden. Mit Vorrat schreibt sie schon während der Sitzung für die
        Wendungen, die gleich kommen. Dann ist der Satz sofort da.
      </p>
      <p className="mt-2 text-xs leading-relaxed text-warn">
        Ehrlich dazu: Das kostet Geld auf deinem eigenen Zugang, <em>ohne</em> dass du
        dafür klickst. Höchstens {VORRAT_MAX} Sätze liegen gleichzeitig bereit, und je
        Sitzung kommen höchstens {NACHSCHUB_PRO_SITZUNG} dazu.
      </p>

      {!cloudAktiv ? (
        <p className="mt-3 text-xs text-faint">
          Dafür brauchst du oben einen eigenen Cloud-Zugang. Ohne ihn gibt es nichts
          vorzuschreiben.
        </p>
      ) : (
        <>
          <label className="mt-3 flex items-center gap-3">
            <input
              type="checkbox"
              aria-label="Sätze auf Vorrat schreiben"
              checked={prefs.vorratAn}
              onChange={(e) => onPrefs({ ...prefs, vorratAn: e.target.checked })}
              className="h-5 w-5 accent-brand"
            />
            <span className="text-sm text-paper">
              {prefs.vorratAn ? 'An — die App schreibt vor' : 'Aus — nur auf Klick'}
            </span>
          </label>

          <div className="mt-3 flex items-center gap-3">
            <p className="flex-1 text-xs text-muted">
              {anzahl === null
                ? 'Vorrat: nicht lesbar'
                : anzahl === 0
                  ? 'Vorrat: leer'
                  : `Vorrat: ${anzahl} ${anzahl === 1 ? 'Satz' : 'Sätze'} bereit`}
            </p>
            <button
              onClick={() => void vorratLeeren().then(zaehlen)}
              disabled={!anzahl}
              className="rounded-lg border border-line px-3 py-2 text-xs text-paper disabled:opacity-40"
            >
              Vorrat leeren
            </button>
          </div>
          <p className="mt-2 text-[0.68rem] leading-relaxed text-faint">
            Wegwerfen kostet dich nichts als Wartezeit — im Vorrat steckt kein Lernstand,
            nur vorgeschriebene Sätze. Er wandert deshalb auch nicht in deine Sicherung.
          </p>
        </>
      )}
    </div>
  );
}
