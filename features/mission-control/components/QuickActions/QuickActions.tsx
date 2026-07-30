"use client";

import { Scale, Footprints, Apple, Droplet, Book, Dumbbell } from "lucide-react";
import { useActivityStore } from "@/stores/activity.store";
import { useNutritionStore } from "@/stores/nutrition.store";

export function QuickActions() {
  const { setDailySteps, dailySteps } = useActivityStore();
  const { setDailyWater, dailyWaterMl } = useNutritionStore();
  const actions = [
    { id: "weight", title: "Log Weight", icon: Scale, color: "text-blue-500", bg: "bg-blue-500/10" },
    { id: "walk", title: "Start Walk", icon: Footprints, color: "text-green-500", bg: "bg-green-500/10" },
    { id: "meal", title: "Log Meal", icon: Apple, color: "text-red-500", bg: "bg-red-500/10" },
    { id: "water", title: "Water", icon: Droplet, color: "text-cyan-500", bg: "bg-cyan-500/10", action: () => {} },
    { id: "journal", title: "Journal", icon: Book, color: "text-purple-500", bg: "bg-purple-500/10", action: () => {} },
    { id: "workout", title: "Workout", icon: Dumbbell, color: "text-orange-500", bg: "bg-orange-500/10", action: () => {} },
  ];

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
      <h3 className="font-semibold text-foreground text-lg mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={action.action}
            className="flex flex-col items-center justify-center p-4 rounded-xl border border-border bg-background hover:bg-secondary/50 transition-colors gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <div className={`p-3 rounded-full ${action.bg}`}>
              <action.icon className={action.color} size={24} />
            </div>
            <span className="text-sm font-medium text-foreground">{action.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
