"use client";

import { useNutritionStore } from "@/stores/nutrition.store";
import { MOCK_MACRO_GOALS, MOCK_MEALS } from "../constants";
import { Flame, Beef, Wheat, Droplet } from "lucide-react";

export function DailySummary() {
  const meals = useNutritionStore((state) => state.meals);

  const targetCalories = 2200;

  const consumedCalories = meals.reduce((acc, m) => acc + (m.calories || 0), 0);
  const remainingCalories = Math.max(0, targetCalories - consumedCalories);
  const consumedProtein = meals.reduce((acc, m) => acc + (m.protein || 0), 0);
  const consumedCarbs = meals.reduce((acc, m) => acc + (m.carbs || 0), 0);
  const consumedFat = meals.reduce((acc, m) => acc + (m.fat || 0), 0);

  const stats = [
    { label: "Consumed", value: consumedCalories, unit: "kcal", icon: Flame, color: "text-orange-400", bg: "bg-orange-400/10" },
    { label: "Remaining", value: remainingCalories, unit: "kcal", icon: Flame, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { label: "Protein", value: consumedProtein, unit: "g", icon: Beef, color: "text-red-400", bg: "bg-red-400/10" },
    { label: "Carbs", value: consumedCarbs, unit: "g", icon: Wheat, color: "text-amber-400", bg: "bg-amber-400/10" },
    { label: "Fat", value: consumedFat, unit: "g", icon: Droplet, color: "text-yellow-400", bg: "bg-yellow-400/10" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col items-start gap-4 transition-transform hover:-translate-y-1 duration-300">
            <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color}`}>
              <Icon size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-white font-mono">
                {stat.value}
                <span className="text-sm text-zinc-500 font-sans ml-1">{stat.unit}</span>
              </p>
              <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mt-1">{stat.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
