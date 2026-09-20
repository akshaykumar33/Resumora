/**
 * Conventional Commits enforcement.
 * See docs/engineering/COMMIT_GUIDE.md and docs/engineering/GIT_WORKFLOW.md
 */
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // `security` is not in the conventional default set, but Resumora needs it:
    // security fixes must be greppable in history.
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'refactor',
        'perf',
        'test',
        'chore',
        'ci',
        'build',
        'revert',
        'security',
      ],
    ],
    // Scopes track the package graph. Empty scope is allowed for repo-wide changes.
    'scope-enum': [
      2,
      'always',
      [
        'core',
        'protocol',
        'web',
        'react',
        'storage-memory',
        'storage-indexeddb',
        'devtools',
        'reference-app',
        'api',
        'docs',
        'repo',
        'ci',
        'deps',
        'release',
        '',
      ],
    ],
    'subject-case': [2, 'never', ['start-case', 'pascal-case', 'upper-case']],
    'body-max-line-length': [0, 'always'],
  },
};
