"use client";

import { MOCK_WEEKLY_SUMMARY } from "../constants";

export function WeeklySummary() {
  const { workoutConsistency, nutritionConsistency, waterIntake, overallScore } = MOCK_WEEKLY_SUMMARY;

  const metrics = [
    { label: "Workout", value: workoutConsistency, color: "bg-orange-500" },
    { label: "Nutrition", value: nutritionConsistency, color: "bg-emerald-500" },
    { label: "Hydration", value: waterIntake, color: "bg-cyan-500" },
  ];

  return (
    <section className="bg-surface border border-border-subtle rounded-2xl p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold text-primary">Weekly Performance</h2>
        <div className="flex items-center gap-3">
          <span className="text-secondary text-xs font-bold uppercase tracking-wider">Score</span>
          <span className="text-2xl font-mono font-bold text-violet-400">{overallScore}</span>
        </div>
      </div>
      
      <div className="space-y-6">
        {metrics.map((m, i) => (
          <div key={i}>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-bold text-primary">{m.label}</span>
              <span className="text-secondary font-mono">{m.value}%</span>
            </div>
            <div className="w-full bg-base rounded-full h-2 overflow-hidden border border-border-subtle/50">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${m.color}`}
                style={{ width: `${m.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
