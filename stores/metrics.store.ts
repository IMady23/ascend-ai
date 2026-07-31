import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useUserStore } from "./user.store";
import { ReliabilityManager } from "@/lib/reliability/ReliabilityManager";
import { RELIABILITY_PROFILES } from "@/lib/reliability/types";

export interface WeightEntry {
  id: string;
  weightKg: number;
  date: string;
  notes?: string;
  timestamp: any;
}

export interface BodyCompositionEntry {
  id: string;
  date: string;
  bodyFatPercentage?: number;
  muscleMassKg?: number;
  waistCm?: number;
  timestamp: any;
}

interface MetricsState {
  weightHistory: WeightEntry[];
  compositionHistory: BodyCompositionEntry[];
  
  // Setters
  setWeightHistory: (history: WeightEntry[]) => void;
  setCompositionHistory: (history: BodyCompositionEntry[]) => void;
  
  // Actions
  logWeight: (weightKg: number, notes?: string) => Promise<void>;
  logComposition: (comp: Omit<BodyCompositionEntry, "id" | "date" | "timestamp">) => Promise<void>;
}

export const useMetricsStore = create<MetricsState>()(
  persist(
    (set, get) => ({
      weightHistory: [],
      compositionHistory: [],
      
      setWeightHistory: (history) => set({ weightHistory: history }),
      setCompositionHistory: (history) => set({ compositionHistory: history }),
      
      logWeight: async (weightKg, notes) => {
        const userId = useUserStore.getState().userId;
        if (!userId) return;

        const dateStr = new Date().toISOString().split('T')[0];
        
        const newEntry: WeightEntry = {
          id: crypto.randomUUID(),
          weightKg,
          date: dateStr,
          notes,
          timestamp: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 }
        };

        set(state => {
          // If there is already an entry for today, replace it (or keep both if desired? We'll just prepend)
          // For a true historical log, we append. For daily unique, we filter out same date. Let's append to preserve history.
          return { weightHistory: [newEntry, ...state.weightHistory] };
        });

        // Also update the active profile so it reflects immediately in basic UI
        const profile = useUserStore.getState().profile;
        if (profile) {
          useUserStore.getState().setProfile({
            ...profile,
            identity: {
              ...(profile.identity || {}),
              weight: weightKg
            } as any
          });
        }

        // Future: Send to Firestore via ReliabilityManager
        // ReliabilityManager.execute(...)
      },
      
      logComposition: async (comp) => {
        const userId = useUserStore.getState().userId;
        if (!userId) return;
        
        const dateStr = new Date().toISOString().split('T')[0];
        
        const newEntry: BodyCompositionEntry = {
          ...comp,
          id: crypto.randomUUID(),
          date: dateStr,
          timestamp: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 }
        };
        
        set(state => ({
          compositionHistory: [newEntry, ...state.compositionHistory]
        }));
        
        // Future: Send to Firestore
      }
    }),
    {
      name: "ascend-metrics-storage",
      partialize: (state) => ({
        weightHistory: state.weightHistory,
        compositionHistory: state.compositionHistory
      })
    }
  )
);
