---
name: test-web-app
description: Test a web app at three levels, from Vitest unit tests to a Playwright self-test that drives the production build, plus keyboard and accessibility checks and a browser tool for what only a person can do. Use when adding logic, fixing a bug, before a release, or when the user asks for tests, end-to-end checks, or "make sure it works".
---

# Test a web app

Three levels, cheapest first. Each new story gets the cheapest level that
can prove its acceptance criteria. A bug fix starts with a test that fails.

| Level | Proves | Speed |
| --- | --- | --- |
| Unit tests (Vitest) | Rules, parsing, data transforms in `src/lib/` | Milliseconds |
| Self-test (Playwright, `e2e/selftest.spec.ts`) | Real flows in the real build: clicks, keys, reload, offline | Seconds |
| Accessibility check (axe in the self-test) | Labels, roles, contrast, focus | Seconds |
| A browser tool driven by the agent | Permissions, file pickers, install, real devices | Minutes |

Snapshots (`build-and-verify` skill) prove how it looks. This skill proves
how it behaves.

## 1. Unit tests

Logic lives in `src/lib/` with no React and no database, so tests run in
milliseconds. A test file sits next to its module.

```ts
import { describe, expect, test } from "vitest";
import { parseDate } from "./parseDate";

const now = new Date("2026-03-02T10:00:00"); // a fixed Monday

describe("parseDate", () => {
  test.each([
    ["tomorrow 9am", "2026-03-03T09:00"],
    ["next fri", "2026-03-06T00:00"],
  ])("%s", (phrase, expected) => {
    expect(parseDate(phrase, now)?.toISOString().slice(0, 16)).toBe(expected);
  });
});
```

```bash
npm test
```

- Pass the clock in (`now`). Never read `Date.now()` inside logic you test.
- A parser that removes text from what the user typed needs at least 20
  negative rows: real titles that contain date words ("Watch Friday Night
  Lights").
- **Table tests** for anything with many cases. Keep the table in
  `docs/research/<topic>.md` too, and add a row there before changing
  behavior.

## 2. Self-test

Playwright builds the app, serves it, and drives it in Chromium. Each test
gets a fresh browser profile, so IndexedDB starts empty, and every URL uses
`?store=selftest`, so it never touches real data.

```ts
test("complete a task with X", async ({ page }) => {
  await page.goto("/?store=selftest&seed=1#/all");
  await page.getByRole("option").first().click();
  await page.keyboard.press("x");
  await expect(page.getByRole("status")).toHaveText(/Task completed/);
});
```

```bash
npm run selftest
```

- Find elements by role and name (`getByRole("button", { name: "Add
  Item" })`), the way a person and a screen reader find them. A test that
  cannot find a control by its role has found an accessibility bug.
- Never use fixed waits (`waitForTimeout`). Use `expect(...)` with web-first
  assertions; they retry until the state is right.
- Reload to prove data survives (`page.reload()`).
- Offline: `await context.setOffline(true)` then reload, once the app has a
  service worker.

Checks worth adding to any self-test:

- Every page loads with no console errors (the template has this test).
- Every shortcut in the `?` sheet does what it says.
- For every page: Add creates a row that is visible and focused on that
  page. After an action removes the selected row, selection moves to the
  next row.
- The real database is never seeded (the template has this test).
- Export, then import into an empty store, gives the same data.

## 3. Accessibility check

Add axe to the self-test once:

```bash
npm install -D @axe-core/playwright
```

```ts
import AxeBuilder from "@axe-core/playwright";

for (const route of routes) {
  test(`${route} has no accessibility violations`, async ({ page }) => {
    await page.goto(`/?store=selftest&seed=1#/${route}`);
    await page.locator("[data-ready]").waitFor();
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
  });
}
```

Run it in light and dark (`test.use({ colorScheme: "dark" })`): contrast
fails in one mode more often than in both.

Axe finds about a third of real problems. Also walk each new flow with the
keyboard in the self-test: `page.keyboard.press("Tab")` through it and
expect focus on the right control at each step.

## 4. A browser tool

Last resort, for what only a person can do: a permission prompt, a file
picker, installing the app, a real phone. Use Claude in Chrome or the
built-in browser if one is available (call its skill first), on
`http://localhost:5173/?store=manual` so the user's data stays safe. Write
the steps as a named manual check in the story.

## Runs that never hang

- Port 4173 must be free. Another `vite preview` holds it: stop it.
- Windows: run from a folder path whose case matches the disk
  (`d:\dev\app`, not `D:\Dev\app`). Otherwise Playwright reports "did not
  expect test() to be called here" and finds no tests.
- First run on a machine: `npx playwright install chromium`.

Done when every acceptance line of the story maps to a passing unit test,
self-test step, or a named manual check, the axe check passes on the pages
it touched, and the bug fix has a test that failed before the fix.
