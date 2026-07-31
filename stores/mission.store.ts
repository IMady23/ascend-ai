import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useUserStore } from "./user.store";
import { eventBus } from "@/lib/events/EventBus";

export interface ExerciseDef {
  id: string;
  name: string;
  targetMuscles: string[];
  equipment: string;
  tips: string[];
  targetSets: number;
  targetReps: string;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  calories: number;
  xp: number;
  difficulty: "Easy" | "Medium" | "Hard" | "Extreme";
  type: string; // e.g. "Upper Body Power", "Fat Loss Cardio"
  exercises: ExerciseDef[];
  completed: boolean;
  scheduledDate: string;
}

interface MissionState {
  missions: Mission[];
  activeMissionId: string | null;
  
  setMissions: (missions: Mission[]) => void;
  setActiveMission: (id: string) => void;
  completeMission: (id: string) => void;
  
  getActiveMission: () => Mission | undefined;
}

export const useMissionStore = create<MissionState>()(
  persist(
    (set, get) => ({
      missions: [],
      activeMissionId: null,
      
      setMissions: (missions) => set({ missions }),
      
      setActiveMission: (id) => {
        set({ activeMissionId: id });
        const mission = get().missions.find(m => m.id === id);
        if (mission) {
          const userId = useUserStore.getState().userId;
          if (userId) {
            eventBus.dispatch({
              id: crypto.randomUUID(),
              userId,
              type: 'MISSION_ACTIVATED' as any,
              timestamp: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 } as any,
              metadata: { missionId: id, title: mission.title },
              processed: false
            });
          }
        }
      },
      
      completeMission: (id) => {
        set(state => ({
          missions: state.missions.map(m => m.id === id ? { ...m, completed: true } : m),
          activeMissionId: state.activeMissionId === id ? null : state.activeMissionId
        }));
      },
      
      getActiveMission: () => {
        const state = get();
        return state.missions.find(m => m.id === state.activeMissionId);
      }
    }),
    {
      name: "ascend-mission-storage",
      partialize: (state) => ({
        missions: state.missions,
        activeMissionId: state.activeMissionId
      })
    }
  )
);
