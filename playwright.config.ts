import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 30000,
  retries: 0,
  workers: 1, // Run sequentially for low memory usage and clean federation loading
  reporter: [["list"]],
  use: {
    baseURL: "https://localhost:5150",
    ignoreHTTPSErrors: true,
    headless: true,
    launchOptions: {
      executablePath: "/usr/bin/chromium-browser",
      args: [
        "--no-sandbox",
        "--disable-gpu",
        "--disable-dev-shm-usage",
        "--disable-setuid-sandbox",
      ],
    },
  },
});
