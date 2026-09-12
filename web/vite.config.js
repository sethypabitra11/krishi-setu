import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/ml-api': {
        target: 'https://sih-2026-lx6e.onrender.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ml-api/, ''),
      },
    },
  },
});
