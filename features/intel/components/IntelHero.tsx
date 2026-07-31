"use client";

import { useUserStore } from "@/stores/user.store";
import { useMissionStore } from "@/stores/mission.store";
import { Activity, Flame, Trophy } from "lucide-react";

export function IntelHero() {
  const { profile } = useUserStore();
  const missions = useMissionStore((state) => state.missions);
  
  // Compute some dynamic placeholder stats based on existing data if possible
  const completedMissions = missions.filter((m) => m.completed).length;
  const totalMissions = missions.length || 1;
  const completionRate = Math.round((completedMissions / totalMissions) * 100);
  
  // We'll use a mocked streak since the store doesn't currently expose it
  const currentStreak = 12;
  const transformationScore = 84; // Mock

  return (
    <section className="bg-gradient-to-br from-indigo-900/40 to-black border border-indigo-900/50 rounded-2xl p-6 md:p-10 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
      
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-medium mb-2">
            <Activity size={16} />
            <span className="uppercase tracking-wider text-xs font-bold">Intel Center</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-primary mb-4 tracking-tight">
            How am I doing?
          </h1>
          <p className="text-secondary max-w-xl text-sm md:text-base leading-relaxed">
            Your transformation is on track. Consistency is key. Keep pushing forward.
          </p>
        </div>

        <div className="flex gap-4">
          <div className="flex flex-col items-start bg-base/50 border border-border-subtle/50 rounded-xl p-4 backdrop-blur-sm min-w-[120px]">
            <div className="flex items-center gap-2 text-secondary mb-1">
              <Trophy size={14} className="text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-wider">Score</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-primary font-mono">{transformationScore}</span>
            </div>
          </div>
          
          <div className="flex flex-col items-start bg-base/50 border border-border-subtle/50 rounded-xl p-4 backdrop-blur-sm min-w-[120px]">
            <div className="flex items-center gap-2 text-secondary mb-1">
              <Activity size={14} className="text-indigo-400" />
              <span className="text-xs font-bold uppercase tracking-wider">Weekly</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-primary font-mono">{completionRate}%</span>
            </div>
          </div>

          <div className="hidden sm:flex flex-col items-start bg-base/50 border border-border-subtle/50 rounded-xl p-4 backdrop-blur-sm min-w-[100px]">
            <div className="flex items-center gap-2 text-secondary mb-1">
              <Flame size={14} className="text-rose-400" />
              <span className="text-xs font-bold uppercase tracking-wider">Streak</span>
            </div>
            <span className="text-2xl font-black text-primary font-mono">{currentStreak}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
