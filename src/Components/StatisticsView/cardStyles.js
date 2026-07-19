// Shared accent styling for the Statistics cards/panels.
// Each card uses the theme-default surface (slate-800 dark / white light)
// and carries its identity through a colored border, shadow, and accent text.
// Class strings are written out in full so Tailwind's JIT keeps them.

export const ACCENTS = {
    sky: {
        borderDark: "border-sky-500/40",
        borderLight: "border-sky-400",
        shadow: "shadow-sky-500/10",
        textDark: "text-sky-400",
        textLight: "text-sky-600"
    },
    purple: {
        borderDark: "border-purple-500/40",
        borderLight: "border-purple-400",
        shadow: "shadow-purple-500/10",
        textDark: "text-purple-400",
        textLight: "text-purple-600"
    },
    emerald: {
        borderDark: "border-emerald-500/40",
        borderLight: "border-emerald-400",
        shadow: "shadow-emerald-500/10",
        textDark: "text-emerald-400",
        textLight: "text-emerald-600"
    },
    rose: {
        borderDark: "border-rose-500/40",
        borderLight: "border-rose-400",
        shadow: "shadow-rose-500/10",
        textDark: "text-rose-400",
        textLight: "text-rose-600"
    }
};

// Card surface: theme-default background + accent border + soft accent shadow.
export const cardSurface = (accent, darkMode) => {
    const a = ACCENTS[accent] || ACCENTS.emerald;
    return darkMode
        ? `bg-slate-800 border ${a.borderDark} shadow-lg ${a.shadow}`
        : `bg-white border ${a.borderLight} shadow-lg ${a.shadow}`;
};

// Accent-colored text tuned for each theme.
export const accentText = (accent, darkMode) => {
    const a = ACCENTS[accent] || ACCENTS.emerald;
    return darkMode ? a.textDark : a.textLight;
};
