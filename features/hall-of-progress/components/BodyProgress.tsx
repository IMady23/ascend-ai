"use client";

import { useUserStore } from "@/stores/user.store";
import { motion } from "framer-motion";
import { Scale, TrendingDown, TrendingUp } from "lucide-react";

export function BodyProgress() {
  const { profile, goals } = useUserStore();
  
  const currentWeight = profile?.weight || 91;
  const goalWeight = goals?.targetWeight || 80;
  const startWeight = 98; // Mock starting weight for historical context

  const netChange = currentWeight - startWeight;
  const isLoss = netChange <= 0;

  // Simple progress calculation
  const totalToLose = startWeight - goalWeight;
  const lostSoFar = startWeight - currentWeight;
  const progressPct = Math.max(0, Math.min(100, (lostSoFar / totalToLose) * 100));

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6"
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Scale size={18} className="text-purple-400" />
          <h2 className="text-lg font-semibold text-white">Body Progress</h2>
        </div>
        <div className={`flex items-center gap-1 px-3 py-1 rounded-full border ${isLoss ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
          {isLoss ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
          <span className="text-xs font-bold tracking-wider">
            {netChange > 0 ? "+" : ""}{netChange.toFixed(1)} kg
          </span>
        </div>
      </div>

      <div className="flex justify-between items-end mb-4">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Start</span>
          <span className="text-xl font-bold text-zinc-300 font-mono">{startWeight}<span className="text-sm text-zinc-600 ml-1">kg</span></span>
        </div>
        
        <div className="flex flex-col items-center">
          <span className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-1">Current</span>
          <span className="text-3xl font-black text-white font-mono">{currentWeight}<span className="text-sm text-zinc-500 ml-1">kg</span></span>
        </div>
        
        <div className="flex flex-col items-end">
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Goal</span>
          <span className="text-xl font-bold text-zinc-300 font-mono">{goalWeight}<span className="text-sm text-zinc-600 ml-1">kg</span></span>
        </div>
      </div>

      {/* Progress Bar Visual */}
      <div className="relative h-2 bg-zinc-950 rounded-full overflow-hidden mt-4">
        <div 
          className="absolute top-0 left-0 h-full bg-purple-500 rounded-full transition-all duration-1000"
          style={{ width: `${progressPct}%` }}
        />
      </div>
      
      {/* SVG Trend Line (Mocked visual representation of journey) */}
      <div className="mt-8 h-24 w-full relative opacity-50">
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible preserve-3d" preserveAspectRatio="none">
          <path
            d="M0,10 C20,15 40,30 50,45 C60,60 80,70 100,85"
            fill="none"
            stroke="currentColor"
            className="text-purple-500"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="100" cy="85" r="3" fill="currentColor" className="text-purple-400" />
        </svg>
      </div>
    </motion.div>
  );
}
