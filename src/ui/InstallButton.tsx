// "Zum Startbildschirm hinzufügen" — nutzt das beforeinstallprompt-Event
// (Android/Chrome). Auf iOS gibt es das Event nicht; dort per Teilen → "Zum
// Home-Bildschirm". Macht die App autark/installierbar (Nutzerwunsch M1).

import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallButton() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => setInstalled(true);
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  if (installed || !deferred) return null;

  return (
    <button
      onClick={async () => {
        await deferred.prompt();
        await deferred.userChoice;
        setDeferred(null);
      }}
      className="w-full rounded-xl border border-brand/50 bg-brand/10 py-3 text-sm font-medium text-brand"
    >
      📲 NEUROLANG installieren
    </button>
  );
}
