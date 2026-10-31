# __APP_TITLE__

A local-first web app in React and TypeScript, built with Vite. Data lives
in the browser (IndexedDB through Dexie). There is no server.

## Layout

- `src/App.tsx` the shell: sidebar, list, detail, shortcuts, undo.
- `src/pages.ts` the sidebar pages. Snapshots and the self-test visit every entry. Add a new page here first.
- `src/db.ts` the database and its types. A schema change is a new `db.version(n)`.
- `src/seed.ts` sample data for snapshots. Seed only what a person can create in the app.
- `src/lib/` rules and data logic with no React or database. Unit tests sit next to each file (`*.test.ts`).
- `src/ui/tokens.css` every color, space, radius, and duration. `src/ui/app.css` the parts.
- `src/ui/theme.ts` the accents people pick in Settings.
- `e2e/` Playwright: `selftest.spec.ts` (behavior) and `snap.spec.ts` (screenshots).
- `tools/` grid checks and the icon renderer.
- `docs/` the brief, the screen index, and the user stories, when they exist.

## Build and check

- Dev server: `npm run dev`, then open http://localhost:5173.
- Build: `npm run build` (type check, then the production build in `dist/`). Fix every error and warning.
- Unit tests: `npm test`.
- Self-test: `npm run selftest`. It builds, serves the build, and drives it in Chromium. Add a test for every story with behavior.
- After every UI change, take snapshots with sample data and look at them: `npm run snap`.
  It writes `shots/<page>-light.png` and `-dark.png` for every page, plus a layout file per PNG.
  `SNAP_PAGES=all,settings npm run snap` limits the pages. `SNAP_ACCENT=green` compares an accent.
- Then check the grid: `npm run grid`. Both checks print PASS.
- All of it at once: `npm run check`.
- First run on a new machine: `npx playwright install chromium`.
- A change is done when the build has no errors, the self-test and grid checks pass, and you looked at the light and dark snapshots.

## Test data

- `?store=<name>` opens a separate test database. `&seed=1` fills an empty test store with sample data.
- Seed data refuses to run without `?store=`. Snapshots and the self-test always use one.
- Never seed, snapshot, or test against the real database (the URL with no `?store=`).

## Design rules

- Every color, space, radius, and duration comes from a token in `src/ui/tokens.css`. Never raw values in components.
- Accent colors: `--accent` for fills and selection, `--accent-text` for text in the accent color, `--on-accent` for text on an accent fill.
- Spacing is on a 4 px grid. Mark custom pages and cards with `data-grid-area` (and `data-grid-inset`) and their main parts with `data-grid-probe`.
- Light and dark follow the system (`light-dark()` in tokens). Check both in every snapshot.
- Use real elements: `<button>` for actions, `<a href>` for navigation, `<label>` around every field. Never a clickable `<div>`.
- Every action works from the keyboard. App shortcuts are single keys outside text fields; browsers keep Ctrl+N, Ctrl+T, and Ctrl+W.
- Every icon-only button has `aria-label` and a `title` that says what it does and its shortcut.
- Empty states say what the page is for and offer the first action as a button.
- Destructive actions offer Undo instead of a confirmation.

## Skills

The bawa plugin has a skill for each step: `web-design` (design rules),
`design-system` (accent and tokens), `layout-grid`, `ux-design`,
`typescript-react`, `web-integrations`, `performance`, `build-and-verify`,
`test-web-app`, `app-icon`, `user-stories`, `improve-loop`, and `deploy`.
Use them.

## Git

- Commit after each working change, with a message that says what the user can now do.
