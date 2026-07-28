"use client";

import { Play, Clock, Dumbbell, Activity } from "lucide-react";
import { useActivityStore } from "@/stores/activity.store";

export function TodayWorkout() {
  // Using a mock workout object since we don't have a complex workout structure in the store yet
  const workout = {
    title: "Full Body Ascend",
    durationMinutes: 45,
    difficulty: "Advanced",
    targets: "Chest, Back, Legs"
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      <div className="flex-1">
        <h2 className="text-xs font-bold uppercase tracking-wider text-orange-400 mb-2">Today's Protocol</h2>
        <h3 className="text-2xl font-bold text-white mb-4">{workout.title}</h3>
        
        <div className="flex flex-wrap gap-4 text-sm text-zinc-400">
          <div className="flex items-center gap-1.5 bg-zinc-800/50 px-3 py-1.5 rounded-lg border border-zinc-800">
            <Clock size={16} />
            <span>{workout.durationMinutes} min</span>
          </div>
          <div className="flex items-center gap-1.5 bg-zinc-800/50 px-3 py-1.5 rounded-lg border border-zinc-800">
            <Activity size={16} />
            <span>{workout.difficulty}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-zinc-800/50 px-3 py-1.5 rounded-lg border border-zinc-800">
            <Dumbbell size={16} />
            <span>{workout.targets}</span>
          </div>
        </div>
      </div>

      <button className="w-full md:w-auto bg-orange-500 hover:bg-orange-400 text-white font-bold py-4 px-8 rounded-xl transition-colors flex items-center justify-center gap-2 group">
        <Play size={20} className="fill-current" />
        Start Workout
      </button>
    </div>
  );
}
