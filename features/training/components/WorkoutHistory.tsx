"use client";

import { useActivityStore } from "@/stores/activity.store";
import { CheckCircle2, Dumbbell, Timer, Activity as ActivityIcon } from "lucide-react";

export function WorkoutHistory() {
  const activities = useActivityStore((state) => state.activities);
  const historyList = activities.slice(0, 5);

  return (
    <section className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
      <div className="p-6 md:p-8 border-b border-zinc-800">
        <h2 className="text-xl font-bold text-white">Recent Sessions</h2>
      </div>
      
      <div className="divide-y divide-zinc-800/50">
        {historyList.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <ActivityIcon size={48} className="text-zinc-700 mb-4" />
            <p className="text-zinc-400 font-medium">No workouts logged yet.</p>
            <p className="text-zinc-600 text-sm mt-2">Your completed sessions will appear here.</p>
          </div>
        ) : (
          historyList.map((item, i) => (
            <div key={item.id || i} className="p-6 hover:bg-zinc-800/20 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-center text-zinc-400">
                  <Dumbbell size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">{item.type}</h3>
                  <p className="text-zinc-500 text-sm">{formatDate(item.date)}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2 text-zinc-400">
                  <Timer size={16} />
                  <span className="font-mono">{item.durationMinutes}m</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-500">
                  <CheckCircle2 size={16} />
                  <span className="font-bold uppercase text-xs tracking-wider">Completed</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

// Helper to format timestamps
function formatDate(date: any) {
  if (!date) return "Yesterday";
  if (date.toDate) return date.toDate().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
  return new Date(date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
}
