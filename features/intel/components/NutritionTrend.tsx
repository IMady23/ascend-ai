"use client";

import { useNutritionStore } from "@/stores/nutrition.store";
import { Leaf, Target } from "lucide-react";
import { MOCK_NUTRITION_TREND } from "../constants";

export function NutritionTrend() {
  const { dailyCalories, dailyProtein, dailyWaterMl } = useNutritionStore();

  const calories = dailyCalories || 0;
  const protein = dailyProtein || 0;
  const water = dailyWaterMl || 0;

  // Placeholder consistency score until full logic is implemented
  const consistencyScore = 100;

  const metrics = [
    { label: "Calories", value: calories, unit: "kcal", target: 2000 },
    { label: "Protein", value: protein, unit: "g", target: 150 },
    { label: "Water", value: water, unit: "ml", target: 2500 },
  ];

  return (
    <div className="bg-surface/50 border border-border-subtle rounded-xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <Leaf size={18} className="text-secondary" />
        <h2 className="text-lg font-semibold text-primary">Nutrition Trend</h2>
      </div>

      <div className="space-y-5">
        {metrics.map((metric, i) => {
          const progress = Math.min(100, Math.round((metric.value / metric.target) * 100));
          
          return (
            <div key={i} className="flex flex-col gap-2">
              <div className="flex justify-between items-end">
                <span className="text-xs font-semibold uppercase tracking-wider text-secondary">{metric.label}</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-bold text-primary font-mono">{metric.value}</span>
                  <span className="text-xs text-secondary font-medium">/ {metric.target} {metric.unit}</span>
                </div>
              </div>
              <div className="h-1.5 w-full bg-base rounded-full overflow-hidden flex">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-6 flex items-center justify-between bg-emerald-900/20 border border-emerald-900/30 p-3 rounded-lg">
         <div className="flex items-center gap-2 text-emerald-400">
           <Target size={14} />
           <span className="text-xs font-semibold uppercase tracking-wider">Macro Adherence</span>
         </div>
         <span className="text-lg font-bold text-emerald-400 font-mono">{consistencyScore}%</span>
      </div>
    </div>
  );
}
