"use client";

import { motion } from "framer-motion";
import { Rocket, CheckCircle2 } from "lucide-react";

export function AboutAscend() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1.1 }}
      className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-6 flex flex-col md:flex-row gap-8 justify-between items-start md:items-center"
    >
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Rocket size={20} className="text-indigo-400" />
          <h2 className="text-xl font-black text-white tracking-tighter">ASCEND AI</h2>
        </div>
        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-4">
          Personal Transformation Protocol
        </p>
        
        <div className="flex items-center gap-4 text-xs font-bold text-zinc-400">
          <div className="flex items-center gap-1">
            <CheckCircle2 size={12} className="text-emerald-500" />
            <span>Firebase Ready</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle2 size={12} className="text-emerald-500" />
            <span>AI Ready</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-right">
        <div className="flex flex-col">
          <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Version</span>
          <span className="text-xs font-mono font-bold text-zinc-300">v0.1.0-alpha</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Build Status</span>
          <span className="text-xs font-mono font-bold text-emerald-400">Stable</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">ADL Version</span>
          <span className="text-xs font-mono font-bold text-zinc-300">v1.0.0</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Framework</span>
          <span className="text-xs font-mono font-bold text-zinc-300">Next.js 15+</span>
        </div>
      </div>
    </motion.div>
  );
}
