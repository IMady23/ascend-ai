import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ProgressionProfile, Mission, Achievement } from "@/types/progression";
import { ProgressionRepository } from "@/services/repositories/progression.repository";
import { useUserStore } from "@/stores/user.store";
import { ReliabilityManager } from "@/lib/reliability/ReliabilityManager";
import { RELIABILITY_PROFILES } from "@/lib/reliability/types";

interface ProgressionState {
  profile: ProgressionProfile | null;
  activeMissions: Mission[];
  
  setProfile: (profile: ProgressionProfile | null) => void;
  setActiveMissions: (missions: Mission[]) => void;
  
  addXP: (amount: number) => Promise<void>;
  updateStreak: (date: string) => Promise<void>;
  unlockAchievement: (achievement: Achievement) => Promise<void>;
  updateLifetimeStats: (updates: { workouts?: number; distanceMeters?: number; caloriesBurned?: number; durationSeconds?: number }) => Promise<void>;
}

export const useProgressionStore = create<ProgressionState>()(
  persist(
    (set, get) => ({
      profile: null,
      activeMissions: [],

      setProfile: (profile) => set({ profile }),
      setActiveMissions: (missions) => {
        set({ activeMissions: missions });
        const userId = useUserStore.getState().userId;
        if (userId) {
          ReliabilityManager.execute(
            'Firestore',
            'saveMissions',
            RELIABILITY_PROFILES.DATABASE_WRITE,
            `missions-${userId}`,
            () => ProgressionRepository.saveMissions(userId, missions),
            'retry'
          ).catch(console.error);
        }
      },

      addXP: async (amount) => {
        const userId = useUserStore.getState().userId;
        if (!userId) return;

        set((state) => {
          if (!state.profile) return state;
          
          let newTotal = state.profile.xp.total + amount;
          let currentLevel = state.profile.xp.currentLevel;
          let xpForCurrentLevel = state.profile.xp.xpForCurrentLevel + amount;
          let xpToNextLevel = Math.floor(100 * Math.pow(currentLevel, 1.5));
          
          while (xpForCurrentLevel >= xpToNextLevel) {
            xpForCurrentLevel -= xpToNextLevel;
            currentLevel++;
            xpToNextLevel = Math.floor(100 * Math.pow(currentLevel, 1.5));
          }

          const updatedProfile = {
            ...state.profile,
            xp: {
              total: newTotal,
              currentLevel,
              xpToNextLevel,
              xpForCurrentLevel
            }
          };

          // Optimistic local update
          return { profile: updatedProfile };
        });

        const updated = get().profile;
        if (updated) {
          ReliabilityManager.execute(
            'Firestore',
            'updateProgressionProfile',
            RELIABILITY_PROFILES.DATABASE_WRITE,
            `progression-${userId}`,
            () => ProgressionRepository.setProfile(userId, updated),
            'retry'
          ).catch(console.error);
        }
      },

      updateStreak: async (date) => {
        const userId = useUserStore.getState().userId;
        if (!userId) return;

        set((state) => {
          if (!state.profile) return state;
          
          const lastDate = state.profile.streak.lastActiveDate;
          let newStreak = state.profile.streak.current;
          
          // Basic logic: if lastDate was yesterday, increment. If today, do nothing. If older, reset to 1.
          const today = new Date(date);
          today.setHours(0,0,0,0);
          
          if (lastDate) {
            const last = new Date(lastDate);
            last.setHours(0,0,0,0);
            
            const diffTime = Math.abs(today.getTime() - last.getTime());
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); 
            
            if (diffDays === 1) {
              newStreak++;
            } else if (diffDays > 1) {
              newStreak = 1;
            }
          } else {
            newStreak = 1;
          }

          const longest = Math.max(newStreak, state.profile.streak.longest);

          const updatedProfile = {
            ...state.profile,
            streak: {
              current: newStreak,
              longest,
              lastActiveDate: date
            }
          };

          return { profile: updatedProfile };
        });

        const updated = get().profile;
        if (updated) {
          ReliabilityManager.execute(
            'Firestore',
            'updateProgressionProfile',
            RELIABILITY_PROFILES.DATABASE_WRITE,
            `progression-${userId}`,
            () => ProgressionRepository.setProfile(userId, updated),
            'retry'
          ).catch(console.error);
        }
      },
      
      unlockAchievement: async (achievement) => {
        const userId = useUserStore.getState().userId;
        if (!userId) return;

        set((state) => {
          if (!state.profile) return state;
          
          const exists = state.profile.achievements.find(a => a.id === achievement.id);
          if (exists) return state;

          const updatedProfile = {
            ...state.profile,
            achievements: [...state.profile.achievements, achievement]
          };

          return { profile: updatedProfile };
        });

        const updated = get().profile;
        if (updated) {
          ReliabilityManager.execute(
            'Firestore',
            'updateProgressionProfile',
            RELIABILITY_PROFILES.DATABASE_WRITE,
            `progression-${userId}`,
            () => ProgressionRepository.setProfile(userId, updated),
            'retry'
          ).catch(console.error);
        }
      },

      updateLifetimeStats: async (updates) => {
        const userId = useUserStore.getState().userId;
        if (!userId) return;

        set((state) => {
          if (!state.profile) return state;
          
          const stats = state.profile.lifetimeStats || {
            totalWorkouts: 0,
            totalDistanceMeters: 0,
            totalCaloriesBurned: 0,
            totalDurationSeconds: 0
          };

          const updatedProfile = {
            ...state.profile,
            lifetimeStats: {
              ...stats,
              totalWorkouts: stats.totalWorkouts + (updates.workouts || 0),
              totalDistanceMeters: stats.totalDistanceMeters + (updates.distanceMeters || 0),
              totalCaloriesBurned: stats.totalCaloriesBurned + (updates.caloriesBurned || 0),
              totalDurationSeconds: stats.totalDurationSeconds + (updates.durationSeconds || 0),
            }
          };

          return { profile: updatedProfile };
        });

        const updated = get().profile;
        if (updated) {
          ReliabilityManager.execute(
            'Firestore',
            'updateProgressionProfile',
            RELIABILITY_PROFILES.DATABASE_WRITE,
            `progression-${userId}`,
            () => ProgressionRepository.setProfile(userId, updated),
            'retry'
          ).catch(console.error);
        }
      }
    }),
    {
      name: "ascend-progression-storage"
    }
  )
);
