"use client";

import { useActivityStore } from "@/stores/activity.store";
import { useNutritionStore } from "@/stores/nutrition.store";
import { useMissionStore } from "@/stores/mission.store";
import { useChapterStore } from "@/stores/chapter.store";
import { ShieldCheck } from "lucide-react";
import { MOCK_WEEKLY_OVERVIEW } from "../constants";

export function ConsistencyScore() {
  const { activities } = useActivityStore();
  const { dailyCalories, dailyProtein, dailyWaterMl } = useNutritionStore();
  const { missions } = useMissionStore();
  const { currentChapter } = useChapterStore();

  // Mock score calculations based on Zustand data
  // Workouts: 35%
  const workoutScore = activities.length > 0 ? 100 : 85; // mock if no data
  
  // Nutrition: 25%
  const nutritionScore = dailyCalories && dailyProtein ? 90 : 88;
  
  // Hydration: 15%
  const hydrationScore = dailyWaterMl ? Math.min(100, Math.round((dailyWaterMl / 2500) * 100)) : 95;
  
  // Missions: 15%
  const completedMissions = missions.filter(m => m.completed).length;
  const missionScore = missions.length > 0 ? Math.min(100, Math.round((completedMissions / missions.length) * 100)) : 80;
  
  // Chapter Progress: 10%
  const chapterScore = currentChapter?.status === "in-progress" ? 85 : 75;

  const overallScore = Math.round(
    (workoutScore * 0.35) + 
    (nutritionScore * 0.25) + 
    (hydrationScore * 0.15) + 
    (missionScore * 0.15) + 
    (chapterScore * 0.10)
  );

  const categories = [
    { name: "Workouts", score: workoutScore, weight: 35, color: "bg-indigo-500" },
    { name: "Nutrition", score: nutritionScore, weight: 25, color: "bg-emerald-500" },
    { name: "Hydration", score: hydrationScore, weight: 15, color: "bg-cyan-500" },
    { name: "Missions", score: missionScore, weight: 15, color: "bg-amber-500" },
    { name: "Chapter", score: chapterScore, weight: 10, color: "bg-rose-500" },
  ];

  return (
    <div className="bg-surface/50 border border-border-subtle rounded-xl p-6 md:col-span-2">
      <div className="flex items-center gap-2 mb-6">
        <ShieldCheck size={18} className="text-secondary" />
        <h2 className="text-lg font-semibold text-primary">Consistency Score</h2>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-center">
        {/* Large Score Display */}
        <div className="flex-shrink-0 relative w-32 h-32 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-zinc-800" />
            <circle 
              cx="50" 
              cy="50" 
              r="40" 
              stroke="currentColor" 
              strokeWidth="6" 
              fill="transparent" 
              className="text-amber-400" 
              strokeDasharray={`${overallScore * 2.51} 251.2`} 
              strokeLinecap="round" 
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-black text-primary font-mono">{overallScore}%</span>
            <span className="text-[10px] uppercase tracking-wider text-secondary font-bold">Overall</span>
          </div>
        </div>

        {/* Breakdown */}
        <div className="flex-grow w-full grid gap-3">
          {categories.map((cat, i) => (
            <div key={i} className="flex items-center gap-4">
              <span className="w-24 text-xs font-semibold uppercase tracking-wider text-secondary">{cat.name}</span>
              <div className="flex-grow h-2 bg-base rounded-full overflow-hidden flex">
                <div 
                  className={`h-full ${cat.color} rounded-full transition-all duration-1000`}
                  style={{ width: `${cat.score}%` }}
                />
              </div>
              <span className="w-8 text-right text-sm font-bold text-primary font-mono">{cat.score}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
