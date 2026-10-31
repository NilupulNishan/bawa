import { mkdirSync, writeFileSync } from "node:fs";
import { test } from "@playwright/test";
import { routes } from "../src/pages";

// Snapshot mode: one PNG per page in light and dark, with seed data, plus a
// layout file per PNG for tools/check-layout.mjs. Limit the pages with
// SNAP_PAGES=all,settings. Compare accents with SNAP_ACCENT=green.
const only = process.env.SNAP_PAGES?.split(",");
const accent = process.env.SNAP_ACCENT ? `&accent=${process.env.SNAP_ACCENT}` : "";
mkdirSync("shots", { recursive: true });

for (const mode of ["light", "dark"] as const) {
  test.describe(mode, () => {
    test.use({ colorScheme: mode });
    for (const route of routes.filter((id) => !only || only.includes(id))) {
      test(route, async ({ page }) => {
        await page.goto(`./?store=snap&seed=1${accent}#/${route}`);
        await page.locator("[data-ready]").waitFor();
        // Select the first row so the detail column shows content.
        const firstRow = page.getByRole("option").first();
        if (await firstRow.count()) await firstRow.click();
        await page.evaluate(() => document.fonts.ready);
        const name = `shots/${route}-${mode}`;
        await page.screenshot({ path: `${name}.png`, animations: "disabled", caret: "hide" });
        writeFileSync(`${name}-layout.json`, JSON.stringify(await page.evaluate(measureLayout), null, 2));
      });
    }
  });
}

/** Runs in the page: the box of every [data-grid-area] and its probes. */
function measureLayout() {
  return [...document.querySelectorAll<HTMLElement>("[data-grid-area]")].map((area) => {
    const box = area.getBoundingClientRect();
    return {
      area: area.dataset.gridArea,
      inset: Number(area.dataset.gridInset ?? 0),
      left: box.left,
      top: box.top,
      right: box.right,
      bottom: box.bottom,
      probes: [...area.querySelectorAll<HTMLElement>("[data-grid-probe]")].map((probe) => {
        const rect = probe.getBoundingClientRect();
        return {
          name: probe.dataset.gridProbe,
          edge: probe.dataset.gridEdge ?? "lead",
          left: rect.left,
          top: rect.top,
          right: rect.right,
          bottom: rect.bottom,
        };
      }),
    };
  });
}
