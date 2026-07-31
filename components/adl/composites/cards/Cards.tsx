import * as React from "react";
import { cn } from "@/utils/cn";
import { GlassSurface, Surface } from "@/components/adl/system/Surface";

// ----------------------------------------------------------------------
// BaseCard (Standard static card)
// ----------------------------------------------------------------------

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingStyles = {
  none: "p-0",
  sm: "p-4",
  md: "p-4 sm:p-6", // Adaptive padding: tighter on mobile, spacious on tablet+
  lg: "p-6 sm:p-8",
};

export function Card({ className, padding = "md", children, ...props }: CardProps) {
  return (
    <Surface level={1} className={cn("rounded-xl sm:rounded-2xl", paddingStyles[padding], className)} {...props}>
      {children}
    </Surface>
  );
}

// ----------------------------------------------------------------------
// GlassCard (AI / Floating overlays)
// ----------------------------------------------------------------------

export interface GlassCardProps extends CardProps {
  intensity?: "low" | "standard" | "high";
}

export function GlassCard({ className, padding = "md", intensity = "standard", children, ...props }: GlassCardProps) {
  return (
    <div 
      className={cn("glass-premium", paddingStyles[padding], className)} 
      {...props}
    >
      {children}
    </div>
  );
}

// ----------------------------------------------------------------------
// InteractiveCard (Clickable, hover lift)
// ----------------------------------------------------------------------

export interface InteractiveCardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: "none" | "sm" | "md" | "lg";
}

export function InteractiveCard({ className, padding = "md", children, ...props }: InteractiveCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl sm:rounded-2xl cursor-pointer bg-bg-surface-elevated border border-border shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-accent,var(--color-info))] transition-all duration-normal ease-ui",
        "hover:border-[var(--color-accent,var(--color-info))]/50 hover:shadow-md hover:-translate-y-1 active:scale-[0.98] active:translate-y-0",
        paddingStyles[padding], 
        className
      )}
      tabIndex={0}
      {...props}
    >
      {children}
    </div>
  );
}

// ----------------------------------------------------------------------
// MetricCard (Compact KPI data)
// ----------------------------------------------------------------------

export interface MetricCardProps extends CardProps {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    label: string;
    isPositive: boolean;
  };
  status?: "excellent" | "good" | "warning" | "critical" | "achieved" | "missed" | "neutral";
}

const statusColors = {
  excellent: "bg-success",
  good: "bg-info",
  warning: "bg-warning",
  critical: "bg-danger",
  achieved: "bg-success",
  missed: "bg-danger",
  neutral: "bg-text-disabled",
};

export function MetricCard({ label, value, icon, trend, status, className, ...props }: MetricCardProps) {
  return (
    <Card padding="md" className={cn("flex flex-col justify-between relative overflow-hidden min-h-[140px]", className)} {...props}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {status && status !== "neutral" && (
            <div className={cn("w-2.5 h-2.5 rounded-full shadow-sm", statusColors[status])} />
          )}
          <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">{label}</span>
        </div>
        {icon && <div className="text-text-muted">{icon}</div>}
      </div>
      
      <div className="flex flex-col gap-1 mt-auto">
        <span className="text-2xl sm:text-3xl font-black tracking-tight text-text-primary font-mono">{value}</span>

        {trend && (
          <div className="flex items-center gap-1.5 text-xs font-medium mt-1">
            <span className={trend.isPositive ? "text-success" : "text-danger"}>
              {trend.isPositive ? "+" : ""}{trend.value}%
            </span>
            <span className="text-text-secondary">{trend.label}</span>
          </div>
        )}
      </div>
    </Card>
  );
}
