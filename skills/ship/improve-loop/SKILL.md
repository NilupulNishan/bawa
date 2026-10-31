---
name: improve-loop
description: Autonomous loop that works through docs/STORIES.md one story at a time for a web app, building, snapshotting, comparing against reference screenshots, fixing, and committing, until a milestone is done. Use when the user says "keep going", "work through the backlog", "make it match the reference", or wants an unattended improvement loop.
argument-hint: "[milestone, e.g. M1]"
---

# Improve loop

One pass through the loop takes one story from `todo` to `done`:

```text
pick story -> plan -> code -> npm run build -> snapshot -> compare -> fix -> commit -> update STORIES.md
```

Stop after the milestone the user named, or after the current milestone if
they named none. Then report.

## 1. Pick

Open `docs/STORIES.md`. Take the first `todo` story in the current
milestone whose dependencies are `done`. Set it to `doing`.

## 2. Plan

If the story adds a screen, an action, or words and has no `UX:` block
yet, call the Skill tool with `ux-design` first.

Write two to five lines in the commit body: which files change, which
data fields are new, which shortcut it adds, which snapshot page shows it.
If the story needs a new field, make it optional or give it a default where
it is read, so data saved before still loads. A new index needs a new
`db.version(n)`.

## 3. Code

Follow the `typescript-react` and `web-design` skills, the story's `UX:`
block, and `design/DESIGN-SYSTEM.md` if the app has one. Browser features
follow `web-integrations`. Keep each component file under about 300 lines.
Put new pages in `src/pages.ts` so snapshots and the self-test visit them.

## 4. Build and snapshot

Follow the `build-and-verify` skill. If the story has logic, add a unit
test or a self-test step (`test-web-app` skill). Seed data makes pages show
real content.

## 5. Compare

Open your snapshot and the story's reference screenshot side by side with
the Read tool. Write down the differences that matter, in this order:

1. Missing or wrong behavior from the acceptance criteria.
2. Words and flow: names, surface, and states that differ from the `UX:`
   block or `docs/GLOSSARY.md`.
3. Layout: wrong column, wrong order, missing element, and every FAIL from
   the grid checks.
4. Hierarchy: what is biggest, boldest, first.
5. Spacing and alignment.
6. Color and details.

The goal is the same structure and behavior, built with the app's own
tokens and parts. It is not a pixel copy, and it takes no logo, text, or
brand from the reference.

No reference screenshot (no app was cloned)? Compare against the story's
acceptance lines and the `web-design` rules instead.

Snapshot only the pages a story touches (`SNAP_PAGES`), and the full set at
the end of each milestone.

Fix, rebuild, and compare again. Three rounds per story at most. If it
still does not match, set the story to `todo` again with a note that says
what is blocking, and move on.

## 6. Commit and record

```bash
git add -A
git commit -m "Complete tasks with X"
```

Set the story to `done` in `docs/STORIES.md` and commit that with the code.
One story per commit, so any story can be reverted on its own. M1 may land
as one commit when its stories share one skeleton (data model, pages, list,
storage); from M2 on, one story per commit.

## 7. Report

At the end of the loop, report to the user:

- Stories done, with one line each and the snapshot paths that show them.
- Stories blocked, and why.
- Anything the user should try by hand (shortcuts, drag and drop, install).
- The next story in line.

Then start `npm run dev` so the user can try the new build.

## Milestone check-in

When the last story of a milestone is `done`, run `npm run check`, then
call the Skill tool with `improve-architecture` before you start the next
milestone. Unattended, do its top recommendation only if it is `Strong`,
and leave the rest in the review file for the user.

When a story fixes a bug, add an entry to `docs/FIXLOG.md`: symptom,
cause, fix, and a last line `Rule: <what to always or never do>`. The fix
log outlives squashed history, and the check-in reads it.

## Running it unattended

The loop works with no one watching, because every step checks itself:
the build, the self-test, the snapshots, the acceptance criteria. To let it
run longer, start it with a clear limit ("finish M2, then stop"), make sure
the tree is committed before you start, and keep every test on a
`?store=` test database. Each story is a separate commit, so the user can
review the history in the morning and revert anything they do not like.

Done when every story in the milestone is `done` or named in the report as
blocked with a reason, each done story has its own commit, `npm run check`
passes, and the user has the report.
