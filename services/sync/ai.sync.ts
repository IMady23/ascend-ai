import { AiRepository } from "@/services/repositories";
import { useAiStore } from "@/stores/ai.store";
import { AiConversation } from "@/types/ai";

let unsubscribe: (() => void) | null = null;
let messagesUnsubscribe: (() => void) | null = null;

export const AiSync = {
  subscribe(userId: string) {},
  subscribeToMessages(userId: string, conversationId: string) {},
  dispose() {}
};
