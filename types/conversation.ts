export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: any; // Firestore Timestamp
  toolExecutions?: any[];
}

export interface Conversation {
  id: string;
  userId: string;
  title: string;
  createdAt: any; // Firestore Timestamp
  updatedAt: any;
  lastMessage?: string;
  messageCount: number;
  archived: boolean;
  pinned: boolean;
  modelVersion: string;
  contextSnapshotVersion: string;
  messages: Message[];
}

export const conversationConverter = {
  toFirestore: (data: Conversation) => data,
  fromFirestore: (snapshot: any, options: any): Conversation => {
    const data = snapshot.data(options);
    return data as Conversation;
  }
};
