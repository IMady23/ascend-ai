import { create } from "zustand";

export interface Mission {
  id: string;
  title: string;
  completed: boolean;
}

interface MissionState {
  missions: Mission[];
  setMissions: (missions: Mission[]) => void;
  toggleMission: (id: string) => void;
}

export const useMissionStore = create<MissionState>((set) => ({
  missions: [
    { id: "1", title: "Morning Walk", completed: true },
    { id: "2", title: "Drink 3L Water", completed: true },
    { id: "3", title: "Complete Workout", completed: false },
    { id: "4", title: "Eat Healthy Meals", completed: true },
    { id: "5", title: "Journal", completed: true },
    { id: "6", title: "Sleep Before 10 PM", completed: false },
  ],
  setMissions: (missions) => set({ missions }),
  toggleMission: (id) =>
    set((state) => ({
      missions: state.missions.map((m) =>
        m.id === id ? { ...m, completed: !m.completed } : m
      ),
    })),
}));
