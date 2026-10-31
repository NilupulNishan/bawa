# BAWA

Agent skills for building local-first web apps. Installed as a Claude Code
and Codex plugin from `.claude-plugin/`, or through `npx skills add`.
`AGENTS.md` at the root is a copy of this file (`.claude/CLAUDE.md`);
keep them identical.

## Layout

- `skills/<stage>/<name>/SKILL.md`, stages in pipeline order: `start`, `plan`,
  `code`, `design`, `ship`.
- References sit next to `SKILL.md` (`writing.md`, `ai-features.md`) and are
  linked relatively. Scripts go in `scripts/`, templates in `template/`.
- `agents/openai.yaml` in every skill: Codex display name and short
  description. A user-invoked skill also sets
  `policy.allow_implicit_invocation: false`.
- `.claude-plugin/plugin.json` lists every shipped skill in `skills`.
- `skills/start/new-web-app/template/` is a working app. Scripts and tools
  are Node (`.mjs`), so they run on Windows, macOS, and Linux.

## Writing skills

Follow Matt Pocock's `writing-for-agents` rules:

- The description is a **context pointer**: one short sentence on what it
  is, then "Use when" and one trigger per branch. Front-load the leading
  word.
- Inline what every branch needs. Push what only some branches need into a
  sibling file behind a link.
- Every step ends on a checkable condition. Every skill ends with a
  "Done when" line.
- Prompt the positive. Use a prohibition only as a hard guardrail, next to
  the positive target.
- Cache only what the environment cannot tell the agent: conventions,
  reasons, gotchas from real apps.
- One skill calls another with "Call the Skill tool with `<name>`".
- No em dashes. Plain words, short sentences, active voice.

## Changing the template

Prove it still works before you commit:

```bash
node skills/start/new-web-app/scripts/new-app.mjs try-app <scratch-folder>
cd <scratch-folder>/try-app && npm run check
```

`npm run check` exits 0, and the snapshots in `shots/` look right in light
and dark. On Windows, `cd` to a path whose case matches the disk.

## Adding a skill

1. Create `skills/<stage>/<name>/SKILL.md` and `agents/openai.yaml`.
2. Add it to `plugin.json` `skills`, the README table, and the router
   (`skills/start/bawa/SKILL.md`).
3. Run `claude plugin validate . --strict`.
4. Keep `version` in `plugin.json` at 1.0.0 until the first release. After that, bump it, so installed copies update.
