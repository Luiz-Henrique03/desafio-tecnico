import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const backendUrl = process.env.VITE_API_TARGET || 'http://localhost:8080';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    proxy: {
      '/auth': {
        target: backendUrl,
        changeOrigin: true,
        secure: false,
      },
      '/clients': {
        target: backendUrl,
        changeOrigin: true,
        secure: false,
      }
    }
  }
})