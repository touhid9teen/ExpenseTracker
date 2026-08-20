"use client";

/* global process */

/**
 * VersionFooter – small version badge pinned to the bottom of the sidebar.
 *
 * The values come from NEXT_PUBLIC_* env vars that next.config.mjs inlines
 * at build time (version from package.json, which scripts/update-version.mjs
 * bumps automatically before every build; timestamp + commit SHA from the
 * deploy environment). Because they're baked in at build time, the server
 * render and client hydration always agree.
 */
const VERSION = process.env.NEXT_PUBLIC_APP_VERSION || "dev";
const BUILD_TIME = process.env.NEXT_PUBLIC_APP_BUILD_TIME || "";
const COMMIT_SHA = process.env.NEXT_PUBLIC_APP_COMMIT_SHA || "";

const VersionFooter = ({ darkMode }) => {
  return (
    <div className="mt-auto px-4 pt-2 pb-4">
      <p
        className={`text-[11px] leading-tight tracking-wide ${
          darkMode ? "text-slate-500" : "text-slate-400"
        }`}
        title={`Built ${BUILD_TIME}${COMMIT_SHA ? ` · commit ${COMMIT_SHA}` : ""}`}
      >
        &copy; FinVue{" "}
        <span className="font-semibold bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
          v{VERSION}
        </span>
      </p>
    </div>
  );
};

export default VersionFooter;
