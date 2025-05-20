import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import cp from 'vite-plugin-cp';

export default defineConfig({
  plugins: [
    react(),
    cp({
      targets: [
        {
          src: 'sms-auth-php', // Копіюємо всю папку sms-auth-php
          dest: 'dist/sms-auth-php'
        },
        {
          src: 'sms-auth-php/.env', // Вихідний файл
          dest: 'dist/sms-auth-php/env' // Копіюємо як env (без крапки)
        }
      ]
    })
  ]
});