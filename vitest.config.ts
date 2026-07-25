import { defineConfig } from 'vitest/config';

// Unit tests only. The Playwright E2E (e2e/*.spec.ts) has its own runner
// (playwright.config.ts) — keep the two from picking up each other's files.
export default defineConfig({
  test: {
    // tools/ = Prüfwerkzeuge für den Inhalt (docs/gremium-content-pruefung.md);
    // ihre harten Regeln sollen in derselben Kaskade laufen wie der App-Code.
    include: ['src/**/*.test.ts', 'tools/**/*.test.ts'],
  },
});
