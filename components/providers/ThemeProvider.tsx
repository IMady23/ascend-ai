"use client";

import React, { useEffect, useState } from "react";
import { useSettingsStore } from "@/stores/settings.store";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { appearance } = useSettingsStore();
  const theme = appearance.theme;

  useEffect(() => {
    const root = document.documentElement;
    let effectiveTheme = theme;

    if (theme === "system") {
      effectiveTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }

    root.setAttribute("data-theme", effectiveTheme);
    root.style.colorScheme = effectiveTheme;
    
    // Update theme-color meta tag for browser UI
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute("content", effectiveTheme === "dark" ? "#0F172A" : "#FFFFFF");
    }

    // Listen to OS changes if system theme is active
    let mediaQuery: MediaQueryList | null = null;
    const handleChange = (e: MediaQueryListEvent) => {
      const newTheme = e.matches ? "dark" : "light";
      root.setAttribute("data-theme", newTheme);
      root.style.colorScheme = newTheme;
      if (metaThemeColor) {
        metaThemeColor.setAttribute("content", newTheme === "dark" ? "#0F172A" : "#FFFFFF");
      }
    };

    if (theme === "system") {
      mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      mediaQuery.addEventListener("change", handleChange);
    }
    
    return () => {
      if (mediaQuery) {
        mediaQuery.removeEventListener("change", handleChange);
      }
    };
  }, [theme]);

  // We rely on the inline script in layout.tsx to prevent FOUC.
  // Returning children directly prevents hydration mismatch since we rely on CSS vars.
  return <>{children}</>;
}
