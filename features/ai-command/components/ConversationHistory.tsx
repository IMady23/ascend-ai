"use client";

import { useAiStore } from "@/stores/ai.store";
import { MessageSquare, Clock } from "lucide-react";

export function ConversationHistory() {
  const conversations = useAiStore((state) => state.conversations);

  return (
    <section className="bg-surface border border-border-subtle rounded-2xl overflow-hidden">
      <div className="p-6 md:p-8 border-b border-border-subtle">
        <h2 className="text-xl font-bold text-primary">Conversation History</h2>
      </div>
      
      <div className="divide-y divide-zinc-800/50">
        {conversations.length === 0 ? (
          <div className="p-8 text-center text-secondary">
            No active conversations. Start a chat above.
          </div>
        ) : (
          conversations.map((conv: any) => {
            let timeString = "Recently";
            if (conv.lastMessageAt && typeof conv.lastMessageAt.toMillis === "function") {
              const date = new Date(conv.lastMessageAt.toMillis());
              timeString = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
            }

            return (
              <button key={conv.id} className="w-full text-left p-6 hover:bg-surface-elevated/20 transition-colors flex items-center justify-between gap-4 group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-base border border-border-subtle rounded-lg flex items-center justify-center text-secondary group-hover:text-violet-400 group-hover:border-violet-500/30 transition-colors">
                    <MessageSquare size={16} />
                  </div>
                  <h3 className="font-bold text-primary group-hover:text-primary transition-colors text-sm sm:text-base">
                    {conv.title || "Untitled Session"}
                  </h3>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-disabled font-mono">
                  <Clock size={12} />
                  <span>{timeString}</span>
                </div>
              </button>
            );
          })
        )}
      </div>
    </section>
  );
}
