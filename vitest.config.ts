import { defineConfig } from 'vitest/config';

// Unit tests only. The Playwright E2E (e2e/*.spec.ts) has its own runner
// (playwright.config.ts) — keep the two from picking up each other's files.
export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
  },
});
