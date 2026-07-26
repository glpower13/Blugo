// Der Hinweis, wenn dem Gerät die schwedische Stimme fehlt.
//
// WARUM ES IHN BRAUCHT: Seit die App ihr Versprechen hält und ohne schwedische
// Stimme schweigt (`tts.ts`), passiert beim Tippen auf „Hören" nichts. Ein Knopf,
// der stumm bleibt, ist schlechter als einer, der sagt warum — der Lerner sucht
// den Fehler sonst bei sich oder hält die App für kaputt.
//
// Der Hinweis erscheint NUR, wenn das Gerät seine Stimmen gemeldet hat und keine
// davon schwedisch ist. Solange die Liste leer ist, heißt das „noch nicht
// geladen" und nicht „keine da" — dann bleibt hier alles still.

import { useEffect, useState } from 'react';
import { onVoicesChanged, swedishVoiceMissing } from '../modules/comprehension/tts';

/** Hat das Gerät nachweislich keine schwedische Stimme? Aktualisiert sich. */
export function useSwedishVoiceMissing(): boolean {
  const [fehlt, setFehlt] = useState(swedishVoiceMissing);
  useEffect(() => {
    const pruefen = () => setFehlt(swedishVoiceMissing());
    const ab = onVoicesChanged(pruefen);
    // Manche Umgebungen reichen die Liste ohne Ereignis nach.
    const t = setTimeout(pruefen, 600);
    return () => {
      ab();
      clearTimeout(t);
    };
  }, []);
  return fehlt;
}

export function VoiceMissingHint({ className = '' }: { className?: string }) {
  const fehlt = useSwedishVoiceMissing();
  if (!fehlt) return null;
  return (
    <p className={`text-[0.7rem] leading-relaxed text-warn ${className}`}>
      Dein Gerät hat keine schwedische Stimme — deshalb bleibt das Vorlesen still.
      Mit einer fremden Stimme würdest du eine Aussprache üben, die es nicht gibt.
      In den Einstellungen deines Geräts lässt sich eine schwedische Stimme
      nachinstallieren.
    </p>
  );
}
