import { create } from "zustand";
import type { UserProfile } from "@/types/user";

interface UserState {
  userId: string | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  isLoading: boolean;
  setUserId: (id: string | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  setAuthStatus: (isAuthenticated: boolean, isInitialized: boolean, isLoading: boolean) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  userId: null,
  profile: null,
  isAuthenticated: false,
  isInitialized: false,
  isLoading: true,
  setUserId: (id) => set({ userId: id }),
  setProfile: (profile) => set({ profile }),
  setAuthStatus: (isAuthenticated, isInitialized, isLoading) => set({ isAuthenticated, isInitialized, isLoading }),
  clearUser: () => set({ userId: null, profile: null, isAuthenticated: false }),
}));
