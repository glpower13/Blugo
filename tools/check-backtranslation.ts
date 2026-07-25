// CLI für Stufe 2 der Prüfkette — die Logik steht in `backtranslation.ts`
// (dort auch die Erklärung, was der Bericht beweist und was nicht).
//
// Eigene Datei, weil `vite-node` kein verlässliches „bin ich das Hauptmodul?"
// kennt: process.argv[1] zeigt auf den Runner, nicht auf das Skript.

import { main } from './backtranslation';

process.exitCode = main();
