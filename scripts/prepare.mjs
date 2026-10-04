#!/usr/bin/env node
/**
 * Installs git hooks locally, but skips in CI / CD environments (Vercel, GitHub Actions, etc.)
 * or when .git directory is not present.
 */

import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';

if (process.env.CI || process.env.VERCEL || !existsSync('.git')) {
  process.exit(0);
}

try {
  execSync('pnpm exec lefthook install', { stdio: 'inherit' });
} catch {
  // Gracefully degrade if hooks cannot be installed
  process.exit(0);
}
