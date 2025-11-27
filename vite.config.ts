import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ⚠ Sem path, sem loadEnv, sem process.env
// Vercel injeta as variáveis automaticamente no build.

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    }
  },
  build: {
    outDir: 'dist'
  }
})
