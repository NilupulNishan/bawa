---
name: new-web-app
description: Create a local-first web app from a working template (Vite, React, TypeScript, IndexedDB, Playwright self-test and snapshots, git) that runs the same on Windows, macOS, and Linux. Use when the user wants to start a new web app or scaffold a web project.
argument-hint: "<app-name> [parent-folder] [--title \"App Title\"]"
allowed-tools: Bash(node *new-app.mjs *) Bash(npm *) Bash(npx *) Bash(git *) Read Write Edit
---

# New web app

The template builds, tests, and runs as is. The first check proves the
toolchain works before you write feature code.

## What the template is

A Vite app with React and TypeScript. Data lives in the browser through
Dexie (IndexedDB), so there is no server to run. Playwright drives the
production build for the self-test and the snapshots.

```text
<app-name>/
  package.json         scripts: dev, build, test, selftest, snap, grid, icons, check
  vite.config.ts       base "./" so the build runs from any folder or subpath
  playwright.config.ts builds, serves on 4173, runs e2e/ in Chromium
  CLAUDE.md            build, check, and design rules for agents
  public/              icon.svg, manifest.webmanifest
  src/
    App.tsx            sidebar, list, detail, N shortcut, delete with Undo
    pages.ts           the sidebar pages; snapshots visit every one
    db.ts              Dexie database, the Item type, ?store= test databases
    seed.ts            sample data for ?store=<name>&seed=1
    Settings.tsx       Settings: accent picker (light and dark follow the system)
    lib/itemTitle.ts   pure logic, with itemTitle.test.ts next to it
    ui/tokens.css      colors, spacing, radii, type, motion; light and dark
    ui/app.css         layout and parts, on the 4 px grid
    ui/theme.ts        accents and the saved choice
    ui/route.ts        hash routes (#/starred)
    ui/Icon.tsx        a small inline icon set
  e2e/
    selftest.spec.ts   behavior: add, rename, reload, star, delete, Undo
    snap.spec.ts       a PNG and a layout file per page, light and dark
  tools/
    grid-lint.mjs      flags px numbers off the 4 px grid
    check-layout.mjs   checks the layout files from snapshot mode
    make-icons.mjs     renders icon.svg to PNG sizes with Playwright
```

## Steps

1. Check the toolchain: `node --version` prints 20 or later, and `git
   --version` works.

2. Pick the name (lowercase, digits, and dashes) and a title. If
   `docs/BRIEF.md` exists, use its name.

3. Run the script with the parent folder. It copies the template, fills in
   the name and title, runs `npm install` and `npx playwright install
   chromium`, runs `git init`, and commits. It keeps a folder that holds
   only a brief.

   ```bash
   node "${CLAUDE_SKILL_DIR}/scripts/new-app.mjs" daily-log ~/dev --title "Daily Log"
   ```

   The install takes a few minutes. Run it in the background.

4. Run every check, then look at the snapshots (`build-and-verify` skill):

   ```bash
   cd ~/dev/daily-log
   npm run check     # unit tests, self-test, snapshots, grid checks
   ```

   Each part prints PASS or its test names, and the command exits 0.

5. Start the dev server for the user: `npm run dev`, then
   http://localhost:5173.

6. If `docs/BRIEF.md` exists, rename `Item` to the brief's main type and the
   pages in `src/pages.ts` to the brief's pages. Nothing else: features go
   through `improve-loop`, one story at a time. Check, snapshot, commit.

## When to add a server

The browser database covers most personal apps. Add a server only when the
brief says data is shared between people or must reach another device.
Then keep the client as is and put the server in `server/` with its own
`package.json`, so the self-test can still run the client alone.

## When the build fails

- A type error: fix the first one first. Later errors often come from it.
- `npm run selftest` hangs at start: port 4173 is taken. Stop the other
  `vite preview`.
- `browserType.launch: Executable doesn't exist`: run `npx playwright
  install chromium`.
- Windows: `Playwright Test did not expect test() to be called here` with
  one Playwright version installed means the shell's folder path differs in
  case from the folder on disk (`D:\Dev` against `d:\dev`). Playwright then
  loads the spec twice. `cd` to the path with its real case and run again.
- `TS2882: Cannot find module or type declarations for side-effect import`
  of a `.css` file: `src/vite-env.d.ts` is missing. It holds one line,
  `/// <reference types="vite/client" />`.
- TypeScript and React errors: call the Skill tool with `typescript-react`.

Done when `npm run check` exits 0, the snapshots show every page in light
and dark, and the first commit exists.
