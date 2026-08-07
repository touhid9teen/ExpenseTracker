"use client";

import { memo } from "react";
import {
  FinVueLogoIcon,
  SunIcon,
  MoonIcon,
  LogInIcon,
} from "./Icons";

/**
 * FloatingControls – replaces the old sticky header. The header is gone;
 * everything is now a button. A minimal floating cluster is pinned to the
 * corners of the screen:
 *   - top-left  : FinVue brand chip
 *   - top-right : theme toggle + login/logout
 *
 * Props:
 *   - darkMode     : boolean
 *   - toggleTheme  : () => void
 *   - user         : object | null
 *   - handleLogout : () => void
 *   - onLogin      : () => void – opens the auth screen (guests)
 */
const FloatingControls = memo(function FloatingControls({
  darkMode,
  toggleTheme,
  user,
  handleLogout,
  onLogin,
}) {
  const chip =
    `fixed top-4 z-40 flex items-center cyber-cut-sm border-2 cyber-3d-sm backdrop-blur-md transition-colors duration-300 ${
      darkMode
        ? "bg-[#0a0f1e]/85 border-cyan-900/60 [--glow-3d:var(--accent-glow-soft)]"
        : "bg-white/90 border-cyan-300/70"
    }`;

  return (
    <>
      {/* ── Brand chip ── */}
      <div className={`${chip} left-4 sm:left-6 gap-2.5 px-3 py-2`}>
        <div className="relative w-7 h-7 cyber-cut bg-gradient-to-tr from-cyan-500 via-sky-500 to-violet-500 flex items-center justify-center shrink-0">
          <FinVueLogoIcon className="w-4 h-4 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />
        </div>
        <span
          className={`font-extrabold tracking-tight text-sm ${
            darkMode ? "text-gradient-aurora" : "text-gradient-aurora-deep"
          }`}
        >
          FinVue
        </span>
      </div>

      {/* ── Action cluster ── */}
      <div className={`${chip} right-4 sm:right-6 gap-2 p-1.5`}>
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          id="theme-toggler"
          aria-label="Toggle Theme"
          className={`p-2.5 cyber-cut-sm border-2 transition-all duration-200 hover:scale-105 active:scale-95 ${
            darkMode
              ? "bg-slate-900 border-cyan-800/60 text-cyan-400 hover:border-violet-500/70 hover:text-violet-400"
              : "bg-slate-100 border-slate-300 text-cyan-600 hover:border-violet-400 hover:text-violet-600"
          }`}
        >
          {darkMode ? (
            <SunIcon className="w-5 h-5" />
          ) : (
            <MoonIcon className="w-5 h-5" />
          )}
        </button>

        {/* Login / Logout */}
        <button
          onClick={user ? handleLogout : onLogin}
          className={`inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2.5 cyber-cut-sm text-xs font-bold border-2 transition-all duration-200 hover:scale-105 active:scale-95 ${
            user
              ? darkMode
                ? "bg-red-500/10 text-red-400 hover:bg-red-500/25 border-red-900/50"
                : "bg-red-50 text-red-600 hover:bg-red-100 border-red-200"
              : darkMode
                ? "bg-cyan-500/15 text-cyan-300 hover:bg-cyan-500/25 border-cyan-800/60"
                : "bg-cyan-100 text-cyan-700 hover:bg-cyan-200 border-cyan-300"
          }`}
        >
          <LogInIcon
            className={`w-4 h-4 ${user ? "transform rotate-180" : ""}`}
            strokeWidth={2.5}
          />
          {user ? "Logout" : "Login"}
        </button>
      </div>
    </>
  );
});

export default FloatingControls;
