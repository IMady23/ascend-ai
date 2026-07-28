"use client";

import { useUserStore } from "@/stores/user.store";
import { useNutritionStore } from "@/stores/nutrition.store";
import { useActivityStore } from "@/stores/activity.store";

export function HealthOverview() {
  const { profile } = useUserStore();
  const { dailyCalories, dailyProtein, dailyWaterMl } = useNutritionStore();
  const { dailySteps } = useActivityStore();
  const metrics = [
    { label: "Weight", value: profile?.weight || 0, unit: "kg" },
    { label: "Calories", value: dailyCalories, unit: "kcal" },
    { label: "Protein", value: dailyProtein, unit: "g" },
    { label: "Water", value: (dailyWaterMl / 1000).toFixed(1), unit: "L" },
    { label: "Steps", value: dailySteps, unit: "" },
  ];

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
      <h3 className="font-semibold text-foreground text-lg mb-4">
        Health Overview
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="flex flex-col space-y-1">
            <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
              {metric.label}
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold font-mono text-foreground">
                {metric.value}
              </span>
              {metric.unit && (
                <span className="text-sm font-medium text-muted-foreground">
                  {metric.unit}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
