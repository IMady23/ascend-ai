"use client";

import { Cpu, User, CheckCircle2, AlertTriangle, Zap } from "lucide-react";
import type { AiMessage } from "@/types/ai";
import { motion } from "framer-motion";

interface MessageBubbleProps {
  message: AiMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isAi = message.role === "assistant" || message.role === "system";

  return (
    <div className={`flex gap-4 max-w-[85%] ${isAi ? "self-start" : "self-end flex-row-reverse"}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border mt-1 ${
        isAi ? "bg-violet-950 border-violet-900/50" : "bg-zinc-800 border-zinc-700"
      }`}>
        {isAi ? <Cpu size={14} className="text-violet-400" /> : <User size={14} className="text-zinc-400" />}
      </div>
      
      <div className={`flex flex-col gap-3 w-full`}>
        {!isAi ? (
          <div className="p-4 rounded-2xl bg-violet-600 text-white rounded-tr-sm text-sm leading-relaxed inline-block">
            {message.content}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {message.structuredContent ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-zinc-950 border border-zinc-800 rounded-2xl rounded-tl-sm overflow-hidden"
              >
                {/* Summary */}
                <div className="p-4 border-b border-zinc-800/50 bg-zinc-900/30">
                  <p className="text-sm text-zinc-200 leading-relaxed">
                    {message.structuredContent.summary}
                  </p>
                </div>

                {/* Warnings */}
                {message.structuredContent.warnings && message.structuredContent.warnings.length > 0 && (
                  <div className="p-4 border-b border-red-500/10 bg-red-500/5">
                    <h4 className="text-xs font-bold text-red-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                      <AlertTriangle size={12} />
                      Attention Required
                    </h4>
                    <ul className="space-y-1.5">
                      {message.structuredContent.warnings.map((w, i) => (
                        <li key={i} className="text-sm text-red-200 flex items-start gap-2">
                          <span className="text-red-500 mt-0.5">•</span>
                          {w}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Recommendations */}
                {message.structuredContent.recommendations && message.structuredContent.recommendations.length > 0 && (
                  <div className="p-4 border-b border-zinc-800/50">
                    <h4 className="text-xs font-bold text-violet-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                      <CheckCircle2 size={12} />
                      Action Plan
                    </h4>
                    <div className="space-y-2">
                      {message.structuredContent.recommendations.map((rec, i) => (
                        <div key={i} className="flex gap-3 items-start bg-zinc-900/50 p-3 rounded-xl border border-zinc-800/50">
                          <div className="w-5 h-5 rounded-full bg-violet-500/20 flex items-center justify-center shrink-0 mt-0.5">
                            <span className="text-[10px] font-bold text-violet-400">{i + 1}</span>
                          </div>
                          <p className="text-sm text-zinc-300 leading-relaxed">{rec}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Encouragement */}
                <div className="p-4 bg-violet-950/20">
                  <p className="text-sm font-medium text-violet-300 italic flex items-center gap-2">
                    <Zap size={14} className="text-violet-400" />
                    "{message.structuredContent.encouragement}"
                  </p>
                </div>
              </motion.div>
            ) : (
              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 text-zinc-300 rounded-tl-sm text-sm leading-relaxed inline-block">
                {message.content}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
