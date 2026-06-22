import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 3,
  reporter: 'list',
  snapshotPathTemplate: '{testDir}/../screenshots/{testFilePath}/{arg}-{projectName}-{platform}.png',
  expect: {
    toHaveScreenshot: {
      animations: 'disabled',
      maxDiffPixelRatio: 0.05,
    },
  },
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
  },
  projects: [
    {
      name: 'Desktop',
      use: { viewport: { width: 1920, height: 1080 } },
    },
    {
      name: 'Tablet',
      use: { viewport: { width: 1024, height: 768 } },
    },
    {
      name: '1366x768',
      use: { viewport: { width: 1366, height: 768 } },
    },
    {
      name: '1600x900',
      use: { viewport: { width: 1600, height: 900 } },
    },
    {
      name: '2560x1440',
      use: { viewport: { width: 2560, height: 1440 } },
    },
    {
      name: '3840x2160',
      use: { viewport: { width: 3840, height: 2160 } },
    },
  ],
})
