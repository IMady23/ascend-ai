import * as React from "react";
import { motion } from "framer-motion";
import { GlassCard } from "../cards/Cards";
import { Heading, BodyText } from "../../typography";
import { Button } from "../../primitives/Button";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  emoji?: string;
  title: string;
  description?: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  className?: string;
}

// 1. Premium Glass Empty State
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  emoji,
  title,
  description,
  primaryAction,
  className = ""
}) => {
  return (
    <GlassCard className={`p-8 md:p-12 flex flex-col items-center justify-center text-center border-dashed border-border-subtle bg-base/20 group relative overflow-hidden ${className}`}>
      {/* Soft Ambient Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 20 }}
        className="flex flex-col items-center max-w-sm mx-auto relative z-10"
      >
        <motion.div 
          className="w-16 h-16 rounded-[24px] bg-white/5 flex items-center justify-center mb-6 shadow-sm border border-white/10 backdrop-blur-md"
          whileHover={{ scale: 1.05, rotate: [-2, 2, 0] }}
          transition={{ type: 'spring' }}
        >
          {emoji ? (
            <span className="text-3xl filter drop-shadow-md">{emoji}</span>
          ) : icon ? (
            <div className="text-[var(--color-text-muted)] w-8 h-8 flex items-center justify-center">
              {icon}
            </div>
          ) : (
            <span className="text-3xl">✨</span>
          )}
        </motion.div>
        
        <Heading level="h4" className="mb-2 text-[var(--color-text-primary)]">{title}</Heading>
        
        {description && (
          <BodyText size="sm" className="text-[var(--color-text-secondary)] mb-6 leading-relaxed">
            {description}
          </BodyText>
        )}
        
        {primaryAction && (
          <Button
            variant="primary"
            onClick={primaryAction.onClick}
            leftIcon={primaryAction.icon}
            className="rounded-[16px] shadow-lg shadow-[var(--color-accent-primary)]/20 hover:shadow-[var(--color-accent-primary)]/40 transition-all"
          >
            {primaryAction.label}
          </Button>
        )}
      </motion.div>
    </GlassCard>
  );
};

// 2. Pre-defined Intentional Empty States
export const MealEmptyState = ({ onAction }: { onAction: () => void }) => (
  <EmptyState emoji="🍎" title="Record your first meal" description="Track your nutrition to hit your goals today." primaryAction={{ label: "Log Meal", onClick: onAction }} />
);

export const HydrationEmptyState = ({ onAction }: { onAction: () => void }) => (
  <EmptyState emoji="💧" title="Start hydration" description="You haven't logged any water today." primaryAction={{ label: "Log Water", onClick: onAction }} />
);

export const WorkoutEmptyState = ({ onAction }: { onAction: () => void }) => (
  <EmptyState emoji="🏋️" title="Complete your workout" description="Your training plan is waiting for you." primaryAction={{ label: "Start Workout", onClick: onAction }} />
);

// 3. Animated Premium Skeleton (Shimmer)
export const Skeleton = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`relative overflow-hidden bg-white/5 rounded-[24px] ${className}`}>
      {/* Animated Shimmer */}
      <motion.div
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
        animate={{ translateX: ['-100%', '200%'] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
      />
    </div>
  );
};
