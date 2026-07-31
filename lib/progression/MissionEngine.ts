import { Mission } from "@/types/progression";
import { useProgressionStore } from "@/stores/progression.store";
import { useUserStore } from "@/stores/user.store";
import { eventBus } from "@/lib/events/EventBus";
import { XP_REWARDS } from "@/config/progression";

export class MissionEngine {
  
  static evaluateEvent(eventType: string, metadata: any) {
    const { activeMissions, setActiveMissions } = useProgressionStore.getState();
    const userId = useUserStore.getState().userId;
    if (!userId) return;

    let updated = false;
    const newMissions = activeMissions.map(m => {
      if (m.status !== 'started' && m.status !== 'idle') return m; // Need to handle idle if it's auto-started? We'll assume active missions are 'started' or 'idle'.

      // Evaluation Logic for daily/weekly missions
      if (m.type === 'daily' || m.type === 'weekly') {
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
          updated = true;
          eventBus.dispatch({
            id: crypto.randomUUID(),
            userId,
            type: 'MISSION_COMPLETED',
            timestamp: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 } as any,
            metadata: { missionId: m.id, xpReward: m.xpReward || XP_REWARDS.MISSION_COMPLETED },
            processed: false
          });
        }
      }

      return m;
    });

    if (updated) {
      setActiveMissions(newMissions);
    }
  }

  static startMission(missionId: string) {
    const { activeMissions, setActiveMissions } = useProgressionStore.getState();
    const userId = useUserStore.getState().userId;
    if (!userId) return;

    const newMissions = activeMissions.map(m => {
      if (m.id === missionId && m.status === 'idle') {
        eventBus.dispatch({
          id: crypto.randomUUID(),
          userId,
          type: 'MISSION_STARTED',
          timestamp: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 } as any,
          metadata: { missionId, missionType: m.type },
          processed: false
        });
        return { ...m, status: 'started' };
      }
      return m;
    });
    setActiveMissions(newMissions as Mission[]);
  }

  static pauseMission(missionId: string, progress: number, distanceMeter?: number, durationSeconds?: number) {
    const { activeMissions, setActiveMissions } = useProgressionStore.getState();
    const userId = useUserStore.getState().userId;
    if (!userId) return;

    const newMissions = activeMissions.map(m => {
      if (m.id === missionId && (m.status === 'started' || m.status === 'resumed')) {
        eventBus.dispatch({
          id: crypto.randomUUID(),
          userId,
          type: 'MISSION_PAUSED',
          timestamp: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 } as any,
          metadata: { missionId, progress, distanceMeter, durationSeconds },
          processed: false
        });
        return { ...m, status: 'paused', progress, distanceMeter: (m.distanceMeter || 0) + (distanceMeter || 0), durationSeconds: (m.durationSeconds || 0) + (durationSeconds || 0) };
      }
      return m;
    });
    setActiveMissions(newMissions as Mission[]);
  }

  static resumeMission(missionId: string) {
    const { activeMissions, setActiveMissions } = useProgressionStore.getState();
    const userId = useUserStore.getState().userId;
    if (!userId) return;

    const newMissions = activeMissions.map(m => {
      if (m.id === missionId && m.status === 'paused') {
        eventBus.dispatch({
          id: crypto.randomUUID(),
          userId,
          type: 'MISSION_RESUMED',
          timestamp: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 } as any,
          metadata: { missionId },
          processed: false
        });
        return { ...m, status: 'resumed' };
      }
      return m;
    });
    setActiveMissions(newMissions as Mission[]);
  }

  static completeMission(missionId: string, progress: number, distanceMeter?: number, durationSeconds?: number, caloriesBurned?: number) {
    const { activeMissions, setActiveMissions } = useProgressionStore.getState();
    const userId = useUserStore.getState().userId;
    if (!userId) return;

    const newMissions = activeMissions.map(m => {
      if (m.id === missionId && ['started', 'paused', 'resumed'].includes(m.status)) {
        const finalDistance = (m.distanceMeter || 0) + (distanceMeter || 0);
        const finalDuration = (m.durationSeconds || 0) + (durationSeconds || 0);
        
        eventBus.dispatch({
          id: crypto.randomUUID(),
          userId,
          type: 'MISSION_COMPLETED',
          timestamp: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 } as any,
          metadata: { missionId, xpReward: m.xpReward || XP_REWARDS.MISSION_COMPLETED },
          processed: false
        });

        if (finalDistance > 0) {
          eventBus.dispatch({
            id: crypto.randomUUID(),
            userId,
            type: 'DISTANCE_LOGGED',
            timestamp: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 } as any,
            metadata: { source: m.type, distanceMeter: finalDistance, durationSeconds: finalDuration },
            processed: false
          });
        }

        return { ...m, status: 'completed', progress, distanceMeter: finalDistance, durationSeconds: finalDuration, caloriesBurned };
      }
      return m;
    });
    setActiveMissions(newMissions as Mission[]);
  }

  static archiveMission(missionId: string) {
    const { activeMissions, setActiveMissions } = useProgressionStore.getState();
    const newMissions = activeMissions.map(m => m.id === missionId ? { ...m, status: 'archived' } : m);
    setActiveMissions(newMissions as Mission[]);
  }
}
