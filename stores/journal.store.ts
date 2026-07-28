import { create } from "zustand";
import type { JournalEntry } from "@/types/journal";

interface JournalState {
  entries: JournalEntry[];
  currentDraft: Partial<JournalEntry> | null;
  currentMood: number | null;
  setEntries: (entries: JournalEntry[]) => void;
  setDraft: (draft: Partial<JournalEntry> | null) => void;
  setMood: (mood: number | null) => void;
}

export const useJournalStore = create<JournalState>((set) => ({
  entries: [],
  currentDraft: null,
  currentMood: null,
  setEntries: (entries) => set({ entries }),
  setDraft: (draft) => set({ currentDraft: draft }),
  setMood: (mood) => set({ currentMood: mood }),
}));
