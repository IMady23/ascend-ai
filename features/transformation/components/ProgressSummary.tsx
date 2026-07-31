"use client";

import { useUserStore } from "@/stores/user.store";
import { useMissionStore } from "@/stores/mission.store";
import { useChapterStore } from "@/stores/chapter.store";
import { Trophy, Flame, CheckCircle, Zap } from "lucide-react";

export function ProgressSummary() {
  const missions = useMissionStore((state) => state.missions);
  const chapters = useChapterStore((state) => state.chapters); 
  
  // Calculate stats based on available store data
  const chaptersCompleted = chapters ? chapters.filter(c => c.status === "completed").length : 0; 
  const currentStreak = 12; // Fallback mock
  const totalMissionsCompleted = missions.filter(m => m.completed).length + 42; // Base mock + today's
  const totalScore = 14500; // Mock score

  const stats = [
    { label: "Chapters", value: chaptersCompleted, icon: Trophy, color: "text-yellow-400", bg: "bg-yellow-400/10" },
    { label: "Day Streak", value: currentStreak, icon: Flame, color: "text-orange-400", bg: "bg-orange-400/10" },
    { label: "Missions", value: totalMissionsCompleted, icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { label: "Score", value: totalScore.toLocaleString(), icon: Zap, color: "text-indigo-400", bg: "bg-indigo-400/10" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div key={i} className="bg-surface border border-border-subtle rounded-2xl p-5 flex flex-col items-start gap-4 transition-transform hover:scale-[1.02] duration-300">
            <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color}`}>
              <Icon size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-primary font-mono">{stat.value}</p>
              <p className="text-secondary text-xs font-semibold uppercase tracking-wider mt-1">{stat.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
