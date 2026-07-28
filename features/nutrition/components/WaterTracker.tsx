"use client";

import { useNutritionStore } from "@/stores/nutrition.store";
import { MOCK_MACRO_GOALS } from "../constants";
import { Droplet, Plus } from "lucide-react";

export function WaterTracker() {
  const currentWater = useNutritionStore((state) => state.dailyWaterMl);
  const setWater = useNutritionStore((state) => state.setDailyWater);
  const target = MOCK_MACRO_GOALS.waterMl;

  const percentage = Math.min(100, Math.round((currentWater / target) * 100));

  const addWater = () => {
    // Optimistic UI update. In full implementation, this triggers sync layer.
    setWater(currentWater + 250);
  };

  return (
    <section className="bg-cyan-950/20 border border-cyan-900/50 rounded-2xl p-6 md:p-8 flex flex-col items-center text-center">
      <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mb-4 border border-cyan-500/30">
        <Droplet className="text-cyan-400" size={32} />
      </div>
      
      <h2 className="text-xl font-bold text-white mb-2">Hydration Status</h2>
      <p className="text-zinc-400 text-sm mb-6">
        <span className="text-white font-bold text-lg font-mono">{currentWater}</span> / {target} ml
      </p>

      {/* Progress Circle could go here, using a bar for simplicity */}
      <div className="w-full max-w-xs bg-zinc-900 rounded-full h-4 overflow-hidden border border-zinc-800 mb-8 relative">
        <div 
          className="bg-cyan-500 h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
          style={{ width: `${percentage}%` }}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
        </div>
      </div>

      <button 
        onClick={addWater}
        className="bg-cyan-500 hover:bg-cyan-400 text-cyan-950 font-bold py-3 px-8 rounded-xl transition-colors flex items-center justify-center gap-2 group w-full max-w-[200px]"
      >
        <Plus size={20} />
        Add 250ml
      </button>
    </section>
  );
}
