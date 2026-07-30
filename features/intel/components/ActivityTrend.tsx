"use client";

import { useActivityStore } from "@/stores/activity.store";
import { Activity, Dumbbell, Timer } from "lucide-react";
import { MOCK_ACTIVITY_TREND } from "../constants";

export function ActivityTrend() {
  const { activities } = useActivityStore();
  
  const totalWorkouts = activities.length;
  const totalMinutes = activities.reduce((sum, a) => sum + (a.durationMinutes || 0), 0);
  
  // Basic empty distribution for now to satisfy UI requirements
  const weeklyDistribution = [
    { day: "Mon", minutes: 0 },
    { day: "Tue", minutes: 0 },
    { day: "Wed", minutes: 0 },
    { day: "Thu", minutes: 0 },
    { day: "Fri", minutes: 0 },
    { day: "Sat", minutes: 0 },
    { day: "Sun", minutes: 0 },
  ];

  // We could map recent activities to the distribution here, but keeping it simple for phase 5 live data conversion

  const maxMinutes = Math.max(...weeklyDistribution.map(d => d.minutes), 1); // fallback to 1 to avoid / 0

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <Activity size={18} className="text-zinc-400" />
        <h2 className="text-lg font-semibold text-white">Activity Trend</h2>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-zinc-400 mb-1">
            <Dumbbell size={14} className="text-indigo-400" />
            <span className="text-xs uppercase tracking-wider font-semibold">Sessions</span>
          </div>
          <span className="text-2xl font-bold text-white font-mono">{totalWorkouts}</span>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-zinc-400 mb-1">
            <Timer size={14} className="text-rose-400" />
            <span className="text-xs uppercase tracking-wider font-semibold">Minutes</span>
          </div>
          <span className="text-2xl font-bold text-white font-mono">{totalMinutes}</span>
        </div>
      </div>

      {/* Simple Bar Chart */}
      <div className="h-24 flex items-end justify-between gap-2">
        {weeklyDistribution.map((day, i) => {
          const heightPct = Math.max((day.minutes / maxMinutes) * 100, 4); // minimum 4% for visibility
          const isActive = day.minutes > 0;
          
          return (
            <div key={i} className="flex flex-col items-center gap-2 flex-1 group">
              <div className="w-full relative h-full flex flex-col justify-end bg-zinc-950 rounded-sm overflow-hidden">
                <div 
                  className={`w-full rounded-sm transition-all duration-500 ${isActive ? 'bg-indigo-500 group-hover:bg-indigo-400' : 'bg-zinc-800'}`}
                  style={{ height: `${heightPct}%` }}
                />
              </div>
              <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">
                {day.day[0]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
