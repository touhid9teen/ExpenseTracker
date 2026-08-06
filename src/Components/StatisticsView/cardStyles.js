// Shared accent styling for the Statistics cards/panels.
// Neo-Cyber Brutalism flavor: cyber-cut corners, dual-tone cyan/amber
// borders, and offset neon shadows. Class strings are written out in full
// so Tailwind's JIT keeps them.
//
// NOTE: these surfaces are always paired with `cyber-cut` (clip-path), and
// clip-path clips box-shadow — so shadows use `filter: drop-shadow(...)`
// (via arbitrary Tailwind properties), which follows the clipped shape.

export const ACCENTS = {
    sky: {
        borderDark: "border-cyan-600/50",
        borderLight: "border-cyan-400",
        shadow: "[filter:drop-shadow(5px_5px_0px_rgba(34,211,238,0.25))]",
        textDark: "text-cyan-400",
        textLight: "text-cyan-600"
    },
    purple: {
        borderDark: "border-fuchsia-600/50",
        borderLight: "border-fuchsia-400",
        shadow: "[filter:drop-shadow(5px_5px_0px_rgba(217,70,239,0.22))]",
        textDark: "text-fuchsia-400",
        textLight: "text-fuchsia-600"
    },
    emerald: {
        borderDark: "border-emerald-600/50",
        borderLight: "border-emerald-400",
        shadow: "[filter:drop-shadow(5px_5px_0px_rgba(16,185,129,0.25))]",
        textDark: "text-emerald-400",
        textLight: "text-emerald-600"
    },
    rose: {
        borderDark: "border-rose-600/50",
        borderLight: "border-rose-400",
        shadow: "[filter:drop-shadow(5px_5px_0px_rgba(244,63,94,0.25))]",
        textDark: "text-rose-400",
        textLight: "text-rose-600"
    },
    amber: {
        borderDark: "border-amber-600/50",
        borderLight: "border-amber-400",
        shadow: "[filter:drop-shadow(5px_5px_0px_rgba(245,158,11,0.3))]",
        textDark: "text-amber-400",
        textLight: "text-amber-600"
    }
};

// Card surface: theme-default background + accent border + offset neon shadow.
export const cardSurface = (accent, darkMode) => {
    const a = ACCENTS[accent] || ACCENTS.sky;
    return darkMode
        ? `bg-slate-900 border-2 ${a.borderDark} ${a.shadow}`
        : `bg-white border-2 ${a.borderLight} ${a.shadow}`;
};

// Accent-colored text tuned for each theme.
export const accentText = (accent, darkMode) => {
    const a = ACCENTS[accent] || ACCENTS.sky;
    return darkMode ? a.textDark : a.textLight;
};
