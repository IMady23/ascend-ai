import { create } from "zustand";
import { Conversation, Message } from "@/types/conversation";
import { useUserStore } from "@/stores/user.store";
import { ConversationRepository } from "@/services/repositories/conversation.repository";
import { aiService } from "@/services/ai/ai.service";
import { ContextBuilder } from "@/services/ai/context.builder";
import { formatCoachMessage } from "@/services/ai/format-coach-response";

export type ConnectionState = "connecting" | "authenticating" | "loading_context" | "ready" | "offline_error";

interface AiState {
  conversations: Conversation[];
  activeConversationId: string | null;
  isLoading: boolean;
  insightsCache: Record<string, string>;
  connectionState: ConnectionState;
  connectionError: string | null;
  lastAiMeta: { provider: string; model: string; responseTime: number; contextSize?: number } | null;
  
  setConversations: (conversations: Conversation[]) => void;
  loadConversation: (id: string) => void;
  createNewConversation: (initialTitle?: string) => Promise<string>;
  sendMessage: (content: string, role?: "user" | "assistant" | "system", coachingMode?: string | null) => Promise<void>;
  setIsLoading: (isLoading: boolean) => void;
  cacheInsight: (key: string, insight: string) => void;
  initializeConnection: () => Promise<void>;
}

export const useAiStore = create<AiState>((set, get) => ({
  conversations: [],
  activeConversationId: null,
  isLoading: false,
  insightsCache: {},
  connectionState: "connecting",
  connectionError: null,
  lastAiMeta: null,
  
  initializeConnection: async () => {
    try {
      set({ connectionState: "connecting", connectionError: null });
      
      // Simulate connection lifecycle checks for AI Coach resilience
      if (!navigator.onLine) {
        set({ connectionState: "offline_error", connectionError: "You are currently offline. Please check your network connection." });
        return;
      }

      set({ connectionState: "authenticating" });
      const userId = useUserStore.getState().userId;
      if (!userId) {
        set({ connectionState: "offline_error", connectionError: "Authentication failed. Please log in again." });
        return;
      }
      
      set({ connectionState: "loading_context" });
      // Verify context builder can run
      ContextBuilder.build();

      set({ connectionState: "ready" });
    } catch (err: any) {
      set({ connectionState: "offline_error", connectionError: err.message || "Failed to initialize AI Coach." });
    }
  },

  setConversations: (conversations) => {
    set({ conversations });
    const state = get();
    if (!state.activeConversationId && conversations.length > 0) {
      set({ activeConversationId: conversations[0].id });
    }
  },
  
  loadConversation: (id) => set({ activeConversationId: id }),
  
  createNewConversation: async (initialTitle = "New Conversation") => {
    const userId = useUserStore.getState().userId;
    if (!userId) return "";
    
    const newConv: Conversation = {
      id: crypto.randomUUID(),
      userId,
      title: initialTitle,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messageCount: 0,
      archived: false,
      pinned: false,
      modelVersion: "v1",
      contextSnapshotVersion: "v1",
      messages: []
    };
    
    set(state => ({
      conversations: [newConv, ...state.conversations],
      activeConversationId: newConv.id
    }));
    
    ConversationRepository.createConversation(userId, newConv).catch(console.error);
    
    return newConv.id;
  },
  
  sendMessage: async (content, role = "user", coachingMode = null) => {
    const state = get();
    const userId = useUserStore.getState().userId;
    if (!userId) return;
    
    let convId = state.activeConversationId;
    if (!convId) {
      convId = await state.createNewConversation();
    }
    
    const newMessage: Message = {
      id: crypto.randomUUID(),
      role,
      content,
      timestamp: new Date().toISOString()
    };
    
    set(state => {
      const updatedConversations = state.conversations.map(c => {
        if (c.id === convId) {
          return {
            ...c,
            updatedAt: new Date().toISOString(),
            lastMessage: content,
            messageCount: c.messageCount + 1,
            messages: [...c.messages, newMessage]
          };
        }
        return c;
      });
      return { conversations: updatedConversations };
    });
    
    const updatedConv = get().conversations.find(c => c.id === convId);
    if (updatedConv) {
      await ConversationRepository.updateConversation(userId, convId, updatedConv);
    }
    
    const isFirstMessage = updatedConv?.messageCount === 1;
    if (isFirstMessage) {
      aiService.generateTitle(content).then(title => {
        set(state => {
          const conversations = state.conversations.map(c => 
            c.id === convId ? { ...c, title } : c
          );
          ConversationRepository.updateConversation(userId, convId, { title }).catch(console.error);
          return { conversations };
        });
      });
    }

    if (role === "user") {
      if (!navigator.onLine) {
         const offlineMsg: Message = {
           id: crypto.randomUUID(),
           role: "assistant",
           content: "You are offline. Your message was saved locally and will be preserved. Please restore your connection to receive a response.",
           timestamp: new Date().toISOString()
         };
         set(state => {
           const updated = state.conversations.map(c => {
             if (c.id === convId) {
               return { ...c, messages: [...c.messages, offlineMsg] };
             }
             return c;
           });
           return { conversations: updated };
         });
         return;
      }

      const contextSnapshot = ContextBuilder.build(coachingMode);
      const currentMessages = updatedConv?.messages || [];
      const chatHistory = currentMessages.slice(0, -1);
      
      let apiResult = null;
      try {
        apiResult = await aiService.getCoachingResponse(contextSnapshot, content, chatHistory);
      } catch (error) {
        console.error("AI coaching request failed:", error);
      }

      if (!apiResult || !apiResult.response) {
         // Network or AI Failure
         const failMsg: Message = {
           id: crypto.randomUUID(),
           role: "assistant",
           content: "The AI service is temporarily unavailable due to a network or server issue. Your message history has been preserved. Please try again in a few moments.",
           timestamp: new Date().toISOString()
         };
         set(state => {
           const updated = state.conversations.map(c => {
             if (c.id === convId) {
               return { ...c, messages: [...c.messages, failMsg] };
             }
             return c;
           });
           return { conversations: updated };
         });
         return;
      }

      const aiResponseContent = formatCoachMessage(apiResult.response);
      
      const aiMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: aiResponseContent,
        timestamp: new Date().toISOString(),
        toolExecutions: [apiResult.response],
      };
      
      set(state => {
        const updatedConversations = state.conversations.map(c => {
          if (c.id === convId) {
            return {
              ...c,
              updatedAt: new Date().toISOString(),
              lastMessage: aiResponseContent,
              messageCount: c.messageCount + 1,
              messages: [...c.messages, aiMessage]
            };
          }
          return c;
        });
        return { conversations: updatedConversations, lastAiMeta: apiResult.meta };
      });
      
      const finalConv = get().conversations.find(c => c.id === convId);
      if (finalConv) {
        await ConversationRepository.updateConversation(userId, convId, finalConv);
      }
    }
  },
  
  setIsLoading: (isLoading) => set({ isLoading }),
  
  cacheInsight: (key, insight) =>
    set((state) => ({
      insightsCache: { ...state.insightsCache, [key]: insight },
    })),
}));
