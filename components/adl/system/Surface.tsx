import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/cn";

export const elevationVariants = cva("transition-all duration-300", {
  variants: {
    level: {
      0: "shadow-none border border-transparent",
      1: "shadow-sm border border-[var(--color-glass-border)] bg-[var(--color-bg-surface)]",
      2: "shadow-md border border-[var(--color-glass-border)] bg-[var(--color-bg-surface)] hover:shadow-lg",
      3: "shadow-lg border border-[var(--color-glass-border)] bg-[var(--color-bg-surface)]",
      floating: "shadow-xl border border-[var(--color-glass-border)] bg-[var(--color-bg-glass-standard)] backdrop-blur-md",
      modal: "shadow-[var(--shadow-xl)] border border-[var(--color-glass-border)] bg-[var(--color-bg-glass-active)] backdrop-blur-xl",
      hero: "shadow-[var(--shadow-hero)] border border-[var(--color-glass-border)] bg-[var(--color-bg-glass-standard)] backdrop-blur-2xl",
    },
    interactive: {
      true: "hover:-translate-y-1 hover:shadow-lg cursor-pointer",
    },
  },
  defaultVariants: {
    level: 1,
    interactive: false,
  },
});

export interface SurfaceProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof elevationVariants> {
  as?: React.ElementType;
}

export const Surface = React.forwardRef<HTMLDivElement, SurfaceProps>(
  ({ className, level, interactive, as: Component = "div", ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(elevationVariants({ level, interactive }), className)}
        {...props}
      />
    );
  }
);
Surface.displayName = "Surface";

// ----------------------------------------------------------------------
// GlassSurface
// ----------------------------------------------------------------------

const glassVariants = cva("glass-highlight border border-[var(--color-glass-border)] transition-all", {
  variants: {
    blur: {
      sm: "backdrop-blur-sm",
      md: "backdrop-blur-md",
      lg: "backdrop-blur-lg",
      xl: "backdrop-blur-xl",
      "2xl": "backdrop-blur-2xl",
    },
    intensity: {
      low: "bg-[var(--color-bg-base)]/30",
      standard: "bg-[var(--color-bg-glass-standard)]",
      high: "bg-[var(--color-bg-glass-active)]",
    }
  },
  defaultVariants: {
    blur: "md",
    intensity: "standard",
  }
});

export interface GlassSurfaceProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof glassVariants> {
  as?: React.ElementType;
}

export const GlassSurface = React.forwardRef<HTMLDivElement, GlassSurfaceProps>(
  ({ className, blur, intensity, as: Component = "div", ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(glassVariants({ blur, intensity }), className)}
        {...props}
      />
    );
  }
);
GlassSurface.displayName = "GlassSurface";
