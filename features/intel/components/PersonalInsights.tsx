"use client";

import { useActivityStore } from "@/stores/activity.store";
import { useNutritionStore } from "@/stores/nutrition.store";
import { Lightbulb, CheckCircle2, AlertCircle, Info } from "lucide-react";

export function PersonalInsights() {
  // Using store data to generate simple rule-based insights
  const { activities } = useActivityStore();
  const { dailyWaterMl, dailyProtein } = useNutritionStore();

  const insights = [];

  // Rule 1: Workout consistency
  if (activities.length >= 4) {
    insights.push({
      id: "i1",
      type: "positive",
      title: "Great Consistency",
      description: "You completed every planned workout this week.",
      icon: CheckCircle2,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20"
    });
  } else {
    insights.push({
      id: "i1",
      type: "info",
      title: "Workout Trend",
      description: "You have completed a few workouts this week. Keep the momentum going.",
      icon: Info,
      color: "text-indigo-400",
      bg: "bg-indigo-500/10",
      border: "border-indigo-500/20"
    });
  }

  // Rule 2: Hydration
  if (dailyWaterMl && dailyWaterMl < 2000) {
    insights.push({
      id: "i2",
      type: "warning",
      title: "Hydration Drop",
      description: "Water intake dropped yesterday. Ensure you rehydrate today.",
      icon: AlertCircle,
      color: "text-rose-400",
      bg: "bg-rose-500/10",
      border: "border-rose-500/20"
    });
  } else {
    insights.push({
      id: "i2",
      type: "positive",
      title: "Optimal Hydration",
      description: "You are consistently hitting your daily water targets.",
      icon: CheckCircle2,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20"
    });
  }

  // Rule 3: Protein
  if (dailyProtein && dailyProtein >= 140) {
    insights.push({
      id: "i3",
      type: "positive",
      title: "Protein Target Hit",
      description: "Protein intake has improved and is hitting your daily macro goal.",
      icon: CheckCircle2,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20"
    });
  } else {
    insights.push({
      id: "i3",
      type: "neutral",
      title: "Protein Adherence",
      description: "Protein is slightly below target. Consider a post-workout shake.",
      icon: Info,
      color: "text-secondary",
      bg: "bg-zinc-500/10",
      border: "border-zinc-500/20"
    });
  }

  return (
    <div className="bg-surface/50 border border-border-subtle rounded-xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <Lightbulb size={18} className="text-secondary" />
        <h2 className="text-lg font-semibold text-primary">Personal Insights</h2>
      </div>

      <div className="space-y-3">
        {insights.map((insight) => (
          <div 
            key={insight.id} 
            className={`flex gap-4 p-4 rounded-lg border ${insight.bg} ${insight.border}`}
          >
            <div className={`mt-0.5 ${insight.color}`}>
              <insight.icon size={18} />
            </div>
            <div>
              <h3 className={`text-sm font-semibold mb-1 ${insight.color}`}>{insight.title}</h3>
              <p className="text-sm text-secondary leading-relaxed">{insight.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
