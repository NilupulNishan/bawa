import { expect, test, type Page } from "@playwright/test";
import { routes } from "../src/pages";

// The self-test drives the real build in a fresh browser profile, on a test
// store (?store=selftest). Add a test for every story with behavior.

/** Collects console errors and uncaught exceptions. */
function watchErrors(page: Page) {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  return errors;
}

test("every page loads with no errors", async ({ page }) => {
  const errors = watchErrors(page);
  for (const route of routes) {
    await page.goto(`/?store=selftest&seed=1#/${route}`);
    await page.locator("[data-ready]").waitFor();
  }
  expect(errors).toEqual([]);
});

test("add an item, rename it, and it survives a reload", async ({ page }) => {
  await page.goto("/?store=selftest#/all");
  await page.getByRole("button", { name: "Add Item" }).first().click();
  const title = page.getByLabel("Title");
  await expect(title).toBeFocused();
  await title.fill("  Water   the plants ");
  await title.press("Enter");
  await expect(page.getByRole("option", { name: "Water the plants" })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("option", { name: "Water the plants" })).toBeVisible();
});

test("N adds an item outside text fields", async ({ page }) => {
  await page.goto("/?store=selftest#/all");
  await page.locator("[data-ready]").waitFor();
  await page.keyboard.press("n");
  await expect(page.getByLabel("Title")).toHaveValue("New Item");
});

test("star an item and it shows on Starred", async ({ page }) => {
  await page.goto("/?store=selftest#/all");
  await page.getByRole("button", { name: "Add Item" }).first().click();
  await page.getByLabel("Title").fill("Star me");
  await page.getByRole("button", { name: "Star", exact: true }).click();
  await page.getByRole("link", { name: /Starred/ }).click();
  await expect(page.getByRole("option", { name: "Star me" })).toBeVisible();
});

test("delete moves selection to the next row, and Undo brings it back", async ({ page }) => {
  await page.goto("/?store=selftest&seed=1#/all");
  const rows = page.getByRole("option");
  await rows.first().click();
  const first = (await rows.first().textContent())!;
  const second = (await rows.nth(1).textContent())!;
  await page.getByRole("button", { name: "Delete" }).click();
  await expect(page.getByRole("option", { selected: true })).toHaveText(second);
  await page.getByRole("button", { name: "Undo" }).click();
  await expect(page.getByRole("option", { name: first })).toBeVisible();
});

test("the real database is never seeded", async ({ page }) => {
  await page.goto("/?seed=1#/all");
  await page.locator("[data-ready]").waitFor();
  await expect(page.getByRole("heading", { name: "No Items" })).toBeVisible();
});
