---
name: bawa
description: Build any web app. Start here to pick the next skill for a local-first web app.
disable-model-invocation: true
---

# Build any web app

Find where the user is on the path below, then call the Skill tool with the
skill for that step. One skill per call.

```text
idea -> research -> clone (optional) -> app-brief -> user-stories -> new-web-app
     -> web-design + design-system + app-icon -> improve-loop (ux, code, design, verify, commit) -> deploy -> repeat
```

Pick the app's name first (app-brief, step 1) and create
`<parent>/<app-name>/docs/` before research, so every skill writes into the
same folder. Design comes right after the scaffold: tokens from the first
view, and the real icon in every snapshot.

## Plan

| The user has | Skill |
| --- | --- |
| A vague idea, or asks "what should I build" | `research`, then `app-brief` |
| An app or site they want to replace or rebuild | `clone` |
| A brief or a screen index, no backlog | `user-stories` |

## Build

| The user wants to | Skill |
| --- | --- |
| Start a new project | `new-web-app` |
| Write or fix TypeScript and React code | `typescript-react` |
| Reach outside the tab: offline, install, notifications, files, clipboard, share | `web-integrations` |
| Make it fast: slow load, janky scroll, big bundle, memory | `performance` |
| Refactor, clean up, or check the code as it grows | `improve-architecture` |

## Design

| The user wants to | Skill |
| --- | --- |
| Decide how a feature works and what it says: names, flow, dialogs, accessibility | `ux-design` |
| Make it look and feel like a well made app | `web-design` |
| An accent or brand color, a color picker, tokens, one set of radii and motion | `design-system` |
| Fix spacing and alignment, or check the layout on the grid | `layout-grid` |
| An app icon, favicon, or home screen icon | `app-icon` |

## Ship

| The user wants to | Skill |
| --- | --- |
| Build it and look at every page | `build-and-verify` |
| Tests, a self-test, or end-to-end checks | `test-web-app` |
| Work through the backlog on its own | `improve-loop` |
| Put it online | `deploy` |

## Done when

You named the step, called its skill, and told the user which skill comes
after it.
