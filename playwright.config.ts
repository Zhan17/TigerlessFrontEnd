import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;

/**
 * End-to-end checks against the production build.
 * Browsers are NOT installed by `npm install`; run
 * `npx playwright install chromium` once before `npm run test:e2e`.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  reporter: "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    ...devices["Desktop Chrome"],
  },
  webServer: {
    command: `npm run build && npm run start -- --port ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
  },
});
