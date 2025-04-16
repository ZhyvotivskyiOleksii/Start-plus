import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import cp from 'vite-plugin-cp';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    cp({
      targets: [
        { src: 'server', dest: 'dist/server' }, // Копіюємо папку server у dist/server
        { src: '.env', dest: 'dist' } // Копіюємо файл .env у dist
      ]
    })
  ]
});