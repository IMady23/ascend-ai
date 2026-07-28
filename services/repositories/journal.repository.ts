import { collection, doc, getDocs, setDoc, updateDoc, deleteDoc, query, orderBy, onSnapshot } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { JournalEntry, journalEntryConverter } from "@/types/journal";
import { handleFirestoreError } from "./error-handler";

export const JournalRepository = {
  getCollectionRef(userId: string) {
    return collection(firestore, `users/${userId}/journal_entries`).withConverter(journalEntryConverter);
  },

  async getJournalEntries(userId: string): Promise<JournalEntry[]> {
    try {
      const q = query(this.getCollectionRef(userId), orderBy("date", "desc"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => doc.data());
    } catch (error) {
      handleFirestoreError(error, `fetching journal entries for user ${userId}`);
    }
  },

  subscribeToJournalEntries(userId: string, onUpdate: (entries: JournalEntry[]) => void, onError: (error: Error) => void): () => void {
    const q = query(this.getCollectionRef(userId), orderBy("date", "desc"));
    return onSnapshot(
      q,
      (snapshot) => {
        onUpdate(snapshot.docs.map((doc) => doc.data()));
      },
      (error) => {
        onError(error);
      }
    );
  },

  async createJournalEntry(userId: string, entry: JournalEntry): Promise<void> {
    try {
      const docRef = doc(this.getCollectionRef(userId), entry.id);
      await setDoc(docRef, entry);
    } catch (error) {
      handleFirestoreError(error, `creating journal entry ${entry.id} for user ${userId}`);
    }
  },

  async updateJournalEntry(userId: string, entryId: string, data: Partial<JournalEntry>): Promise<void> {
    try {
      const docRef = doc(this.getCollectionRef(userId), entryId);
      await updateDoc(docRef, data);
    } catch (error) {
      handleFirestoreError(error, `updating journal entry ${entryId} for user ${userId}`);
    }
  },

  async deleteJournalEntry(userId: string, entryId: string): Promise<void> {
    try {
      const docRef = doc(this.getCollectionRef(userId), entryId);
      await deleteDoc(docRef);
    } catch (error) {
      handleFirestoreError(error, `deleting journal entry ${entryId} for user ${userId}`);
    }
  },
};
