"use client";

import * as React from "react";
import { cn } from "@/utils/cn";
import { BodyText } from "@/components/adl/typography";

export interface UserChatBubbleProps {
  content: string;
  className?: string;
}

export function UserChatBubble({ content, className }: UserChatBubbleProps) {
  return (
    <div className={cn("flex w-full justify-end mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300", className)}>
      <div className="max-w-[75%] bg-[var(--color-accent-indigo)] text-white p-4 rounded-2xl rounded-tr-sm shadow-md shadow-[var(--color-accent-indigo)]/10">
        <BodyText size="md" className="leading-relaxed text-white">
          {content}
        </BodyText>
      </div>
    </div>
  );
}
