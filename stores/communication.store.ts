import { create } from "zustand";
import { CommunicationItem } from "@/types/communication";
import { CommunicationRepository } from "@/services/repositories/communication.repository";
import { useUserStore } from "@/stores/user.store";
import { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";

interface CommunicationState {
  items: CommunicationItem[];
  unreadCount: number;
  lastDoc: QueryDocumentSnapshot<DocumentData> | null;
  isLoading: boolean;
  hasMore: boolean;

  fetchInitialItems: () => Promise<void>;
  fetchMoreItems: () => Promise<void>;
  addItemLocal: (item: CommunicationItem) => void;
  markAsRead: (itemId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

export const useCommunicationStore = create<CommunicationState>((set, get) => ({
  items: [],
  unreadCount: 0,
  lastDoc: null,
  isLoading: false,
  hasMore: true,

  fetchInitialItems: async () => {
    const userId = useUserStore.getState().userId;
    if (!userId) return;

    set({ isLoading: true });
    try {
      const { items, lastDoc } = await CommunicationRepository.getItems(userId, 50);
      const unreadCount = await CommunicationRepository.getUnreadCount(userId);
      
      set({ 
        items, 
        lastDoc, 
        unreadCount,
        hasMore: items.length === 50,
        isLoading: false 
      });
    } catch (e) {
      console.error(e);
      set({ isLoading: false });
    }
  },

  fetchMoreItems: async () => {
    const state = get();
    if (state.isLoading || !state.hasMore) return;

    const userId = useUserStore.getState().userId;
    if (!userId) return;

    set({ isLoading: true });
    try {
      const { items, lastDoc } = await CommunicationRepository.getItems(userId, 50, state.lastDoc || undefined);
      
      // Deduplicate before adding
      const newItems = items.filter(i => !state.items.find(existing => existing.id === i.id));
      
      set({ 
        items: [...state.items, ...newItems], 
        lastDoc, 
        hasMore: items.length === 50,
        isLoading: false 
      });
    } catch (e) {
      console.error(e);
      set({ isLoading: false });
    }
  },

  addItemLocal: (item: CommunicationItem) => {
    set((state) => ({
      items: [item, ...state.items],
      unreadCount: state.unreadCount + (item.isRead ? 0 : 1)
    }));
  },

  markAsRead: async (itemId: string) => {
    const userId = useUserStore.getState().userId;
    if (!userId) return;

    // Optimistic update
    set((state) => {
      let newlyRead = false;
      const newItems = state.items.map(i => {
        if (i.id === itemId && !i.isRead) {
          newlyRead = true;
          return { ...i, isRead: true };
        }
        return i;
      });

      return {
        items: newItems,
        unreadCount: newlyRead ? Math.max(0, state.unreadCount - 1) : state.unreadCount
      };
    });

    try {
      await CommunicationRepository.markAsRead(userId, itemId);
    } catch (e) {
      console.error("Failed to mark as read in remote", e);
    }
  },

  markAllAsRead: async () => {
    const userId = useUserStore.getState().userId;
    if (!userId) return;

    set((state) => ({
      items: state.items.map(i => ({ ...i, isRead: true })),
      unreadCount: 0
    }));

    try {
      await CommunicationRepository.markAllAsRead(userId);
    } catch (e) {
      console.error("Failed to mark all as read in remote", e);
    }
  }
}));
