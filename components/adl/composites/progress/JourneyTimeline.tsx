"use client";

import * as React from "react";
import { cn } from "@/utils/cn";
import { Heading, BodyText, Caption } from "@/components/adl/typography";

export interface JourneyNode {
  id: string;
  title: string;
  date: string;
  description?: string;
  icon?: React.ReactNode;
  isActive?: boolean;
}

export interface JourneyTimelineProps {
  nodes: JourneyNode[];
  className?: string;
}

export function JourneyTimeline({ nodes, className }: JourneyTimelineProps) {
  return (
    <div className={cn("relative flex flex-col gap-6 py-4", className)}>
      {/* Connecting Line */}
      <div className="absolute left-[23px] top-4 bottom-4 w-[2px] bg-gradient-to-b from-[var(--color-accent-gold)] via-[var(--color-glass-border)] to-transparent" />
      
      {nodes.map((node, i) => (
        <div key={node.id} className={cn(
          "relative flex gap-6 group transition-opacity",
          !node.isActive && "opacity-50 hover:opacity-100"
        )}>
          {/* Node Icon/Dot */}
          <div className="relative z-10 shrink-0">
            <div className={cn(
              "w-12 h-12 rounded-full border-2 flex items-center justify-center bg-[var(--color-bg-base)] transition-colors",
              node.isActive 
                ? "border-[var(--color-accent-gold)] text-[var(--color-accent-gold)] shadow-[0_0_15px_rgba(var(--color-accent-gold-rgb),0.3)]"
                : "border-[var(--color-glass-border)] text-[var(--color-text-muted)] group-hover:border-[var(--color-text-secondary)]"
            )}>
              {node.icon ? (
                <div className="text-xl">{node.icon}</div>
              ) : (
                <div className={cn("w-3 h-3 rounded-full", node.isActive ? "bg-[var(--color-accent-gold)]" : "bg-[var(--color-text-muted)]")} />
              )}
            </div>
          </div>
          
          {/* Node Content */}
          <div className="flex flex-col pt-1.5 pb-4">
            <Caption className="text-[var(--color-text-muted)] font-mono text-[10px] mb-1">{node.date}</Caption>
            <Heading level="h4" className={cn(
              "text-lg transition-colors",
              node.isActive ? "text-[var(--color-text-primary)]" : "text-[var(--color-text-secondary)]"
            )}>
              {node.title}
            </Heading>
            {node.description && (
              <BodyText size="sm" className="text-[var(--color-text-muted)] mt-1 max-w-sm">
                {node.description}
              </BodyText>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
