import { Timestamp, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions, DocumentData } from "firebase/firestore";

export interface AiMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Timestamp;
}

export interface AiConversation {
  id: string;
  title: string | null;
  startedAt: Timestamp;
  lastMessageAt: Timestamp;
  summary: string | null;
}

export const aiMessageConverter: FirestoreDataConverter<AiMessage> = {
  toFirestore(message: AiMessage): DocumentData {
    const { id, ...data } = message;
    return data;
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): AiMessage {
    const data = snapshot.data(options);
    return { ...data, id: snapshot.id } as AiMessage;
  }
};

export const aiConversationConverter: FirestoreDataConverter<AiConversation> = {
  toFirestore(conversation: AiConversation): DocumentData {
    const { id, ...data } = conversation;
    return data;
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): AiConversation {
    const data = snapshot.data(options);
    return { ...data, id: snapshot.id } as AiConversation;
  }
};
