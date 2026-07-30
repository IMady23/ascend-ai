"use client";

import { Play, Clock, Dumbbell, Activity } from "lucide-react";
import { useActivityStore } from "@/stores/activity.store";

export function TodayWorkout() {
  const { currentActivity } = useActivityStore();

  if (!currentActivity) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-orange-400 mb-2">Today's Protocol</h2>
          <h3 className="text-xl font-bold text-zinc-500 mb-2">No Active Protocol</h3>
          <p className="text-sm text-zinc-400">You don't have a workout scheduled for today.</p>
        </div>
        <button className="w-full md:w-auto bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-4 px-8 rounded-xl transition-colors flex items-center justify-center gap-2 group">
          <Dumbbell size={20} className="text-zinc-400 group-hover:text-white transition-colors" />
          Create Workout
        </button>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      <div className="flex-1">
        <h2 className="text-xs font-bold uppercase tracking-wider text-orange-400 mb-2">Active Protocol</h2>
        <h3 className="text-2xl font-bold text-white mb-4">{currentActivity.type} Session</h3>
        
        <div className="flex flex-wrap gap-4 text-sm text-zinc-400">
          <div className="flex items-center gap-1.5 bg-zinc-800/50 px-3 py-1.5 rounded-lg border border-zinc-800">
            <Clock size={16} />
            <span>{currentActivity.durationMinutes} min</span>
          </div>
          <div className="flex items-center gap-1.5 bg-zinc-800/50 px-3 py-1.5 rounded-lg border border-zinc-800">
            <Activity size={16} />
            <span>{currentActivity.metrics?.intensity || 'Normal'}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-zinc-800/50 px-3 py-1.5 rounded-lg border border-zinc-800">
            <Dumbbell size={16} />
            <span>{currentActivity.caloriesBurned} kcal</span>
          </div>
        </div>
      </div>

      <button className="w-full md:w-auto bg-orange-500 hover:bg-orange-400 text-white font-bold py-4 px-8 rounded-xl transition-colors flex items-center justify-center gap-2 group">
        <Play size={20} className="fill-current" />
        Resume Session
      </button>
    </div>
  );
}
