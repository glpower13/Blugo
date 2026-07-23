import { defineConfig, devices } from '@playwright/test';

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
    launchOptions: process.env.PW_EXECUTABLE_PATH
      ? { executablePath: process.env.PW_EXECUTABLE_PATH }
      : {},
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
