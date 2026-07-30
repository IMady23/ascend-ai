import { create } from "zustand";
import type { Chapter } from "@/types/chapter";

interface ChapterState {
  chapters: Chapter[];
  currentChapter: Chapter | null;
  activeMilestones: string[];
  setChapters: (chapters: Chapter[]) => void;
  setCurrentChapter: (chapter: Chapter | null) => void;
  setActiveMilestones: (milestones: string[]) => void;
}

export const useChapterStore = create<ChapterState>((set) => ({
  chapters: [],
  currentChapter: null,
  activeMilestones: [],
  setChapters: (chapters) => set({ chapters }),
  setCurrentChapter: (chapter) => set({ currentChapter: chapter }),
  setActiveMilestones: (milestones) => set({ activeMilestones: milestones }),
}));
