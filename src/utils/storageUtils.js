const THEME_KEY = "theme";

export const loadThemePreference = () => {
    if (typeof window === "undefined") return true;
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme) return savedTheme === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
};

export const saveThemePreference = (darkMode) => {
    if (typeof window !== "undefined") {
        localStorage.setItem(THEME_KEY, darkMode ? "dark" : "light");
    }
};
