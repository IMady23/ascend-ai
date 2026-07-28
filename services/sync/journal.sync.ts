import { JournalRepository } from "@/services/repositories";
import { useJournalStore } from "@/stores/journal.store";
import { JournalEntry } from "@/types/journal";

let unsubscribe: (() => void) | null = null;

export const JournalSync = {
  subscribe(userId: string) {
    if (unsubscribe) {
      unsubscribe();
    }

    unsubscribe = JournalRepository.subscribeToJournalEntries(
      userId,
      (entries: JournalEntry[]) => {
        useJournalStore.getState().setEntries(entries);
      },
      (error) => {
        console.error("Failed to sync journal entries:", error);
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
