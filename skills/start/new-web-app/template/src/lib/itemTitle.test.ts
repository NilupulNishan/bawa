import { describe, expect, test } from "vitest";
import { cleanTitle } from "./itemTitle";

describe("cleanTitle", () => {
  test.each([
    ["  Buy milk  ", "Buy milk"],
    ["Call\n  Anna", "Call Anna"],
    ["", "New Item"],
    ["   ", "New Item"],
  ])("%j becomes %j", (input, expected) => {
    expect(cleanTitle(input)).toBe(expected);
  });
});
