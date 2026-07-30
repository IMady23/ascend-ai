"use client";

import * as React from "react";
import { cn } from "@/utils/cn";
import { Badge } from "@/components/adl/primitives/Badge";
import { BrainCircuit, X } from "lucide-react";

export interface MemoryChipProps {
  label: string;
  category: "goal" | "preference" | "milestone" | "context";
  onRemove?: () => void;
  className?: string;
}

export function MemoryChip({ label, category, onRemove, className }: MemoryChipProps) {
  const colorClass = 
    category === "goal" ? "border-[var(--color-accent-indigo)] text-[var(--color-accent-indigo)] bg-[var(--color-accent-indigo)]/5" :
    category === "preference" ? "border-[var(--color-accent-blue)] text-[var(--color-accent-blue)] bg-[var(--color-accent-blue)]/5" :
    category === "milestone" ? "border-[var(--color-accent-gold)] text-[var(--color-accent-gold)] bg-[var(--color-accent-gold)]/5" :
    "border-[var(--color-text-muted)] text-[var(--color-text-primary)] bg-[var(--color-bg-surface)]";

  return (
    <Badge variant="outline" className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-md", colorClass, className)}>
      <BrainCircuit size={12} className="opacity-70" />
      <span className="text-xs font-medium">{label}</span>
      {onRemove && (
        <button 
          onClick={onRemove}
          className="ml-1 opacity-50 hover:opacity-100 transition-opacity focus:outline-none"
        >
          <X size={12} />
        </button>
      )}
    </Badge>
  );
}
