// Shared accent styling for the Statistics cards/panels.
// Aurora Cyber flavor: cyber-cut corners, aurora-tone borders, and
// real 3D extruded edges via the `.cyber-3d` utility (layered drop-shadows
// follow the clipped silhouette, so the cut corners gain stepped 3D edges).
//
// Each accent only tints the glow + text; the extruded edge itself stays
// dark cyan/slate for a consistent machined-slab look.

export const ACCENTS = {
    sky: {
        borderDark: "border-cyan-600/70",
        borderLight: "border-cyan-400",
        glow: "[--glow-3d:var(--accent-glow-soft)]",
        glow2: "[--glow-3d-2:var(--violet-glow-soft)]",
        textDark: "text-cyan-400",
        textLight: "text-cyan-600"
    },
    violet: {
        borderDark: "border-violet-600/70",
        borderLight: "border-violet-400",
        glow: "[--glow-3d:rgba(167,139,250,0.2)]",
        glow2: "[--glow-3d-2:rgba(139,92,246,0.16)]",
        textDark: "text-violet-400",
        textLight: "text-violet-600"
    },
    indigo: {
        borderDark: "border-indigo-600/70",
        borderLight: "border-indigo-400",
        glow: "[--glow-3d:rgba(129,140,248,0.22)]",
        glow2: "[--glow-3d-2:rgba(99,102,241,0.16)]",
        textDark: "text-indigo-400",
        textLight: "text-indigo-600"
    },
    gold: {
        borderDark: "border-amber-600/70",
        borderLight: "border-amber-400",
        glow: "[--glow-3d:rgba(251,191,36,0.2)]",
        glow2: "[--glow-3d-2:rgba(245,158,11,0.14)]",
        textDark: "text-amber-400",
        textLight: "text-amber-600"
    },
    emerald: {
        borderDark: "border-emerald-600/70",
        borderLight: "border-emerald-400",
        glow: "[--glow-3d:rgba(16,185,129,0.22)]",
        glow2: "[--glow-3d-2:rgba(16,185,129,0.14)]",
        textDark: "text-emerald-400",
        textLight: "text-emerald-600"
    },
    rose: {
        borderDark: "border-rose-600/70",
        borderLight: "border-rose-400",
        glow: "[--glow-3d:rgba(244,63,94,0.22)]",
        glow2: "[--glow-3d-2:rgba(244,63,94,0.14)]",
        textDark: "text-rose-400",
        textLight: "text-rose-600"
    },
    fuchsia: {
        borderDark: "border-fuchsia-600/70",
        borderLight: "border-fuchsia-400",
        glow: "[--glow-3d:rgba(217,70,239,0.2)]",
        glow2: "[--glow-3d-2:rgba(192,38,211,0.14)]",
        textDark: "text-fuchsia-400",
        textLight: "text-fuchsia-600"
    },
};

// Card surface: theme-default background + accent border + 3D extrusion.
export const cardSurface = (accent, darkMode) => {
    const a = ACCENTS[accent] || ACCENTS.sky;
    return darkMode
        ? `bg-slate-900 border-2 ${a.borderDark} cyber-3d ${a.glow} ${a.glow2}`
        : `bg-white border-2 ${a.borderLight} cyber-3d ${a.glow} ${a.glow2}`;
};

// Accent-colored text tuned for each theme.
export const accentText = (accent, darkMode) => {
    const a = ACCENTS[accent] || ACCENTS.sky;
    return darkMode ? a.textDark : a.textLight;
};
