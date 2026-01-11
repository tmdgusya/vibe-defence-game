import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('phaser')) return 'phaser-vendor';
            if (id.includes('react')) return 'react-vendor';
            if (id.includes('howler')) return 'audio-vendor';
            return 'vendor';
          }

          if (id.includes('/src/scenes/')) return 'scenes';
          if (id.includes('/src/entities/')) return 'entities';
          if (id.includes('/src/systems/')) return 'systems';
          if (id.includes('/src/components/')) return 'components';
        },
      },
    },
  },
});
