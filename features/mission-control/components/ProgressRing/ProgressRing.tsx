"use client";

import { useMissionStore } from "@/stores/mission.store";

export function ProgressRing() {
  const { missions } = useMissionStore();

  const totalMissions = missions.length || 1;
  const missionsCompleted = missions.filter((m) => m.completed).length;
  const percentageComplete = Math.round((missionsCompleted / totalMissions) * 100);

  const radius = 60;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset =
    circumference - (percentageComplete / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-card border border-border rounded-2xl shadow-sm">
      <div className="relative flex items-center justify-center">
        <svg
          height={radius * 2}
          width={radius * 2}
          className="transform -rotate-90"
        >
          {/* Background Ring */}
          <circle
            stroke="currentColor"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className="text-secondary"
          />
          {/* Progress Ring */}
          <circle
            stroke="currentColor"
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={circumference + " " + circumference}
            style={{ strokeDashoffset }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className="text-primary transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-3xl font-bold font-mono text-foreground">
            {percentageComplete}%
          </span>
          <span className="text-xs text-muted-foreground mt-1">
            {missionsCompleted} of {missions.length}
          </span>
        </div>
      </div>
      <h3 className="mt-4 font-semibold text-foreground text-lg">
        Today's Progress
      </h3>
    </div>
  );
}
