import * as React from "react";
import { cn } from "@/utils/cn";
import { WorkoutRecoveryBanner } from "@/components/adl/composites/training/WorkoutRecoveryBanner";

// ----------------------------------------------------------------------
// Page & Dashboard
// ----------------------------------------------------------------------

export function DashboardLayout({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("min-h-screen bg-base flex flex-col", className)} {...props}>
      <WorkoutRecoveryBanner />
      {children}
    </div>
  );
}

// ----------------------------------------------------------------------
// Hero Section
// ----------------------------------------------------------------------

export function HeroSection({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <section className={cn("relative w-full py-12 md:py-20 lg:py-24 flex flex-col items-center justify-center text-center overflow-hidden", className)} {...props}>
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--current-accent,var(--color-primary))]/5 to-transparent pointer-events-none" />
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 md:px-8">
        {children}
      </div>
    </section>
  );
}

// ----------------------------------------------------------------------
// Widget Section & Analytics Grid
// ----------------------------------------------------------------------

export function WidgetSection({ className, title, action, children, ...props }: React.HTMLAttributes<HTMLDivElement> & { title?: React.ReactNode, action?: React.ReactNode }) {
  return (
    <section className={cn("w-full py-8", className)} {...props}>
      {(title || action) && (
        <div className="flex items-center justify-between mb-6 px-1">
          {title && <h3 className="text-xl font-semibold text-primary tracking-tight">{title}</h3>}
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </section>
  );
}

export function AnalyticsGrid({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6", className)} {...props}>
      {children}
    </div>
  );
}

// ----------------------------------------------------------------------
// Form Section
// ----------------------------------------------------------------------

export function FormSection({ className, title, description, children, ...props }: React.HTMLAttributes<HTMLDivElement> & { title?: React.ReactNode, description?: React.ReactNode }) {
  return (
    <div className={cn("flex flex-col md:flex-row gap-8 md:gap-12 py-8 border-b border-border-subtle last:border-0", className)} {...props}>
      <div className="w-full md:w-1/3">
        {title && <h4 className="text-lg font-semibold text-primary mb-1">{title}</h4>}
        {description && <p className="text-sm text-secondary">{description}</p>}
      </div>
      <div className="w-full md:w-2/3 space-y-6">
        {children}
      </div>
    </div>
  );
}
