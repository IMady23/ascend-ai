import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/cn";

// ----------------------------------------------------------------------
// Heading
// ----------------------------------------------------------------------
const headingVariants = cva("font-semibold tracking-tight text-[var(--color-text-primary)]", {
  variants: {
    level: {
      h1: "text-4xl md:text-5xl lg:text-6xl font-bold",
      h2: "text-3xl md:text-4xl font-bold",
      h3: "text-2xl md:text-3xl font-semibold",
      h4: "text-xl md:text-2xl font-semibold",
      h5: "text-lg md:text-xl font-medium",
      h6: "text-base md:text-lg font-medium",
    },
  },
  defaultVariants: {
    level: "h1",
  },
});

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement>, VariantProps<typeof headingVariants> {
  asChild?: boolean;
}

export function Heading({ className, level, ...props }: HeadingProps) {
  const Comp = level || "h1";
  return <Comp className={cn(headingVariants({ level }), className)} {...props} />;
}

// ----------------------------------------------------------------------
// Subheading
// ----------------------------------------------------------------------
const subheadingVariants = cva("text-[var(--color-text-secondary)]", {
  variants: {
    size: {
      sm: "text-sm md:text-base",
      md: "text-base md:text-lg",
      lg: "text-lg md:text-xl",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export interface SubheadingProps extends React.HTMLAttributes<HTMLParagraphElement>, VariantProps<typeof subheadingVariants> {}

export function Subheading({ className, size, ...props }: SubheadingProps) {
  return <p className={cn(subheadingVariants({ size }), className)} {...props} />;
}

// ----------------------------------------------------------------------
// BodyText
// ----------------------------------------------------------------------
const bodyVariants = cva("text-[var(--color-text-primary)] leading-relaxed", {
  variants: {
    size: {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
    },
    muted: {
      true: "text-[var(--color-text-muted)]",
    }
  },
  defaultVariants: {
    size: "md",
    muted: false,
  },
});

export interface BodyTextProps extends React.HTMLAttributes<HTMLParagraphElement>, VariantProps<typeof bodyVariants> {}

export function BodyText({ className, size, muted, ...props }: BodyTextProps) {
  return <p className={cn(bodyVariants({ size, muted }), className)} {...props} />;
}

// ----------------------------------------------------------------------
// Caption
// ----------------------------------------------------------------------
export function Caption({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("text-xs text-[var(--color-text-muted)]", className)} {...props} />;
}

// ----------------------------------------------------------------------
// Label
// ----------------------------------------------------------------------
export function Label({ className, ...props }: React.HTMLAttributes<HTMLLabelElement>) {
  return (
    <label className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)} {...props} />
  );
}

// ----------------------------------------------------------------------
// Statistic (for big numbers in MetricCards)
// ----------------------------------------------------------------------
export function Statistic({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={cn("text-4xl md:text-5xl font-bold tracking-tighter text-[var(--color-text-primary)] font-sans", className)} {...props} />
  );
}

// ----------------------------------------------------------------------
// MonoData (for tabular numbers)
// ----------------------------------------------------------------------
export function MonoData({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={cn("font-mono text-sm font-medium tracking-tight", className)} {...props} />
  );
}

// ----------------------------------------------------------------------
// Premium Animations
// ----------------------------------------------------------------------
export * from "./RevealText";
export * from "./CountUp";
export * from "./EngraveText";
