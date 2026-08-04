"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/adl/composites/cards/Cards";
import { Button } from "@/components/adl/primitives/Button";
import { Heading, Caption } from "@/components/adl/typography";

export function AISettingsDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void; }) {
  const [persona, setPersona] = React.useState<string>(() => {
    try { return localStorage.getItem('ascend_ai_persona') || 'Friendly'; } catch { return 'Friendly'; }
  });
  const [storeHistory, setStoreHistory] = React.useState<boolean>(() => {
    try { return localStorage.getItem('ascend_ai_store_history') !== 'false'; } catch { return true; }
  });

  React.useEffect(() => {
    if (!isOpen) return;
    // refresh values
    setPersona(localStorage.getItem('ascend_ai_persona') || 'Friendly');
    setStoreHistory(localStorage.getItem('ascend_ai_store_history') !== 'false');
  }, [isOpen]);

  const save = () => {
    try {
      localStorage.setItem('ascend_ai_persona', persona);
      localStorage.setItem('ascend_ai_store_history', storeHistory ? 'true' : 'false');
    } catch (e) {}
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end p-4">
          <motion.div
            className="absolute inset-0"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ background: 'rgba(15, 23, 42, 0.12)', backdropFilter: 'blur(6px)' }}
          />

          <motion.div
            className="relative z-10 w-full max-w-sm mx-3 sm:mx-0"
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
                  <Heading level="h4">AI Settings</Heading>
                  <Caption className="text-xs text-text-disabled">Personalize your coach</Caption>
                </div>
                <Button variant="ghost" onClick={onClose}>Close</Button>
              </div>

              <div className="space-y-4">
                <div>
                  <Caption className="block mb-2">Coach Persona</Caption>
                  <select value={persona} onChange={(e) => setPersona(e.target.value)} className="w-full bg-base border border-border-subtle rounded p-2">
                    <option>Friendly</option>
                    <option>Direct</option>
                    <option>Technical</option>
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={storeHistory} onChange={(e) => setStoreHistory(e.target.checked)} />
                    <Caption>Store conversation history locally</Caption>
                  </label>
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="ghost" onClick={onClose}>Cancel</Button>
                  <Button variant="primary" onClick={save}>Save</Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default AISettingsDrawer;
