"use client";

import { CheckCircle2, Circle, Target } from "lucide-react";
import { useMissionStore } from "@/stores/mission.store";
import { useUserStore } from "@/stores/user.store";
import { MissionRepository } from "@/services/repositories/mission.repository";

export function MissionList() {
  const { missions } = useMissionStore();
  const { userId } = useUserStore();

  const handleToggle = async (missionId: string, completed: boolean) => {
    if (!userId) return;
    await MissionRepository.updateMission(userId, missionId, { completed: !completed });
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col h-full">
      <h3 className="font-semibold text-foreground text-lg mb-4">
        Today's Missions
      </h3>
      <div className="flex-1 space-y-3 flex flex-col">
        {missions.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border border-dashed border-border rounded-xl">
            <Target size={32} className="text-muted-foreground mb-3 opacity-50" />
            <p className="text-sm font-semibold text-primary">No missions yet.</p>
            <p className="text-xs text-muted-foreground mt-1">Create your first mission to begin.</p>
          </div>
        ) : (
          missions.map((mission) => (
          <div
            key={mission.id}
            className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
              mission.completed
                ? "bg-secondary/30 border-transparent"
                : "bg-background border-border"
            }`}
          >
            <button
              onClick={() => handleToggle(mission.id, mission.completed)}
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
        )))}
      </div>
    </div>
  );
}
