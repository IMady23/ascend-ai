import { create } from "zustand";
import type { UserProfile, UserCustomGoals } from "@/types/user";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

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
  updateGoals: (newGoals: Partial<UserCustomGoals>) => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  userId: null,
  profile: null,
  isAuthenticated: false,
  isInitialized: false,
  isLoading: true,
  setUserId: (id) => set({ userId: id }),
  setProfile: (profile) => set({ profile }),
  setAuthStatus: (isAuthenticated, isInitialized, isLoading) => set({ isAuthenticated, isInitialized, isLoading }),
  clearUser: () => set({ userId: null, profile: null, isAuthenticated: false }),
  
  updateGoals: async (newGoals: Partial<UserCustomGoals>) => {
    const { userId, profile } = get();
    if (!userId || !profile) throw new Error("User not authenticated");

    // Deep clone the current profile for rollback
    const previousProfile = JSON.parse(JSON.stringify(profile)) as UserProfile;

    // Build the new nested preferences
    const updatedGoals = {
      ...profile.preferences?.goals,
      ...newGoals
    } as UserCustomGoals;

    // Perform optimistic UI update immediately
    set({
      profile: {
        ...profile,
        preferences: {
          ...profile.preferences,
          goals: updatedGoals
        } as any // bypass strict typing for now if preference lacks full fields
      }
    });

    try {
      // Sync to Firestore using merge: true to avoid overwriting other profile fields
      const userRef = doc(db, "users", userId);
      await setDoc(userRef, {
        profile: {
          preferences: {
            goals: updatedGoals
          }
        }
      }, { merge: true });
    } catch (error) {
      console.error("Failed to update goals in Firestore", error);
      // Rollback to previous state
      set({ profile: previousProfile });
      throw error; // Rethrow to let the UI trigger a toast notification
    }
  }
}));
