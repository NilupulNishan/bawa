#!/usr/bin/env node
// Creates a new web app from the template next to this script. Runs the same
// on Windows, macOS, and Linux.
// Usage: node new-app.mjs <app-name> [parent-folder] [--title "Daily Log"] [--no-install]
//   node new-app.mjs daily-log ~/dev --title "Daily Log"
// Creates <parent-folder>/<app-name>. If that folder exists, it must not have
// a package.json yet; existing files (like docs/BRIEF.md) are kept.
// app-name is lowercase letters, digits, and dashes (an npm package name).
import { execSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const args = process.argv.slice(2);
const flag = (name) => {
  const index = args.indexOf(name);
  if (index === -1) return undefined;
  const [, value] = args.splice(index, 2);
  return value;
};
const install = !args.includes("--no-install");
if (!install) args.splice(args.indexOf("--no-install"), 1);
const titleArg = flag("--title");
const [name, parent = process.cwd()] = args;

if (!name || !/^[a-z][a-z0-9-]*$/.test(name)) {
  console.error('usage: node new-app.mjs <app-name> [parent-folder] [--title "Daily Log"] [--no-install]');
  console.error("app-name is lowercase letters, digits, and dashes, like tasks or daily-log");
  process.exit(1);
}
const title = titleArg ?? name.split("-").map((word) => word[0].toUpperCase() + word.slice(1)).join(" ");
const template = join(dirname(fileURLToPath(import.meta.url)), "..", "template");
const dest = resolve(parent, name);

if (existsSync(join(dest, "package.json"))) {
  console.error(`${dest} already has a package.json`);
  process.exit(1);
}

// Copy the template and keep files that are already there.
mkdirSync(dest, { recursive: true });
cpSync(template, dest, { recursive: true, force: false, errorOnExist: false });

// A kept .gitignore gets the template lines it lacks.
const ignorePath = join(dest, ".gitignore");
const ours = readFileSync(join(template, ".gitignore"), "utf8").split(/\r?\n/).filter(Boolean);
const theirs = readFileSync(ignorePath, "utf8").split(/\r?\n/);
const missing = ours.filter((line) => !theirs.includes(line));
if (missing.length) writeFileSync(ignorePath, theirs.join("\n").replace(/\n*$/, "\n") + missing.join("\n") + "\n");

// Replace the placeholders in every text file.
(function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (entry === "node_modules" || entry === ".git") continue;
    if (statSync(path).isDirectory()) walk(path);
    else if (/\.(json|webmanifest|html|md|ts|tsx|mjs|css|svg)$|^\.gitignore$/.test(entry)) {
      const text = readFileSync(path, "utf8");
      const next = text.replaceAll("__APP_NAME__", name).replaceAll("__APP_TITLE__", title);
      if (next !== text) writeFileSync(path, next);
    }
  }
})(dest);

const run = (command) => execSync(command, { cwd: dest, stdio: "inherit" });
// Installs fail now and then on a slow network. One retry fixes most.
const runWithRetry = (command) => {
  try {
    run(command);
  } catch {
    console.log(`retrying: ${command}`);
    run(command);
  }
};
if (install) {
  runWithRetry("npm install");
  runWithRetry("npx playwright install chromium");
}
if (!existsSync(join(dest, ".git"))) run("git init -q");
run("git add -A");
run(`git commit -qm "Create ${title} from the web app template"`);
console.log(`created ${dest}`);
console.log(`next: cd "${dest}" && npm run dev`);
