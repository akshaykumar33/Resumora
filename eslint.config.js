import { existsSync, readdirSync } from 'node:fs';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';

// Browser and Node globals that must never appear in @resumora/core (invariant 3 in AGENTS.md).
// The type-check already fails on them because core compiles without DOM or Node types; this
// rule gives the reason in the error and also catches `globalThis.<name>` access.
const HOST_GLOBALS = [
  'window',
  'document',
  'navigator',
  'location',
  'localStorage',
  'sessionStorage',
  'indexedDB',
  'caches',
  'process',
  'Buffer',
  'require',
];
const HOST_GLOBAL_MESSAGE =
  'core must stay platform-independent: no browser or Node APIs. Put platform code in an adapter or @resumora/web.';

// Type-aware linting covers every package that has its own tsconfig. Placeholder packages join
// automatically once they are built.
const TYPED_PACKAGES = readdirSync('packages').filter((name) =>
  existsSync(`packages/${name}/tsconfig.json`),
);

export default tseslint.config(
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      'coverage/**',
      'scripts/autopilot/**',
      '.codegraph/**',
      'apps/**',
      '**/.next/**',
      '**/.source/**',
      '**/out/**',
      // Placeholder packages without a tsconfig are not built yet (see TYPED_PACKAGES).
      ...readdirSync('packages')
        .filter((name) => !existsSync(`packages/${name}/tsconfig.json`))
        .map((name) => `packages/${name}/**`),
    ],
  },
  js.configs.recommended,
  {
    files: TYPED_PACKAGES.map((name) => `packages/${name}/src/**/*.ts`),
    extends: [tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
    },
  },
  {
    files: ['packages/core/src/**/*.ts'],
    rules: {
      'no-restricted-globals': [
        'error',
        ...HOST_GLOBALS.map((name) => ({ name, message: HOST_GLOBAL_MESSAGE })),
      ],
      'no-restricted-properties': [
        'error',
        ...HOST_GLOBALS.map((property) => ({
          object: 'globalThis',
          property,
          message: HOST_GLOBAL_MESSAGE,
        })),
      ],
    },
  },
  {
    files: ['**/*.{js,mjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
        setTimeout: 'readonly',
        TextEncoder: 'readonly',
        TextDecoder: 'readonly',
        URL: 'readonly',
      },
    },
  },
  {
    // Spike and end-to-end scripts evaluate code inside the page.
    files: ['spikes/**/*.mjs', 'e2e/**/*.js'],
    languageOptions: { globals: { window: 'readonly', indexedDB: 'readonly' } },
  },
);
