---
name: ux-design
description: UX pass for one feature of a web app, covering names, flow, where it opens (inline, popover, panel, dialog, page), states, words, tooltips, accessibility, and AI features. Use before coding a story that adds a screen, an action, or text, when user-stories or improve-loop call it, or when the user asks for a UX review, clearer wording, better names, or whether something should be a modal.
argument-hint: "[story ID or screen]"
---

# UX design

A feature that works can still confuse people. This pass decides what
things are called, how a person moves through the feature, where it opens,
and what it says, before any code exists.

Run it once per story that adds a screen, an action, or words. The output
is a `UX:` block in the story in `docs/STORIES.md`, plus new terms in
`docs/GLOSSARY.md`. To review a built screen, run the same steps against
its snapshot and list what fails, most serious first.

## 0. Read

Read `docs/BRIEF.md`, `docs/GLOSSARY.md` (create it if missing), the story,
and its reference screenshots.

## 1. Name it

Every thing in the app has exactly one name, and every name lives in the
glossary.

```markdown
| Term | Means | Not |
| --- | --- | --- |
| Task | One thing to do, with an optional due date | to-do, item, entry |
| Complete | Mark a task done; it leaves the list | check, finish, close |
```

- Name the things first (the nouns in the brief), then the actions on them.
- Use the user's words, not the code's: "Task", not "TaskEntity" or "record".
- One word per idea across buttons, menus, titles, tooltips, and errors.
- Name a feature for what it does for the person, not the technology.
  Method: [writing.md](writing.md#names).

Check: every noun and verb the story puts on screen is in the glossary,
and no glossary term has a second name anywhere.

## 2. Map the flow

Write the flow as one line, from every way in to a clear end.

```text
N, toolbar +, command palette "Add Task" -> title field has focus -> Enter saves, row appears -> focus stays for the next task
```

- List every entry point: button, shortcut, command palette, context menu,
  drag and drop, a link.
- Cut steps: fill in good defaults, ask only for what you cannot guess.
- Every step has a way back: Escape cancels, Undo reverses, the browser
  Back button goes to the previous page.
- The end is visible: the new row, a checkmark, the dialog closing.

Check: the flow fits on one line, and each step names its way back.

## 3. Pick the surface

Go down this list and use the first one that fits. Lighter is better.

| The feature | Use |
| --- | --- |
| Changes one value on something already on screen | Inline (field, toggle, menu in the row) |
| Shows details of the selection while people keep working | Detail column or side panel |
| A few related choices tied to one control | Popover or menu |
| One short task that must finish or cancel before going on | Dialog (`<dialog>` with `showModal()`) |
| A long or self-contained task, or one worth a link | Its own page with a URL |
| A place people come back to, like a list or a collection | Navigation page |
| A rare action that destroys data and cannot be undone | Confirmation dialog |
| A problem people must act on right now | Inline banner at the top of the page |

- Show one modal at a time. Never open a dialog from a dialog.
- A dialog's title names its task: "Rename Project", not "Edit".
- Enter confirms, Escape cancels, and the confirm button names the action.
- Focus moves into a dialog when it opens and back to the control that
  opened it when it closes. `<dialog>` with `showModal()` does both.
- Anything worth sharing or reopening gets a URL. The Back button works.
- Ask before leaving only when people would lose what they typed
  (`beforeunload`).
- Information that needs no action goes inline, never in a dialog.

Check: the `UX:` block names the surface and the table row that picked it.

## 4. Cover the states

Every view the story touches has words and a look for each state:

- **Empty**: what it is for, plus the first action as a button.
- **Loading**: only when it can take longer than half a second. Show
  cached content first. A skeleton for the layout, words for what is
  happening ("Importing 12 notes"), and Cancel when it is safe.
- **Error**: inline, next to the problem, with the fix.
- **Offline**: what still works, and what waits for the network.
- **Too much**: long names truncate with the full text in a tooltip; a
  thousand rows still scroll smoothly.
- **Narrow**: the page works at 390 px wide when the brief says mobile.
- **Done**: visible feedback in the same frame, and Undo where it applies.

Check: each state has a snapshot page or seed data that shows it.

## 5. Write the words

- Buttons and menu items start with a verb: "Add Task", "Export…".
- Add an ellipsis when the command asks for more input before it acts.
- Title case for buttons, menu items, and page titles. Sentence case for
  labels, descriptions, and messages.
- Errors say what happened and how to fix it, without blame. Write
  "Unable to load tasks", never "Oops, something went wrong".
- Confirmations repeat the action: "Delete 3 Tasks?" with buttons "Delete"
  and "Cancel", never "Yes" and "No".

Patterns and before and after examples: [writing.md](writing.md).

A feature that uses AI (a summary, generated text, a model's suggestion)
also follows [ai-features.md](ai-features.md).

Check: read every string aloud. Each one is short, uses glossary terms
only, and a new user could say what each button does.

## 6. Add tooltips

- Every icon-only button gets `aria-label` with its name and `title` with
  what it does, starting with a verb, then its shortcut: `title="Add a
  task to this list (N)"`. Rules: [writing.md](writing.md#tooltips).
- Hover can reveal secondary actions on a row. The same actions are also in
  the context menu and on the keyboard, because touch screens have no hover.
- Hover feedback shows at once and never shifts the layout.
- Information people need is always visible. Hover only adds detail.

Check: every icon-only control in the snapshot has `aria-label` and `title`.

## 7. Check accessibility

Target WCAG 2.2 AA.

- The whole flow works with the keyboard alone: Tab reaches every control
  in reading order, focus is always visible, and nothing traps it.
- Real elements: `<button>` for actions, `<a href>` for navigation,
  `<label>` for fields, headings in order. A clickable `<div>` fails.
- A screen reader reads every control with the same words as the screen.
  Lists with a selection use `role="listbox"` and `aria-selected`; status
  messages use `role="status"`.
- Text contrast is 4.5:1 (3:1 for large text and control borders) in light
  and dark.
- Meaning never rests on color alone: add an icon or a word.
- Targets are at least 24 by 24 px.
- `prefers-reduced-motion` turns slides and bounces into fades or nothing.
  The template's motion tokens do this.
- Text zoom to 200% keeps everything readable without sideways scrolling.

Automated check: add `@axe-core/playwright` to the self-test and expect no
violations on each page (the `test-web-app` skill).

Check: you ran the flow keyboard-only, and the axe check passes for the
new views.

## 8. Write the UX block

Add the result under the story's acceptance lines:

```markdown
UX:
- Flow: N, toolbar + -> title field -> Enter saves -> focus stays
- Surface: inline row at the top of the list (changes one value on screen)
- States: empty "No Tasks" with "Add Task"; error "Give the task a title." under the field
- Words: "Add Task", tooltip "Add a task to this list (N)", toast "Task added" with Undo
- Access: Enter saves, Escape cancels; label "New task title"
```

Done when the story has a `UX:` block, every term it uses is in
`docs/GLOSSARY.md`, and steps 1 to 7 pass on its snapshots.
