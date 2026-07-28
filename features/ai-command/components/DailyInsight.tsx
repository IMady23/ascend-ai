"use client";

import { Lightbulb } from "lucide-react";

export function DailyInsight() {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5 transition-transform hover:-translate-y-1 duration-300">
      <div className="w-12 h-12 bg-violet-500/20 rounded-xl flex items-center justify-center shrink-0 border border-violet-500/30">
        <Lightbulb className="text-violet-400" size={24} />
      </div>
      <div>
        <h3 className="text-white font-bold text-lg mb-1">Daily Insight</h3>
        <p className="text-zinc-400 text-sm leading-relaxed">
          "You're doing well. Completing today's workout will put you ahead of your weekly goal. Keep this momentum."
        </p>
      </div>
    </div>
  );
}
