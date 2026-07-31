"use client";

import React from "react";
import { MotionCard } from "@/components/ui/motion/MotionCard";
import { Trophy, Timer, Flame, TrendingUp, Activity } from "lucide-react";
import { format } from "date-fns";
import { AnalyticsState } from "@/stores/analytics.store";

interface PRCardProps {
  personalRecords: AnalyticsState['personalRecords'];
}

export function PersonalRecordsCard({ personalRecords }: PRCardProps) {
  if (!personalRecords) return null;

  const records = [
    {
      label: "Heaviest Squat",
      value: personalRecords.squat.weight > 0 ? `${personalRecords.squat.weight} kg` : "-",
      date: personalRecords.squat.date,
      icon: <TrendingUp className="w-5 h-5 text-accent-workout" />,
    },
    {
      label: "Heaviest Bench",
      value: personalRecords.bench.weight > 0 ? `${personalRecords.bench.weight} kg` : "-",
      date: personalRecords.bench.date,
      icon: <TrendingUp className="w-5 h-5 text-accent-workout" />,
    },
    {
      label: "Heaviest Deadlift",
      value: personalRecords.deadlift.weight > 0 ? `${personalRecords.deadlift.weight} kg` : "-",
      date: personalRecords.deadlift.date,
      icon: <TrendingUp className="w-5 h-5 text-accent-workout" />,
    },
    {
      label: "Longest Run",
      value: personalRecords.longestRun.km > 0 ? `${personalRecords.longestRun.km} km` : "-",
      date: personalRecords.longestRun.date,
      icon: <Activity className="w-5 h-5 text-accent-blue" />,
    },
    {
      label: "Best Pace",
      value: personalRecords.fastestPace.minPerKm > 0 ? `${personalRecords.fastestPace.minPerKm.toFixed(2)} min/km` : "-",
      date: personalRecords.fastestPace.date,
      icon: <Timer className="w-5 h-5 text-accent-blue" />,
    },
    {
      label: "Most Calories",
      value: personalRecords.mostCalories.kcal > 0 ? `${personalRecords.mostCalories.kcal} kcal` : "-",
      date: personalRecords.mostCalories.date,
      icon: <Flame className="w-5 h-5 text-accent-orange" />,
    },
    {
      label: "Longest Streak",
      value: personalRecords.longestStreak.days > 0 ? `${personalRecords.longestStreak.days} days` : "-",
      date: personalRecords.longestStreak.date,
      icon: <Trophy className="w-5 h-5 text-accent-gold" />,
    },
  ];

  const activeRecords = records.filter(r => r.value !== "-");

  if (activeRecords.length === 0) {
    return (
      <MotionCard className="glass-panel overflow-hidden" interactive={false}>
        <div className="p-6 border-b border-border-subtle bg-bg-surface">
          <h3 className="text-xl font-semibold flex items-center gap-2 text-text-primary">
            <Trophy className="w-5 h-5 text-accent-gold" />
            Personal Records
          </h3>
        </div>
        <div className="p-8 flex flex-col items-center justify-center text-center">
          <Trophy className="w-12 h-12 text-text-secondary opacity-20 mb-4" />
          <p className="text-text-primary font-medium">No Records Yet</p>
          <p className="text-text-secondary text-sm mt-1">Keep training to unlock your first personal record.</p>
        </div>
      </MotionCard>
    );
  }

  return (
    <MotionCard className="glass-panel overflow-hidden" interactive={false}>
      <div className="p-6 border-b border-border-subtle bg-bg-surface">
        <h3 className="text-xl font-semibold flex items-center gap-2 text-text-primary">
          <Trophy className="w-5 h-5 text-accent-gold" />
          Personal Records
        </h3>
      </div>
      <div className="p-0">
        <ul className="divide-y divide-border-subtle">
          {activeRecords.map((record, idx) => (
            <li key={idx} className="flex items-center justify-between p-4 hover:bg-bg-surface-elevated transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-bg-surface rounded-lg">
                  {record.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">{record.label}</p>
                  <p className="text-xs text-text-secondary">
                    {record.date ? format(new Date(record.date), "MMM d, yyyy") : ""}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-text-primary">{record.value}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </MotionCard>
  );
}
