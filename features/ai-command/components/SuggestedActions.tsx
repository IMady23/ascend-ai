"use client";

import { CheckSquare, Utensils, Calendar, Target } from "lucide-react";

export function SuggestedActions() {
  const actions = [
    { label: "Review Progress", icon: CheckSquare, desc: "Analyze today's output" },
    { label: "Nutrition Check", icon: Utensils, desc: "Evaluate macro balance" },
    { label: "Plan Tomorrow", icon: Calendar, desc: "Set up the next 24h" },
    { label: "Weekly Debrief", icon: Target, desc: "Summarize performance" },
  ];

  return (
    <section>
      <h2 className="text-xl font-bold text-white mb-6 px-1">Suggested Actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action, i) => {
          const Icon = action.icon;
          return (
            <button key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col items-start gap-4 transition-transform hover:-translate-y-1 hover:border-violet-500/50 hover:bg-zinc-800/80 duration-300 group text-left">
              <div className="p-2.5 rounded-xl bg-violet-500/10 text-violet-400 group-hover:bg-violet-500/20 transition-colors">
                <Icon size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-white group-hover:text-violet-400 transition-colors">{action.label}</p>
                <p className="text-zinc-500 text-xs mt-1 leading-tight">{action.desc}</p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
