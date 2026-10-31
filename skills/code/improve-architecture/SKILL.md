---
name: improve-architecture
description: Architecture check-in for a growing TypeScript web app. Finds hot spots, proposes deeper modules, and refactors one step per commit with behavior proven unchanged. Use at the end of a milestone, before a big feature, when a file passes 400 lines, when one feature touches many files, when bugs repeat in one area, or when the user asks to refactor or clean up the code.
---

# Improve architecture

Features pile up, and an app that was easy to change gets hard to change.
A **check-in** catches that early: survey, propose, let the user pick, then
refactor in small steps that keep behavior the same.

## When to run

Any one signal is enough:

- The end of a milestone (the `improve-loop` skill calls this skill there).
- Before a big feature. Ask: "What change to the code would make this
  feature easy?"
- A file over 400 lines (act at 700), or a component over 250 lines.
- One feature touched more than 6 files.
- The same area shows up in 3 fix-log entries, or the same kind of bug
  happens twice.
- A component re-renders on every key press for state it does not show.
- Logic that a test needs lives inside a component or a hook.

## Vocabulary

Use these words exactly, so proposals stay comparable:

- **Module**: anything with an interface and an implementation (a
  function, a file, a folder).
- **Interface**: everything a caller must know: signatures, ordering,
  error modes, async behavior, performance.
- **Depth**: how much a module does per unit of interface. Deep modules
  hide a lot behind a small interface. Shallow modules are pass-throughs.
- **Seam**: a place where you can swap behavior without editing callers.
- **Adapter**: one implementation behind a seam. One adapter is a
  hypothetical seam. Two (production and test) make it real.
- **Locality**: a change touches one place. **Leverage**: callers get a lot
  for little.

## 1. Survey

Change no code in this step.

1. Read `CLAUDE.md`, `ARCHITECTURE.md`, `docs/adr/`, and `docs/FIXLOG.md`
   where they exist.
2. Find hot spots:

   ```bash
   git log --since=30.days --name-only --format= | sort | uniq -c | sort -rn | head -20
   git ls-files 'src/*.ts' 'src/*.tsx' | xargs wc -l | sort -n | tail -20
   ```

3. Map the structure: features and their files, what imports what, where
   the database is read and written.
4. Look for React and TypeScript friction:
   - One component that owns everything (`App.tsx` with every handler).
   - Hooks and wrappers that only forward calls.
   - Database calls spread through many components instead of one module
     per feature.
   - Pure logic inside components or hooks, which unit tests cannot reach.
     Move it into `src/lib/`.
   - Props passed through three levels that no middle level reads.
   - Copies that drifted: the same helper or style defined in two files.
   - A settings card or dialog that lives far from its feature.
5. **Deletion test** for each candidate: if you deleted this module, would
   its complexity concentrate in one place (keep it) or spread to every
   caller (it earns its place)? Pass-throughs fail the test.

## 2. Propose

Write `docs/architecture-review-<YYYY-MM-DD>.md`, one card per candidate:

```markdown
## <Title in domain nouns>  [Strong | Worth exploring | Speculative]

Files: src/App.tsx (820 lines), ...
Signal: <which trigger above>
Problem: <what is hard to change today, with one example>
Proposal: <the new module and its interface, 15 lines of TypeScript at most>
Benefits: <locality and leverage; which tests get simpler>
Proof of same behavior: <unit tests, self-test, snapshots, perf baseline>
Plan: <one commit per step>
```

End with a **top recommendation** and a short "considered, not
recommended" list. "The code is fine" is a valid result: then every card
is `Speculative` or there are none.

Stop and ask the user which candidate to do. In an unattended loop, do the
top recommendation only if it is `Strong`. Leave the rest in the file.

## 3. Refactor

- **Before:** record the proof: `npm run check` passes, and the snapshot
  PNGs are saved aside for comparison. Add a performance baseline where
  speed matters.
- One refactor per commit. Behavior stays the same. No features mixed in.
- New modules go in new files that build first. Then move callers over.
  `npm run build` passes after every step.
- Replacing an engine: keep the old path behind a flag for one milestone,
  then delete it.
- Replace tests, do not layer them: delete the old shallow tests that the
  new interface tests cover.
- If a diff passes about 10 files, split it.
- If the interface is open, design it twice: sketch two or three
  interfaces under different constraints (fewest entry points, simplest
  common caller, ports and adapters) and pick one with a reason.

## 4. Record

- Update `ARCHITECTURE.md`: features, layers, dependency direction, seams.
- Add an ADR in `docs/adr/` only when the decision is hard to reverse,
  surprising without context, and a real trade-off.
- Add a `docs/FIXLOG.md` entry for any bug the refactor found. Every entry
  ends with a `Rule:` line.

Done when the review file exists, the chosen refactor is committed in
steps, `npm run check` passes before and after, the snapshots match, and
`ARCHITECTURE.md` matches the code.
