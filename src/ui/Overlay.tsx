// Eine Überlagerung, die sich für Tastatur und Vorlese-Programm richtig verhält
// (Barrierefreiheits-Audit 2026-07-25).
//
// BEFUND: Die Einstellungen waren nur ein `<div class="fixed inset-0">`. Gemessen
// mit 42-mal Tabulator landeten 15 Sprünge HINTER der Fläche — der Fokusring war
// unsichtbar, aber die Eingabetaste startete trotzdem eine Lern-Sitzung unter dem
// offenen Fenster. Escape schloss nirgends etwas, das Dokument hatte zwei `h1`,
// und nach dem Schließen war der Fokus weg.
//
// WAS DIESER BAUSTEIN LEISTET:
//   · `role="dialog" aria-modal="true"` samt Beschriftung über die Überschrift
//   · Escape schließt
//   · Fokus wandert beim Öffnen in die Fläche und beim Schließen zurück auf den
//     Knopf, der sie geöffnet hat
//   · Tabulator läuft im Kreis INNERHALB der Fläche (kein Weg in den Hintergrund)
//   · der Hintergrund wird für Vorlese-Programme stillgelegt (`inert`)
//
// Bewusst KEIN Fremdpaket: Es sind ~60 Zeilen, und eine Abhängigkeit für
// Tastaturverhalten wäre in einer App ohne Backend schwer zu rechtfertigen.

import { useEffect, useRef, type ReactNode } from 'react';

/** Alles, was der Tabulator anspringen kann — in Dokumentreihenfolge. */
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface Props {
  /** id der Überschrift in `children` — wird zum zugänglichen Namen der Fläche. */
  labelledBy: string;
  onClose: () => void;
  /** Äußere Klassen (Positionierung, Hintergrund) — die Fläche selbst bleibt frei. */
  className?: string;
  children: ReactNode;
}

export function Overlay({ labelledBy, onClose, className = '', children }: Props) {
  const box = useRef<HTMLDivElement | null>(null);
  // Wer die Fläche geöffnet hat — dorthin geht der Fokus zurück.
  const opener = useRef<HTMLElement | null>(null);

  /**
   * `onClose` NICHT als Abhängigkeit des Aufbau-Effekts verwenden.
   *
   * BEFUND E-1 (Prüfkaskade 2026-07-25, im Browser reproduziert): Alle drei
   * Aufrufstellen übergeben eine Inline-Funktion (`onClose={() => setX(false)}`).
   * Die hat bei jedem Rendern eine neue Identität. Stand `onClose` in der
   * Abhängigkeitsliste, lief der Aufbau-Effekt bei JEDEM Rendern der Elternfläche
   * erneut — und setzte den Fokus jedes Mal auf das erste Bedienelement zurück.
   *
   * Wirkung: Ein Zeichen ins Namensfeld tippen ließ die Fläche neu rendern, der
   * Fokus sprang auf „Fertig", und von „Andreas" kam ein „A" an. Das Feld war
   * mit Tastatur unbenutzbar.
   *
   * Der Effekt läuft jetzt genau einmal; die jeweils aktuelle Schließen-Funktion
   * kommt über diese Referenz.
   */
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  });

  useEffect(() => {
    const el = box.current;
    if (!el) return;

    // Der Auslöser darf nie ein Element INNERHALB der Fläche sein — sonst zeigt
    // die Rückgabe des Fokus beim Schließen auf einen entfernten Knoten.
    const active = document.activeElement as HTMLElement | null;
    opener.current = active && !el.contains(active) ? active : null;

    // Fokus hinein: erstes Bedienelement, sonst die Fläche selbst.
    const first = el.querySelector<HTMLElement>(FOCUSABLE);
    (first ?? el).focus();

    // Hintergrund stilllegen, damit Vorlese-Programme und Tabulator ihn nicht
    // erreichen. `inert` wird von allen aktuellen Browsern unterstützt; wo nicht,
    // fängt der Fokus-Kreis unten den Rest ab.
    // Gezählt statt gesetzt/gelöscht: Läge je eine Fläche über der anderen,
    // würde die innere beim Schließen `inert` entfernen und den Hintergrund
    // wieder freigeben, obwohl die äußere noch offen ist (Befund E-2, heute
    // nicht erreichbar — die Guard kostet fünf Zeilen und schließt die Lücke).
    const main = document.querySelector('main');
    const tabs = document.querySelector('nav[aria-label="Hauptbereiche"]');
    const muted = [main, tabs].filter(Boolean) as HTMLElement[];
    for (const m of muted) {
      const depth = Number(m.dataset.inertDepth ?? '0') + 1;
      m.dataset.inertDepth = String(depth);
      m.setAttribute('inert', '');
    }

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.stopPropagation();
        closeRef.current();
        return;
      }
      if (e.key !== 'Tab' || !el) return;
      const items = Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (n) => n.offsetParent !== null || n === document.activeElement,
      );
      if (items.length === 0) return;
      const firstItem = items[0];
      const lastItem = items[items.length - 1];
      if (e.shiftKey && document.activeElement === firstItem) {
        e.preventDefault();
        lastItem.focus();
      } else if (!e.shiftKey && document.activeElement === lastItem) {
        e.preventDefault();
        firstItem.focus();
      }
    }

    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      for (const m of muted) {
        const depth = Number(m.dataset.inertDepth ?? '1') - 1;
        if (depth <= 0) {
          delete m.dataset.inertDepth;
          m.removeAttribute('inert');
        } else {
          m.dataset.inertDepth = String(depth);
        }
      }
      // `isConnected` prüfen: Ein entfernter Knoten nimmt den Fokus nicht an,
      // und der Aufruf ginge still ins Leere (kein stiller Verlust, §3.1).
      if (opener.current?.isConnected) opener.current.focus();
    };
    // Bewusst leer: siehe closeRef oben. Der Aufbau darf genau einmal laufen.
  }, []);

  return (
    <div
      ref={box}
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledBy}
      tabIndex={-1}
      className={className}
    >
      {children}
    </div>
  );
}
