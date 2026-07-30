import { AiStructuredResponse } from "@/types/ai";

/** Builds display text from structured coach response for message persistence. */
export function formatCoachMessage(response: AiStructuredResponse): string {
  const parts: string[] = [response.summary];

  if (response.recommendations?.length > 0) {
    parts.push("\n\n" + response.recommendations.map((r) => `→ ${r}`).join("\n"));
  }

  if (response.warnings?.length > 0) {
    parts.push("\n\n" + response.warnings.map((w) => `⚠ ${w}`).join("\n"));
  }

  if (response.encouragement) {
    parts.push("\n\n" + response.encouragement);
  }

  if (response.followUpQuestion) {
    parts.push("\n\n" + response.followUpQuestion);
  }

  return parts.join("");
}
