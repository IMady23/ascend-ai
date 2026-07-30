import { Mission } from "@/types/progression";
import { useProgressionStore } from "@/stores/progression.store";
import { useUserStore } from "@/stores/user.store";
import { Timestamp } from "firebase/firestore";

export class MissionEngine {
  
  static evaluateEvent(eventType: string, metadata: any) {
    const { activeMissions, setActiveMissions } = useProgressionStore.getState();
    const userId = useUserStore.getState().userId;
    if (!userId) return;

    let updated = false;
    const newMissions = activeMissions.map(m => {
      if (m.status !== 'active') return m;

      // Evaluation Logic based on mission title/id (Simplified for demo)
      if (m.id.includes('protein') && eventType === 'MEAL_LOGGED' && metadata.isGoalMet) {
        m.progress += 1;
        updated = true;
      }
      
      if (m.id.includes('workout') && eventType === 'WORKOUT_COMPLETED') {
        m.progress += 1;
        updated = true;
      }

      if (m.progress >= m.target) {
        m.status = 'completed';
        // Need to award XP for mission completion!
        // This should actually dispatch an event to the EventBus
        import('../events/EventBus').then(({ eventBus }) => {
           eventBus.dispatch({
             id: crypto.randomUUID(),
             userId,
             type: 'MISSION_COMPLETED',
             timestamp: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 } as any,
             metadata: { missionId: m.id, xpReward: m.xpReward },
             processed: false
           });
        });
      }

      return m;
    });

    if (updated) {
      setActiveMissions(newMissions);
    }
  }

  // AI-generated missions (To be called daily by a chron or login check)
  static async generateMissions() {
    // Ideally this calls an LLM to look at user trends and generate a mission
    console.log("[MissionEngine] Generating dynamic missions based on user trends...");
  }
}
