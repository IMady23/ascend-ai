"use client";

import React, { useEffect, useState } from "react";
import { useThemeStore } from "@/stores/theme.store";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    let effectiveTheme = theme;

    if (theme === "system") {
      effectiveTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }

    root.setAttribute("data-theme", effectiveTheme);
    // Sync the color-scheme property to help browser internals
    root.style.colorScheme = effectiveTheme;

    // Listen to OS changes if system theme is active
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = (e: MediaQueryListEvent) => {
        const newTheme = e.matches ? "dark" : "light";
        root.setAttribute("data-theme", newTheme);
        root.style.colorScheme = newTheme;
      };
      
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme, mounted]);

  // Prevent hydration flash by avoiding early render mismatches, 
  // though typically you'd run a blocking script in <head> for perfect anti-flash.
  if (!mounted) {
    return <div style={{ visibility: "hidden" }}>{children}</div>;
  }

  return <>{children}</>;
}
