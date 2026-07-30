"use client";

import { useNutritionStore } from "@/stores/nutrition.store";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";

export function NutritionInsights() {
  const meals = useNutritionStore((state) => state.meals);

  return (
    <section>
      <h2 className="text-xl font-bold text-white mb-6 px-1">AI Insights</h2>
      <div className="space-y-4">
        {meals.length === 0 ? (
          <div className="p-5 rounded-2xl border bg-zinc-950/20 border-zinc-900/50 flex gap-4 text-zinc-500">
            <Info size={20} />
            <div>
              <h3 className="font-bold text-sm mb-1 text-zinc-400">Waiting for data</h3>
              <p className="text-sm">Log your meals today to receive AI-powered nutritional insights and optimization strategies.</p>
            </div>
          </div>
        ) : (
          <div className="p-5 rounded-2xl border bg-emerald-950/20 border-emerald-900/50 flex gap-4 text-emerald-500">
            <CheckCircle2 size={20} />
            <div>
              <h3 className="font-bold text-sm mb-1 text-emerald-400">On Track</h3>
              <p className="text-sm text-zinc-300 leading-relaxed">You are actively tracking your nutrition today. Keep going!</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
