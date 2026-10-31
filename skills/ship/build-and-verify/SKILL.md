---
name: build-and-verify
description: Build a web app, run its checks, and look at light and dark snapshots of every page before calling a change done. Use after any UI code change, when a build fails, or when the user asks to run, screenshot, or check the app.
allowed-tools: Bash(npm run *) Bash(npm test*) Bash(npx playwright *) Bash(node tools/*) Read
---

# Build and verify

A change is done when four things are true:

1. `npm run build` finishes with no errors or warnings.
2. You looked at the light and dark snapshots of every page you touched.
3. The snapshots match what the user story or reference screenshot asks for.
4. The grid checks pass (`layout-grid` skill).

App not made from the `new-web-app` template? Copy `e2e/snap.spec.ts`,
`playwright.config.ts`, and `tools/` from that skill's template, and add
the `snap` and `grid` scripts to `package.json`. Change the routes in
`snap.spec.ts` to the app's pages.

Never report a UI change as done from the code alone. Code that compiles
can still render an empty column, clipped text, or unreadable dark mode.

## 1. Build

```bash
npm run build      # type check, then the production build in dist/
```

Read the errors, fix them, and build again. Fix the first error first:
later errors often come from it.

## 2. Snapshot

```bash
npm run snap
# 6 passed
```

Playwright builds the app, serves it on port 4173, and opens every page in
`src/pages.ts` plus Settings in a fresh browser, in light and dark. Each
run uses a new test store with seed data (`?store=snap&seed=1`), so the
user's real data is never touched and the seed is never stale. It writes
`shots/<page>-light.png`, `shots/<page>-dark.png`, and a layout file per
PNG.

- `SNAP_PAGES=all,settings npm run snap` limits the pages.
- `SNAP_ACCENT=green npm run snap` takes them in another accent.
- A dialog, popover, or menu needs its own state: add a test to
  `snap.spec.ts` that opens it and saves `shots/<page>-<state>-<mode>.png`.
- Phone layout: add a test with `viewport: { width: 390, height: 844 }`
  for the main pages when the brief says mobile.

### Seed data

Empty pages only show empty states. `src/seed.ts` fills an empty test
store. Grow it with the app: 10 to 20 items with long and short titles,
dates in the past and future, every status, and only what a person can
create in the app.

## 3. Check the grid

```bash
npm run grid
# PASS grid-lint: 5 files
# PASS all-light-layout.json: 3 probes
```

Both print PASS. On a FAIL, call the Skill tool with `layout-grid`: it has
the rules, the overlay, and a table of fixes.

## 4. Look

Open every PNG of the pages you touched with the Read tool, and check, in
this order:

- Nothing is blank, clipped, or overlapping. Text fits. Long titles
  truncate. The sidebar shows its items.
- Dark mode is readable. No fixed white or black surfaces.
- The page matches the story or the reference screenshot (layout, labels,
  order).
- The `web-design` rules hold: one accent for selection, the primary
  action, and focus; tokens only; empty states that invite the first
  action.
- No focus ring or selected text that nobody asked for, and no scroll bar
  with nothing to scroll.

Describe what you see in one or two sentences per page in your report, and
name the PNG paths so the user can open them.

## 5. Behavior

Snapshots show state, not behavior. Run `npm run selftest` and add a test
for each new action. The `test-web-app` skill covers unit tests, the
self-test, keyboard checks, and accessibility checks.

`npm run check` runs the unit tests, the self-test, the snapshots, and the
grid checks in one go.

## 6. Show the user

Start the dev server so the user can try it: `npm run dev`, then
http://localhost:5173. The dev server uses the user's real browser data,
not the test store.

## 7. Commit

When the build is clean and the snapshots look right, commit with a
message that says what the user can now do: "Add tasks from the quick-add
dialog", not "Update components".

Done when the four conditions at the top hold and the change is committed.
