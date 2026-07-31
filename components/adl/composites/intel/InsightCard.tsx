"use client";

import * as React from "react";
import { cn } from "@/utils/cn";
import { GlassCard } from "@/components/adl/composites/cards/Cards";
import { Heading, BodyText, Caption } from "@/components/adl/typography";
import { Button } from "@/components/adl/primitives/Button";
import { ConfidenceBadge, ConfidenceLevel } from "./ConfidenceBadge";
import { ChevronDown, ChevronUp, Sparkles, LineChart, MessageSquare, Star } from "lucide-react";

export interface InsightCardProps {
  title: string;
  insight: string;
  eli5: string;
  confidence: ConfidenceLevel;
  evidenceLabel: string;
  suggestedAction?: string;
  timeWindow: string;
  className?: string;
}

export function InsightCard({
  title,
  insight,
  eli5,
  confidence,
  evidenceLabel,
  suggestedAction,
  timeWindow,
  className
}: InsightCardProps) {
  const [expanded, setExpanded] = React.useState(false);
  const [showEli5, setShowEli5] = React.useState(false);
  const [rating, setRating] = React.useState(0);

  const activeText = showEli5 ? eli5 : insight;

  return (
    <GlassCard className={cn("p-5 flex flex-col gap-4 border-[var(--color-accent-indigo)]/30 group", className)}>
      
      <div className="flex justify-between items-start gap-4">
        <div>
          <Heading level="h4" className="text-sm text-[var(--color-accent-indigo)] mb-1">{title}</Heading>
          <BodyText size="md" className={cn("text-primary transition-all duration-300", showEli5 && "font-mono text-sm leading-relaxed")}>
            {activeText}
          </BodyText>
        </div>
        <ConfidenceBadge level={confidence} className="shrink-0 mt-1" />
      </div>

      <div className="flex items-center justify-between border-t border-border-subtle pt-3 mt-1">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className={cn("h-7 px-2 text-xs", showEli5 ? "bg-[var(--color-accent-pink)]/10 text-[var(--color-accent-pink)]" : "text-[var(--color-text-muted)]")}
            leftIcon={<Sparkles size={12} />}
            onClick={() => setShowEli5(!showEli5)}
          >
            Explain Simply
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 px-2 text-xs text-[var(--color-text-muted)] hover:text-primary"
            rightIcon={expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Hide Details" : "Insight Explorer"}
          </Button>
        </div>
        <Caption className="text-[var(--color-text-muted)] font-mono text-[10px] uppercase">{timeWindow}</Caption>
      </div>

      {/* Expanded State (Insight Explorer) */}
      {expanded && (
        <div className="flex flex-col gap-4 mt-2 p-4 bg-base/50 rounded-[var(--radius-lg)] border border-border-subtle animate-in fade-in slide-in-from-top-2 duration-300">
          
          <div>
            <Caption className="text-[var(--color-text-muted)] uppercase tracking-wider mb-2 font-semibold">Evidence</Caption>
            <div className="flex items-center gap-2 text-sm text-primary bg-surface p-2 rounded-md border border-border-subtle">
              <LineChart size={16} className="text-[var(--color-accent-blue)]" />
              <span>{evidenceLabel}</span>
            </div>
          </div>

          {suggestedAction && (
            <div>
              <Caption className="text-[var(--color-text-muted)] uppercase tracking-wider mb-2 font-semibold">Suggested Action</Caption>
              <div className="flex items-center gap-2 text-sm text-primary bg-[var(--color-accent-green)]/5 p-2 rounded-md border border-[var(--color-accent-green)]/20">
                <MessageSquare size={16} className="text-[var(--color-accent-green)]" />
                <span>{suggestedAction}</span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-border-subtle">
            <Caption className="text-[var(--color-text-muted)]">Rate this insight:</Caption>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  size={16} 
                  className={cn("cursor-pointer transition-colors", star <= rating ? "fill-[var(--color-accent-gold)] text-[var(--color-accent-gold)]" : "text-[var(--color-text-muted)] hover:text-secondary")}
                  onClick={() => setRating(star)}
                />
              ))}
            </div>
          </div>

        </div>
      )}

    </GlassCard>
  );
}
