/**
 * Ascend Design Language (ADL) Theme Tokens
 * This file can be used to import design tokens directly into JS/TS
 * environments (e.g. for Framer Motion or JS logic).
 */
export const theme = {
  colors: {
    primary: {
      DEFAULT: "var(--primary)",
      foreground: "var(--primary-foreground)",
    },
    secondary: {
      DEFAULT: "var(--secondary)",
      foreground: "var(--secondary-foreground)",
    },
    background: "var(--background)",
    foreground: "var(--foreground)",
    accent: {
      DEFAULT: "var(--accent)",
      foreground: "var(--accent-foreground)",
    },
    muted: {
      DEFAULT: "var(--muted)",
      foreground: "var(--muted-foreground)",
    },
    border: "var(--border)",
  },
  fonts: {
    sans: "var(--font-inter)",
    mono: "var(--font-jetbrains-mono)",
  }
};
