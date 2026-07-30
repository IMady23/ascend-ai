import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/utils/cn";
import { ButtonMotion } from "@/utils/motion";
import { Spinner } from "./Spinner";
import Magnetic from "./Magnetic";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-[var(--radius-md)] text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:bg-[var(--color-primary)]/90 shadow-sm",
        secondary:
          "bg-[var(--color-bg-surface)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-glass-hover)] border border-[var(--color-glass-border)]",
        ghost:
          "hover:bg-[var(--color-bg-glass-standard)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]",
        glass:
          "bg-[var(--color-bg-glass-standard)] text-[var(--color-text-primary)] border border-[var(--color-glass-border)] backdrop-blur-md glass-highlight hover:bg-[var(--color-bg-glass-hover)]",
        danger:
          "bg-[var(--color-danger)] text-white hover:bg-[var(--color-danger)]/90",
        success:
          "bg-[var(--color-success)] text-white hover:bg-[var(--color-success)]/90",
      },
      size: {
        xs: "h-7 rounded-[var(--radius-sm)] px-2 text-xs",
        sm: "h-9 rounded-[var(--radius-md)] px-3",
        md: "h-11 px-4 py-2",
        lg: "h-12 rounded-[var(--radius-lg)] px-8 text-base",
        icon: "h-11 w-11",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      loading,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const buttonContent = (
      <motion.button
        ref={ref}
        whileHover={disabled || loading ? undefined : ButtonMotion.hover}
        whileTap={disabled || loading ? undefined : ButtonMotion.tap}
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        disabled={disabled || loading}
        {...(props as any)}
      >
        {loading && (
          <span className="mr-2">
            <Spinner size="sm" />
          </span>
        )}
        {!loading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!loading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </motion.button>
    );

    if (fullWidth || disabled) {
      return buttonContent;
    }

    return (
      <Magnetic strength={0.2}>
        {buttonContent}
      </Magnetic>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
