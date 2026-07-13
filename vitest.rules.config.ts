import { defineConfig } from 'vitest/config';

// Config separada de vitest.config.ts: estos tests necesitan el emulador de
// Firestore corriendo (via `firebase emulators:exec`), asi que no deben
// correr como parte de `npm test` normal.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/rules/**/*.test.ts'],
  },
});
