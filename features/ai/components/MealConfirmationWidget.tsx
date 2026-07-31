import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/adl/composites/cards/Cards';
import { Heading, BodyText, Caption } from '@/components/adl/typography';
import { Button } from '@/components/adl/primitives/Button';
import { Check, Edit2, X, Utensils } from 'lucide-react';

interface MealConfirmationWidgetProps {
  toolCall: any;
  onConfirm: (params: any) => void;
  onEdit: () => void;
  onCancel: () => void;
}

export function MealConfirmationWidget({ toolCall, onConfirm, onEdit, onCancel }: MealConfirmationWidgetProps) {
  const params = toolCall.params || {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full max-w-sm my-4"
    >
      <GlassCard className="p-4 border-[var(--color-accent-green)]/30 bg-gradient-to-br from-[var(--color-accent-green)]/10 to-transparent">
        <div className="flex items-center gap-2 mb-3">
          <Utensils size={18} className="text-[var(--color-accent-green)]" />
          <Heading level="h4" className="text-sm font-semibold">Confirm Meal Log</Heading>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex justify-between items-center border-b border-border-subtle pb-1">
            <Caption className="text-[var(--color-text-muted)]">Parsed Food</Caption>
            <BodyText size="sm" className="font-medium">{params.description || 'Quick log'}</BodyText>
          </div>
          <div className="flex justify-between items-center border-b border-border-subtle pb-1">
            <Caption className="text-[var(--color-text-muted)]">Calories</Caption>
            <BodyText size="sm" className="font-bold text-[var(--color-accent-green)]">{params.calories} kcal</BodyText>
          </div>
          <div className="flex justify-between items-center border-b border-border-subtle pb-1">
            <Caption className="text-[var(--color-text-muted)]">Protein</Caption>
            <BodyText size="sm">{params.protein || 0}g</BodyText>
          </div>
          <div className="flex justify-between items-center border-b border-border-subtle pb-1">
            <Caption className="text-[var(--color-text-muted)]">Carbs</Caption>
            <BodyText size="sm">{params.carbs || 0}g</BodyText>
          </div>
          <div className="flex justify-between items-center border-b border-border-subtle pb-1">
            <Caption className="text-[var(--color-text-muted)]">Fat</Caption>
            <BodyText size="sm">{params.fat || 0}g</BodyText>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={() => onConfirm(params)} size="sm" className="flex-1 bg-[var(--color-accent-green)] hover:bg-[var(--color-accent-green)]/90 text-black">
            <Check size={14} className="mr-1" /> Confirm
          </Button>
          <Button onClick={onEdit} variant="secondary" size="sm" className="flex-1">
            <Edit2 size={14} className="mr-1" /> Edit
          </Button>
          <Button onClick={onCancel} variant="ghost" size="sm" className="px-2 text-[var(--color-text-muted)] hover:text-primary">
            <X size={16} />
          </Button>
        </div>
      </GlassCard>
    </motion.div>
  );
}
