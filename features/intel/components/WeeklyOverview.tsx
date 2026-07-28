"use client";

import { useNutritionStore } from "@/stores/nutrition.store";
import { useActivityStore } from "@/stores/activity.store";
import { useUserStore } from "@/stores/user.store";
import { Activity, Flame, Beef, Droplets, Footprints, Scale } from "lucide-react";
import { MOCK_WEEKLY_OVERVIEW } from "../constants";

export function WeeklyOverview() {
  // Pull from stores if available, else fallback to mock for demonstration
  const { dailySteps } = useActivityStore();
  const { dailyCalories, dailyProtein, dailyWaterMl } = useNutritionStore();
  const { profile } = useUserStore();

  const data = {
    ...MOCK_WEEKLY_OVERVIEW,
    avgCalories: dailyCalories || MOCK_WEEKLY_OVERVIEW.avgCalories,
    avgProtein: dailyProtein || MOCK_WEEKLY_OVERVIEW.avgProtein,
    avgWater: dailyWaterMl || MOCK_WEEKLY_OVERVIEW.avgWater,
    avgSteps: dailySteps || MOCK_WEEKLY_OVERVIEW.avgSteps,
    weight: profile?.weight || 90,
  };

  const cards = [
    {
      label: "Workouts",
      value: `${data.workoutsCompleted}/${data.workoutsTarget}`,
      icon: Activity,
      color: "text-indigo-400",
    },
    {
      label: "Calories",
      value: `${data.avgCalories}`,
      unit: "kcal",
      icon: Flame,
      color: "text-rose-400",
    },
    {
      label: "Protein",
      value: `${data.avgProtein}`,
      unit: "g",
      icon: Beef,
      color: "text-amber-400",
    },
    {
      label: "Water",
      value: `${(data.avgWater / 1000).toFixed(1)}`,
      unit: "L",
      icon: Droplets,
      color: "text-cyan-400",
    },
    {
      label: "Steps",
      value: `${(data.avgSteps / 1000).toFixed(1)}k`,
      icon: Footprints,
      color: "text-emerald-400",
    },
    {
      label: "Weight",
      value: `${data.weight}`,
      unit: "kg",
      icon: Scale,
      color: "text-zinc-400",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-semibold text-white">Weekly Overview</h2>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {cards.map((card, i) => (
          <div key={i} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 flex flex-col justify-between min-h-[100px]">
            <div className="flex items-center gap-2 text-zinc-400 mb-2">
              <card.icon size={16} className={card.color} />
              <span className="text-xs font-semibold uppercase tracking-wider">{card.label}</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-white font-mono">{card.value}</span>
              {card.unit && <span className="text-sm text-zinc-500 font-medium">{card.unit}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
