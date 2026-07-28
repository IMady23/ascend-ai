"use client";

import { useAiStore } from "@/stores/ai.store";
import { MessageSquare, Clock } from "lucide-react";

export function ConversationHistory() {
  const storeConversations = useAiStore((state) => state.conversations);
  // Using store data if exists, otherwise mock
  const conversations = storeConversations && storeConversations.length > 0 
    ? storeConversations 
    : [
      { id: "c-1", title: "Morning check-in", lastMessageAt: { toMillis: () => Date.now() - 3600000 } },
      { id: "c-2", title: "Nutrition planning", lastMessageAt: { toMillis: () => Date.now() - 86400000 } },
      { id: "c-3", title: "Workout review", lastMessageAt: { toMillis: () => Date.now() - 172800000 } },
    ];

  return (
    <section className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
      <div className="p-6 md:p-8 border-b border-zinc-800">
        <h2 className="text-xl font-bold text-white">Conversation History</h2>
      </div>
      
      <div className="divide-y divide-zinc-800/50">
        {conversations.map((conv: any) => {
          let timeString = "Recently";
          if (conv.lastMessageAt && typeof conv.lastMessageAt.toMillis === "function") {
            const date = new Date(conv.lastMessageAt.toMillis());
            timeString = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
          }

          return (
            <button key={conv.id} className="w-full text-left p-6 hover:bg-zinc-800/20 transition-colors flex items-center justify-between gap-4 group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center justify-center text-zinc-500 group-hover:text-violet-400 group-hover:border-violet-500/30 transition-colors">
                  <MessageSquare size={16} />
                </div>
                <h3 className="font-bold text-zinc-300 group-hover:text-white transition-colors text-sm sm:text-base">
                  {conv.title || "Untitled Session"}
                </h3>
              </div>
              
              <div className="flex items-center gap-2 text-xs text-zinc-600 font-mono">
                <Clock size={12} />
                <span>{timeString}</span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
