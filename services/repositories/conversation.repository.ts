import { collection, doc, getDocs, setDoc, updateDoc, deleteDoc, query, orderBy, onSnapshot } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { Conversation, conversationConverter } from "@/types/conversation";
import { handleFirestoreError } from "./error-handler";

export const ConversationRepository = {
  getCollectionRef(userId: string) {
    return collection(firestore, `users/${userId}/conversations`).withConverter(conversationConverter);
  },

  async getConversations(userId: string): Promise<Conversation[]> {
    try {
      const q = query(this.getCollectionRef(userId), orderBy("updatedAt", "desc"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => doc.data());
    } catch (error) {
      handleFirestoreError(error, `fetching conversations for user ${userId}`);
      return [];
    }
  },

  subscribeToConversations(userId: string, onUpdate: (conversations: Conversation[]) => void, onError: (error: Error) => void): () => void {
    const q = query(this.getCollectionRef(userId), orderBy("updatedAt", "desc"));
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

  async createConversation(userId: string, conversation: Conversation): Promise<void> {
    try {
      const docRef = doc(this.getCollectionRef(userId), conversation.id);
      await setDoc(docRef, conversation);
    } catch (error) {
      handleFirestoreError(error, `creating conversation ${conversation.id} for user ${userId}`);
    }
  },

  async updateConversation(userId: string, conversationId: string, data: Partial<Conversation>): Promise<void> {
    try {
      const docRef = doc(this.getCollectionRef(userId), conversationId);
      await updateDoc(docRef, data as any);
    } catch (error) {
      handleFirestoreError(error, `updating conversation ${conversationId} for user ${userId}`);
    }
  },

  async deleteConversation(userId: string, conversationId: string): Promise<void> {
    try {
      const docRef = doc(this.getCollectionRef(userId), conversationId);
      await deleteDoc(docRef);
    } catch (error) {
      handleFirestoreError(error, `deleting conversation ${conversationId} for user ${userId}`);
    }
  },
};
