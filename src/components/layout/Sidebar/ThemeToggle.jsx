"use client";

import { SunIcon, MoonIcon } from "../../ui/Icons";

/**
 * ThemeToggle – dark-mode switch row (sun/moon icon + toggle button).
 */
const ThemeToggle = ({ darkMode, toggleTheme }) => (
  <div className="px-4 pb-4">
    <div
      className={`flex items-center justify-between rounded-xl border px-3 py-2.5 ${
        darkMode
          ? "bg-[#141a2e] border-slate-800"
          : "bg-[#F7F7FA] border-[#EBEBEC]"
      }`}
    >
      <span
        className={`flex items-center gap-2 text-sm font-medium ${
          darkMode ? "text-slate-200" : "text-[#3D3A5C]"
        }`}
      >
        {darkMode ? (
          <SunIcon className="w-4 h-4" strokeWidth={2.25} />
        ) : (
          <MoonIcon className="w-4 h-4" strokeWidth={2.25} />
        )}
        {darkMode ? "Light mode" : "Dark mode"}
      </span>
      <button
        onClick={toggleTheme}
        role="switch"
        aria-checked={darkMode}
        aria-label="Toggle dark mode"
        className={`relative w-10 h-6 rounded-full transition-colors duration-200 shrink-0 ${
          darkMode ? "bg-violet-500" : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${
            darkMode ? "translate-x-[18px]" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  </div>
);

export default ThemeToggle;
