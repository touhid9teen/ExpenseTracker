"use client";

import { useState } from "react";
import AppLoader from "../Components/common/AppLoader";
import { loadThemePreference } from "../utils/storageUtils";

export default function Loading() {
  const [darkMode] = useState(() => loadThemePreference());
  return <AppLoader darkMode={darkMode} />;
}
