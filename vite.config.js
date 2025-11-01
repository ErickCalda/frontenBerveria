import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: ['13fd34198e42.ngrok-free.app'], // Tu subdominio de ngrok actual
    host: true, // Permite acceso externo
    port: 5173, // Asegúrate de que coincida con el que usas
    proxy: {
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
