"use client";

import { QUICK_PROMPTS } from "../constants";
import * as Icons from "lucide-react";

export function QuickPrompts() {
  return (
    <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8">
      <h2 className="text-xl font-bold text-white mb-6">Quick Prompts</h2>
      <div className="flex flex-wrap gap-3">
        {QUICK_PROMPTS.map((prompt) => {
          const IconComponent = (Icons as any)[prompt.iconName] || Icons.Circle;
          return (
            <button 
              key={prompt.id}
              className="bg-zinc-950 border border-zinc-800 hover:border-violet-500/50 hover:bg-zinc-800/80 text-zinc-300 hover:text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 group"
            >
              <IconComponent size={14} className="text-violet-500/70 group-hover:text-violet-400 transition-colors" />
              {prompt.text}
            </button>
          );
        })}
      </div>
    </section>
  );
}
