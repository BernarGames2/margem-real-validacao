import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

const arquivo = (caminho: string) => fileURLToPath(new URL(caminho, import.meta.url))

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        inicio: arquivo('./index.html'),
        privacidade: arquivo('./privacidade/index.html'),
      },
    },
  },
  test: {
    include: ['tests/unit/**/*.test.ts'],
  },
})
