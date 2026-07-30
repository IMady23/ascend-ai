import { create } from "zustand";

export interface Mission {
  id: string;
  title: string;
  completed: boolean;
}

interface MissionState {
  missions: Mission[];
  setMissions: (missions: Mission[]) => void;
}

export const useMissionStore = create<MissionState>((set) => ({
  missions: [],
  setMissions: (missions) => set({ missions }),
}));
