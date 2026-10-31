---
name: clone
description: Walk through any existing web app in a browser, screenshot every page, menu, and dialog, write a screen index, and turn it into user stories. Use when the user wants to clone, rebuild, replace, or copy the design of a web app or site, or says "screenshot every screen".
argument-hint: "<URL of the app>"
---

# Clone

Output: a folder of screenshots, one index that describes everything the
app shows, and a backlog built from it.

```text
docs/screens/
  INDEX.md
  01-inbox.png
  02-today.png
  ...
docs/STORIES.md      (from the user-stories skill)
```

## 1. Pick the tool

| You have | Use |
| --- | --- |
| Claude in Chrome or the built-in browser | It, with the user's own sign-in |
| Neither | Playwright from a script (below), for public pages or a demo account |
| A desktop app, not a web app | Computer use, if the plan has it. Otherwise ask the user for screenshots |

Call the Skill tool with the browser's own skill before its first use, if
one is listed.

## 2. Agree on privacy

Tell the user you will see everything in the app. Suggest a demo account or
sample data. Look, do not touch: open pages and menus, press Escape to
close dialogs. Type, create, change, or delete only when the user says so.
Never type a password: the user signs in.

## 3. Save real files

Save each screen at full resolution to `docs/screens/`. In a browser tool,
use its screenshot with a file path. With Playwright:

```js
// node shot.mjs <url> <file>
import { chromium } from "@playwright/test";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(process.argv[2], { waitUntil: "networkidle" });
await page.screenshot({ path: process.argv[3], fullPage: true });
await browser.close();
```

Use one viewport for the whole walk (1440 x 900), plus a phone width (390)
for the two or three main pages when the brief says mobile.

## 4. Walk the app in this order

1. The default page after sign-in.
2. Every navigation item, top to bottom. Expand collapsed groups.
3. Every view mode (list, board, calendar), sort menu, filter menu.
4. One item opened in detail: panel, fields, sub-items.
5. Creation flows: add button, quick-add, command palette (Ctrl+K or
   Cmd+K), inline editor. Empty and half filled in, then Escape.
6. Context menus (right-click) on an item, a section, a navigation entry.
7. Keyboard shortcut help: press `?`. Many apps list every shortcut there.
8. Settings: every tab.
9. Empty states.
10. Dark mode, if the app has it: the two or three main pages again.

Name files `NN-page-or-state.png` in capture order. The walk is
exhaustive when every navigation item, menu, and settings tab has a file.

## Lessons from real walkthroughs

- Most actions hide in hover toolbars, right-click menus, and command
  palettes. Hover rows and search the palettes (typing in a palette search
  is safe; do not press Enter).
- The `?` shortcut sheet and the help center list features faster than
  clicking does. Read them and link them in the index.
- Preview fields test behavior without saving. A "Type a date" box shows
  how it parses a phrase before anything is stored.
- Note any change in the user's data during the walk, even if you are not
  sure you caused it, and tell them.

## 5. Write docs/screens/INDEX.md

One section per screenshot:

```markdown
## 03-upcoming.png

Page: Upcoming. Reached from: sidebar > Upcoming. URL: /upcoming
Layout: header with month picker and "Today" button; week strip; tasks
grouped by day, each day a section with a heading and an add button.
Elements: task row (checkbox, title, description line, date, project tag,
priority flag color).
Actions: complete, open, drag to another day, add to a day.
Shortcuts seen: none.
```

End with three lists:

- **Navigation map**: navigation items, their URLs, and where each leads.
- **Command map**: every menu item, palette command, and keyboard shortcut.
- **Data model guess**: the nouns and fields you saw.

Describe structure and behavior. Take no text, logo, or icon from the app:
rebuilding for personal use is fine, copying a brand is not. Keep the PNGs
out of public repos (add `docs/screens/*.png` to `.gitignore`).

## 6. Turn it into stories

Call the Skill tool with `user-stories`. Every screen in the index ends up
linked from at least one story, or listed under `## Dropped`.

Done when INDEX.md has a section per PNG, the three maps exist, and
`docs/STORIES.md` covers every screen.
