// Auto-bump the app version in package.json.
//
// Runs automatically via the `prebuild` npm hook, so Vercel (which calls
// `npm run build`) gets a fresh patch bump on every deploy. `npm run dev`
// calls it with --no-bump so local development leaves the version alone.
//
// The version is consumed at build time by next.config.mjs and exposed to
// the app as NEXT_PUBLIC_APP_VERSION (see src/components/layout/Sidebar/
// VersionFooter.jsx).
//
// Usage:
//   node scripts/update-version.mjs            # patch bump
//   node scripts/update-version.mjs --no-bump  # leave version unchanged
//   node scripts/update-version.mjs --minor    # minor bump
//   node scripts/update-version.mjs --major    # major bump

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const pkgPath = path.join(root, "package.json");

const args = process.argv.slice(2);
const noBump = args.includes("--no-bump");
const bumpMajor = args.includes("--major");
const bumpMinor = args.includes("--minor");

const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
const [major = 0, minor = 0, patch = 0] = String(pkg.version ?? "0.0.0")
  .split(".")
  .map((n) => parseInt(n, 10) || 0);

let version = pkg.version;
if (!noBump) {
  version = bumpMajor
    ? `${major + 1}.0.0`
    : bumpMinor
      ? `${major}.${minor + 1}.0`
      : `${major}.${minor}.${patch + 1}`;
  pkg.version = version;
  fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
}

console.log(`App version: ${version}${noBump ? " (no bump)" : ""}`);
