---
name: research
description: Online research for a web app before building it, run as parallel researcher subagents, saved to docs/research/. Use when the user asks what to build, which features matter, how the best apps in a category work, how a browser API works, or wants a feature comparison.
argument-hint: "<app category or question>"
---

# Research

Research answers three questions before code exists: what the best apps in
the category do, what users love and hate about them, and what the browser
lets you build. The output feeds `app-brief` and `user-stories`.

## 1. Frame

Write the question in one line, and the decision it informs ("which
features go in version one", "IndexedDB or the File System Access API").
If the user gave only a category, the question is "what makes the best
<category> web app".

## 2. Fan out

Start one subagent per track, in parallel, with the brief below. Pick the
tracks that fit. Four is typical. Market and Reviews always run. Reviews
covers many apps: give each subagent 3 or 4 apps, or the 600 words run out.

| Track | Finds |
| --- | --- |
| Market | The 5 to 8 best apps in the category, their price, platforms, and headline features |
| Reviews | Per app: what people like and dislike, from G2, Capterra, Product Hunt, Reddit, Hacker News, and "switched from X" posts |
| Features | The full feature list of the 2 or 3 leaders, from docs, changelogs, and help pages |
| Design | Screens, interaction details, and keyboard shortcuts of the leaders |
| Platform | The browser APIs each feature needs, their support in Chrome, Safari, and Firefox (MDN, caniuse), and the permission each one asks for |

Subagent brief (fill in the brackets):

```text
Research [track] for a web app that [one-line idea].
Question: [the question]. Decision it informs: [decision].
Search the web. Prefer primary sources: official docs, changelogs, MDN,
web.dev, caniuse, the app's own help pages. Use reviews and forums for
opinions only. If a source is blocked, say so and use another. Do not
write any files.
Tag every claim: [V] verified in a source (give the URL), [K] from your
own knowledge, [U] unverified, must be tested.
Return at most 600 words: a findings list, a table where it helps, and
the 3 things that matter most for the decision. No intro, no summary.
```

## 3. Merge

Write one file per question: `docs/research/<topic>.md`.

```markdown
# <Topic>

Research for <App Title>. Done <YYYY-MM-DD>.
[V] verified in a source, [K] from knowledge, [U] unverified, test first.

## Findings
- ... [V](url)

## Likes and dislikes
| App | People like | People dislike | Sources |
| --- | --- | --- | --- |
| App A | <3 to 5 points, most mentioned first> | <3 to 5 points> | <urls> |

Patterns: <likes that repeat across apps (must have), dislikes that repeat
(our chance to do better)>

## Feature matrix
| Feature | App A | App B | App C | Version one? |

## Browser support
| API | Chrome | Safari | Firefox | Fallback |

## Decisions
1. <decision>, because <finding>. Planned test: <test, for a [U] finding>.

## Open questions
- <[U] claim and how to test it>
```

Keep the feature matrix: `user-stories` turns its "Version one?" column
into stories. Every "People like" point maps to a decision or to an
"accepted gap" line in the brief, so nothing loved is dropped by accident.
Every API the app needs has a row in the support table and a fallback for
the browsers that lack it. Turn each `[U]` that a decision depends on into
a test before you trust it (a small page in `docs/research/probes/`, or a
self-test step).

## 4. Hand off

Call the Skill tool with `clone` if one app stands out as the reference
and you can open it in a browser. Then call the Skill tool with
`app-brief`.

Done when every track returned, the file has a likes and dislikes table
for every app in the market list, a feature matrix, a browser support
table, and a decision list, and every decision cites a `[V]` or a planned
test.
