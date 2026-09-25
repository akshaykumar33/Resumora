import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  // tsup's declaration build injects `baseUrl`, which TypeScript 6 deprecates. Scoped here so the
  // project's own tsconfig stays free of deprecated options.
  dts: { compilerOptions: { ignoreDeprecations: '6.0' } },
  sourcemap: true,
  clean: true,
  target: 'es2022',
});
