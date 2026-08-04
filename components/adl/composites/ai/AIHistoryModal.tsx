"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/adl/composites/cards/Cards";
import { Button } from "@/components/adl/primitives/Button";
import { Caption, BodyText, Heading } from "@/components/adl/typography";

export interface ConversationSummary {
  id: string;
  title: string;
  snippet: string;
  createdAt: string;
}

export function loadConversations(): ConversationSummary[] {
  try {
    const raw = localStorage.getItem('ascend_ai_conversations');
    if (!raw) return [];
    return JSON.parse(raw) as ConversationSummary[];
  } catch (e) {
    return [];
  }
}

export function AIHistoryModal({ isOpen, onClose, onLoad }: { isOpen: boolean; onClose: () => void; onLoad: (id: string) => void; }) {
  const [convos, setConvos] = React.useState<ConversationSummary[]>([]);

  React.useEffect(() => {
    if (!isOpen) return;
    setConvos(loadConversations());
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            className="absolute inset-0"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ background: 'rgba(15, 23, 42, 0.16)', backdropFilter: 'blur(6px)' }}
          />

          <motion.div
            className="relative z-10 w-full max-w-md mx-3 sm:mx-0"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            <div
              className="rounded-2xl p-4 bg-bg-surface/90 border border-border-subtle"
              style={{
                boxShadow: '0 18px 36px rgba(2,6,23,0.28), 0 6px 14px rgba(2,6,23,0.18)',
                transform: 'perspective(900px) translateY(-4px)'
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <Heading level="h4">Conversation History</Heading>
                  <Caption className="text-xs text-text-disabled">Saved locally on this device</Caption>
                </div>
                <Button variant="ghost" onClick={onClose}>Close</Button>
              </div>

              <div className="space-y-2 max-h-[56vh] overflow-y-auto">
                {convos.length === 0 && (
                  <BodyText size="sm">No saved conversations yet.</BodyText>
                )}
                {convos.map(c => (
                  <div key={c.id} className="p-3 bg-bg-base/40 border border-border-subtle rounded-lg flex items-start justify-between">
                    <div className="min-w-0">
                      <Caption className="font-semibold block truncate">{c.title || new Date(c.createdAt).toLocaleString()}</Caption>
                      <BodyText size="sm" className="text-text-secondary line-clamp-2">{c.snippet}</BodyText>
                    </div>
                    <div className="flex flex-col gap-2 ml-4 shrink-0">
                      <Button size="sm" variant="secondary" onClick={() => onLoad(c.id)}>Load</Button>
                      <Button size="sm" variant="ghost" onClick={() => {
                        const remaining = convos.filter(x => x.id !== c.id);
                        localStorage.setItem('ascend_ai_conversations', JSON.stringify(remaining));
                        setConvos(remaining);
                      }}>Delete</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default AIHistoryModal;
