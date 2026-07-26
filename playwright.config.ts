import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { defineConfig, devices } from '@playwright/test';

/**
 * Wo liegt ein brauchbares Chromium?
 *
 * BEFUND (Prüfkaskade 2026-07-25): `npm run test:e2e` lief in dieser Umgebung
 * nur mit vorangestelltem `PW_EXECUTABLE_PATH=…`. Ohne die Variable suchte
 * Playwright den *headless shell*, den es hier nicht gibt, und ALLE Tests
 * scheiterten mit „Executable doesn't exist" — ein Fehlerbild, das wie ein
 * kaputtes Produkt aussieht und keines ist. §2 C des Prüf-Standards verlangt
 * einen zentralen Lauf, der einfach durchläuft; eine Umgebungsvariable, die man
 * sich merken muss, erfüllt das nicht.
 *
 * Reihenfolge: ausdrückliche Variable → vorinstalliertes Chromium im Sandkasten
 * → nichts (dann entscheidet Playwright selbst, wie in CI nach
 * `playwright install`).
 */
function findChromium(): string | undefined {
  if (process.env.PW_EXECUTABLE_PATH) return process.env.PW_EXECUTABLE_PATH;
  const root = process.env.PLAYWRIGHT_BROWSERS_PATH ?? '/opt/pw-browsers';
  if (!existsSync(root)) return undefined;
  for (const dir of readdirSync(root)) {
    if (!dir.startsWith('chromium-')) continue;
    const bin = join(root, dir, 'chrome-linux', 'chrome');
    if (existsSync(bin)) return bin;
  }
  return undefined;
}

const chromium = findChromium();

// E2E (Stufe B des Test-Standards) gegen die echte Vite-Preview.
// Startet den Preview-Server selbst und räumt ihn wieder ab.
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'on-first-retry',
    // Use a pre-provisioned Chromium if given (avoids re-downloading in
    // sandboxes); CI leaves it unset and runs `playwright install chromium`.
    launchOptions: chromium ? { executablePath: chromium } : {},
  },
  projects: [
    { name: 'mobile-chromium', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: 'npm run build && npm run preview -- --port 4173',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
