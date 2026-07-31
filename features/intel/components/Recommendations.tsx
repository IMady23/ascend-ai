"use client";

import { useNutritionStore } from "@/stores/nutrition.store";
import { useActivityStore } from "@/stores/activity.store";
import { useMissionStore } from "@/stores/mission.store";
import { ArrowRight, Zap } from "lucide-react";
import type { Recommendation } from "../types";

export function Recommendations() {
  const { dailyWaterMl, dailyProtein } = useNutritionStore();
  const { activities } = useActivityStore();
  const { missions } = useMissionStore();

  const recommendations: Recommendation[] = [];

  // Generate actionable recommendations based on state
  if (dailyWaterMl && dailyWaterMl < 2500) {
    recommendations.push({
      id: "r1",
      title: "Hydrate",
      description: `Drink ${(2500 - dailyWaterMl)} ml more water today to hit your target.`,
      actionText: "Log Water",
    });
  }

  if (activities.length >= 5) {
    recommendations.push({
      id: "r2",
      title: "Active Recovery",
      description: "You've trained hard this week. Schedule a recovery workout tomorrow.",
      actionText: "View Schedule",
    });
  }

  if (dailyProtein && dailyProtein < 150) {
    recommendations.push({
      id: "r3",
      title: "Optimize Macros",
      description: "Increase protein at breakfast to hit your daily 150g target.",
      actionText: "Log Meal",
    });
  }

  const pendingMissions = missions.filter(m => !m.completed);
  if (pendingMissions.length > 0) {
    recommendations.push({
      id: "r4",
      title: "Mission Pending",
      description: "Complete today's remaining mission to keep your streak alive.",
      actionText: "View Missions",
    });
  }

  // Fallback if none trigger
  if (recommendations.length === 0) {
    recommendations.push({
      id: "r-default",
      title: "Stay the Course",
      description: "You are hitting all targets. Maintain your current streak.",
      actionText: "View Journey",
    });
  }

  return (
    <div className="bg-surface/50 border border-border-subtle rounded-xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <Zap size={18} className="text-amber-400" />
        <h2 className="text-lg font-semibold text-primary">Actionable Recommendations</h2>
      </div>

      <div className="space-y-4">
        {recommendations.slice(0, 3).map((rec) => (
          <div key={rec.id} className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-base/50 rounded-lg border border-border-subtle/50 hover:border-border-subtle transition-colors">
            <div>
              <h3 className="text-sm font-bold text-primary mb-1">{rec.title}</h3>
              <p className="text-sm text-secondary">{rec.description}</p>
            </div>
            <button className="flex items-center justify-center gap-2 px-4 py-2 bg-surface-elevated hover:bg-surface-elevated text-primary text-xs font-semibold uppercase tracking-wider rounded-md transition-colors whitespace-nowrap">
              {rec.actionText}
              <ArrowRight size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
