import { create } from "zustand";
import type { UserProfile, UserGoals } from "@/types/user";

interface UserState {
  userId: string | null;
  profile: UserProfile | null;
  goals: UserGoals | null;
  setUserId: (id: string | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  setGoals: (goals: UserGoals | null) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  userId: "mock-user-id",
  profile: {
    age: 25,
    height: 180,
    weight: 91,
    gender: "male",
  },
  goals: {
    targetWeight: 80,
    weeklyWorkouts: 4,
  },
  setUserId: (id) => set({ userId: id }),
  setProfile: (profile) => set({ profile }),
  setGoals: (goals) => set({ goals }),
  clearUser: () => set({ userId: null, profile: null, goals: null }),
}));
