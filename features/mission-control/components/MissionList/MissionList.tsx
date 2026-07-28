"use client";

import { CheckCircle2, Circle } from "lucide-react";
import { useMissionStore } from "@/stores/mission.store";

export function MissionList() {
  const { missions, toggleMission } = useMissionStore();
  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col h-full">
      <h3 className="font-semibold text-foreground text-lg mb-4">
        Today's Missions
      </h3>
      <div className="flex-1 space-y-3">
        {missions.map((mission) => (
          <div
            key={mission.id}
            className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
              mission.completed
                ? "bg-secondary/30 border-transparent"
                : "bg-background border-border"
            }`}
          >
            <button
              onClick={() => toggleMission(mission.id)}
              className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full"
              aria-label={
                mission.completed
                  ? `Mark ${mission.title} as incomplete`
                  : `Mark ${mission.title} as complete`
              }
            >
              {mission.completed ? (
                <CheckCircle2 className="text-primary" size={24} />
              ) : (
                <Circle className="text-muted-foreground" size={24} />
              )}
            </button>
            <span
              className={`flex-1 text-sm font-medium ${
                mission.completed
                  ? "line-through text-muted-foreground"
                  : "text-foreground"
              }`}
            >
              {mission.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
