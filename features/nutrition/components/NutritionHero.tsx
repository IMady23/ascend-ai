"use client";

import { useNutritionStore } from "@/stores/nutrition.store";
import { MOCK_MACRO_GOALS } from "../constants";
import { Leaf, Droplets, Flame } from "lucide-react";

export function NutritionHero() {
  // Aggregate from store. Using dailyCalories logged if store supports it, or sum from meals.
  const meals = useNutritionStore((state) => state.meals);
  const currentWater = useNutritionStore((state) => state.dailyWaterMl);
  
  const consumedCalories = meals.reduce((acc, m) => acc + m.calories, 0) || 1100; // fallback mock if empty
  
  const calPercent = Math.min(100, Math.round((consumedCalories / MOCK_MACRO_GOALS.calories) * 100));
  const waterPercent = Math.min(100, Math.round((currentWater / MOCK_MACRO_GOALS.waterMl) * 100));
  const streak = 18; // Mock

  return (
    <section className="bg-gradient-to-br from-emerald-900/40 to-black border border-emerald-900/50 rounded-2xl p-6 md:p-10 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
      
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 font-medium mb-2">
            <Leaf size={16} />
            <span className="uppercase tracking-wider text-xs font-bold">Nutrition Lab</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Fuel the Machine.
          </h1>
          <p className="text-zinc-400 max-w-xl text-sm md:text-base leading-relaxed">
            Every meal is an opportunity to optimize performance. Stay precise.
          </p>
        </div>

        <div className="flex gap-4">
          {/* Calorie Progress */}
          <div className="flex flex-col items-start bg-zinc-950/50 border border-zinc-800/50 rounded-xl p-4 backdrop-blur-sm min-w-[120px]">
            <div className="flex items-center gap-2 text-zinc-400 mb-1">
              <Flame size={14} className="text-emerald-400" />
              <span className="text-xs font-bold uppercase tracking-wider">Calories</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-white font-mono">{calPercent}%</span>
            </div>
          </div>
          
          {/* Hydration Progress */}
          <div className="flex flex-col items-start bg-zinc-950/50 border border-zinc-800/50 rounded-xl p-4 backdrop-blur-sm min-w-[120px]">
            <div className="flex items-center gap-2 text-zinc-400 mb-1">
              <Droplets size={14} className="text-cyan-400" />
              <span className="text-xs font-bold uppercase tracking-wider">Hydration</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-white font-mono">{waterPercent}%</span>
            </div>
          </div>

          <div className="hidden sm:flex flex-col items-start bg-zinc-950/50 border border-zinc-800/50 rounded-xl p-4 backdrop-blur-sm min-w-[100px]">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">Streak</span>
            <span className="text-2xl font-black text-white font-mono">{streak}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
