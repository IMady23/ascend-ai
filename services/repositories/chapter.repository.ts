import { collection, doc, getDocs, setDoc, updateDoc, deleteDoc, query, orderBy, onSnapshot } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { Chapter, chapterConverter } from "@/types/chapter";
import { handleFirestoreError } from "./error-handler";

export const ChapterRepository = {
  getCollectionRef(userId: string) {
    return collection(firestore, `users/${userId}/chapters`).withConverter(chapterConverter);
  },

  async getAllChapters(userId: string): Promise<Chapter[]> {
    try {
      const q = query(this.getCollectionRef(userId), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => doc.data());
    } catch (error) {
      handleFirestoreError(error, `fetching chapters for user ${userId}`);
    }
  },

  subscribeToChapters(userId: string, onUpdate: (chapters: Chapter[]) => void, onError: (error: Error) => void): () => void {
    const q = query(this.getCollectionRef(userId), orderBy("createdAt", "desc"));
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

  async createChapter(userId: string, chapter: Chapter): Promise<void> {
    try {
      const docRef = doc(this.getCollectionRef(userId), chapter.id);
      await setDoc(docRef, chapter);
    } catch (error) {
      handleFirestoreError(error, `creating chapter ${chapter.id} for user ${userId}`);
    }
  },

  async updateChapter(userId: string, chapterId: string, data: Partial<Chapter>): Promise<void> {
    try {
      const docRef = doc(this.getCollectionRef(userId), chapterId);
      await updateDoc(docRef, data);
    } catch (error) {
      handleFirestoreError(error, `updating chapter ${chapterId} for user ${userId}`);
    }
  },

  async deleteChapter(userId: string, chapterId: string): Promise<void> {
    try {
      const docRef = doc(this.getCollectionRef(userId), chapterId);
      await deleteDoc(docRef);
    } catch (error) {
      handleFirestoreError(error, `deleting chapter ${chapterId} for user ${userId}`);
    }
  },
};
