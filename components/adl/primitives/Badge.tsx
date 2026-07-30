import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/cn";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[var(--color-bg-surface)] text-[var(--color-text-primary)]",
        primary:
          "border-transparent bg-[var(--color-primary)] text-[var(--color-primary-foreground)]",
        secondary:
          "border-transparent bg-[var(--color-secondary)] text-[var(--color-secondary-foreground)]",
        glass:
          "border-[var(--color-glass-border)] bg-[var(--color-bg-glass-standard)] text-[var(--color-text-primary)] backdrop-blur-md",
        success:
          "border-transparent bg-[var(--color-success)]/10 text-[var(--color-success)]",
        warning:
          "border-transparent bg-[var(--color-warning)]/10 text-[var(--color-warning)]",
        danger:
          "border-transparent bg-[var(--color-danger)]/10 text-[var(--color-danger)]",
        outline: "text-[var(--color-text-secondary)] border-[var(--color-glass-border)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

export function Badge({ className, variant, dot, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot && (
        <span 
          className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current opacity-80" 
          aria-hidden="true" 
        />
      )}
      {children}
    </div>
  );
}
