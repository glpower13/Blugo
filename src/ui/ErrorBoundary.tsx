// Fehler-Fang: fängt Render-Fehler ab und zeigt eine freundliche Karte mit
// „Neu laden" statt einer weißen Seite (Stabilität, Nutzerwunsch 2026-07-24).
// Bewusst schlicht (keine externen Abhängigkeiten); im Glas-Look der App.

import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}
interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // Nie still scheitern (docs/TEST-UND-PRUEF-STANDARD.md §3.1).
    console.error('UI error boundary caught', error, info);
  }

  render(): ReactNode {
    if (!this.state.hasError) return this.props.children;
    return (
      <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center gap-4 px-6 text-center">
        <div className="glass rounded-2xl p-6">
          <p className="font-display text-xl font-semibold text-paper">Etwas ist schiefgelaufen.</p>
          <p className="mt-2 text-sm text-muted">
            Kein Datenverlust — dein Fortschritt ist lokal gespeichert. Bitte lade die App neu.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="btn-gold mt-4 rounded-xl px-5 py-2.5 font-medium text-ink"
          >
            Neu laden
          </button>
        </div>
      </main>
    );
  }
}
