import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Мой React работает тут
    proxy: {
      '/api': {
        target: 'http://localhost:8000', // Адрес, где будет работать Django
        changeOrigin: true,
      }
    }
  }
})