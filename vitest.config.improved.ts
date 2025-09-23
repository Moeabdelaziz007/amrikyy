import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: [
      'node_modules',
      'dist',
      '.idea',
      '.git',
      '.cache',
      'test/e2e/**/*',
      'server/**/*',
      'auraos-automation/**/*',
      'auraos-dev-1/**/*',
      'auraos-mcp/**/*',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'test/',
        'dist/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/coverage/**',
        'server/**/*',
        'auraos-automation/**/*',
        'auraos-dev-1/**/*',
        'auraos-mcp/**/*',
      ],
      thresholds: {
        global: {
          branches: 70,
          functions: 70,
          lines: 70,
          statements: 70,
        },
      },
    },
    testTimeout: 10000,
    hookTimeout: 10000,
    teardownTimeout: 10000,
  },
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'client/src'),
      '@shared': path.resolve(import.meta.dirname, 'shared'),
      '@assets': path.resolve(import.meta.dirname, 'attached_assets'),
    },
  },
  define: {
    'import.meta.env.VITE_FIREBASE_API_KEY': JSON.stringify('test-api-key'),
    'import.meta.env.VITE_FIREBASE_AUTH_DOMAIN': JSON.stringify(
      'test-project.firebaseapp.com'
    ),
    'import.meta.env.VITE_FIREBASE_PROJECT_ID':
      JSON.stringify('test-project-id'),
    'import.meta.env.VITE_FIREBASE_STORAGE_BUCKET': JSON.stringify(
      'test-project.appspot.com'
    ),
    'import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID':
      JSON.stringify('123456789'),
    'import.meta.env.VITE_FIREBASE_APP_ID': JSON.stringify('test-app-id'),
  },
});
