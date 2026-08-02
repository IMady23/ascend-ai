import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Footprints, Flame, Timer, X, Check } from "lucide-react";
import { Heading, BodyText, Caption } from "@/components/adl/typography";
import { Button } from "@/components/adl/primitives/Button";
import { GlassCard } from "@/components/adl/composites/cards/Cards";
import { useActivityStore } from "@/stores/activity.store";
import { useScrollIntoViewIfNeeded } from "@/hooks/useScrollIntoViewIfNeeded";

interface StepsLoggerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StepsLoggerModal({ isOpen, onClose }: StepsLoggerModalProps) {
  const { dailySteps, setDailySteps } = useActivityStore();
  const [stepsInput, setStepsInput] = React.useState(dailySteps.toString());
  const scrollRef = useScrollIntoViewIfNeeded<HTMLDivElement>(isOpen, {
    alignment: "nearest",
    offset: 64,
    focusFirstInput: false,
  });

  React.useEffect(() => {
    if (isOpen) {
      setStepsInput(dailySteps.toString());
    }
  }, [isOpen, dailySteps]);

  const stepsNum = parseInt(stepsInput) || 0;
  
  // Basic calculations (rough estimates based on average stride/weight)
  const distanceKm = (stepsNum * 0.000762).toFixed(2); // ~0.762m per step
  const caloriesBurned = Math.round(stepsNum * 0.04); // ~0.04 kcal per step
  const activeTimeMin = Math.round(stepsNum / 100); // ~100 steps per minute walking

  const formatTime = (mins: number) => {
    if (mins < 60) return `${mins}m`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center md:p-4 bg-base/60 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />
      <motion.div 
        initial={{ opacity: 0, y: "100%" }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.2}
        onDragEnd={(e, { offset, velocity }) => {
          if (offset.y > 100 || velocity.y > 400) {
            onClose();
          }
        }}
        className="relative w-full max-w-sm mt-auto md:mt-0"
        ref={scrollRef}
      >
        <GlassCard intensity="high" className="flex flex-col overflow-hidden shadow-2xl p-6 rounded-t-[32px] md:rounded-[var(--radius-2xl)] rounded-b-none md:rounded-b-[var(--radius-2xl)]">
          {/* Drag Handle (Mobile Only) */}
          <div className="md:hidden w-full flex justify-center pb-4 -mt-2 cursor-grab active:cursor-grabbing">
            <div className="w-12 h-1.5 bg-border rounded-full" />
          </div>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[var(--color-accent-blue)]/10 flex items-center justify-center">
                <Activity size={16} className="text-[var(--color-accent-blue)]" />
              </div>
              <Heading level="h4">Log Daily Steps</Heading>
            </div>
            <button onClick={onClose} className="p-1 rounded-md text-[var(--color-text-muted)] hover:text-primary hover:bg-surface transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <Caption className="mb-1 text-secondary">Total Steps</Caption>
              <input 
                type="number" 
                value={stepsInput} 
                onChange={(e) => setStepsInput(e.target.value)}
                placeholder="0"
                className="w-full bg-base border border-border-subtle rounded-lg text-2xl font-mono py-4 px-4 text-center focus:outline-none focus:border-[var(--color-accent-blue)] transition-colors"
                autoFocus
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="bg-base/50 border border-border-subtle rounded-xl p-3 flex flex-col items-center justify-center text-center">
                <Footprints size={16} className="text-[var(--color-accent-blue)] mb-2" />
                <span className="font-mono text-sm font-bold">{distanceKm}</span>
                <span className="text-[10px] text-[var(--color-text-muted)] uppercase">KM</span>
              </div>
              <div className="bg-base/50 border border-border-subtle rounded-xl p-3 flex flex-col items-center justify-center text-center">
                <Flame size={16} className="text-[var(--color-accent-orange)] mb-2" />
                <span className="font-mono text-sm font-bold">{caloriesBurned}</span>
                <span className="text-[10px] text-[var(--color-text-muted)] uppercase">KCAL</span>
              </div>
              <div className="bg-base/50 border border-border-subtle rounded-xl p-3 flex flex-col items-center justify-center text-center">
                <Timer size={16} className="text-[var(--color-accent-green)] mb-2" />
                <span className="font-mono text-sm font-bold">{formatTime(activeTimeMin)}</span>
                <span className="text-[10px] text-[var(--color-text-muted)] uppercase">ACTIVE</span>
              </div>
            </div>

            <Button 
              variant="primary" 
              fullWidth 
              size="lg" 
              onClick={() => {
                setDailySteps(stepsNum);
                onClose();
              }}
              leftIcon={<Check size={18} />}
            >
              Save Steps
            </Button>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
