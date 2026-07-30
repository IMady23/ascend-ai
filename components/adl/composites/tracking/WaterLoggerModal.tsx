import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Droplet, X, Check, Plus } from "lucide-react";
import { Heading, BodyText, Caption } from "@/components/adl/typography";
import { Button } from "@/components/adl/primitives/Button";
import { Input } from "@/components/adl/primitives/Input";
import { GlassCard } from "@/components/adl/composites/cards/Cards";
import { ProgressRing } from "@/components/adl/composites/progress/Progress";
import { useNutritionStore } from "@/stores/nutrition.store";
import { useUserStore } from "@/stores/user.store";
import { useToastStore } from "@/stores/toast.store";

interface WaterLoggerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WaterLoggerModal({ isOpen, onClose }: WaterLoggerModalProps) {
  const { addWater, dailyWaterMl } = useNutritionStore();
  const { profile } = useUserStore();
  const { addToast } = useToastStore();
  
  const [customAmount, setCustomAmount] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const targetWater = profile?.targets?.water || 3000;
  const progress = Math.min((dailyWaterMl / targetWater) * 100, 100);

  const handleAdd = async (amount: number) => {
    setIsSubmitting(true);
    try {
      await addWater(amount);
      addToast({
        title: "Water Logged",
        message: `Successfully logged ${amount}ml of water.`,
        type: "success"
      });
      onClose();
    } catch (e) {
      addToast({
        title: "Error",
        message: "Failed to log water.",
        type: "warning"
      });
    } finally {
      setIsSubmitting(false);
      setCustomAmount("");
    }
  };

  const handleCustomAdd = () => {
    const amount = parseInt(customAmount);
    if (!isNaN(amount) && amount > 0) {
      handleAdd(amount);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-sm"
      >
        <GlassCard intensity="high" className="flex flex-col overflow-hidden shadow-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[var(--color-accent-blue)]/10 flex items-center justify-center">
                <Droplet size={16} className="text-[var(--color-accent-blue)]" />
              </div>
              <Heading level="h4">Log Hydration</Heading>
            </div>
            <button onClick={onClose} className="p-1 rounded-md text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-surface)] transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="flex flex-col items-center justify-center mb-8">
            <div className="relative">
              <ProgressRing 
                value={progress} 
                size={120} 
                strokeWidth={8} 
                color="var(--color-accent-blue)" 
                icon={<React.Fragment />}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <span className="font-mono text-xl font-bold text-[var(--color-accent-blue)]">{dailyWaterMl}</span>
                 <Caption className="text-[var(--color-text-muted)] text-[10px] uppercase font-semibold">/ {targetWater} ML</Caption>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <Button onClick={() => handleAdd(250)} variant="secondary" size="md" disabled={isSubmitting}>+ 250 ml</Button>
            <Button onClick={() => handleAdd(500)} variant="secondary" size="md" disabled={isSubmitting}>+ 500 ml</Button>
            <Button onClick={() => handleAdd(750)} variant="secondary" size="md" disabled={isSubmitting}>+ 750 ml</Button>
            <Button onClick={() => handleAdd(1000)} variant="secondary" size="md" disabled={isSubmitting}>+ 1000 ml</Button>
          </div>

          <div className="flex items-center gap-2">
            <input 
              type="number"
              placeholder="Custom (ml)"
              value={customAmount}
              onChange={e => setCustomAmount(e.target.value)}
              className="flex-1 bg-[var(--color-bg-base)] border border-[var(--color-glass-border)] rounded-lg font-mono py-2.5 px-4 text-center focus:outline-none focus:border-[var(--color-accent-blue)] transition-colors"
            />
            <Button 
              onClick={handleCustomAdd} 
              variant="primary" 
              className="shrink-0"
              disabled={isSubmitting || !customAmount}
            >
              <Plus size={18} />
            </Button>
          </div>

        </GlassCard>
      </motion.div>
    </div>
  );
}
