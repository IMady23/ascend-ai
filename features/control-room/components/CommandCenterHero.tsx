"use client";

import { useChapterStore } from "@/stores/chapter.store";
import { useUserStore } from "@/stores/user.store";
import { motion } from "framer-motion";
import { Server, Activity, ShieldCheck, Zap } from "lucide-react";

export function CommandCenterHero() {
  const { currentChapter } = useChapterStore();
  const { profile } = useUserStore();

  const streak = 18; // Mock

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-base/80 border border-purple-500/30 rounded-2xl p-6 md:p-10 relative overflow-hidden backdrop-blur-xl shadow-[0_0_50px_rgba(168,85,247,0.05)]"
    >
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/10 blur-[80px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />
      
      <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-8">
        <div>
          <div className="flex items-center gap-2 text-purple-400 font-bold mb-3 tracking-widest text-xs uppercase">
            <Server size={14} />
            <span>Control Room</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-primary mb-2 tracking-tighter">
            {"Commander"}
          </h1>
          <p className="text-secondary max-w-xl text-sm md:text-base font-medium">
            Operational Headquarters. All systems monitoring active.
          </p>

          <div className="flex gap-4 mt-8">
             <div className="flex flex-col">
               <span className="text-xs font-bold text-secondary uppercase tracking-widest mb-1">Current Chapter</span>
               <span className="text-lg font-bold text-primary">{currentChapter?.title || "Initiation"}</span>
             </div>
             <div className="w-px h-10 bg-surface-elevated" />
             <div className="flex flex-col">
               <span className="text-xs font-bold text-secondary uppercase tracking-widest mb-1">Phase</span>
               <span className="text-lg font-bold text-primary">Execution</span>
             </div>
             <div className="w-px h-10 bg-surface-elevated hidden sm:block" />
             <div className="flex flex-col hidden sm:flex">
               <span className="text-xs font-bold text-secondary uppercase tracking-widest mb-1">Streak</span>
               <span className="text-lg font-bold text-primary">{streak} Days</span>
             </div>
          </div>
        </div>

        {/* System Status Panel */}
        <div className="bg-surface/50 border border-border-subtle/50 rounded-xl p-5 backdrop-blur-md min-w-[240px]">
          <div className="flex items-center gap-2 mb-4">
             <div className="relative flex h-3 w-3">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
             </div>
             <span className="text-xs font-bold text-primary uppercase tracking-widest">System Status</span>
          </div>
          
          <div className="text-2xl font-black text-emerald-400 mb-2 uppercase tracking-tight">
            Operational
          </div>
          
          <div className="space-y-1.5 mt-4 text-[10px] font-mono text-secondary uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <ShieldCheck size={12} className="text-emerald-500/70" />
              <span>All modules online.</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap size={12} className="text-emerald-500/70" />
              <span>Mission protocol ready.</span>
            </div>
            <div className="flex items-center gap-2">
              <Activity size={12} className="text-emerald-500/70" />
              <span>Biometrics nominal.</span>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
