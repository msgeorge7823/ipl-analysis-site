import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    watch: {
      usePolling: true,
      interval: 1000,
      ignored: [
        '**/node_modules/**',
        '**/dist/**',
        '**/.git/**',
        '**/public/data/**',
        '**/public/teams/**',
        '**/public/photos/**',
        '**/raw-data/**',
        '**/data-docs/**',
        '**/root-files/**',
        '**/scripts/**',
      ],
    },
  },
})
