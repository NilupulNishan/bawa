// The sidebar pages. Snapshots and the self-test visit every entry, so a new
// page goes here first. Plain data with no React, so e2e tests can import it.
export const pages = [
  { id: "all", title: "All Items", icon: "tray" },
  { id: "starred", title: "Starred", icon: "star" },
] as const;

export type PageId = (typeof pages)[number]["id"] | "settings";

/** Every route snapshot mode visits, Settings last. */
export const routes: PageId[] = [...pages.map((page) => page.id), "settings"];
