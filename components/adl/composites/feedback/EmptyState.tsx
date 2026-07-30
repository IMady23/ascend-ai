import * as React from "react";
import { motion } from "framer-motion";
import { GlassCard } from "../cards/Cards";
import { Heading, BodyText } from "../../typography";
import { Button } from "../../primitives/Button";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  emoji?: string;
  title: string;
  description: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  emoji,
  title,
  description,
  primaryAction,
  secondaryAction,
  className = ""
}) => {
  return (
    <GlassCard className={`p-8 md:p-12 flex flex-col items-center justify-center text-center border-dashed border-[var(--color-glass-border)] bg-[var(--color-bg-base)]/50 ${className}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center max-w-md mx-auto"
      >
        <div className="w-16 h-16 rounded-full bg-[var(--color-bg-surface)] flex items-center justify-center mb-6 shadow-sm border border-[var(--color-glass-border)]">
          {emoji ? (
            <span className="text-3xl">{emoji}</span>
          ) : icon ? (
            <div className="text-[var(--color-text-muted)] w-8 h-8 flex items-center justify-center">
              {icon}
            </div>
          ) : (
            <span className="text-3xl">✨</span>
          )}
        </div>
        
        <Heading level="h3" className="mb-3">{title}</Heading>
        
        <BodyText size="md" className="text-[var(--color-text-secondary)] mb-8">
          {description}
        </BodyText>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
          {primaryAction && (
            <Button
              variant="primary"
              onClick={primaryAction.onClick}
              leftIcon={primaryAction.icon}
            >
              {primaryAction.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              variant="secondary"
              onClick={secondaryAction.onClick}
              leftIcon={secondaryAction.icon}
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      </motion.div>
    </GlassCard>
  );
};
