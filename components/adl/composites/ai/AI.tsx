import * as React from "react";
import { motion, Variants } from "framer-motion";
import { cn } from "@/utils/cn";
import { AIMotion } from "@/utils/motion";

// ----------------------------------------------------------------------
// ThinkingIndicator
// ----------------------------------------------------------------------

export interface ThinkingIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
}

export function ThinkingIndicator({ size = "md", className, ...props }: ThinkingIndicatorProps) {
  const sizeStyles = {
    sm: "h-1.5 w-1.5 gap-1",
    md: "h-2 w-2 gap-1.5",
    lg: "h-2.5 w-2.5 gap-2",
  };

  return (
    <div className={cn("flex items-center", sizeStyles[size].split(" ")[2], className)} {...props}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={cn(
            "rounded-full bg-[var(--color-accent-indigo)]",
            sizeStyles[size].split(" ").slice(0, 2).join(" ")
          )}
          variants={AIMotion.thinking as Variants}
          animate="animate"
          style={{ 
            animationDelay: `${i * 0.15}s`,
            boxShadow: "0 0 8px var(--color-accent-indigo)"
          }}
        />
      ))}
    </div>
  );
}

// ----------------------------------------------------------------------
// SuggestionChip
// ----------------------------------------------------------------------

import { HTMLMotionProps } from "framer-motion";

export interface SuggestionChipProps extends Omit<HTMLMotionProps<"button">, "children"> {
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export const SuggestionChip = React.forwardRef<HTMLButtonElement, SuggestionChipProps>(
  ({ className, icon, children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "inline-flex items-center gap-2 rounded-full border border-[var(--color-accent-indigo)]/30 bg-[var(--color-accent-indigo)]/10 px-4 py-2 text-sm font-medium text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-accent-indigo)]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-indigo)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-base)] glass-highlight",
          className
        )}
        {...props}
      >
        {icon && <span className="text-[var(--color-accent-indigo)]">{icon}</span>}
        {children}
      </motion.button>
    );
  }
);
SuggestionChip.displayName = "SuggestionChip";
