import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/health': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  build: {
    commonjsOptions: {
      include: [/@orah\/shared/, /node_modules/],
    },
  },
  optimizeDeps: {
    include: ['@orah/shared'],
  },
})

