import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const LOCAL_IP = '172.16.19.20'  // sesuaikan dengan IP laptop kamu

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,       // WAJIB supaya bisa diakses dari network
    port: 5173,
    proxy: {
      '/api': {
        target: `http://${LOCAL_IP}:4000`,
        changeOrigin: true,
      },
    },
  },
})
