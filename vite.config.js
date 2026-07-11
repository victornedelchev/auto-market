import { defineConfig } from 'vite';

export default defineConfig({
  esbuild: {
    drop: ['console', 'debugger'],
  },
  build: {
    outDir: 'dist',
    minify: 'esbuild',
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('@supabase')) {
              return 'supabase';
            }
            if (id.includes('jspdf')) {
              return 'jspdf';
            }
            return 'vendor'; // all other vendor modules
          }
        },
      },
    },
  },
});
