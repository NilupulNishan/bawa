import { isTestStore } from "../db";

// The accent colors people can pick in Settings. Each id has light and dark
// shades in tokens.css ([data-accent="<id>"]). Add one here and there.
export const accents = [
  { id: "blue", name: "Blue" },
  { id: "purple", name: "Purple" },
  { id: "pink", name: "Pink" },
  { id: "orange", name: "Orange" },
  { id: "green", name: "Green" },
  { id: "graphite", name: "Graphite" },
] as const;

export type AccentId = (typeof accents)[number]["id"];

export const defaultAccent: AccentId = "blue";
const storageKey = "__APP_NAME__.accent";

function isAccent(value: string | null): value is AccentId {
  return accents.some((accent) => accent.id === value);
}

/** ?accent=<id> wins, so snapshots can compare accents. Then the saved choice. */
export function loadAccent(): AccentId {
  const fromURL = new URLSearchParams(location.search).get("accent");
  if (isAccent(fromURL)) return fromURL;
  try {
    const saved = localStorage.getItem(storageKey);
    if (isAccent(saved)) return saved;
  } catch {
    // Storage can be blocked (private mode, strict settings). Use the default.
  }
  return defaultAccent;
}

export function applyAccent(id: AccentId) {
  document.documentElement.dataset.accent = id;
}

/** Saves the choice. Test and snapshot runs leave the saved choice alone. */
export function saveAccent(id: AccentId) {
  applyAccent(id);
  if (isTestStore) return;
  try {
    localStorage.setItem(storageKey, id);
  } catch {
    // Not saved; the choice still applies until the page reloads.
  }
}
