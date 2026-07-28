import { ActivityRepository } from "@/services/repositories";
import { useActivityStore } from "@/stores/activity.store";
import { Activity } from "@/types/activity";

let unsubscribe: (() => void) | null = null;

export const ActivitySync = {
  subscribe(userId: string) {
    if (unsubscribe) {
      unsubscribe();
    }

    unsubscribe = ActivityRepository.subscribeToActivities(
      userId,
      (activities: Activity[]) => {
        useActivityStore.getState().setActivities(activities);
        if (activities.length > 0) {
          useActivityStore.getState().setCurrentActivity(activities[0]);
        }
      },
      (error) => {
        console.error("Failed to sync activities:", error);
      }
    );
  },

  dispose() {
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = null;
    }
  },

  async addSteps(userId: string, steps: number) {
    // Optimistic update
    const currentSteps = useActivityStore.getState().dailySteps;
    useActivityStore.getState().setDailySteps(currentSteps + steps);
    
    // Logic to create/update activity in Firestore would go here
  }
};
