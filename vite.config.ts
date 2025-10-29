import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    dts({
      include: ['src/**/*.ts', 'src/**/*.tsx'],
      exclude: ['src/**/*.spec.ts', 'src/**/*.test.ts', 'src/**/*.test.tsx'],
      rollupTypes: true
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },

  build: {
    target: 'node22',
    minify: false,
    lib: {
      entry: {
        main: resolve(__dirname, 'src/config/index.ts'),
        react: resolve(__dirname, 'src/libs/react/index.ts'),
        utils: resolve(__dirname, 'src/utils/index.ts')
      },
      formats: ['es', 'cjs']
    },
    rollupOptions: {
      external: [
        'viem',
        'abitype',
        'bls-eth-wasm',
        'class-validator',
        'dotenv',
        'graphql-request',
        'lodash-es',
        'tslib',
        'zod',
        'fs',
        'path',
        'crypto',
        'url',
        'util',
        'stream',
        'buffer',
        'os'
      ]
    },
    outDir: 'dist'
  },
  optimizeDeps: {
    include: ['src/graphql/graphql.ts']
  }
});
