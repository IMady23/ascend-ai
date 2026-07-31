"use client";

import { useActivityStore } from "@/stores/activity.store";
import { Dumbbell, Target, Flame } from "lucide-react";

export function TrainingHero() {
  const currentActivity = useActivityStore((state) => state.currentActivity);
  
  // Using mocks for stats that aren't available in current state
  const currentStreak = 12;
  const weeklyCompletion = 85;

  const hasCompletedWorkoutToday = currentActivity && currentActivity.date.toMillis() > Date.now() - 86400000;

  return (
    <section className="bg-gradient-to-br from-orange-900/40 to-black border border-orange-900/50 rounded-2xl p-6 md:p-10 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
      
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-orange-400 font-medium mb-2">
            <Dumbbell size={16} />
            <span className="uppercase tracking-wider text-xs font-bold">Training Center</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-primary mb-4 tracking-tight">
            {hasCompletedWorkoutToday ? "Day Conquered." : "Ready to push?"}
          </h1>
          <p className="text-secondary max-w-xl text-sm md:text-base leading-relaxed">
            {hasCompletedWorkoutToday 
              ? "You've crushed today's requirements. Rest, recover, and prepare for tomorrow."
              : "Your next session is waiting. Embrace the friction."}
          </p>
        </div>

        <div className="flex gap-6">
          <div className="flex flex-col items-start bg-base/50 border border-border-subtle/50 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-secondary mb-1">
              <Flame size={14} className="text-orange-400" />
              <span className="text-xs font-bold uppercase tracking-wider">Streak</span>
            </div>
            <span className="text-2xl font-black text-primary font-mono">{currentStreak}</span>
          </div>
          <div className="flex flex-col items-start bg-base/50 border border-border-subtle/50 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-secondary mb-1">
              <Target size={14} className="text-orange-400" />
              <span className="text-xs font-bold uppercase tracking-wider">Weekly</span>
            </div>
            <span className="text-2xl font-black text-primary font-mono">{weeklyCompletion}%</span>
          </div>
        </div>
      </div>
    </section>
  );
}
