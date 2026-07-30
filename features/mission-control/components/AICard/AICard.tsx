"use client";

import { Bot, ArrowRight } from "lucide-react";
import { useAiStore } from "@/stores/ai.store";

export function AICard() {
  const { activeConversationId, conversations } = useAiStore();
  const activeConversation = conversations.find(c => c.id === activeConversationId);
  const message = activeConversation?.lastMessage || "Ready to crush today's goals?";
  return (
    <div className="bg-primary border border-primary/20 rounded-2xl p-6 shadow-md relative overflow-hidden">
      {/* Decorative gradient blob */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl pointer-events-none" />
      
      <div className="flex items-start gap-4 relative z-10">
        <div className="bg-primary-foreground/20 p-3 rounded-full text-primary-foreground shrink-0 mt-1">
          <Bot size={28} />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-primary-foreground text-lg mb-2">
            AI Coach
          </h3>
          <p className="text-primary-foreground/90 text-sm leading-relaxed mb-4">
            "{message}"
          </p>
          <button className="flex items-center gap-2 text-sm font-semibold text-primary-foreground hover:bg-primary-foreground/10 px-4 py-2 rounded-lg transition-colors -ml-4">
            Open AI Command <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
