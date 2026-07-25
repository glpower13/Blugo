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

  useEffect(() => {
    opener.current = document.activeElement as HTMLElement | null;
    const el = box.current;
    if (!el) return;

    // Fokus hinein: erstes Bedienelement, sonst die Fläche selbst.
    const first = el.querySelector<HTMLElement>(FOCUSABLE);
    (first ?? el).focus();

    // Hintergrund stilllegen, damit Vorlese-Programme und Tabulator ihn nicht
    // erreichen. `inert` wird von allen aktuellen Browsern unterstützt; wo nicht,
    // fängt der Fokus-Kreis unten den Rest ab.
    const main = document.querySelector('main');
    const tabs = document.querySelector('nav[aria-label="Hauptbereiche"]');
    const muted = [main, tabs].filter(Boolean) as HTMLElement[];
    for (const m of muted) m.setAttribute('inert', '');

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
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
      for (const m of muted) m.removeAttribute('inert');
      opener.current?.focus?.();
    };
  }, [onClose]);

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
