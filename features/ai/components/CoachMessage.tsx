"use client";

import React from "react";
import { AiStructuredResponse } from "@/types/ai";

interface CoachMessageProps {
  response: AiStructuredResponse;
  fallbackContent?: string;
}

export function CoachMessage({ response, fallbackContent }: CoachMessageProps) {
  const hasStructured =
    response.recommendations?.length > 0 ||
    response.warnings?.length > 0 ||
    response.encouragement ||
    response.followUpQuestion;

  if (!hasStructured && fallbackContent) {
    return <p className="whitespace-pre-wrap leading-relaxed">{fallbackContent}</p>;
  }

  return (
    <div className="space-y-3">
      <p className="whitespace-pre-wrap leading-relaxed">{response.summary}</p>

      {response.recommendations?.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
            Next Steps
          </p>
          <ul className="space-y-1">
            {response.recommendations.map((rec, i) => (
              <li key={i} className="text-sm text-secondary flex gap-2">
                <span className="text-[var(--color-accent-blue)] shrink-0">→</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {response.warnings?.length > 0 && (
        <div className="space-y-1 rounded-lg bg-amber-500/10 border border-amber-500/20 px-3 py-2">
          {response.warnings.map((w, i) => (
            <p key={i} className="text-xs text-amber-200/90">
              ⚠ {w}
            </p>
          ))}
        </div>
      )}

      {response.encouragement && (
        <p className="text-sm italic text-secondary border-l-2 border-[var(--color-accent-blue)]/40 pl-3">
          {response.encouragement}
        </p>
      )}

      {response.followUpQuestion && (
        <p className="text-sm font-medium text-[var(--color-accent-blue)] pt-1">
          {response.followUpQuestion}
        </p>
      )}
    </div>
  );
}
