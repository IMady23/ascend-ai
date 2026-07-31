"use client";

import { useNutritionStore } from "@/stores/nutrition.store";
import { MOCK_MACRO_GOALS, MOCK_MEALS } from "../constants";
import { Flame, Beef, Wheat, Droplet } from "lucide-react";

import { NutritionCoach } from "@/lib/ai/NutritionCoach";
import { useUserStore } from "@/stores/user.store";

export function DailySummary() {
  const nutrition = useNutritionStore();
  const profile = useUserStore((state) => state.profile);

  const progress = NutritionCoach.generateGoalProgress(
    nutrition.dailyCalories,
    nutrition.dailyProtein,
    nutrition.dailyWaterMl,
    nutrition.meals,
    profile
  );

  const stats = [
    { label: "Consumed", value: progress.calories.consumed, unit: "kcal", icon: Flame, color: "text-orange-400", bg: "bg-orange-400/10" },
    { label: "Remaining", value: progress.calories.remaining, unit: "kcal", icon: Flame, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { label: "Protein", value: progress.protein.consumed, unit: "g", icon: Beef, color: "text-red-400", bg: "bg-red-400/10" },
    { label: "Carbs", value: progress.carbs.consumed, unit: "g", icon: Wheat, color: "text-amber-400", bg: "bg-amber-400/10" },
    { label: "Fat", value: progress.fat.consumed, unit: "g", icon: Droplet, color: "text-yellow-400", bg: "bg-yellow-400/10" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div key={i} className="bg-surface border border-border-subtle rounded-2xl p-5 flex flex-col items-start gap-4 transition-transform hover:-translate-y-1 duration-300">
            <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color}`}>
              <Icon size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-primary font-mono">
                {stat.value}
                <span className="text-sm text-secondary font-sans ml-1">{stat.unit}</span>
              </p>
              <p className="text-secondary text-xs font-semibold uppercase tracking-wider mt-1">{stat.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
