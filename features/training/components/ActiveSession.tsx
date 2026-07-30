"use client";

import { useActivityStore } from "@/stores/activity.store";
import { Pause, Square, Activity as ActivityIcon } from "lucide-react";

export function ActiveSession() {
  const { currentActivity } = useActivityStore();
  
  const isSessionActive = currentActivity !== null;

  if (!isSessionActive) {
    return (
      <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center text-center min-h-[250px]">
        <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-4">
          <ActivityIcon className="text-zinc-500" size={32} />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">No Active Session</h3>
        <p className="text-zinc-500 text-sm max-w-sm">
          You are currently at rest. Select a workout from the categories above or start today's protocol to begin tracking.
        </p>
      </section>
    );
  }

  // Active state template
  return (
    <section className="bg-orange-950/20 border border-orange-900/50 rounded-2xl p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse" />
          <span className="text-orange-400 font-bold uppercase tracking-wider text-sm">Session In Progress</span>
        </div>
        <span className="text-3xl font-mono font-bold text-white">42:15</span>
      </div>

      <div className="space-y-2 mb-8">
        <div className="flex justify-between text-sm">
          <span className="text-zinc-400">Completion</span>
          <span className="text-white font-bold">75%</span>
        </div>
        <div className="w-full bg-zinc-900 rounded-full h-2 overflow-hidden">
          <div className="bg-orange-500 h-full rounded-full" style={{ width: "75%" }} />
        </div>
      </div>

      <div className="flex gap-4">
        <button className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors">
          <Pause size={20} />
          Pause
        </button>
        <button className="flex-1 bg-orange-500 hover:bg-orange-400 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors">
          <Square size={20} className="fill-current" />
          Finish
        </button>
      </div>
    </section>
  );
}
