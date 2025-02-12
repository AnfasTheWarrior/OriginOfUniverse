import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import glsl from 'vite-plugin-glsl';

export default defineConfig({
  plugins: [react(), glsl()],
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === 'EVAL') return; // Suppress eval warnings
        warn(warning);
      },
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'], // Group vendor libraries
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});

