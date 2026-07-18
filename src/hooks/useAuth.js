import { useEffect, useState } from "react";
import toast from "react-hot-toast";

/**
 * Owns authentication state: current user, initial auth check, and logout.
 */
export const useAuth = ({ onLogout } = {}) => {
    const [user, setUser] = useState(null);
    const [isAuthLoading, setIsAuthLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch("/api/auth/profile");
                if (res.ok) {
                    const { user } = await res.json();
                    setUser(user);
                }
            } catch (error) {
                console.error("Failed to authenticate:", error);
            } finally {
                setIsAuthLoading(false);
            }
        };

        checkAuth();
    }, []);

    const handleLogout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
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
