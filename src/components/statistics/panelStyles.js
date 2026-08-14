// Shared clean-theme (SaaS dashboard) surface helpers for the Statistics
// panels. Soft rounded cards with subtle borders — matches the Sidebar /
// CommandCenter look rather than the old Aurora-Cyber slabs.

// Card / panel surface.
export const panelClass = (darkMode) =>
    darkMode ? "bg-slate-900 border border-slate-700/70" : "bg-white border border-slate-200";

// Muted secondary text.
export const mutedText = (darkMode) => (darkMode ? "text-slate-400" : "text-slate-500");

// Primary heading text.
export const headingText = (darkMode) => (darkMode ? "text-white" : "text-slate-900");

// Soft colored icon chips used on the summary / insight cards.
export const CHIP = {
    violet: { light: "bg-violet-100 text-violet-600", dark: "bg-violet-500/15 text-violet-300" },
    indigo: { light: "bg-indigo-100 text-indigo-600", dark: "bg-indigo-500/15 text-indigo-300" },
    sky: { light: "bg-sky-100 text-sky-600", dark: "bg-sky-500/15 text-sky-300" },
    emerald: { light: "bg-emerald-100 text-emerald-600", dark: "bg-emerald-500/15 text-emerald-300" },
    amber: { light: "bg-amber-100 text-amber-600", dark: "bg-amber-500/15 text-amber-300" },
    rose: { light: "bg-rose-100 text-rose-600", dark: "bg-rose-500/15 text-rose-300" },
};

export const chipClass = (accent, darkMode) => {
    const c = CHIP[accent] || CHIP.violet;
    return darkMode ? c.dark : c.light;
};

// Formats a ৳ figure with thousands separators (rounded, no decimals).
export const formatTaka = (value) => `৳${Math.round(Number(value) || 0).toLocaleString()}`;
