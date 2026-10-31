// Renders public/icon.svg to the PNG sizes browsers and home screens ask
// for, with the Chromium that Playwright already installed.
// Usage: node tools/make-icons.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { chromium } from "@playwright/test";

const svg = readFileSync("public/icon.svg", "utf8");
const sizes = [
  ["public/icon-192.png", 192],
  ["public/icon-512.png", 512],
  ["public/apple-touch-icon.png", 180],
  ["public/favicon-32.png", 32],
];

const browser = await chromium.launch();
const page = await browser.newPage();
for (const [path, size] of sizes) {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(
    `<style>html,body{margin:0;background:transparent}svg{display:block;width:${size}px;height:${size}px}</style>${svg}`,
  );
  writeFileSync(path, await page.screenshot({ omitBackground: true }));
  console.log(`wrote ${path}`);
}
await browser.close();

// List the PNGs in the manifest next to the SVG.
const manifest = JSON.parse(readFileSync("public/manifest.webmanifest", "utf8"));
manifest.icons = [
  { src: "icon.svg", sizes: "any", type: "image/svg+xml" },
  { src: "icon-192.png", sizes: "192x192", type: "image/png" },
  { src: "icon-512.png", sizes: "512x512", type: "image/png" },
  { src: "icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
];
writeFileSync("public/manifest.webmanifest", JSON.stringify(manifest, null, 2) + "\n");
console.log("updated public/manifest.webmanifest");
