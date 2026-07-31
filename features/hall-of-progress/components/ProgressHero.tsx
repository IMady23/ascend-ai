"use client";

import { useChapterStore } from "@/stores/chapter.store";
import { useUserStore } from "@/stores/user.store";
import { useProgressionStore } from "@/stores/progression.store";
import { motion } from "framer-motion";
import { Trophy, Star, Zap, Flame } from "lucide-react";

export function ProgressHero() {
  const { currentChapter } = useChapterStore();
  const { profile } = useUserStore();
  const { profile: progressionProfile } = useProgressionStore();

  const chapterTitle = currentChapter?.title || "Initiation";
  const level = progressionProfile?.xp?.currentLevel || 1;
  const totalXp = progressionProfile?.xp?.total || 0;
  const currentStreak = progressionProfile?.streak?.current || 0;

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-purple-900/40 to-black border border-purple-900/50 rounded-2xl p-6 md:p-10 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
      
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-purple-400 font-medium mb-2">
            <Trophy size={16} />
            <span className="uppercase tracking-wider text-xs font-bold">Hall of Progress</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-primary mb-4 tracking-tight">
            How far have I come?
          </h1>
          <p className="text-secondary max-w-xl text-sm md:text-base leading-relaxed">
            Every drop of sweat, every perfect day, etched into your history. 
            You are currently dominating <span className="text-purple-300 font-semibold">{chapterTitle}</span>.
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="flex flex-col items-start bg-base/50 border border-border-subtle/50 rounded-xl p-4 backdrop-blur-sm min-w-[110px]">
            <div className="flex items-center gap-2 text-secondary mb-1">
              <Star size={14} className="text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-wider">Level</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-primary font-mono">{level}</span>
            </div>
          </div>
          
          <div className="flex flex-col items-start bg-base/50 border border-border-subtle/50 rounded-xl p-4 backdrop-blur-sm min-w-[110px]">
            <div className="flex items-center gap-2 text-secondary mb-1">
              <Zap size={14} className="text-purple-400" />
              <span className="text-xs font-bold uppercase tracking-wider">XP</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-primary font-mono">{(totalXp / 1000).toFixed(1)}k</span>
            </div>
          </div>

          <div className="hidden sm:flex flex-col items-start bg-base/50 border border-border-subtle/50 rounded-xl p-4 backdrop-blur-sm min-w-[110px]">
            <div className="flex items-center gap-2 text-secondary mb-1">
              <Flame size={14} className="text-rose-400" />
              <span className="text-xs font-bold uppercase tracking-wider">Streak</span>
            </div>
            <span className="text-2xl font-black text-primary font-mono">{currentStreak}</span>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
