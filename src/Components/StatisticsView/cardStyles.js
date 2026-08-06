// Shared accent styling for the Statistics cards/panels.
// Neo-Cyber Brutalism flavor: cyber-cut corners, cyan-tone borders, and
// real 3D extruded edges via the `.cyber-3d` utility (layered drop-shadows
// follow the clipped silhouette, so the cut corners gain stepped 3D edges).
//
// Each accent only tints the glow + text; the extruded edge itself stays
// dark cyan/slate for a consistent machined-slab look.

export const ACCENTS = {
    sky: {
        borderDark: "border-cyan-600/50",
        borderLight: "border-cyan-400",
        glow: "[--glow-3d:var(--accent-glow-soft)]",
        textDark: "text-cyan-400",
        textLight: "text-cyan-600"
    },
    purple: {
        borderDark: "border-fuchsia-600/50",
        borderLight: "border-fuchsia-400",
        glow: "[--glow-3d:rgba(217,70,239,0.22)]",
        textDark: "text-fuchsia-400",
        textLight: "text-fuchsia-600"
    },
    emerald: {
        borderDark: "border-emerald-600/50",
        borderLight: "border-emerald-400",
        glow: "[--glow-3d:rgba(16,185,129,0.25)]",
        textDark: "text-emerald-400",
        textLight: "text-emerald-600"
    },
    rose: {
        borderDark: "border-rose-600/50",
        borderLight: "border-rose-400",
        glow: "[--glow-3d:rgba(244,63,94,0.25)]",
        textDark: "text-rose-400",
        textLight: "text-rose-600"
    },
};

// Card surface: theme-default background + accent border + 3D extrusion.
export const cardSurface = (accent, darkMode) => {
    const a = ACCENTS[accent] || ACCENTS.sky;
    return darkMode
        ? `bg-slate-900 border-2 ${a.borderDark} cyber-3d ${a.glow}`
        : `bg-white border-2 ${a.borderLight} cyber-3d ${a.glow}`;
};

// Accent-colored text tuned for each theme.
export const accentText = (accent, darkMode) => {
    const a = ACCENTS[accent] || ACCENTS.sky;
    return darkMode ? a.textDark : a.textLight;
};
