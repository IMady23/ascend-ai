export interface AIRequest {
  id: string;
  correlationId: string;
  conversationId: string;
  userId: string;
  prompt: string;
  systemContext?: string;
  chatHistory?: any[];
  timestamp: number;
}
