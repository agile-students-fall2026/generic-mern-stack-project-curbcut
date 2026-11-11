import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // While developing, send every /api request to the back end on port 3000
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
})
