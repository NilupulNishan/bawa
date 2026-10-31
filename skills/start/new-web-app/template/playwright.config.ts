import { defineConfig, devices } from "@playwright/test";

// Self-test and snapshots run against the production build (vite preview),
// not the dev server, so they see what people will get. LIVE_URL runs them
// against a deployed copy instead (deploy skill).
const live = process.env.LIVE_URL;

export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  reporter: [["list"]],
  use: {
    baseURL: live ?? "http://localhost:4173",
    viewport: { width: 1280, height: 800 },
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 800 } } }],
  webServer: live
    ? undefined
    : {
        command: "npm run build && npm run preview",
        url: "http://localhost:4173",
        reuseExistingServer: false,
        timeout: 120_000,
      },
});
