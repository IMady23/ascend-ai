import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import { CardMotion } from "@/utils/motion";
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
  md: "p-6",
  lg: "p-8",
};

export function Card({ className, padding = "md", children, ...props }: CardProps) {
  return (
    <Surface level={1} className={cn("rounded-[var(--radius-xl)]", paddingStyles[padding], className)} {...props}>
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

export interface InteractiveCardProps extends React.ComponentPropsWithoutRef<typeof motion.div> {
  padding?: "none" | "sm" | "md" | "lg";
}

export function InteractiveCard({ className, padding = "md", children, ...props }: InteractiveCardProps) {
  return (
    <motion.div
      whileHover={CardMotion.hoverLift.hover}
      whileTap={CardMotion.hoverLift.tap}
      className={cn(
        "rounded-[24px] cursor-pointer bg-[var(--color-bg-surface)] border border-[var(--color-glass-border)] shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transition-all duration-300",
        "hover:border-[var(--color-accent-blue)]/50 hover:shadow-[0_10px_40px_rgba(37,99,255,0.15)]",
        paddingStyles[padding], 
        className
      )}
      tabIndex={0}
      {...props}
    >
      {children}
    </motion.div>
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
  excellent: "bg-[var(--color-success)]",
  good: "bg-[var(--color-info)]",
  warning: "bg-[var(--color-warning)]",
  critical: "bg-[var(--color-danger)]",
  achieved: "bg-[var(--color-success)]",
  missed: "bg-[var(--color-danger)]",
  neutral: "bg-[var(--color-text-muted)]",
};

export function MetricCard({ label, value, icon, trend, status, className, ...props }: MetricCardProps) {
  return (
    <Card padding="md" className={cn("flex flex-col gap-3 relative overflow-hidden", className)} {...props}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {status && status !== "neutral" && (
            <div className={cn("w-2 h-2 rounded-full", statusColors[status])} />
          )}
          <span className="text-sm font-medium text-[var(--color-text-secondary)]">{label}</span>
        </div>
        {icon && <div className="text-[var(--color-text-muted)]">{icon}</div>}
      </div>
      
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold tracking-tight text-[var(--color-text-primary)] font-mono">{value}</span>
      </div>

      {trend && (
        <div className="flex items-center gap-1.5 text-xs font-medium mt-1">
          <span className={trend.isPositive ? "text-[var(--color-success)]" : "text-[var(--color-danger)]"}>
            {trend.isPositive ? "+" : ""}{trend.value}%
          </span>
          <span className="text-[var(--color-text-muted)]">{trend.label}</span>
        </div>
      )}
    </Card>
  );
}
