"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import { GlassCard } from "@/components/adl/composites/cards/Cards";
import { Heading, BodyText, Caption } from "@/components/adl/typography";
import { Trophy } from "lucide-react";

export interface MilestoneCardProps {
  title: string;
  metric: string;
  date: string;
  description: string;
  icon?: React.ReactNode;
  className?: string;
}

export function MilestoneCard({
  title,
  metric,
  date,
  description,
  icon = <Trophy size={32} />,
  className
}: MilestoneCardProps) {
  return (
    <GlassCard className={cn(
      "p-6 border border-[var(--color-accent-gold)]/30 bg-gradient-to-br from-[var(--color-accent-gold)]/5 to-[var(--color-bg-base)] relative overflow-hidden group",
      className
    )}>
      {/* Background Glow */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-[var(--color-accent-gold)] opacity-5 blur-3xl rounded-full group-hover:opacity-10 transition-opacity" />
      
      <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--color-accent-gold)] to-amber-600 flex items-center justify-center text-primary shrink-0 shadow-[0_0_20px_rgba(var(--color-accent-gold-rgb),0.3)]">
          {icon}
        </div>
        
        <div className="flex-1">
          <Caption className="text-[var(--color-accent-gold)] uppercase tracking-widest font-bold mb-1">
            Milestone Reached • {date}
          </Caption>
          <Heading level="h3" className="text-2xl mb-1">{title}</Heading>
          <BodyText size="sm" className="text-secondary">{description}</BodyText>
        </div>
        
        <div className="text-left md:text-right shrink-0">
          <div className="font-mono text-3xl font-bold text-primary tracking-tight">{metric}</div>
        </div>
      </div>
    </GlassCard>
  );
}
