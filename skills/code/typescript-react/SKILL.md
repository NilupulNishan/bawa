---
name: typescript-react
description: TypeScript and React code rules for a local-first web app, covering state, effects, IndexedDB with Dexie, forms, keyboard handling, and fixes for common type and runtime errors. Use when writing, reviewing, or debugging TypeScript or React code in a web app, or on a type error, a render loop, or stale state.
---

# TypeScript and React

Rules for code an agent writes and a person can still read a year later.
They assume the `new-web-app` template: React with function components,
strict TypeScript, Dexie for data.

## Where code goes

| Code | Place |
| --- | --- |
| Rules, parsing, formatting, data transforms | `src/lib/`, plain functions, no React, no database. Tests next to the file |
| Database types and schema | `src/db.ts` |
| A page or a large part | `src/<Feature>.tsx`, one component per file over about 150 lines |
| Shared parts (buttons, rows, icons) | `src/ui/` |
| Styles | `src/ui/app.css` with tokens from `src/ui/tokens.css` |

Keep each component file under about 300 lines. Split by feature, not by
kind (`Projects.tsx` with its rows and dialog, not `components/` plus
`hooks/` plus `utils/`).

## TypeScript

- `strict` stays on. Never add `any`. Use `unknown` and narrow it.
- Types from data: `type PageId = (typeof pages)[number]["id"]` keeps one
  source of truth.
- Use a union of string literals for a fixed set (`"todo" | "done"`), not an
  `enum`.
- `!` only where the code just checked, or for `document.getElementById("root")`.
- Validate anything that comes from outside (a URL parameter, an imported
  file, `localStorage`) before you use it. `isAccent()` in `ui/theme.ts`
  shows the shape.

## State

1. Data that must survive a reload lives in the database. Read it with
   `useLiveQuery`, so every view updates when it changes. Never copy it
   into `useState`.
2. What the URL should keep (the page, a selected id worth linking) lives
   in the hash route.
3. UI state (selection, an open dialog, a draft) lives in `useState` in
   the lowest component that needs it. Lift it only when a sibling needs it.
4. Derive, do not store: a filtered list or a count is computed in render.

Add a context only when three or more levels pass the same prop. Add a
state library only when a measurement or a real pain asks for it.

## Effects

`useEffect` is for syncing with something outside React: the document
title, a key listener, a timer. Not for:

- Computing a value from props or state. Compute it in render.
- Reacting to a click. Do the work in the click handler.
- Loading data. `useLiveQuery` does it.

Every effect that adds a listener or a timer returns the cleanup. Strict
mode runs effects twice in development, so a missing cleanup shows up as a
double listener at once.

## Data with Dexie

- Writes go through `db.<table>.add`, `update`, `delete`, or `bulkAdd`.
  Several writes that belong together go in `db.transaction("rw", ...)`.
- A schema change is a new `db.version(n).stores(...)` below the old ones.
  Never edit an old version: people have data saved with it.
- A new field is optional in the type, or gets a default where it is read,
  so old records still load.
- Ids are `crypto.randomUUID()`, made by the app, never auto-increment.
  They stay stable through export and import.
- Index only fields you sort or filter on. IndexedDB cannot index
  booleans: a record whose indexed field is `true` is left out of the index
  with no error. Store a flag you query as `0` or `1`.

## Forms and keyboard

- Every input sits in a `<label>`, or has `aria-label` when no visible
  label fits.
- Save as people type for fields on an item (title, notes). Use a form with
  a submit button for things that are created all at once.
- Enter submits and Escape cancels in every dialog and inline editor.
- App shortcuts check `isTyping(event.target)` first, so typing an `n` in a
  field never adds an item.
- Browsers keep Ctrl+N, Ctrl+T, Ctrl+W, and Ctrl+Tab. Use single keys or
  `Shift` combinations outside fields, and show them in tooltips and the
  `?` help.

## Common errors

| Error | Fix |
| --- | --- |
| `Type 'X | undefined' is not assignable` | `useLiveQuery` returns undefined while loading. Handle the loading case, or default with `?? []` |
| "Too many re-renders" | A setter called in render. Move it into a handler or an effect |
| "Each child in a list should have a unique key" | `key={item.id}`, never the array index for rows that can move |
| A value is stale inside a listener | The effect captured an old closure. Add the value to the dependencies, or re-add the listener each render as `App.tsx` does |
| `DatabaseClosedError` or `VersionError` | Another tab holds an older schema. Reload every tab. A version number went down |
| `Cannot find module` after adding a file | Check the import path and its case. Windows ignores case, the Linux build server does not |

Done when `npm run build` has no errors or warnings, no `any` was added,
and every new effect that subscribes to something has a cleanup.
