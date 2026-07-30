"use client";

import { useAiStore } from "@/stores/ai.store";
import { useUserStore } from "@/stores/user.store";
import { aiService } from "@/services/ai/ai.service";
import { MessageBubble } from "./MessageBubble";
import { Send, Sparkles, Loader2 } from "lucide-react";
import { useState } from "react";

export function ChatWindow() {
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { activeConversationId, conversations, sendMessage: sendStoreMessage } = useAiStore();
  const activeConversation = conversations.find(c => c.id === activeConversationId);
  const messages = activeConversation?.messages || [];
  const { userId } = useUserStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !activeConversationId || !userId || isProcessing) return;
    
    const userMessageText = input.trim();
    setInput("");
    setIsProcessing(true);

    try {
      if (activeConversationId) {
        await sendStoreMessage(userMessageText, "user");
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <section className="bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col h-[600px] overflow-hidden">
      <div className="p-4 border-b border-zinc-800 bg-zinc-950 flex items-center gap-2">
        <Sparkles size={16} className="text-violet-400" />
        <h2 className="font-bold text-white text-sm">Ascend Intelligence</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 flex flex-col">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-zinc-500">
            <Sparkles size={32} className="mb-4 opacity-50 text-violet-400" />
            <p>How can I optimize your protocol today?</p>
          </div>
        ) : (
          messages.map((msg: any) => (
            <MessageBubble key={msg.id} message={msg} />
          ))
        )}
        {isProcessing && (
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center shrink-0">
              <Sparkles size={16} className="text-violet-400" />
            </div>
            <div className="bg-zinc-800/50 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
              <Loader2 size={16} className="text-violet-400 animate-spin" />
              <span className="text-zinc-400 text-sm">Analyzing protocol data...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-zinc-950 border-t border-zinc-800">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Command Ascend AI..."
            disabled={isProcessing}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-4 pr-12 text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/50 transition-colors disabled:opacity-50"
          />
          <button 
            type="submit"
            className="absolute right-2 p-2 bg-violet-600 hover:bg-violet-500 rounded-lg text-white transition-colors disabled:opacity-50"
            disabled={!input.trim() || isProcessing}
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </section>
  );
}
