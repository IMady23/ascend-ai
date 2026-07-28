import { MissionRepository, Mission } from "@/services/repositories";
import { useMissionStore } from "@/stores/mission.store";

let unsubscribe: (() => void) | null = null;

export const MissionSync = {
  subscribe(userId: string) {
    if (unsubscribe) {
      unsubscribe();
    }

    unsubscribe = MissionRepository.subscribeToMissions(
      userId,
      (missions: Mission[]) => {
        useMissionStore.getState().setMissions(missions);
      },
      (error) => {
        console.error("Failed to sync missions:", error);
      }
    );
  },

  dispose() {
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = null;
    }
  },

  async toggleMission(userId: string, missionId: string) {
    try {
      // Optimistic update
      useMissionStore.getState().toggleMission(missionId);
      
      const mission = useMissionStore.getState().missions.find(m => m.id === missionId);
      if (mission) {
        await MissionRepository.updateMission(userId, missionId, { completed: mission.completed });
      }
    } catch (error) {
      console.error("Failed to toggle mission:", error);
      // Rollback optimistic update
      useMissionStore.getState().toggleMission(missionId);
    }
  }
};
