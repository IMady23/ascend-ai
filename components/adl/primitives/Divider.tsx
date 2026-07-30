import * as React from "react";
import { cn } from "@/utils/cn";

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  glass?: boolean;
}

export const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
  (
    { className, orientation = "horizontal", glass = false, ...props },
    ref
  ) => {
    return (
      <div
        ref={ref}
        role="separator"
        aria-orientation={orientation}
        className={cn(
          "shrink-0",
          orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
          glass ? "bg-[var(--color-glass-border)]" : "bg-[var(--color-border)]",
          className
        )}
        {...props}
      />
    );
  }
);
Divider.displayName = "Divider";
