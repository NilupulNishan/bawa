---
name: app-brief
description: One-page brief (docs/BRIEF.md) for a new web app, written before any code. Use when the user has an app idea, wants to replace a web app or SaaS they pay for, or the research and clone skills are done.
argument-hint: "[idea in a few words]"
---

# App brief

Write `docs/BRIEF.md` in a folder named after the app
(`<parent>/<app-name>/docs/BRIEF.md`; ask for the parent folder, default
the current folder). Every later skill reads it. Keep it to one page.

## 1. Name and read what exists

Pick the name first: a lowercase npm-style name for the folder and package
(`tasks`, `daily-log`) and a display title (`Daily Log`). The folder, the
research, and the scaffold all use it.

If `docs/research/` or `docs/screens/INDEX.md` exist, read them first.
Skip every question they already answer.

## 2. Interview

Ask a few questions at a time. If the user asked you to decide everything,
answer each question yourself from the research, write the choice in the
brief, and note "decided by the agent" next to it.

1. What do you do today, and which app, site, or habit does it replace?
2. What are the three things you do most often? These become the main pages.
3. What data does it hold? Name the nouns: tasks, notes, recipes, invoices.
4. Is there a reference app you like? Then the `clone` skill comes next.
5. Where is it used: a desktop browser, a phone, or both? Installed to the
   home screen or Dock (a PWA), or a normal tab?
6. Where does the data live? Default: in the browser, local-first, no
   server. A server only when the data must be shared or reach another
   device.
7. Which three things are out of scope for version one?
8. What should it look like? Note a brand or accent color, and any app
   they name ("like Linear"). No answer means a clean neutral look with a
   blue accent people can change in Settings.

## 3. Cut scope

A personal app has one user. Remove what exists only for other users:
accounts, sharing, teams, sync servers, billing, onboarding, analytics. If
the user wants data on two devices, note "later: export and import, then
sync".

Version one is one afternoon of agent time: one shell, two to five main
pages, one data model with two to four types. Smart lists that filter one
model (Today, Upcoming, Someday) count as one page.

## 4. Write docs/BRIEF.md

```markdown
# <App Title>

One sentence: what it is and who it is for.

## Replaces
<app, site, or habit>

## Main jobs
1. ...
2. ...
3. ...

## Data
- <Type>: <fields>

## Shape
<sidebar app / single page tool / dashboard>, desktop first or mobile first.
Data in the browser (IndexedDB). Works offline. No accounts.

## Browser hooks
<installable PWA, offline, notifications, file open and save, clipboard, share, or "none">

## Reference
<app name or URL, or "none">

## Look
<neutral with an accent (name it), or "like <app>", and why>

## Not in version one
- ...
```

## 5. Hand off

Call the Skill tool with `user-stories`, or with `new-web-app` if the user
wants to see the app running first.

Done when `docs/BRIEF.md` exists, fits on one page, and has every section.
