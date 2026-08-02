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
    <section className="bg-surface border border-border-subtle rounded-2xl flex flex-col overflow-hidden" style={{ height: 'min(600px, 70dvh)' }}>
      <div className="p-4 border-b border-border-subtle bg-base flex items-center gap-2">
        <Sparkles size={16} className="text-violet-400" />
        <h2 className="font-bold text-primary text-sm">Ascend Intelligence</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 flex flex-col">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-secondary">
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
            <div className="bg-surface-elevated/50 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
              <Loader2 size={16} className="text-violet-400 animate-spin" />
              <span className="text-secondary text-sm">Analyzing protocol data...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-base border-t border-border-subtle">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(e as any); }}
            placeholder="Command Ascend AI..."
            disabled={isProcessing}
            inputMode="text"
            enterKeyHint="send"
            className="w-full bg-surface border border-border-subtle rounded-xl py-3 pl-4 pr-12 text-primary placeholder:text-disabled focus:outline-none focus:border-violet-500/50 transition-colors disabled:opacity-50 [overflow-wrap:break-word]"
          />
          <button 
            type="submit"
            className="absolute right-2 p-2 bg-violet-600 hover:bg-violet-500 rounded-lg text-primary transition-colors disabled:opacity-50"
            disabled={!input.trim() || isProcessing}
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </section>
  );
}
