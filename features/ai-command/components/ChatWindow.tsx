"use client";

import { MessageBubble } from "./MessageBubble";
import { MOCK_CHAT_MESSAGES } from "../constants";
import { Send, Sparkles } from "lucide-react";
import { useState } from "react";

export function ChatWindow() {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    // Placeholder action for now
    setInput("");
  };

  return (
    <section className="bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col h-[600px] overflow-hidden">
      <div className="p-4 border-b border-zinc-800 bg-zinc-950 flex items-center gap-2">
        <Sparkles size={16} className="text-violet-400" />
        <h2 className="font-bold text-white text-sm">Ascend Intelligence</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 flex flex-col">
        {MOCK_CHAT_MESSAGES.map((msg) => (
          <MessageBubble key={msg.id} role={msg.role} content={msg.content} />
        ))}
      </div>

      <div className="p-4 bg-zinc-950 border-t border-zinc-800">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Command Ascend AI..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-4 pr-12 text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/50 transition-colors"
          />
          <button 
            type="submit"
            className="absolute right-2 p-2 bg-violet-600 hover:bg-violet-500 rounded-lg text-white transition-colors disabled:opacity-50"
            disabled={!input.trim()}
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </section>
  );
}
