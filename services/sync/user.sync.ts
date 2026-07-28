import { UserRepository } from "@/services/repositories";
import { useUserStore } from "@/stores/user.store";
import { User } from "@/types/user";

let unsubscribe: (() => void) | null = null;

export const UserSync = {
  /**
   * Initializes real-time synchronization for the user profile.
   */
  subscribe(userId: string) {
    if (unsubscribe) {
      unsubscribe();
    }

    unsubscribe = UserRepository.subscribeToUser(
      userId,
      (user: User | null) => {
        if (user) {
          useUserStore.getState().setProfile(user.profile);
          useUserStore.getState().setGoals(user.goals);
        } else {
          useUserStore.getState().setProfile(null);
          useUserStore.getState().setGoals(null);
        }
      },
      (error) => {
        console.error("Failed to sync user data:", error);
      }
    );
  },

  /**
   * Cleans up the listener.
   */
  dispose() {
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = null;
    }
  },

  /**
   * Pushes a local state update to Firestore.
   */
  async updateGoals(userId: string, goals: Partial<User["goals"]>) {
    try {
      const currentGoals = useUserStore.getState().goals || {};
      const newGoals = { ...currentGoals, ...goals } as User["goals"];
      
      // Optimistic update
      useUserStore.getState().setGoals(newGoals);
      
      await UserRepository.updateUser(userId, { goals: newGoals });
    } catch (error) {
      console.error("Failed to update user goals:", error);
      // In a robust implementation, we would rollback the optimistic update here.
    }
  }
};
