import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import cp from 'vite-plugin-cp';

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  const VITE_API_BASE_URL = env.VITE_API_BASE_URL || 'http://127.0.0.1:3001'; 

  return defineConfig({
    plugins: [
      react(),
      cp({
        dot: true,
        verbose: true,
        targets: [
          {
            src: 'sms-auth-php/**', 
            dest: 'dist/sms-auth-php'
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
    server: {
      proxy: {
        '/api': {
          target: VITE_API_BASE_URL,
          changeOrigin: true,
        }
      }
    },
  });
};