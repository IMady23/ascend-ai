import { create } from "zustand";
import { persist } from "zustand/middleware";

export type WorkspaceProfile = "Athlete Mode" | "Fat Loss" | "Recovery Week";

interface WorkspaceState {
  activeProfile: WorkspaceProfile;
  setProfile: (profile: WorkspaceProfile) => void;
  reset: () => void;
}

const initialState = {
  activeProfile: "Athlete Mode" as WorkspaceProfile,
};

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set) => ({
      ...initialState,
      setProfile: (profile) => set({ activeProfile: profile }),
      reset: () => set(initialState),
    }),
    {
      name: "ascend-workspace-storage",
    }
  )
);
