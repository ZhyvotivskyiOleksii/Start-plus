import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import cp from 'vite-plugin-cp';

export default defineConfig({
  plugins: [
    react(),
    cp({
      dot: true,
      verbose: true,
      targets: [
        {
          src: 'sms-auth-php',
          dest: 'dist'
        },
        {
          src: 'sms-auth-php/.env',
          dest: 'dist/sms-auth-php'
        },
        {
          src: 'sms-auth-php/.htaccess',
          dest: 'dist/sms-auth-php'
        }
      ]
    })
  ],
});
