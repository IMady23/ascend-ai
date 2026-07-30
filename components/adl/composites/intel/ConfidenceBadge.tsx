"use client";

import * as React from "react";
import { cn } from "@/utils/cn";
import { Badge } from "@/components/adl/primitives/Badge";
import { CheckCircle2, AlertCircle, HelpCircle, AlertTriangle } from "lucide-react";

export type ConfidenceLevel = "High" | "Medium" | "Low" | "Unknown";

export interface ConfidenceBadgeProps {
  level: ConfidenceLevel;
  className?: string;
}

export function ConfidenceBadge({ level, className }: ConfidenceBadgeProps) {
  const Icon = 
    level === "High" ? CheckCircle2 :
    level === "Medium" ? AlertCircle :
    level === "Low" ? AlertTriangle : HelpCircle;

  const colorClass = 
    level === "High" ? "border-[var(--color-success)] text-[var(--color-success)]" :
    level === "Medium" ? "border-[var(--color-accent-gold)] text-[var(--color-accent-gold)]" :
    level === "Low" ? "border-[var(--color-accent-orange)] text-[var(--color-accent-orange)]" :
    "border-[var(--color-text-muted)] text-[var(--color-text-muted)]";

  const label = level === "High" ? "Strong signal" : level === "Medium" ? "Growing signal" : "Early signal";

  return (
    <Badge variant="outline" className={cn("flex items-center gap-1.5 px-2 py-0.5 shadow-sm bg-[var(--color-bg-base)]/80 backdrop-blur-sm", colorClass, className)}>
      <Icon size={12} />
      <span className="font-semibold tracking-wider uppercase text-[9px]">
        {label}
      </span>
    </Badge>
  );
}
