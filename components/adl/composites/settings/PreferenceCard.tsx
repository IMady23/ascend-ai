"use client";

import * as React from "react";
import { cn } from "@/utils/cn";
import { GlassCard } from "@/components/adl/composites/cards/Cards";
import { BodyText, Caption } from "@/components/adl/typography";

export interface PreferenceCardProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action: React.ReactNode;
  className?: string;
}

export function PreferenceCard({ title, description, icon, action, className }: PreferenceCardProps) {
  return (
    <GlassCard className={cn("p-4 flex items-center justify-between gap-4 hover:bg-[var(--color-bg-surface)] transition-colors", className)}>
      <div className="flex items-start gap-3 flex-1 min-w-0">
        {icon && (
          <div className="p-2 rounded-lg bg-[var(--color-bg-base)] text-[var(--color-text-secondary)] border border-[var(--color-glass-border)] shrink-0 mt-0.5">
            {icon}
          </div>
        )}
        <div className="flex flex-col gap-0.5 min-w-0">
          <BodyText size="sm" className="font-semibold text-[var(--color-text-primary)] truncate">{title}</BodyText>
          {description && (
            <Caption className="text-[var(--color-text-secondary)] leading-snug line-clamp-2">{description}</Caption>
          )}
        </div>
      </div>
      <div className="shrink-0 flex items-center justify-end pl-4">
        {action}
      </div>
    </GlassCard>
  );
}
