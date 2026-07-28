import { AiRepository } from "@/services/repositories";
import { useAiStore } from "@/stores/ai.store";
import { AiConversation } from "@/types/ai";

let unsubscribe: (() => void) | null = null;

export const AiSync = {
  subscribe(userId: string) {
    if (unsubscribe) {
      unsubscribe();
    }

    unsubscribe = AiRepository.subscribeToConversations(
      userId,
      (conversations: AiConversation[]) => {
        useAiStore.getState().setConversations(conversations);
        if (conversations.length > 0) {
          useAiStore.getState().setCurrentConversation(conversations[0]);
        }
      },
      (error) => {
        console.error("Failed to sync AI conversations:", error);
      }
    );
  },

  dispose() {
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = null;
    }
  }
};
