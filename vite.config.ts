import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/lib': path.resolve(__dirname, './src/lib'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/utils': path.resolve(__dirname, './src/lib/utils'),
      '@/types': path.resolve(__dirname, './src/lib/types'),
      '@/hooks': path.resolve(__dirname, './src/lib/hooks'),
      '@/services': path.resolve(__dirname, './src/lib/services'),
      '@/config': path.resolve(__dirname, './src/lib/config')
    }
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'ai-services': ['@google/generative-ai'],
          'database': ['@supabase/supabase-js']
        }
      }
    }
  },
  server: {
    watch: {
      usePolling: true
    }
  }
});