import { Timestamp, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions, DocumentData } from "firebase/firestore";

export interface AiStructuredResponse {
  summary: string;
  recommendations: string[];
  warnings: string[];
  encouragement: string;
  followUpQuestion?: string;
  confidence: number;
  widgets?: any[];
  tool_calls?: any[];
}

export interface AiMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  structuredContent?: AiStructuredResponse;
  contextSnapshot?: any;
  provider?: string;
  model?: string;
  responseTime?: number;
  timestamp: Timestamp;
}

export interface AiConversation {
  id: string;
  userId?: string;
  title: string | null;
  startedAt: Timestamp;
  lastMessageAt: Timestamp;
  summary: string | null;
  model?: string;
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
