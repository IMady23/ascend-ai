import { collection, doc, getDocs, setDoc, updateDoc, deleteDoc, query, orderBy, getDoc, onSnapshot } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { AiConversation, AiMessage, aiConversationConverter, aiMessageConverter } from "@/types/ai";
import { handleFirestoreError } from "./error-handler";

export const AiRepository = {
  getConversationsRef(userId: string) {
    return collection(firestore, `users/${userId}/aiChats`).withConverter(aiConversationConverter);
  },

  getMessagesRef(userId: string, conversationId: string) {
    return collection(firestore, `users/${userId}/aiChats/${conversationId}/messages`).withConverter(aiMessageConverter);
  },

  async getConversations(userId: string): Promise<AiConversation[]> {
    try {
      const q = query(this.getConversationsRef(userId), orderBy("lastMessageAt", "desc"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => doc.data());
    } catch (error) {
      handleFirestoreError(error, `fetching AI conversations for user ${userId}`);
    }
  },

  subscribeToConversations(userId: string, onUpdate: (conversations: AiConversation[]) => void, onError: (error: Error) => void): () => void {
    const q = query(this.getConversationsRef(userId), orderBy("lastMessageAt", "desc"));
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

  subscribeToMessages(userId: string, conversationId: string, onUpdate: (messages: AiMessage[]) => void, onError: (error: Error) => void): () => void {
    const q = query(this.getMessagesRef(userId, conversationId), orderBy("timestamp", "asc"));
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

  async getConversation(userId: string, conversationId: string): Promise<AiConversation | null> {
    try {
      const docRef = doc(this.getConversationsRef(userId), conversationId);
      const snapshot = await getDoc(docRef);
      return snapshot.exists() ? snapshot.data() : null;
    } catch (error) {
      handleFirestoreError(error, `fetching AI conversation ${conversationId} for user ${userId}`);
    }
  },

  async createConversation(userId: string, conversation: AiConversation): Promise<void> {
    try {
      const docRef = doc(this.getConversationsRef(userId), conversation.id);
      await setDoc(docRef, conversation);
    } catch (error) {
      handleFirestoreError(error, `creating AI conversation ${conversation.id} for user ${userId}`);
    }
  },

  async updateConversation(userId: string, conversationId: string, updates: Partial<AiConversation>): Promise<void> {
    try {
      const docRef = doc(this.getConversationsRef(userId), conversationId);
      await updateDoc(docRef, updates);
    } catch (error) {
      handleFirestoreError(error, `updating AI conversation ${conversationId} for user ${userId}`);
    }
  },

  async getMessages(userId: string, conversationId: string): Promise<AiMessage[]> {
    try {
      const q = query(this.getMessagesRef(userId, conversationId), orderBy("timestamp", "asc"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => doc.data());
    } catch (error) {
      handleFirestoreError(error, `fetching messages for conversation ${conversationId}`);
    }
  },

  async createMessage(userId: string, conversationId: string, message: AiMessage): Promise<void> {
    try {
      const docRef = doc(this.getMessagesRef(userId, conversationId), message.id);
      await setDoc(docRef, message);
    } catch (error) {
      handleFirestoreError(error, `creating message in conversation ${conversationId}`);
    }
  }
};
