import { ChapterRepository } from "@/services/repositories";
import { useChapterStore } from "@/stores/chapter.store";
import { Chapter } from "@/types/chapter";

let unsubscribe: (() => void) | null = null;

export const ChapterSync = {
  subscribe(userId: string) {
    if (unsubscribe) {
      unsubscribe();
    }

    unsubscribe = ChapterRepository.subscribeToChapters(
      userId,
      (chapters: Chapter[]) => {
        useChapterStore.getState().setChapters(chapters);
        const activeChapter = chapters.find(c => c.status === "in-progress");
        if (activeChapter) {
          useChapterStore.getState().setCurrentChapter(activeChapter);
        }
      },
      (error) => {
        console.error("Failed to sync chapters:", error);
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
