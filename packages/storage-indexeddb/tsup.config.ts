import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  // ESM only. Node 22.12+ can require() ESM, so CommonJS consumers are still served, and a
  // single copy avoids the dual-package hazard: with two copies loaded, `instanceof` checks
  // against the exported error classes would fail across them.
  format: ['esm'],
  // tsup's declaration build injects `baseUrl`, which TypeScript 6 deprecates. Scoped here so the
  // project's own tsconfig stays free of deprecated options.
  dts: { compilerOptions: { ignoreDeprecations: '6.0' } },
  sourcemap: true,
  clean: true,
  target: 'node22',
});
