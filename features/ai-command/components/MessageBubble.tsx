"use client";

import { Cpu, User } from "lucide-react";

interface MessageBubbleProps {
  role: string;
  content: string;
}

export function MessageBubble({ role, content }: MessageBubbleProps) {
  const isAi = role === "assistant" || role === "system";

  return (
    <div className={`flex gap-4 max-w-[85%] ${isAi ? "self-start" : "self-end flex-row-reverse"}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
        isAi ? "bg-violet-950 border-violet-900/50" : "bg-zinc-800 border-zinc-700"
      }`}>
        {isAi ? <Cpu size={14} className="text-violet-400" /> : <User size={14} className="text-zinc-400" />}
      </div>
      
      <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
        isAi 
          ? "bg-zinc-950 border border-zinc-800 text-zinc-300 rounded-tl-sm" 
          : "bg-violet-600 text-white rounded-tr-sm"
      }`}>
        {content}
      </div>
    </div>
  );
}
