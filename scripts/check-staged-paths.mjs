#!/usr/bin/env node
/**
 * Blocks forbidden paths from being committed.
 *
 * Layer 2 of the secret-prevention model — see docs/security/PRE_COMMIT_VERIFICATION.md
 *
 * This reads `git diff --cached` directly rather than relying on hook-runner
 * file templating, because a force-added (`git add -f`) file that .gitignore
 * would normally exclude must still be caught here.
 */

import { execFileSync } from 'node:child_process';

/** @type {{ pattern: RegExp, reason: string }[]} */
const FORBIDDEN = [
  {
    pattern: /(^|\/)\.env(\.|$)(?!example$)/,
    reason: 'Environment files may contain live credentials. Only .env.example may be committed.',
  },
  {
    pattern: /\.(pem|key|p12|pfx)$/i,
    reason: 'Private key material must never enter version control.',
  },
  {
    pattern: /(^|\/)id_(rsa|ed25519)(\.pub)?$/,
    reason: 'SSH keys must never enter version control.',
  },
  {
    pattern: /(^|\/)(gcp-service-account.*|.*-credentials)\.json$/i,
    reason: 'Cloud service-account credentials must never enter version control.',
  },
  {
    pattern: /\.(checkpoint|timeline-export)\.json$/,
    reason:
      'Captured runtime state can contain real user work. Scrub and rename before committing.',
  },
  {
    pattern: /(^|\/)fixtures\/.*\.real\.json$/,
    reason: 'Fixtures marked .real.json are presumed to contain real user data.',
  },
];

function stagedFiles() {
  const out = execFileSync('git', ['diff', '--cached', '--name-only', '--diff-filter=ACMR'], {
    encoding: 'utf8',
  });
  return out.split('\n').filter(Boolean);
}

const violations = [];
for (const file of stagedFiles()) {
  for (const { pattern, reason } of FORBIDDEN) {
    if (pattern.test(file)) {
      violations.push({ file, reason });
      break;
    }
  }
}

if (violations.length > 0) {
  console.error('\nBLOCKED — forbidden path(s) staged for commit:\n');
  for (const { file, reason } of violations) {
    console.error(`  ✖ ${file}`);
    console.error(`    ${reason}\n`);
  }
  console.error('See docs/security/PRE_COMMIT_VERIFICATION.md');
  console.error('Unstage with:  git restore --staged <file>\n');
  process.exit(1);
}
