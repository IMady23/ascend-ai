"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import { Caption } from "@/components/adl/typography";
import { Lock } from "lucide-react";

export type TrophyTier = "Bronze" | "Silver" | "Gold" | "Diamond" | "Legendary";

export interface AchievementBadgeProps {
  icon: React.ReactNode;
  name: string;
  tier: TrophyTier;
  isUnlocked: boolean;
  dateUnlocked?: string;
  onClick?: () => void;
  className?: string;
}

const tierColors: Record<TrophyTier, string> = {
  Bronze: "from-orange-700/80 to-amber-900/80 border-orange-500/50 text-orange-200",
  Silver: "from-slate-400/80 to-slate-600/80 border-slate-300/50 text-primary",
  Gold: "from-yellow-400/80 to-amber-600/80 border-yellow-300/50 text-yellow-100",
  Diamond: "from-cyan-300/80 to-blue-500/80 border-cyan-200/50 text-cyan-50",
  Legendary: "from-fuchsia-500/80 via-purple-600/80 to-indigo-800/80 border-fuchsia-300/50 text-fuchsia-50 animate-pulse",
};

export function AchievementBadge({
  icon,
  name,
  tier,
  isUnlocked,
  dateUnlocked,
  onClick,
  className
}: AchievementBadgeProps) {
  
  if (!isUnlocked) {
    return (
      <div className={cn("flex flex-col items-center gap-2 group", className)}>
        <div className="w-20 h-20 rounded-full bg-surface border border-border-subtle flex items-center justify-center opacity-40 grayscale transition-all group-hover:opacity-60">
          <Lock size={24} className="text-[var(--color-text-muted)]" />
        </div>
        <Caption className="text-[var(--color-text-muted)] text-center text-xs w-full line-clamp-2">Locked</Caption>
      </div>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn("flex flex-col items-center gap-2 group outline-none", className)}
    >
      <div className={cn(
        "w-20 h-20 rounded-full flex items-center justify-center border shadow-xl bg-gradient-to-br transition-all relative overflow-hidden",
        tierColors[tier]
      )}>
        {/* Glow effect */}
        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        {/* Reflection slash */}
        <div className="absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 transform bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-40 group-hover:animate-[shimmer_1.5s_infinite]" />
        
        <div className="relative z-10 text-3xl filter drop-shadow-md">
          {icon}
        </div>
      </div>
      <div className="flex flex-col items-center">
        <Caption className="text-primary text-center text-xs font-semibold w-24 leading-tight mb-0.5">{name}</Caption>
        {dateUnlocked && <span className="text-[9px] text-[var(--color-text-muted)] uppercase tracking-wider">{dateUnlocked}</span>}
      </div>
    </motion.button>
  );
}
