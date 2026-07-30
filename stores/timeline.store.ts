import { create } from "zustand";
import { TimelineEvent } from "@/types/progression";
import { TimelineRepository } from "@/services/repositories/timeline.repository";
import { useUserStore } from "@/stores/user.store";
import { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";

interface TimelineState {
  events: TimelineEvent[];
  lastDoc: QueryDocumentSnapshot<DocumentData> | null;
  isLoading: boolean;
  hasMore: boolean;

  fetchInitialEvents: () => Promise<void>;
  fetchMoreEvents: () => Promise<void>;
  addEventLocal: (event: TimelineEvent) => void;
}

export const useTimelineStore = create<TimelineState>((set, get) => ({
  events: [],
  lastDoc: null,
  isLoading: false,
  hasMore: true,

  fetchInitialEvents: async () => {
    const userId = useUserStore.getState().userId;
    if (!userId) return;

    set({ isLoading: true });
    try {
      const { events, lastDoc } = await TimelineRepository.getEvents(userId, 100);
      set({ 
        events, 
        lastDoc, 
        hasMore: events.length === 100,
        isLoading: false 
      });
    } catch (e) {
      console.error(e);
      set({ isLoading: false });
    }
  },

  fetchMoreEvents: async () => {
    const state = get();
    if (state.isLoading || !state.hasMore) return;

    const userId = useUserStore.getState().userId;
    if (!userId) return;

    set({ isLoading: true });
    try {
      const { events, lastDoc } = await TimelineRepository.getEvents(userId, 100, state.lastDoc || undefined);
      set({ 
        events: [...state.events, ...events], 
        lastDoc, 
        hasMore: events.length === 100,
        isLoading: false 
      });
    } catch (e) {
      console.error(e);
      set({ isLoading: false });
    }
  },

  addEventLocal: (event: TimelineEvent) => {
    set((state) => ({
      events: [event, ...state.events]
    }));
  }
}));
