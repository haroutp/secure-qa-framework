import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Where your tests live
  testDir: './e2e/tests',

  // Run tests in parallel
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry failed tests (0 locally, 2 on CI)
  retries: process.env.CI ? 2 : 0,

  // Reporter - show each test result
  reporter: 'html',

  // Shared settings for all tests
  use: {
    // Base URL for all tests - no need to repeat in every test
    baseURL: 'https://www.saucedemo.com',

    // Capture screenshot on failure
    screenshot: 'only-on-failure',

    // Record trace on first retry (helps debug flaky tests)
    trace: 'on-first-retry',

    // Slow down actions by 100ms so you can see what's happening (remove for CI)
    // slowMo: 100,

    // data-testid modification
    testIdAttribute: 'data-test'
  },

  // Which browsers to test in
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Uncomment to add more browsers later:
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
  ],
});