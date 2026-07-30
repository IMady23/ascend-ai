import { create } from "zustand";
import { Conversation, Message } from "@/types/conversation";
import { useUserStore } from "@/stores/user.store";
import { ConversationRepository } from "@/services/repositories/conversation.repository";
import { aiService } from "@/services/ai/ai.service";
import { ContextBuilder } from "@/services/ai/context.builder";
import { formatCoachMessage } from "@/services/ai/format-coach-response";
import { buildFallbackCoachResponse } from "@/lib/ai/coach-state";

interface AiState {
  conversations: Conversation[];
  activeConversationId: string | null;
  isLoading: boolean;
  insightsCache: Record<string, string>;
  
  setConversations: (conversations: Conversation[]) => void;
  loadConversation: (id: string) => void;
  createNewConversation: (initialTitle?: string) => Promise<string>;
  sendMessage: (content: string, role?: "user" | "assistant" | "system", coachingMode?: string | null) => Promise<void>;
  setIsLoading: (isLoading: boolean) => void;
  cacheInsight: (key: string, insight: string) => void;
}

export const useAiStore = create<AiState>((set, get) => ({
  conversations: [],
  activeConversationId: null,
  isLoading: false,
  insightsCache: {},
  
  setConversations: (conversations) => {
    set({ conversations });
    // Auto-load most recent if none is active and there are conversations
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
    
    // We update local state first for immediate UI response
    set(state => ({
      conversations: [newConv, ...state.conversations],
      activeConversationId: newConv.id
    }));
    
    // Fire and forget repo call
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
    
    // Optimistic local update
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
    
    // Persist user message to firestore
    const updatedConv = get().conversations.find(c => c.id === convId);
    if (updatedConv) {
      await ConversationRepository.updateConversation(userId, convId, updatedConv);
    }
    
    // Generate Title if it's the first message
    const isFirstMessage = updatedConv?.messageCount === 1;
    if (isFirstMessage) {
      aiService.generateTitle(content).then(title => {
        set(state => {
          const conversations = state.conversations.map(c => 
            c.id === convId ? { ...c, title } : c
          );
          // Persist the title change
          ConversationRepository.updateConversation(userId, convId, { title }).catch(console.error);
          return { conversations };
        });
      });
    }

    // Call AI if the message is from user
    if (role === "user") {
      const contextSnapshot = ContextBuilder.build(coachingMode);
      
      // Pass chat history up to (but not including) this new message
      const currentMessages = updatedConv?.messages || [];
      const chatHistory = currentMessages.slice(0, -1);
      
      let response = null;
      try {
        response = await aiService.getCoachingResponse(contextSnapshot, content, chatHistory);
      } catch (error) {
        console.error("AI coaching request failed, using fallback response:", error);
      }

      const coachResponse = response || buildFallbackCoachResponse(contextSnapshot, content);
      const aiResponseContent = response ? formatCoachMessage(response) : coachResponse.summary;
      
      const aiMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: aiResponseContent,
        timestamp: new Date().toISOString(),
        toolExecutions: response ? [response] : [],
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
        return { conversations: updatedConversations };
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
