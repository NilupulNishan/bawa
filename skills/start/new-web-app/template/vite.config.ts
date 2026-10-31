import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// base "./" lets the build run from any folder or subpath (GitHub Pages,
// a file share). Routing uses the URL hash, so no server rewrites are needed.
export default defineConfig({
  base: "./",
  plugins: [react()],
  server: { port: 5173 },
  preview: { port: 4173, strictPort: true },
  test: {
    include: ["src/**/*.test.ts"],
  },
});
