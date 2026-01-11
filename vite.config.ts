import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig(({ mode }) => {
  const isDevelopment = mode === 'development';
  const isProduction = mode === 'production';

  return {
    plugins: [
      react({
        fastRefresh: true,
      }),
      visualizer({
        filename: 'dist/bundle-analysis.html',
        open: true,
        gzipSize: true,
      }),
    ],
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
    build: {
      target: 'es2020',
      minify: 'esbuild',
      sourcemap: isDevelopment,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'zustand'],
            phaser: ['phaser'],
            audio: ['howler'],
            game: [
              './src/scenes/GameScene.ts',
              './src/entities/',
              './src/systems/TowerSystem.ts',
            ],
          },
          chunkFileNames: isProduction
            ? 'assets/js/[name]-[hash].js'
            : 'assets/js/[name].js',
          entryFileNames: isProduction
            ? 'assets/js/[name]-[hash].js'
            : 'assets/js/[name].js',
          assetFileNames: isProduction
            ? 'assets/[ext]/[name]-[hash].[ext]'
            : 'assets/[ext]/[name].[ext]',
        },
      },
      chunkSizeWarningLimit: 1000,
      cssCodeSplit: true,
    },
    optimizeDeps: {
      include: ['phaser', 'react', 'react-dom', 'zustand', 'howler'],
      force: true,
    },
    server: {
      port: 3000,
      open: true,
      hmr: {
        overlay: true,
      },
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cross-Origin-Embedder-Policy': 'require-corp',
        'Cross-Origin-Opener-Policy': 'same-origin',
      },
    },
    define: {
      __DEV__: isDevelopment,
      __PROD__: isProduction,
    },
    preview: {
      port: 4173,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    },
    css: {
      devSourcemap: isDevelopment,
    },
  };
});
