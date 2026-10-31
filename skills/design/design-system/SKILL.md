---
name: design-system
description: Accent color and design system for a web app, from the accent and the accent picker in Settings to CSS tokens plus a design/DESIGN-SYSTEM.md that says which token to use when. Use when the user wants a brand or accent color, wants people to pick a color, when an app has more than a few screens, when screens drift apart or animations feel inconsistent, or when the user asks for themes, a style guide, or design tokens.
---

# Design system

A design system is a short list of **tokens** in code and one page that
says which token to use when. Every component uses tokens, never raw
values. Then a change in one place changes the whole app, and an agent can
review a screen against one page.

Start from `web-design`. The template already has the base:

- `src/ui/tokens.css`: spacing, widths, radii, type, surfaces, text, motion,
  and one `[data-accent="<id>"]` block per accent with `--accent`,
  `--accent-text`, and `--on-accent`. Light and dark through `light-dark()`.
- `src/ui/theme.ts`: the accent list, the saved choice, `?accent=<id>` for
  snapshots.
- `src/Settings.tsx`: Settings > Appearance, where people pick the accent.
  Light and dark follow the system. Add a System, Light, Dark choice only
  when the owner asks, with System as the default.

## 1. Pick the accent

Read `## Look` in `docs/BRIEF.md`. With no color named, keep `blue`.

For a brand color, add an accent with three values:

- `--accent`: fills (primary button, selection). White text on it passes
  4.5:1 in both modes. If white does not pass (yellow, mint, cyan), set
  `--on-accent` to a dark color instead.
- `--accent-text`: accent-colored text on normal surfaces. A deeper shade in
  light mode, a lighter shade in dark mode.
- `--on-accent`: text and icons on an accent fill.

Add the id to `accents` in `theme.ts` and set `defaultAccent`. Keep the
picker, so people can still choose their own color.

To compare colors, run `SNAP_ACCENT=<id> npm run snap` for two or three of
them and show the user the PNGs.

Check: every accent passes 4.5:1 for `--on-accent` on `--accent` and for
`--accent-text` on `--surface`, in light and dark. Check with the axe test
in the self-test, or a contrast checker.

## 2. Collect

New app with no views yet? Skip this step: the template's tokens are the
defaults.

Existing app: read every component and stylesheet. List each raw value you
find: hex colors, `rgb()`, opacities, radii, paddings, widths, durations,
easing curves, shadows. Group them. Most apps have 3 to 5 of each where 1
or 2 are meant.

## 3. Write the tokens

All tokens live in `src/ui/tokens.css`, grouped with a comment per group:

| Group | Tokens |
| --- | --- |
| Spacing | `--space-xs 4` to `--space-section 32`, `--space-margin 20` |
| Widths | `--sidebar-width`, `--list-width`, `--content-width`, dialog widths |
| Radii | `--radius-sm 4` controls inside controls, `--radius-md 8` buttons and rows, `--radius-lg 12` cards, `--radius-xl 16` dialogs, `--radius-full` pills |
| Type | `--font-sans`, `--text-sm` to `--text-xl`, `--leading` |
| Surfaces | `--bg`, `--surface`, `--sidebar`, `--hover`, `--hairline`, `--shadow` |
| Text | `--text`, `--text-secondary`, `--danger` |
| Accent | `--accent`, `--accent-text`, `--on-accent` per `[data-accent]` |
| Motion | `--duration-quick`, `--duration-ui`, `--ease` |

Add each token when the app first needs it. A new token needs a name that
says its job (`--row-height`), not its value (`--gray-200`).

## 4. Write design/DESIGN-SYSTEM.md

One section per group above. Each section says which token to use when,
and the rules that go with it. Keep it under 100 lines. Rules that transfer
to most apps:

- Never a raw color, radius, or duration in a component. Use a token.
- Every color token has a light and a dark value, and a stronger value
  under `prefers-contrast: more` where contrast is close to the limit.
- Accent-colored text uses `--accent-text`. Text on an accent fill uses
  `--on-accent`, never a fixed white.
- Style native controls. Never rebuild a button or a checkbox from `<div>`s:
  it loses the keyboard, focus, and the screen reader.
- Inner corners are concentric: inner radius = outer radius - inset.
- Every transition uses the motion tokens, so reduced motion applies
  everywhere.
- Search results and filtering lists do not animate. Speed wins.
- Hover never moves a selection. Only a click or a key does.
- Never animate a page's first render.
- One primary button per page or dialog.

## 5. Migrate

Replace raw values one screen per commit. After each, run `npm run snap`
(`build-and-verify` skill). The screen looks the same or better, never
worse.

## 6. Point agents at it

Add one line to the app's `CLAUDE.md`: "Design rules:
`design/DESIGN-SYSTEM.md`. Use its tokens; never raw colors, radii, or
durations."

Done when this finds no hits outside `tokens.css`:

```bash
grep -rnE '#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(|border-radius: *[0-9]|[0-9]+ms|cubic-bezier' src --include=*.css --include=*.tsx | grep -v tokens.css
```

(hex strings in data and SVG files are fine), and DESIGN-SYSTEM.md has a
section for every token group.
