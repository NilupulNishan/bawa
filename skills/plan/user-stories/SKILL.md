---
name: user-stories
description: Prioritized backlog of user stories with checkable acceptance criteria (docs/STORIES.md) for a web app, built from a brief, research, or screen index. Use after app-brief or clone, or when the user asks for user stories, a backlog, a feature list, or "what do we build first".
---

# User stories

Screens show what an app looks like. Stories say what a person does with
it. You build and test stories, not screens.

Read `docs/BRIEF.md`, `docs/research/*.md`, and `docs/screens/INDEX.md`
where they exist. Write `docs/STORIES.md`.

## Story format

```markdown
### S-012 Complete a task with the keyboard
As the user, I select a task and press X to complete it.
Screens: 01-inbox.png, 02-today.png
Depends: S-004
Acceptance:
- [snap] The circle fills and the row fades out within half a second.
- [e2e] An "Undo" toast shows for five seconds; Z also undoes it.
- [unit] A recurring task moves to its next date.
Status: todo
```

- One action per story. "Rename a project from its context menu", not
  "Manage projects".
- Every acceptance line starts with how it is checked: `[snap]` snapshot,
  `[unit]` unit test, `[e2e]` self-test in the browser, `[manual]` a person
  must try it. "Works well" is not checkable.
- `Screens:` links reference screenshots, so `improve-loop` knows what to
  compare. Without a reference app, name the snapshot pages that will show
  the story. A dialog, popover, or menu needs its own snapshot state.
- `Depends:` (optional) lists stories that must be done first.
- Keep a control and the only surface that shows it in one story: a
  field that lives only in the quick-add dialog ships with the dialog.
- Status: `todo`, `doing`, `done`, or `dropped`.

## Milestones

Each milestone ends with an app the user can use for a day.

1. **M1 Core loop**: the one thing the app is for, end to end. Data
   survives a reload.
2. **M2 Organize**: the main structure, navigation pages, moving items.
3. **M3 Time**: dates, Today and Upcoming, recurrence, reminders.
4. **M4 Speed**: quick-add, command palette, keyboard navigation, search,
   shortcut help on `?`.
5. **M5 Browser**: install as an app, offline, notifications, export and
   import, share.
6. **M6 Polish**: drag and drop, context menus, empty states, icon,
   settings, phone layout.

Rename milestones to fit the app. Inside a milestone, stories that others
depend on come first.

## Seed data

Every attribute the seed data sets (icons, colors, notes) is something a
story lets the user create in the app. Otherwise snapshots show features
no one can use.

## Leave things out

Drop what exists only for other people or for the vendor: accounts,
sharing, teams, integrations, upgrade prompts, gamification. List them
under `## Dropped`, one line each, so the decision is visible.

## UX notes

For each M1 story that adds a screen, an action, or words, call the Skill
tool with `ux-design`. It adds a `UX:` block under the acceptance lines and
starts `docs/GLOSSARY.md`, so every story uses the same names. Later
milestones get their UX notes in `improve-loop`, just before they are built.

## Size check

M1 has 5 to 10 stories. Over 60 stories in total means version one is too
big: move stories to `## Later`.

Done when every main job in the brief, every "Version one: yes" row in the
research matrix, and every screen in the index maps to a story or a
`Dropped` line, and every M1 story with UI has a `UX:` block.
