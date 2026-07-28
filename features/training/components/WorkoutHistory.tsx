"use client";

import { useActivityStore } from "@/stores/activity.store";
import { CheckCircle2, Dumbbell, Timer } from "lucide-react";

export function WorkoutHistory() {
  const activities = useActivityStore((state) => state.activities);
  
  // Use real data if available, fallback to mock UI list
  const historyList = activities && activities.length > 0 ? activities.slice(0, 5) : MOCK_HISTORY;

  return (
    <section className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
      <div className="p-6 md:p-8 border-b border-zinc-800">
        <h2 className="text-xl font-bold text-white">Recent Sessions</h2>
      </div>
      
      <div className="divide-y divide-zinc-800/50">
        {historyList.map((item, i) => (
          <div key={i} className="p-6 hover:bg-zinc-800/20 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-center text-zinc-400">
                <Dumbbell size={20} />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">{item.type || (item as any).title}</h3>
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
        ))}
      </div>
    </section>
  );
}

// Helper to format timestamps if they exist, otherwise just return a mock string
function formatDate(date: any) {
  if (!date) return "Yesterday";
  if (date.toDate) return date.toDate().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
  return "Yesterday";
}

const MOCK_HISTORY = [
  { title: "Upper Body Strength", date: null, durationMinutes: 45, type: "Strength" },
  { title: "Zone 2 Cardio", date: null, durationMinutes: 60, type: "Cardio" },
  { title: "Recovery Walk", date: null, durationMinutes: 30, type: "Walking" },
];
