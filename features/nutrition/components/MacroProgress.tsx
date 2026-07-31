"use client";

import { useNutritionStore } from "@/stores/nutrition.store";
import { MOCK_MACRO_GOALS, MOCK_MEALS } from "../constants";

export function MacroProgress() {
  const meals = useNutritionStore((state) => state.meals);

  const consumedProtein = meals.reduce((acc, m) => acc + (m.protein || 0), 0);
  const consumedCarbs = meals.reduce((acc, m) => acc + (m.carbs || 0), 0);
  const consumedFat = meals.reduce((acc, m) => acc + (m.fat || 0), 0);

  const targetProtein = 150;
  const targetCarbs = 200;
  const targetFat = 70;

  const macros = [
    { label: "Protein", current: consumedProtein, target: targetProtein, color: "bg-red-500", text: "text-red-400" },
    { label: "Carbs", current: consumedCarbs, target: targetCarbs, color: "bg-amber-500", text: "text-amber-400" },
    { label: "Fat", current: consumedFat, target: targetFat, color: "bg-yellow-500", text: "text-yellow-400" },
  ];

  return (
    <section className="bg-surface border border-border-subtle rounded-2xl p-6 md:p-8">
      <h2 className="text-xl font-bold text-primary mb-6">Macronutrients</h2>
      
      <div className="space-y-6">
        {macros.map((macro, i) => {
          const percentage = Math.min(100, Math.round((macro.current / macro.target) * 100));
          
          return (
            <div key={i}>
              <div className="flex justify-between text-sm mb-2">
                <span className={`font-bold uppercase tracking-wider text-xs ${macro.text}`}>
                  {macro.label}
                </span>
                <span className="text-secondary font-mono">
                  <span className="text-primary">{macro.current}g</span> / {macro.target}g
                </span>
              </div>
              <div className="w-full bg-surface-elevated rounded-full h-3 overflow-hidden border border-border-subtle">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${macro.color}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
