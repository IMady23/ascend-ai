import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemeMode = "dark" | "light" | "system";

interface ThemeState {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "dark",
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((state) => {
        if (state.theme === "dark") return { theme: "light" };
        if (state.theme === "light") return { theme: "system" };
        return { theme: "dark" };
      }),
    }),
    {
      name: "ascend-theme-storage",
    }
  )
);
