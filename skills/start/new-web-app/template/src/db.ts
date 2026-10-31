import Dexie, { type EntityTable } from "dexie";

export interface Item {
  /** A stable id for links, export, and the self-test. */
  id: string;
  title: string;
  notes: string;
  starred: boolean;
  createdAt: number;
}

// ?store=<name> opens a separate test database, so snapshots, seed data, and
// the self-test never touch the real one. Without it the app opens the real
// database for this origin.
const params = new URLSearchParams(location.search);
export const storeName = params.get("store");
export const isTestStore = storeName !== null && /^[a-z0-9-]+$/.test(storeName);

export const db = new Dexie(isTestStore ? `__APP_NAME__-${storeName}` : "__APP_NAME__") as Dexie & {
  items: EntityTable<Item, "id">;
};

// Add a new version for every schema change. Give new fields a default where
// they are read, so data saved by older versions keeps loading. Index only
// fields you sort or query on. IndexedDB cannot index booleans: store 0 or 1
// for a flag you query with where().
db.version(1).stores({
  items: "id, createdAt",
});
