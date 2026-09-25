import { defineConfig, devices } from '@playwright/test';

// End-to-end crash-recovery tests against the built packages (run `pnpm build` first).
export default defineConfig({
  testDir: 'e2e',
  fullyParallel: false,
  workers: 1, // each test drives a whole browser, including crashing it
  retries: 0, // a crash-recovery test that needs retries is not proving anything
  reporter: process.env.CI ? [['list'], ['github']] : 'list',
  timeout: 60_000,
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
