import { create } from "zustand";
import { RecoveryProfile } from "@/types/recovery";
import { RecoveryRepository } from "@/services/repositories/recovery.repository";
import { useUserStore } from "@/stores/user.store";

interface RecoveryState {
  currentProfile: RecoveryProfile | null;
  history: RecoveryProfile[];
  isLoading: boolean;

  fetchRecovery: () => Promise<void>;
}

export const useRecoveryStore = create<RecoveryState>((set) => ({
  currentProfile: null,
  history: [],
  isLoading: false,

  fetchRecovery: async () => {
    const userId = useUserStore.getState().userId;
    if (!userId) return;

    set({ isLoading: true });
    
    try {
      const [current, history] = await Promise.all([
        RecoveryRepository.getLatestRecoveryProfile(userId),
        RecoveryRepository.getRecoveryHistory(userId, 7)
      ]);

      set({
        currentProfile: current,
        history,
        isLoading: false
      });
    } catch (error) {
      console.error(error);
      set({ isLoading: false });
    }
  }
}));
