import { MissionRepository } from "@/services/repositories";
import { useMissionStore, Mission } from "@/stores/mission.store";

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

};
