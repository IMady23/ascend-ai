"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getAccentColorForRoute } from "@/utils/theme";

type ThemeContextType = {
  currentAccentColor: string;
};

const ThemeContext = createContext<ThemeContextType>({
  currentAccentColor: "var(--color-accent-blue)",
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [accentColor, setAccentColor] = useState("var(--color-accent-blue)");

  useEffect(() => {
    // Determine color based on route
    const newColor = getAccentColorForRoute(pathname);
    setAccentColor(newColor);
    
    // Inject it at the document level for potential global overrides
    document.documentElement.style.setProperty("--current-accent", newColor);
  }, [pathname]);

  return (
    <ThemeContext.Provider value={{ currentAccentColor: accentColor }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
