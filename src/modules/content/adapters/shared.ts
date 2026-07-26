// Was jeder Cloud-Adapter gleich macht: HTTP-Fehler in klare deutsche Sätze
// übersetzen und die echte Anbieter-Meldung durchreichen.
//
// Vorher stand das im Claude-Adapter. Ein zweiter Anbieter hätte es kopiert —
// und dann hätte ein Nutzer je nach Anbieter unterschiedlich gute Fehlermeldungen
// bekommen, ohne dass das jemand entschieden hätte.

/**
 * Übersetzt HTTP-Fehler in eine klare, nicht-technische Meldung (rein).
 *
 * `detail` ist die ECHTE Fehlermeldung des Anbieters (falls vorhanden) — sie zu
 * zeigen ist der Unterschied zwischen „geht nicht" und „weiß, warum es nicht geht".
 * `schluesselHinweis` ist anbieterabhängig: Bei Claude beginnt der Zugang mit
 * „sk-ant-…", woanders sieht er anders aus. Eine falsche Hilfestellung ist
 * schlimmer als keine.
 */
export function friendlyError(status: number, detail?: string, schluesselHinweis = ''): string {
  const extra = detail && detail.trim() ? ` — ${detail.trim()}` : '';
  if (status === 400) return `Anfrage abgelehnt (400)${extra}.`;
  if (status === 401)
    return `KI-Zugang ungültig (401)${extra}.${schluesselHinweis ? ' ' + schluesselHinweis : ''}`;
  if (status === 403) return `Kein Zugriff mit diesem Schlüssel (403)${extra}.`;
  if (status === 404)
    return (
      `Modell nicht verfügbar (404)${extra}. ` +
      'Tipp: Wähle ein anderes Modell — dein Zugang hat evtl. keinen Zugriff auf dieses.'
    );
  if (status === 429) return `Zu viele Anfragen (429)${extra} — kurz warten und erneut testen.`;
  if (status >= 500)
    return `Der Anbieter hat gerade ein Problem (HTTP ${status})${extra} — später erneut.`;
  return `Anfrage fehlgeschlagen (HTTP ${status})${extra}.`;
}

/** Liest die eigentliche Fehlermeldung aus dem Antwort-Body (rein, tolerant). */
export async function readErrorDetail(res: Response): Promise<string> {
  try {
    const data = (await res.json()) as { error?: { message?: unknown } };
    const msg = data?.error?.message;
    return typeof msg === 'string' ? msg.trim() : '';
  } catch {
    return '';
  }
}

/** Die Meldung, wenn schon die Verbindung nicht zustande kommt. */
export const NETZ_FEHLER =
  'Keine Verbindung zur Cloud-KI (Netzwerk). Prüfe die Internet-Verbindung — ' +
  'ein Ad-/Tracking-Blocker oder ein Firmen-/Schul-Netz kann den Anbieter blockieren.';

/**
 * Ein HTTP-Aufruf mit gebündelter, robuster Fehlerbehandlung. Wirft
 * ausschließlich klare deutsche Meldungen.
 */
export async function callJson(
  url: string,
  headers: Record<string, string>,
  body: string,
  schluesselHinweis = '',
): Promise<unknown> {
  let res: Response;
  try {
    res = await fetch(url, { method: 'POST', headers, body });
  } catch {
    // `fetch` wirft nur bei Netzwerk/CORS — nicht bei HTTP-Fehlern (die sind !res.ok).
    throw new Error(NETZ_FEHLER);
  }
  if (!res.ok) throw new Error(friendlyError(res.status, await readErrorDetail(res), schluesselHinweis));
  return (await res.json()) as unknown;
}
