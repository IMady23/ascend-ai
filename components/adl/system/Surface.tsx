import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/cn";

export const elevationVariants = cva("transition-all duration-300 ease-ui", {
  variants: {
    level: {
      0: "shadow-none border border-transparent",
      1: "shadow-sm border border-border bg-bg-surface-elevated",
      2: "shadow-md border border-border bg-bg-surface-elevated hover:shadow-lg",
      3: "shadow-lg border border-border bg-bg-surface-elevated",
      floating: "shadow-modal border border-white/10 bg-white/5 backdrop-blur-md",
      modal: "shadow-modal border border-white/10 bg-white/10 backdrop-blur-xl",
      hero: "shadow-modal border border-white/10 bg-white/10 backdrop-blur-2xl",
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

const glassVariants = cva("glass-highlight border border-white/10 transition-all duration-300 ease-ui", {
  variants: {
    blur: {
      sm: "backdrop-blur-sm",
      md: "backdrop-blur-md",
      lg: "backdrop-blur-lg",
      xl: "backdrop-blur-2xl",
      "2xl": "backdrop-blur-3xl",
    },
    intensity: {
      low: "bg-bg-base/30",
      standard: "bg-white/5",
      high: "bg-white/10",
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
