// Rules for item titles. Logic lives in src/lib with no React or database,
// so unit tests run it in milliseconds. Put parsers, date rules, and data
// rules here too.

/** Trims spaces and line breaks, collapses inner runs of spaces, and falls
 * back to "New Item" for an empty title. */
export function cleanTitle(text: string): string {
  const words = text.split(/\s+/).filter(Boolean);
  return words.length === 0 ? "New Item" : words.join(" ");
}
