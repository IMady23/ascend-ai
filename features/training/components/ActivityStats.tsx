"use client";

import { useActivityStore } from "@/stores/activity.store";
import { Activity, Flame, Clock, Footprints, Map } from "lucide-react";

export function ActivityStats() {
  const activities = useActivityStore((state) => state.activities);
  const dailySteps = useActivityStore((state) => state.dailySteps);

  // Derive stats from activities array
  const totalWorkouts = activities.length;
  const minutesTrained = activities.reduce((acc, curr) => acc + curr.durationMinutes, 0);
  const caloriesBurned = activities.reduce((acc, curr) => acc + (curr.caloriesBurned || 0), 0);
  const distanceWalked = (dailySteps * 0.0008).toFixed(1); // Rough km estimate

  const stats = [
    { label: "Workouts", value: totalWorkouts, icon: Activity, color: "text-blue-400", bg: "bg-blue-400/10" },
    { label: "Minutes", value: minutesTrained, icon: Clock, color: "text-purple-400", bg: "bg-purple-400/10" },
    { label: "Calories", value: caloriesBurned.toLocaleString(), icon: Flame, color: "text-orange-400", bg: "bg-orange-400/10" },
    { label: "Steps", value: dailySteps.toLocaleString(), icon: Footprints, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { label: "Km", value: distanceWalked, icon: Map, color: "text-zinc-400", bg: "bg-zinc-800" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col items-start gap-4 transition-transform hover:-translate-y-1 duration-300">
            <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color}`}>
              <Icon size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-white font-mono">{stat.value}</p>
              <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mt-1">{stat.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
