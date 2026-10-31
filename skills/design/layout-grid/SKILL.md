---
name: layout-grid
description: Grid and alignment rules for a web app, with three checks that catch misalignment (a lint for off-grid px values, a layout probe that measures real boxes in snapshot mode, and a grid overlay). Use when building or reviewing a custom page, card, row, form, or dialog, after every change that touched layout, or when the user says something looks misaligned, crooked, cramped, or unevenly spaced.
---

# Layout grid

Agents guess numbers. A guessed `padding: 13px` looks almost right and
makes the whole app feel slightly off. This skill replaces guessing with
one scale and three checks that fail when something is off.

The template has everything in place: the spacing tokens in
`src/ui/tokens.css`, `tools/grid-lint.mjs`, `tools/check-layout.mjs`, and
the layout measure in `e2e/snap.spec.ts`. For an app made before this
skill, copy those three files from the `new-web-app` skill's template and
add `"grid"` to `package.json` scripts.

## The rules

1. Every padding, gap, and margin comes from a token: `--space-xs 4`,
   `--space-sm 8`, `--space-md 12`, `--space-lg 16`, `--space-xl 20`,
   `--space-xxl 24`, `--space-section 32`. Raw px values are 0, 1, 2, or a
   multiple of 4.
2. Pages and columns have a 20 px margin (`--space-margin`). Cards pad 16.
   Related controls sit 8 apart, groups 20 to 24, sections 32.
3. Each column has one leading edge. Titles, text, cards, and buttons in a
   column start on the same x. Indent on purpose, by a step of the scale.
4. Let layout do the aligning:
   - Stacks: `display: flex; flex-direction: column; gap: var(--space-*)`.
     Use `gap`, not margins on children.
   - Rows of values and forms with labels beside fields: CSS grid.
   - Text of different sizes in one row: `align-items: baseline`.
   - Numbers in a column: `tabular-nums`, right aligned.
5. Dialogs are 360, 480, or 640 px wide. Controls take their height from
   padding and line height, never from a fixed `height`.
6. Nested corners are concentric: inner radius = outer radius - padding.
7. `position: absolute`, `transform`, and negative margins move a box out
   of the flow, so nothing lines up with it. Use them only for overlays,
   motion, and drag previews, with `/* grid: ok <why> */` on the line.
8. Long text truncates with its full value in `title`. Nothing clips.

## Check 1: lint the code

Run it after every change that touched styles:

```bash
node tools/grid-lint.mjs
# src/ui/app.css:52: off grid (10px): padding: 10px 16px;
# FAIL grid-lint: 1 lines off the grid
```

Fix each line with a token.

## Check 2: probe the real layout

Mark what you lay out yourself: the page, its sections, cards, rows in a
card. Use data attributes:

```tsx
<main className="page" data-grid-area="page" data-grid-inset="20">
  <h1 data-grid-probe="title">Today</h1>
  <StatsRow data-grid-probe="stats" />
  <section className="card" data-grid-probe="card">...</section>
</main>
```

`data-grid-area` marks a container and `data-grid-inset` its padding.
`data-grid-probe` marks a view in it. Probes share one leading edge unless
they set `data-grid-edge` to another name, or to `none` for views that sit
side by side.

`npm run snap` writes `shots/<page>-<mode>-layout.json` next to every PNG.
Check them:

```bash
node tools/check-layout.mjs shots
# PASS all-light-layout.json: 3 probes
# FAIL settings-light-layout.json
#   - edge page/lead has 2 leading edges: title 260, appearance 264
```

It checks that every probe:

1. Starts a multiple of 4 px from its area's edge.
2. Stays inside its area's inset on both sides.
3. Shares one leading edge with the others on its edge.
4. Never overlaps another probe in its area.

`npm run grid` runs both checks.

## Check 3: look at the grid

When a check fails and the cause is not clear, draw the grid over the page
in a snapshot. Add this to the page for one run, from the browser console
or a test:

```js
document.body.style.backgroundImage =
  "linear-gradient(to right, rgb(255 0 128 / .15) 1px, transparent 1px)," +
  "linear-gradient(to bottom, rgb(255 0 128 / .15) 1px, transparent 1px)";
document.body.style.backgroundSize = "8px 8px";
document.querySelectorAll("[data-grid-area]").forEach((el) => (el.style.outline = "1px dashed #3b82f6"));
document.querySelectorAll("[data-grid-probe]").forEach((el) => (el.style.outline = "1px solid #ec4899"));
```

Then take a screenshot and open it with the Read tool. Remove the code
after.

## Fix a failure

| Message | Usual cause | Fix |
| --- | --- | --- |
| starts 23 px into page | a raw padding on one child | remove it, use the parent's `gap` and padding |
| 2 leading edges | a centered stack, or one child with extra margin | `align-items: stretch` or `flex-start` on the stack, remove the margin |
| off grid (10px) | a guessed number | a `--space-*` token |
| not inside its 20 px inset | a missing padding, or a fixed width wider than the parent | `padding: var(--space-margin)`, `max-width` instead of `width` |
| overlaps | `position: absolute`, a negative margin, or a fixed height | remove it, let the layout size the box |

Done when `npm run grid` passes on the layout files of every page you
touched, and every custom page and card has a `data-grid-area` with probes
on its main parts.
