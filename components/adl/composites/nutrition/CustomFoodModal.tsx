"use client";

import * as React from "react";
import { X, Check } from "lucide-react";
import { GlassCard } from "@/components/adl/composites/cards/Cards";
import { Heading, BodyText } from "@/components/adl/typography";
import { Button } from "@/components/adl/primitives/Button";
import { useNutritionStore } from "@/stores/nutrition.store";
import type { FoodItem } from "@/types/nutrition";
import { motion } from "framer-motion";
import { useScrollIntoViewIfNeeded } from "@/hooks/useScrollIntoViewIfNeeded";

interface CustomFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
  onFoodCreated?: (food: FoodItem) => void;
}

export function CustomFoodModal({ isOpen, onClose, initialQuery = "", onFoodCreated }: CustomFoodModalProps) {
  const { addCustomFood } = useNutritionStore();

  const [name, setName] = React.useState(initialQuery);
  const [servingSize, setServingSize] = React.useState("g");
  const [quantity, setQuantity] = React.useState("100");
  const [calories, setCalories] = React.useState("");
  const [protein, setProtein] = React.useState("");
  const [carbs, setCarbs] = React.useState("");
  const [fat, setFat] = React.useState("");
  const [fiber, setFiber] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const scrollRef = useScrollIntoViewIfNeeded<HTMLDivElement>(isOpen, {
    alignment: "nearest",
    offset: 64,
    focusFirstInput: false,
  });

  React.useEffect(() => {
    if (isOpen) {
      setName(initialQuery);
      setServingSize("g");
      setQuantity("100");
      setCalories("");
      setProtein("");
      setCarbs("");
      setFat("");
      setFiber("");
    }
  }, [isOpen, initialQuery]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !calories || !protein || !carbs || !fat || !quantity) return;

    setIsSubmitting(true);
    try {
      const newFood = await addCustomFood({
        name: name.trim(),
        servingSize,
        quantity: Number(quantity),
        calories: Number(calories),
        protein: Number(protein),
        carbs: Number(carbs),
        fat: Number(fat),
        fiber: fiber ? Number(fiber) : undefined
      });

      if (onFoodCreated) {
        onFoodCreated(newFood);
      }
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-base/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-lg"
        ref={scrollRef}
      >
        <GlassCard className="flex flex-col overflow-hidden border border-border-subtle bg-base/95 shadow-2xl">
          
          <div className="p-4 border-b border-border-subtle flex items-center justify-between">
            <Heading level="h3">Add Custom Food</Heading>
            <button onClick={onClose} className="p-2 text-[var(--color-text-muted)] hover:text-primary rounded-full hover:bg-surface transition-colors">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSave} className="p-6 space-y-4">
            
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1 uppercase tracking-wider">Food Name *</label>
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Chicken Curry"
                className="w-full bg-surface border border-border-subtle rounded-[var(--radius-md)] px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent-blue)] transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1 uppercase tracking-wider">Quantity *</label>
                <input 
                  type="number" 
                  required
                  min="0"
                  step="0.1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="e.g. 100"
                  className="w-full bg-surface border border-border-subtle rounded-[var(--radius-md)] px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent-blue)] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1 uppercase tracking-wider">Unit *</label>
                <input 
                  type="text" 
                  required
                  value={servingSize}
                  onChange={(e) => setServingSize(e.target.value)}
                  placeholder="e.g. g, cup, oz"
                  className="w-full bg-surface border border-border-subtle rounded-[var(--radius-md)] px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent-blue)] transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              <div>
                <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1 uppercase tracking-wider">Calories *</label>
                <input 
                  type="number" 
                  required
                  min="0"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  className="w-full bg-surface border border-border-subtle rounded-[var(--radius-md)] px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent-blue)] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1 uppercase tracking-wider">Protein (g) *</label>
                <input 
                  type="number" 
                  required
                  min="0"
                  step="0.1"
                  value={protein}
                  onChange={(e) => setProtein(e.target.value)}
                  className="w-full bg-surface border border-border-subtle rounded-[var(--radius-md)] px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent-blue)] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1 uppercase tracking-wider">Carbs (g) *</label>
                <input 
                  type="number" 
                  required
                  min="0"
                  step="0.1"
                  value={carbs}
                  onChange={(e) => setCarbs(e.target.value)}
                  className="w-full bg-surface border border-border-subtle rounded-[var(--radius-md)] px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent-blue)] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1 uppercase tracking-wider">Fat (g) *</label>
                <input 
                  type="number" 
                  required
                  min="0"
                  step="0.1"
                  value={fat}
                  onChange={(e) => setFat(e.target.value)}
                  className="w-full bg-surface border border-border-subtle rounded-[var(--radius-md)] px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent-blue)] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1 uppercase tracking-wider">Fiber (g) - Optional</label>
              <input 
                type="number" 
                min="0"
                step="0.1"
                value={fiber}
                onChange={(e) => setFiber(e.target.value)}
                className="w-full sm:w-1/4 bg-surface border border-border-subtle rounded-[var(--radius-md)] px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent-blue)] transition-colors"
              />
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
              <Button 
                type="submit" 
                variant="primary" 
                disabled={isSubmitting}
                leftIcon={<Check size={16} />}
              >
                Save & Add
              </Button>
            </div>

          </form>
          
        </GlassCard>
      </motion.div>
    </div>
  );
}
