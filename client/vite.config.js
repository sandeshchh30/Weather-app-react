import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/Weather-app-react',
  plugins: [react()],
  server: {
    proxy: {
      // Proxy all requests to /api to the Flask backend
      '/predict': {
        target: 'http://localhost:5000', // Your Flask backend URL
        changeOrigin: true, // Ensures the correct origin is used
        secure: false, // Set to false if your Flask server is not using HTTPS
      },
    },
  },
})
