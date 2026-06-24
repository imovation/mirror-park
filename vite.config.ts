import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-echarts': ['echarts', 'echarts-for-react'],
          'vendor-three-core': ['three'],
          'vendor-three-r3f': ['@react-three/fiber', '@react-three/drei', '@react-three/postprocessing'],
          'vendor-react': ['react', 'react-dom', '@tanstack/react-query', 'zustand'],
        },
      },
    },
  },
})
