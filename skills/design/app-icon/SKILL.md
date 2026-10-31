---
name: app-icon
description: App icon for a web app, drawn as one SVG and rendered to every size browsers, home screens, and the PWA manifest ask for, then checked in light and dark and at 16 px. Use when the user wants an app icon, a favicon, a better icon, or an icon for an installed app.
allowed-tools: Bash(npm run icons) Bash(node tools/make-icons.mjs) Read Edit Write
---

# App icon

One SVG is the source: `public/icon.svg`. `npm run icons` renders the PNGs
from it with the Chromium that Playwright already installed, and lists
them in `public/manifest.webmanifest`.

| File | Used by |
| --- | --- |
| `icon.svg` | The browser tab (modern browsers), the manifest |
| `favicon-32.png` | Browsers that do not take an SVG favicon |
| `apple-touch-icon.png` (180) | iPhone and iPad home screen |
| `icon-192.png`, `icon-512.png` | Android and desktop install, the splash screen |

## 1. Pick the idea

Read `docs/BRIEF.md`. The icon shows one object or symbol for the app's
main job: a check for tasks, a page for notes, a pot for recipes. Write
three ideas, pick one, and say why in one line.

- One symbol, no words, no more than two or three shapes.
- It reads at 16 px in a browser tab. Test this first: a detail that
  vanishes at 16 px goes.
- Its own idea. No logo or icon from another app.

## 2. Draw the SVG

Edit `public/icon.svg`, `viewBox="0 0 512 512"`:

- A full-bleed background shape: a rounded square (`rx="112"`) in the
  brand or accent color, so it looks right on light and dark tabs.
- The symbol centered, inside the middle 80% (about 52 px of padding on
  each side), so Android's mask can crop the corners (the manifest marks
  the 512 icon `maskable`).
- Simple fills. A gradient on the background at most. No text, no thin
  lines under 24 units (they vanish at 16 px).

## 3. Render

```bash
npm run icons
# wrote public/icon-192.png
# ...
# updated public/manifest.webmanifest
```

Add `<link rel="apple-touch-icon" href="./apple-touch-icon.png">` to
`index.html` once, if it is not there yet.

## 4. Review

Open these with the Read tool:

1. `public/icon-512.png`: the full icon.
2. `public/favicon-32.png`: still readable at tab size.
3. A snapshot of the app in light and dark (`npm run snap`): the icon in
   context, if the app shows it in the sidebar.

Check: the symbol is clear at 32 px, it sits inside the middle 80%, and it
is distinct from the browser's default icon on a light and a dark tab bar.
Fix the SVG and render again until all three hold.

## 5. Theme color

Set `theme_color` and `background_color` in the manifest, and the
`theme-color` meta tags in `index.html`, to the app's background tokens
(`--bg` light and dark), so the installed window title bar matches the app.

Done when every file in the table exists, the manifest lists them, the 32
px render is readable, and the icon change is committed.
