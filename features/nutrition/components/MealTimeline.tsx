"use client";

import { useNutritionStore } from "@/stores/nutrition.store";
import { MOCK_MEALS } from "../constants";
import { Clock } from "lucide-react";

export function MealTimeline() {
  const meals = useNutritionStore((state) => state.meals);

  return (
    <section className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
      <div className="p-6 md:p-8 border-b border-zinc-800">
        <h2 className="text-xl font-bold text-white">Daily Log</h2>
      </div>
      
      <div className="divide-y divide-zinc-800/50">
        {meals.map((meal) => (
          <MealCard key={meal.id} meal={meal} />
        ))}
        {meals.length === 0 && (
          <div className="p-8 text-center text-zinc-500">
            No meals logged today.
          </div>
        )}
      </div>
    </section>
  );
}

function MealCard({ meal }: { meal: any }) {
  // Rough format for mock or firestore timestamp
  let timeString = "Morning";
  if (meal.date && typeof meal.date.toMillis === "function") {
    timeString = new Date(meal.date.toMillis()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  return (
    <div className="p-6 hover:bg-zinc-800/20 transition-colors flex flex-col sm:flex-row justify-between gap-4">
      <div>
        <h3 className="font-bold text-white text-lg capitalize mb-1">{meal.mealType}</h3>
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <Clock size={14} />
          <span>{timeString}</span>
        </div>
      </div>
      
      <div className="flex gap-4 sm:gap-6 text-sm">
        <div className="flex flex-col items-center">
          <span className="text-zinc-500 text-xs font-bold uppercase mb-1">Cals</span>
          <span className="text-orange-400 font-bold font-mono">{meal.calories}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-zinc-500 text-xs font-bold uppercase mb-1">Pro</span>
          <span className="text-red-400 font-bold font-mono">{meal.protein}g</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-zinc-500 text-xs font-bold uppercase mb-1">Carb</span>
          <span className="text-amber-400 font-bold font-mono">{meal.carbs}g</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-zinc-500 text-xs font-bold uppercase mb-1">Fat</span>
          <span className="text-yellow-400 font-bold font-mono">{meal.fat}g</span>
        </div>
      </div>
    </div>
  );
}
