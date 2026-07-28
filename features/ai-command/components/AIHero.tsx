"use client";

import { Cpu } from "lucide-react";
import { useUserStore } from "@/stores/user.store";

export function AIHero() {
  const profile = useUserStore((state) => state.profile);
  const name = "Operative"; // Fallback until profile has a name field

  return (
    <section className="bg-gradient-to-br from-violet-900/40 to-black border border-violet-900/50 rounded-2xl p-6 md:p-10 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
      
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-violet-400 font-medium mb-2">
            <Cpu size={16} />
            <span className="uppercase tracking-wider text-xs font-bold">AI Command Center</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Hello, {name}.
          </h1>
          <p className="text-zinc-400 max-w-xl text-sm md:text-base leading-relaxed">
            I am Ascend AI. Your central intelligence system. Ready to analyze, strategize, and execute.
          </p>
        </div>

        <div className="flex flex-col items-start md:items-end">
          <div className="flex items-center gap-2 bg-zinc-950/50 border border-zinc-800/50 px-4 py-2 rounded-xl backdrop-blur-sm">
            <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
            <span className="text-violet-400 font-mono text-xs font-bold uppercase tracking-wider">System Online</span>
          </div>
        </div>
      </div>
    </section>
  );
}
