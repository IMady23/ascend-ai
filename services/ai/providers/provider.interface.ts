import type { AiStructuredResponse } from "@/types/ai";

export interface AIProvider {
  /**
   * Generates a structured response based on the system prompt and the user's message.
   */
  generateResponse(systemPrompt: string, userMessage: string): Promise<AiStructuredResponse>;
}
