import { useEffect, useState } from "react";
import { getCategoryStyles } from "../utils/categoryStyles";
import { loadThemePreference, saveThemePreference } from "../utils/storageUtils";

/**
 * Owns the dark/light theme preference and theme-aware category styling.
 */
export const useTheme = () => {
    const [darkMode, setDarkMode] = useState(true);

    useEffect(() => {
        setDarkMode(loadThemePreference());
    }, []);

    const toggleTheme = () => {
        const nextTheme = !darkMode;
        setDarkMode(nextTheme);
        saveThemePreference(nextTheme);
    };

    const getCategoryStylesForTheme = (category) => getCategoryStyles(category, darkMode);

    return { darkMode, setDarkMode, toggleTheme, getCategoryStylesForTheme };
};
