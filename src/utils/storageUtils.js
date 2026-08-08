const THEME_KEY = "theme";

export const loadThemePreference = () => {
    if (typeof window === "undefined") return false;
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme) return savedTheme === "dark";
    // Default to the light theme — only a saved preference switches to dark.
    return false;
};

export const saveThemePreference = (darkMode) => {
    if (typeof window !== "undefined") {
        localStorage.setItem(THEME_KEY, darkMode ? "dark" : "light");
    }
};
