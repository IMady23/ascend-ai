"use client";

import * as React from "react";
import { cn } from "@/utils/cn";
import { Mic, Paperclip, Send } from "lucide-react";
import { Button } from "@/components/adl/primitives/Button";

export interface OmnibarProps {
  onSend: (message: string) => void;
  className?: string;
  placeholder?: string;
}

export function Omnibar({ onSend, className, placeholder = "Ask your coach anything..." }: OmnibarProps) {
  const [input, setInput] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSend(input);
      setInput("");
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className={cn("w-full bg-surface border border-border-subtle rounded-2xl p-2 flex items-end gap-2 shadow-sm focus-within:border-[var(--color-accent-indigo)]/50 focus-within:shadow-[var(--color-accent-indigo)]/10 transition-all", className)}
    >
      <Button 
        type="button"
        variant="ghost" 
        size="icon" 
        className="shrink-0 text-[var(--color-text-muted)] hover:text-primary rounded-xl"
      >
        <Paperclip size={20} />
      </Button>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
          }
        }}
        placeholder={placeholder}
        className="w-full bg-transparent text-primary placeholder-[var(--color-text-muted)] resize-none outline-none py-3 max-h-32 min-h-[44px]"
        rows={1}
      />

      <div className="flex gap-1 shrink-0 pb-1 pr-1">
        <Button 
          type="button"
          variant="ghost" 
          size="icon" 
          className="text-[var(--color-text-muted)] hover:text-[var(--color-accent-blue)] rounded-xl relative group"
        >
          <div className="absolute inset-0 bg-[var(--color-accent-blue)]/10 rounded-xl scale-0 group-hover:scale-100 transition-transform origin-center" />
          <Mic size={20} className="relative z-10" />
        </Button>
        <Button 
          type="submit"
          variant="primary" 
          size="icon" 
          className="rounded-xl shadow-md bg-gradient-to-br from-[var(--color-accent-indigo)] to-[var(--color-accent-blue)] border-0"
          disabled={!input.trim()}
        >
          <Send size={18} />
        </Button>
      </div>
    </form>
  );
}
