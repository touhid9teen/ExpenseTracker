import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
    loadCachedUser,
    saveCachedUser,
    clearCachedUser,
    clearUserOfflineData
} from "../utils/offlineStore";

/**
 * Owns authentication state: current user, initial auth check, and logout.
 * The user is mirrored to localStorage so an offline reload keeps the session
 * (the `/api/auth/profile` check can't reach the server offline).
 */
export const useAuth = ({ onLogout } = {}) => {
    const [user, setUserState] = useState(null);
    const [isAuthLoading, setIsAuthLoading] = useState(true);

    // Persist the user alongside every state change so offline hydration and
    // login both keep the cache in sync.
    const setUser = (next) => {
        setUserState(next);
        if (next) saveCachedUser(next);
        else clearCachedUser();
    };

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch("/api/auth/profile");
                if (res.ok) {
                    const { user } = await res.json();
                    setUser(user);
                }
            } catch (error) {
                // Offline (or server unreachable): fall back to the cached user
                // so the app stays usable without a round-trip.
                console.error("Failed to authenticate:", error);
                const cached = loadCachedUser();
                if (cached) setUserState(cached);
            } finally {
                setIsAuthLoading(false);
            }
        };

        checkAuth();
    }, []);

    const handleLogout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            clearUserOfflineData(user?.id);
            setUser(null);
            onLogout?.();
            toast.success("Logged out successfully!");
        } catch (error) {
            console.error("Logout failed:", error);
            toast.error("Failed to log out.");
        }
    };

    return { user, setUser, isAuthLoading, handleLogout };
};
