"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import AppLoader from "../Components/common/AppLoader";
import LoginSkeleton from "../Components/Skeleton/LoginSkeleton/LoginSkeleton";
import { loadThemePreference } from "../utils/storageUtils";

export default function Loading() {
  const pathname = usePathname();
  const [darkMode] = useState(() => loadThemePreference());

  // /login is a static, light-only page — show a skeleton that mirrors its
  // layout instead of the app's boot spinner, so the loading state matches
  // the content that appears after it.
  if (pathname === "/login") {
    return <LoginSkeleton />;
  }

  return <AppLoader darkMode={darkMode} />;
}
