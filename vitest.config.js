import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Only the repository's own suites; local tooling (scripts/autopilot) is never collected.
    include: ['tests/**/*.test.js', 'packages/*/src/**/*.test.js'],
    environment: 'node',
  },
});
