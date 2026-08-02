"use client";

import * as React from "react";
import { cn } from "@/utils/cn";
import { BodyText } from "@/components/adl/typography";
import { ConfidenceBadge, ConfidenceLevel } from "@/components/adl/composites/intel/ConfidenceBadge";
import { Sparkles } from "lucide-react";

function isConfidenceVisible(confidence?: ConfidenceLevel) {
  return confidence === "High" || confidence === "Medium" || confidence === "Low";
}

export interface AIChatBubbleProps {
  content: React.ReactNode;
  confidence?: ConfidenceLevel;
  className?: string;
}

export function AIChatBubble({ content, confidence, className }: AIChatBubbleProps) {
  return (
    <div className={cn("flex w-full justify-start mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300", className)}>
      <div className="flex gap-4 max-w-[85%]">
        
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-accent-indigo)] to-[var(--color-accent-blue)] flex items-center justify-center shrink-0 shadow-lg shadow-[var(--color-accent-indigo)]/20 mt-1">
          <Sparkles size={14} className="text-primary" />
        </div>
        
        <div className="flex flex-col gap-2">
          <div className="bg-[var(--color-accent-blue)]/[0.08] border border-[var(--color-accent-blue)]/20 rounded-2xl rounded-tl-sm p-4 shadow-sm">
            <BodyText size="md" className="leading-relaxed whitespace-pre-wrap text-[var(--color-text-primary)]">
              {content}
            </BodyText>
          </div>
          
          {isConfidenceVisible(confidence) && (
            <div className="flex justify-start px-2">
              <ConfidenceBadge level={confidence} />
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}
