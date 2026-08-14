import fs from "node:fs";
import path from "node:path";

// Read the app version straight from package.json — scripts/update-version.mjs
// bumps it automatically before every build (`prebuild`), so each deploy gets
// a fresh patch version without any hand-editing.
const pkg = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "package.json"), "utf8")
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  env: {
    NEXT_PUBLIC_APP_VERSION: pkg.version,
    // Fixed at build time so the footer never differs between server render
    // and client hydration.
    NEXT_PUBLIC_APP_BUILD_TIME: new Date().toISOString(),
    NEXT_PUBLIC_APP_COMMIT_SHA:
      process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ||
      process.env.GITHUB_SHA?.slice(0, 7) ||
      "",
  },
};

export default nextConfig;
