// Checks the layout files that snapshot mode writes next to every PNG.
// Every probe must start a multiple of 4 px from its area's edge, stay
// inside the area's inset, share one leading edge with the probes on its
// edge, and not overlap another probe in its area.
// Usage: node tools/check-layout.mjs [shots-folder]
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const dir = process.argv[2] ?? "shots";
if (!existsSync(dir)) {
  console.log(`FAIL check-layout: no ${dir}/ folder. Run npm run snap first.`);
  process.exit(1);
}
const files = readdirSync(dir).filter((name) => name.endsWith("-layout.json"));
if (files.length === 0) {
  console.log(`FAIL check-layout: no layout files in ${dir}/. Run npm run snap first.`);
  process.exit(1);
}

const near = (a, b) => Math.abs(a - b) < 0.5;
let failed = 0;

for (const file of files) {
  const problems = [];
  let probeCount = 0;
  for (const area of JSON.parse(readFileSync(join(dir, file), "utf8"))) {
    const edges = new Map();
    probeCount += area.probes.length;
    for (const probe of area.probes) {
      const offset = probe.left - area.left;
      if (!near(offset % 4, 0) && !near(offset % 4, 4)) {
        problems.push(`${area.area}/${probe.name} starts ${offset.toFixed(1)} px into ${area.area}, not on the 4 px grid`);
      }
      if (offset < area.inset - 0.5 || probe.right > area.right - area.inset + 0.5) {
        problems.push(`${area.area}/${probe.name} is not inside its ${area.inset} px inset`);
      }
      if (probe.edge !== "none") {
        edges.set(probe.edge, [...(edges.get(probe.edge) ?? []), probe]);
      }
    }
    for (const [edge, probes] of edges) {
      const lefts = [...new Set(probes.map((probe) => Math.round(probe.left)))];
      if (lefts.length > 1) {
        problems.push(`edge ${area.area}/${edge} has ${lefts.length} leading edges: ${probes.map((p) => `${p.name} ${Math.round(p.left)}`).join(", ")}`);
      }
    }
    for (const [i, a] of area.probes.entries()) {
      for (const b of area.probes.slice(i + 1)) {
        const overlaps = a.left < b.right - 0.5 && b.left < a.right - 0.5 && a.top < b.bottom - 0.5 && b.top < a.bottom - 0.5;
        if (overlaps) problems.push(`${area.area}/${a.name} overlaps ${b.name}`);
      }
    }
  }
  if (problems.length) {
    failed++;
    console.log(`FAIL ${file}`);
    for (const problem of problems) console.log(`  - ${problem}`);
  } else {
    console.log(`PASS ${file}: ${probeCount} probes`);
  }
}

if (failed) process.exit(1);
