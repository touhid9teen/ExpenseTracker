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
  const date = BUILD_TIME
    ? new Date(BUILD_TIME).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

  return (
    <div className="mt-auto px-4 pt-2 pb-4">
      <p
        className={`text-[11px] leading-tight tracking-wide ${
          darkMode ? "text-slate-500" : "text-slate-400"
        }`}
        title={`Built ${BUILD_TIME}${COMMIT_SHA ? ` · commit ${COMMIT_SHA}` : ""}`}
      >
        v{VERSION}
        {date && (
          <>
            <span className="mx-1 opacity-50">·</span>
            {date}
          </>
        )}
        {COMMIT_SHA && (
          <>
            <span className="mx-1 opacity-50">·</span>
            {COMMIT_SHA}
          </>
        )}
      </p>
    </div>
  );
};

export default VersionFooter;
