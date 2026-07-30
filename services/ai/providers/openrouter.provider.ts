import { AiStructuredResponse } from "@/types/ai";

export class OpenRouterProvider {
  private get apiKey() {
    return process.env.OPENROUTER_API_KEY;
  }

  private get model() {
    return process.env.OPENROUTER_MODEL || "google/gemini-2.5-flash";
  }

  private get baseUrl() {
    return process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1";
  }

  async generateResponse(systemPrompt: string, userMessage: string, chatHistory: any[] = [], isRetry = false): Promise<AiStructuredResponse> {
    if (!this.apiKey) {
      throw new Error("Missing OpenRouter API Key configuration.");
    }

    try {
      const messages = [
        { role: "system", content: systemPrompt },
        ...chatHistory.map(m => ({
          role: m.role === "ai" || m.role === "assistant" ? "assistant" : "user",
          content: m.content
        })),
        { role: "user", content: userMessage }
      ];

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
          "X-Title": "Ascend AI",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: this.model,
          messages,
          response_format: { type: "json_object" } // Some models support this OpenRouter flag
        })
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error("Rate limit exceeded. Please try again later.");
        }
        throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const rawContent = data.choices?.[0]?.message?.content;

      if (!rawContent) {
        throw new Error("Empty response from model");
      }

      return this.parseStructuredContent(rawContent, systemPrompt, userMessage, chatHistory, isRetry);

    } catch (error) {
      console.error("OpenRouterProvider Error:", error);
      throw error;
    }
  }

  private async parseStructuredContent(rawContent: string, systemPrompt: string, userMessage: string, chatHistory: any[], isRetry: boolean): Promise<AiStructuredResponse> {
    try {
      // Remove any potential markdown block formatting
      const cleaned = rawContent.replace(/```json/gi, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleaned);

      return {
        summary: parsed.summary || "No summary provided.",
        recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : [],
        warnings: Array.isArray(parsed.warnings) ? parsed.warnings : [],
        encouragement: parsed.encouragement || "Stay focused.",
        confidence: typeof parsed.confidence === "number" ? parsed.confidence : 0.5
      };
    } catch (e) {
      if (!isRetry) {
        console.warn("Failed to parse JSON, attempting repair prompt...", rawContent);
        const repairPrompt = systemPrompt + "\\n\\nCRITICAL: Your previous response was invalid JSON. You must return ONLY raw JSON.";
        return this.generateResponse(repairPrompt, userMessage, chatHistory, true);
      }
      
      console.error("Failed to parse JSON even after retry. Falling back to plain text card.", rawContent);
      return {
        summary: rawContent.substring(0, 200) + (rawContent.length > 200 ? "..." : ""),
        recommendations: ["Unable to parse structured recommendations."],
        warnings: ["Response format was invalid."],
        encouragement: "Keep going despite technical difficulties.",
        confidence: 0
      };
    }
  }
}
