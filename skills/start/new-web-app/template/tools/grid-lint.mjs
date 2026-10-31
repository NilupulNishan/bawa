// Flags px numbers off the 4 px grid in src/ (CSS and TSX). Allowed: 0, 1,
// 2, and multiples of 4. Type lines (font-size, line-height, letter-spacing)
// and tokens.css are skipped. Mark a deliberate exception with "grid: ok".
// Usage: node tools/grid-lint.mjs
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const skip = /font-size|line-height|letter-spacing|grid: ok/;
const files = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path);
    else if (/\.(css|tsx)$/.test(name) && name !== "tokens.css") files.push(path);
  }
})("src");

let failures = 0;
for (const file of files) {
  readFileSync(file, "utf8")
    .split("\n")
    .forEach((line, index) => {
      if (skip.test(line)) return;
      for (const match of line.matchAll(/(?<![\w.-])(\d+(?:\.\d+)?)px/g)) {
        const value = Number(match[1]);
        if (value <= 2 || value % 4 === 0) continue;
        console.log(`${file}:${index + 1}: off grid (${value}px): ${line.trim()}`);
        failures++;
      }
    });
}

if (failures) {
  console.log(`FAIL grid-lint: ${failures} lines off the grid`);
  process.exit(1);
}
console.log(`PASS grid-lint: ${files.length} files`);
