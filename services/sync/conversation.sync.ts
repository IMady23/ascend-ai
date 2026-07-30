import { ConversationRepository } from "@/services/repositories/conversation.repository";
import { useAiStore } from "@/stores/ai.store";
import { Conversation } from "@/types/conversation";

let unsubscribe: (() => void) | null = null;

export const ConversationSync = {
  subscribe(userId: string) {
    if (unsubscribe) {
      unsubscribe();
    }

    unsubscribe = ConversationRepository.subscribeToConversations(
      userId,
      (conversations: Conversation[]) => {
        useAiStore.getState().setConversations(conversations as any);
      },
      (error) => {
        console.error("Failed to sync conversations:", error);
      }
    );
  },

  dispose() {
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = null;
    }
  },
};
