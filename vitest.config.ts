import { defineConfig } from 'vitest/config';
import path from 'path';

// Config de tests separada de vite.config.ts: proyecto Vite+React pero los
// tests (api/*.ts, firestore rules) corren en Node, no necesitan el plugin
// de React ni jsdom.
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts', 'api/**/*.test.ts'],
    exclude: ['tests/**'],
  },
});
