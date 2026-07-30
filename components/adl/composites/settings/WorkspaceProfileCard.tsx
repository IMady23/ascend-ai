"use client";

import * as React from "react";
import { cn } from "@/utils/cn";
import { GlassCard } from "@/components/adl/composites/cards/Cards";
import { Heading, BodyText, Caption } from "@/components/adl/typography";
import { Badge } from "@/components/adl/primitives/Badge";
import { CheckCircle2 } from "lucide-react";

export interface WorkspaceProfileCardProps {
  name: string;
  description: string;
  icon: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

export function WorkspaceProfileCard({
  name,
  description,
  icon,
  isActive = false,
  onClick,
  className
}: WorkspaceProfileCardProps) {
  return (
    <GlassCard 
      className={cn(
        "p-4 cursor-pointer transition-all relative overflow-hidden group",
        isActive ? "border-[var(--current-accent,var(--color-accent-blue))] shadow-[0_0_15px_rgba(0,0,0,0.1)]" : "hover:border-[var(--color-text-muted)]",
        className
      )}
      onClick={onClick}
    >
      {isActive && (
        <div className="absolute top-0 left-0 w-1 h-full bg-[var(--current-accent,var(--color-accent-blue))]" />
      )}
      
      <div className="flex justify-between items-start mb-2 pl-2">
        <div className="p-2 rounded-lg bg-[var(--color-bg-base)] text-[var(--color-text-primary)] border border-[var(--color-glass-border)]">
          {icon}
        </div>
        {isActive && (
          <Badge variant="outline" className="border-[var(--current-accent,var(--color-accent-blue))] text-[var(--current-accent,var(--color-accent-blue))] gap-1 px-1.5">
            <CheckCircle2 size={10} /> Active
          </Badge>
        )}
      </div>
      
      <div className="pl-2">
        <Heading level="h4" className="text-sm mb-1">{name}</Heading>
        <Caption className="text-[var(--color-text-secondary)] line-clamp-2">{description}</Caption>
      </div>
    </GlassCard>
  );
}
