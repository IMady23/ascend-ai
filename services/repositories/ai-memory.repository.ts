import { collection, doc, getDocs, setDoc, updateDoc, deleteDoc, query, orderBy } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { MemoryItem } from "@/lib/ai/types/Memory";
import { handleFirestoreError } from "./error-handler";

export const AiMemoryRepository = {
  getMemoryRef(userId: string) {
    return collection(firestore, `users/${userId}/aiMemory`);
  },

  async getMemories(userId: string): Promise<MemoryItem[]> {
    try {
      const q = query(this.getMemoryRef(userId), orderBy("metadata.createdAt", "desc"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => doc.data() as MemoryItem);
    } catch (error) {
      handleFirestoreError(error, `fetching AI memory for user ${userId}`);
      return [];
    }
  },

  async saveMemory(userId: string, memory: MemoryItem): Promise<void> {
    try {
      const docRef = doc(this.getMemoryRef(userId), memory.id);
      await setDoc(docRef, memory);
    } catch (error) {
      handleFirestoreError(error, `saving AI memory ${memory.id} for user ${userId}`);
    }
  },

  async updateMemory(userId: string, memoryId: string, updates: Partial<MemoryItem>): Promise<void> {
    try {
      const docRef = doc(this.getMemoryRef(userId), memoryId);
      await updateDoc(docRef, updates);
    } catch (error) {
      handleFirestoreError(error, `updating AI memory ${memoryId} for user ${userId}`);
    }
  },

  async deleteMemory(userId: string, memoryId: string): Promise<void> {
    try {
      const docRef = doc(this.getMemoryRef(userId), memoryId);
      await deleteDoc(docRef);
    } catch (error) {
      handleFirestoreError(error, `deleting AI memory ${memoryId} for user ${userId}`);
    }
  }
};
