import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/cn";
import { Spinner } from "./Spinner";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-base font-medium transition-all duration-fast ease-ui focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base disabled:pointer-events-none disabled:opacity-50 active:scale-95",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--color-accent,var(--color-info))] text-white hover:brightness-110 shadow-sm focus-visible:ring-[var(--color-accent,var(--color-info))]",
        secondary:
          "bg-surface-elevated text-text-primary hover:bg-[var(--color-bg-glass-standard)] border border-border-subtle focus-visible:ring-border",
        ghost:
          "hover:bg-[var(--color-bg-glass-standard)] text-text-secondary hover:text-text-primary focus-visible:ring-border",
        glass:
          "glass-premium hover:bg-[var(--color-bg-glass-standard)] focus-visible:ring-border",
        danger:
          "bg-[var(--color-danger)] text-white hover:brightness-110 focus-visible:ring-danger",
        success:
          "bg-[var(--color-success)] text-white hover:brightness-110 focus-visible:ring-success",
      },
      size: {
        xs: "h-8 rounded-sm px-3 text-xs", // Min 44px on mobile is recommended, but xs is xs
        sm: "h-11 rounded-md px-4 text-sm", // 44px height for minimum touch target
        md: "h-12 rounded-lg px-6 text-base", // 48px height
        lg: "h-14 rounded-xl px-8 text-lg", // 56px height
        icon: "h-11 w-11 rounded-full",
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
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        disabled={disabled || loading}
        {...props}
        onClick={(e) => {
          if (!disabled && !loading) {
            import("@/utils/haptics").then(({ vibrate }) => vibrate(15));
          }
          props.onClick?.(e);
        }}
      >
        {loading && (
          <span className="mr-2">
            <Spinner size="sm" />
          </span>
        )}
        {!loading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        <span className={cn(loading && "opacity-0")}>{children}</span>
        {!loading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
