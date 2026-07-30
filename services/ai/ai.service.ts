import { ContextBuilder } from "./context.builder";
import { AiRepository } from "@/services/repositories/ai.repository";
import { Timestamp } from "firebase/firestore";
import { AiStructuredResponse } from "@/types/ai";
import { useUserStore } from "@/stores/user.store";

class AiService {
  async getCoachingResponse(contextSnapshot: any, messageText: string, chatHistory: any[] = []): Promise<AiStructuredResponse | null> {
    try {
      const userId = useUserStore.getState().userId;
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageText, contextSnapshot, chatHistory, userId })
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        console.error("AI Service Error:", result.error);
        return null;
      }

      return result.data;
    } catch (error) {
      console.error("AI Service Network Error:", error);
      return null;
    }
  }

  async generateTitle(messageText: string): Promise<string> {
    try {
      // For now, doing a basic client-side check. Ideally this would hit an LLM API endpoint too.
      // We will hit a generic /api/ai endpoint with a specialized prompt to get the title.
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messageText: `Generate a 2-4 word title for a fitness conversation that starts with this message: "${messageText}". Output ONLY the title, no quotes.`, 
          contextSnapshot: { overridePrompt: true } // We could handle this specially in the backend if we want, or just let the LLM answer
        })
      });
      
      const result = await response.json();
      if (result?.success && result.data?.summary) {
         let title = result.data.summary.replace(/["']/g, "").trim();
         if (title.length > 30) title = title.substring(0, 30) + "...";
         return title;
      }
      return "New Conversation";
    } catch (e) {
      return "New Conversation";
    }
  }
}

export const aiService = new AiService();
