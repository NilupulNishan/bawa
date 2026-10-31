import { db, isTestStore } from "./db";

// Sample data for snapshots: ?store=<name>&seed=1 fills an empty test store
// with realistic items (short and long titles, starred and not). Replace
// these with your app's own types. Seed only what a person can create in
// the app, or the snapshots show features no one can use.
export async function seedIfRequested() {
  if (new URLSearchParams(location.search).get("seed") !== "1") return;
  if (!isTestStore) {
    console.warn("seed=1 ignored: add ?store=<name> to use a test database");
    return;
  }
  if ((await db.items.count()) > 0) return;
  const samples: [string, boolean][] = [
    ["Book the dentist", false],
    ["Read the article about local-first software and write down three ideas worth trying", true],
    ["Renew passport", false],
    ["Plan the weekend trip", true],
    ["Call Anna", false],
    ["Back up the photo library to the external drive before the trip", false],
    ["Groceries", false],
    ["Draft the quarterly review", true],
  ];
  const now = Date.now();
  await db.items.bulkAdd(
    samples.map(([title, starred], index) => ({
      id: crypto.randomUUID(),
      title,
      notes: "",
      starred,
      createdAt: now - index * 3_600_000,
    })),
  );
}
