---
name: web-design
description: Design rules that make a web app look and feel like a well made app instead of a website, covering principles, layout, navigation, type, color, dark mode, responsive layout, motion, and keyboard use. Use when building or reviewing any page, sidebar, toolbar, list, dialog, or settings screen, or when the user asks for a cleaner, more polished, or better designed app.
---

# Web design

An app is a tool people return to every day, not a page they read once.
Design for the tenth visit: dense enough to work in, calm enough to look
at all day, and fast with the keyboard.

- App-wide tokens (colors, radii, motion): call the Skill tool with
  `design-system`.
- How a feature works and what it says (names, flow, dialogs, errors,
  accessibility): call the Skill tool with `ux-design`.
- Spacing, alignment, and the checks that catch misalignment: call the
  Skill tool with `layout-grid`.

## Principles

Use them as the review lens for every screen:

1. **Purpose**: each feature costs people time and attention. Cut what does not earn it.
2. **Content first**: the UI frames the user's data. Chrome is quiet; content has the contrast.
3. **Familiar**: things that look the same work the same. Standard controls, standard icons, standard shortcuts.
4. **Forgiving**: Undo over confirmations. Nothing is lost by a wrong click.
5. **Fast**: the result of every action shows in the same frame.
6. **Keyboard first**: every action has a key, and the keys are listed on `?`.
7. **Craft**: aligned edges, consistent spacing, layouts that survive resizing.

Every screen answers: Where am I? What can I do? Where can I go?

## Before you write views

Write these under `## Design plan` in `docs/BRIEF.md`, or in
`docs/DESIGN.md` when the brief would pass one page:

1. **Archetype**: sidebar app (sidebar, list, detail), single-page tool
   (one canvas or form with a toolbar), or dashboard (cards on a grid).
   Most personal apps are a sidebar app.
2. **Information architecture**: navigation pages, at most two levels.
3. **Command map**: every action, where it lives, its shortcut.
4. **Empty states**: what each page shows before there is data.
5. **Feeling**: the one feeling the app aims for (calm, quick, confident).
   Motion, words, and color all reinforce it.

## Layout

- Sidebar app: a 240 px sidebar, a list column, and a detail column. The
  template has this shell.
- The page itself never scrolls. Columns scroll on their own, so the
  sidebar and headers stay in place.
- Text columns stop at about 640 px wide (`--content-width`). Wide screens
  get more margin, not longer lines.
- Progressive disclosure: an empty page shows one empty state with the
  first action. Filters and sorting appear once there is content.
- One primary button per page or dialog.

## Navigation

- The current page is marked in the sidebar (`aria-current="page"`).
- Every page has a URL. Reload and Back keep people where they were.
- A command palette (Ctrl+K and Cmd+K) once there are more than about ten
  actions. It lists every command with its shortcut.
- `?` opens a shortcut sheet.

## Type

- The system font stack (`--font-sans`): San Francisco on Apple, Segoe UI
  on Windows, Roboto on Android. It loads instantly and looks native.
- Body 15 px, small 13 px, headings at most two sizes up. Weight and color
  make hierarchy before size does.
- `font-variant-numeric: tabular-nums` for numbers in columns and counts.
- Sentence case for labels and text, title case for buttons and titles.

## Color

- Neutral surfaces, one accent. The accent marks selection, the primary
  button, and focus. Not headings, not borders, not icons everywhere.
- Text in two levels: `--text` and `--text-secondary`. Never lighter than
  4.5:1 against its background.
- Red only for destructive actions and errors.
- A custom brand color goes on the icon, an empty state, and one hero
  element. Keep it off most controls.

## Dark mode

- Every token has a light and a dark value (`light-dark()`). Check every
  snapshot in both.
- Dark surfaces are dark gray (#1c1c1e), not black, and lighter surfaces
  sit higher (a card is lighter than the page).
- Never a fixed white or black in a component.
- `color-scheme: light dark` on `:root`, so scroll bars and form controls
  follow.

## Responsive

- Desktop first for tools, mobile first when the brief says phone.
- Under about 800 px wide, the sidebar becomes a menu button and the
  detail column replaces the list (Back returns).
- Touch targets are 44 px tall on phones. Hover-only actions also live in a
  menu.
- Snapshot the main pages at 390 px wide when the brief says mobile.

## Motion

- Motion explains a change: where a row went, where a panel came from.
  Never decoration.
- 120 to 200 ms (`--duration-quick`, `--duration-ui`). Nothing slower in
  everyday use.
- Search results and lists that filter as people type do not animate.
- `prefers-reduced-motion` sets durations to 0. The template's tokens do
  this, so every transition must use them.

## Controls

- Native elements first: `<button>`, `<input>`, `<select>`, `<dialog>`,
  `<details>`. Style them with tokens. They bring the keyboard, focus, and
  screen reader support for free.
- Focus rings show for keyboard use only (`:focus-visible`), in the accent
  color.
- Icons are one set, one stroke width, 16 px in rows and buttons. Every
  icon-only button has a label.

## Review checklist

On every snapshot, check in this order:

1. Where am I, what can I do, where can I go: each answered at a glance.
2. Nothing clipped, overlapping, or blank. Long titles truncate.
3. One accent, used for selection, the primary action, and focus only.
4. Both modes readable. No fixed white or black.
5. Edges line up (`layout-grid` checks pass).
6. Empty states invite the first action.

Done when the design plan exists, and every snapshot of the pages you
touched passes the review checklist in light and dark.
