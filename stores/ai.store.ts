import { create } from "zustand";
import type { AiConversation } from "@/types/ai";

interface AiState {
  conversations: AiConversation[];
  currentConversation: AiConversation | null;
  isLoading: boolean;
  insightsCache: Record<string, string>;
  setConversations: (conversations: AiConversation[]) => void;
  setCurrentConversation: (conversation: AiConversation | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  cacheInsight: (key: string, insight: string) => void;
}

export const useAiStore = create<AiState>((set) => ({
  conversations: [],
  currentConversation: {
    id: "mock",
    title: "Morning check-in",
    startedAt: null as any,
    lastMessageAt: null as any,
    summary: "Great progress today. Complete your workout to finish today's mission.",
  } as any,
  isLoading: false,
  insightsCache: {},
  setConversations: (conversations) => set({ conversations }),
  setCurrentConversation: (conversation) =>
    set({ currentConversation: conversation }),
  setIsLoading: (isLoading) => set({ isLoading }),
  cacheInsight: (key, insight) =>
    set((state) => ({
      insightsCache: { ...state.insightsCache, [key]: insight },
    })),
}));
