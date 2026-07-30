import * as React from "react";
import { cn } from "@/utils/cn";
import { cva, type VariantProps } from "class-variance-authority";
import { AlertCircle } from "lucide-react";

// ----------------------------------------------------------------------
// TextInput
// ----------------------------------------------------------------------

const inputVariants = cva(
  "flex w-full rounded-[var(--radius-md)] bg-[var(--color-bg-surface)] px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] transition-colors focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border border-[var(--color-glass-border)] focus-visible:ring-2 focus-visible:ring-[var(--current-accent,var(--color-accent-blue))] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-base)]",
        ghost: "border-transparent bg-transparent hover:bg-[var(--color-bg-glass-standard)] focus-visible:bg-[var(--color-bg-surface)] focus-visible:ring-0",
        error: "border-[var(--color-danger)] focus-visible:ring-2 focus-visible:ring-[var(--color-danger)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-base)]",
      },
      size: {
        sm: "h-8 text-xs",
        md: "h-11",
        lg: "h-12 text-base",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>, VariantProps<typeof inputVariants> {
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const TextInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, size, error, leftIcon, rightIcon, ...props }, ref) => {
    
    // If there is an error string, override the variant to error
    const activeVariant = error ? "error" : variant;

    return (
      <div className="flex flex-col gap-1.5 w-full relative">
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 text-[var(--color-text-muted)] flex items-center justify-center">
              {leftIcon}
            </div>
          )}
          
          <input
            className={cn(
              inputVariants({ variant: activeVariant, size, className }),
              leftIcon && "pl-10",
              rightIcon && "pr-10"
            )}
            ref={ref}
            {...props}
          />

          {rightIcon && !error && (
            <div className="absolute right-3 text-[var(--color-text-muted)] flex items-center justify-center">
              {rightIcon}
            </div>
          )}

          {error && (
            <div className="absolute right-3 text-[var(--color-danger)] flex items-center justify-center">
              <AlertCircle size={16} />
            </div>
          )}
        </div>
        
        {error && (
          <span className="text-xs font-medium text-[var(--color-danger)] ml-1">
            {error}
          </span>
        )}
      </div>
    );
  }
);
TextInput.displayName = "TextInput";

// ----------------------------------------------------------------------
// Switch (Custom toggle)
// ----------------------------------------------------------------------

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, checked, onCheckedChange, disabled, ...props }, ref) => {
    return (
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onCheckedChange(!checked)}
        className={cn(
          "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--current-accent,var(--color-accent-blue))] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-base)] disabled:cursor-not-allowed disabled:opacity-50",
          checked ? "bg-[var(--color-success)]" : "bg-[var(--color-bg-surface)]",
          className
        )}
      >
        <span
          className={cn(
            "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform",
            checked ? "translate-x-5" : "translate-x-0"
          )}
        />
      </button>
    );
  }
);
Switch.displayName = "Switch";
