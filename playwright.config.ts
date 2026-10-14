import { defineConfig, devices } from '@playwright/test'

// Endereço falso: os testes interceptam as chamadas ao Supabase e nada sai da máquina.
export const SUPABASE_TESTE = 'https://teste.supabase.local'

// Para usar um Chromium já instalado (ex.: /opt/pw-browsers/chromium), defina PW_CHROMIUM_PATH.
const chromiumLocal = process.env.PW_CHROMIUM_PATH

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'retain-on-failure',
    launchOptions: chromiumLocal ? { executablePath: chromiumLocal } : {},
  },
  projects: [
    { name: 'celular', use: { ...devices['Pixel 7'] } },
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: 'npm run build && npm run preview',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    env: {
      VITE_SUPABASE_URL: SUPABASE_TESTE,
      VITE_SUPABASE_ANON_KEY: 'sb_publishable_chave_de_teste',
    },
  },
})
