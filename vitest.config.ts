import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        'dist/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/index.ts',
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
    include: ['src/**/*.{test,spec}.{js,ts,tsx}'],
    exclude: ['node_modules/', 'dist/', 'public/'],
    testTimeout: 10000,
    hookTimeout: 10000,
    teardownTimeout: 10000,
    isolate: false,
    threads: false,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@/scenes': resolve(__dirname, './src/scenes'),
      '@/entities': resolve(__dirname, './src/entities'),
      '@/systems': resolve(__dirname, './src/systems'),
      '@/components': resolve(__dirname, './src/components'),
      '@/types': resolve(__dirname, './src/types'),
      '@/utils': resolve(__dirname, './src/utils'),
      '@/config': resolve(__dirname, './src/config'),
      '@/hooks': resolve(__dirname, './src/hooks'),
    },
  },
});
