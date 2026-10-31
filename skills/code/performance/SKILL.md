---
name: performance
description: Make a web app fast by measuring load time, interaction delay, layout shifts, bundle size, and memory, then fixing the cause. Use when the app loads slowly, a click or key press lags, scrolling stutters, the bundle grows, memory grows, or the user asks to optimize or profile.
---

# Performance

Fast means three numbers on a mid-range laptop: the page is usable in
under 1 second from cache, every click or key press shows its result in
under 100 ms, and nothing shifts after it appears. Every change in this
skill starts and ends with a **measurement**, so you know it helped.

## The loop

```text
reproduce -> measure (production build) -> find the line -> fix -> measure again -> commit with the numbers
```

1. **Reproduce.** Write the exact steps, or add a Playwright test that
   runs the slow action and logs the time of each step with
   `performance.now()`.
2. **Measure the production build.** `npm run build && npm run preview`.
   The dev server is slower and points at the wrong code.
3. **Find the line.** Pick the tool for the symptom:

   | Symptom | Tool |
   | --- | --- |
   | Slow first load | Lighthouse: `npx lighthouse http://localhost:4173 --only-categories=performance --output=json --output-path=./shots/lighthouse.json` |
   | A big bundle | `npx vite-bundle-visualizer`, or the sizes `vite build` prints |
   | A click or key press lags | Chrome DevTools Performance panel, or a Playwright trace (`--trace on`) |
   | Too many renders | React DevTools Profiler with "Highlight updates" |
   | Stutter while scrolling | Performance panel, look for long tasks and layout |
   | Memory grows | DevTools Memory panel: two heap snapshots, compare |

4. **Fix** with the rules below.
5. **Measure again** with the same steps. Put before and after in the
   commit message: "Search answers in 30 ms, was 400 ms".

## The rules that fix most problems

- **Show first, work after.** Update the screen in the same frame as the
  click, then save. The database write does not block the UI.
- **Long lists render only what shows.** Past about 500 rows, use a
  virtual list (`@tanstack/react-virtual`).
- **Search and filters do not animate.** Results update in place.
- **Heavy work leaves the main thread.** Parsing a large import, search
  indexes, and image work go in a Web Worker.
- **Split what most people never open.** `lazy(() => import("./Charts"))`
  for a heavy page or library.
- **Images at display size**, with `width` and `height` set, so nothing
  shifts. `loading="lazy"` below the fold.
- **Few dependencies.** Check the size before you add a package
  (bundlephobia), and prefer the platform: `Intl` for dates and numbers,
  `crypto.randomUUID()` for ids.
- **Database queries use an index.** `where("starred").equals(1)` on an
  indexed field (a flag stored as 0 or 1), not `toArray()` then `filter()`,
  once a table passes a few thousand rows.
- **No polling without a reason.** Timers stop when the tab is hidden
  (`document.visibilityState`).

Done when the slow action has a measured before and after, the after meets
the three numbers at the top, and the commit message names both.
