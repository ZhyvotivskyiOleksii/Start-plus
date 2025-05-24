import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import cp from 'vite-plugin-cp';

export default defineConfig({
  plugins: [
    react(),
    cp({
      targets: [
        {
          src: 'sms-auth-php',
          dest: 'dist/sms-auth-php'
        },
        {
          src: 'sms-auth-php/.env',
          dest: 'dist/sms-auth-php/env'
        }
      ]
    })
  ],
  assetsInclude: ['**/*.ttf'],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          icons: ['react-icons'],
          motion: ['framer-motion'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  }
});