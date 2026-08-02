"use client";

import * as React from "react";
import { X, Search, Plus, Star, Clock, Info, Check } from "lucide-react";
import { GlassCard } from "@/components/adl/composites/cards/Cards";
import { Heading, BodyText, Caption } from "@/components/adl/typography";
import { Button } from "@/components/adl/primitives/Button";
import { Badge } from "@/components/adl/primitives/Badge";
import { useNutritionStore } from "@/stores/nutrition.store";

import type { FoodItem, MealType } from "@/types/nutrition";
import { motion, AnimatePresence } from "framer-motion";
import { FoodRepository } from "@/services/repositories/food.repository";
import { CustomFoodModal } from "./CustomFoodModal";
import { calculateMacrosForServing } from "@/lib/nutrition/calculator";
import { useScrollIntoViewIfNeeded } from "@/hooks/useScrollIntoViewIfNeeded";

interface MealLoggerModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMealType?: MealType;
  mealToEdit?: any; // any to accept NutritionLog type easily
}

export function MealLoggerModal({ isOpen, onClose, defaultMealType = "lunch", mealToEdit }: MealLoggerModalProps) {
  const { addMeal, updateMeal, favoriteFoods, recentFoods, customFoods } = useNutritionStore();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedFoods, setSelectedFoods] = React.useState<(FoodItem & { localId: string })[]>([]);
  const [mealType, setMealType] = React.useState<MealType>(defaultMealType);
  const [mode, setMode] = React.useState<"quick" | "detailed">("quick");
  const [mealName, setMealName] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isCustomFoodModalOpen, setIsCustomFoodModalOpen] = React.useState(false);
  const scrollRef = useScrollIntoViewIfNeeded<HTMLDivElement>(isOpen, {
    alignment: "nearest",
    offset: 64,
    focusFirstInput: false,
  });

  // Reset state when opened
  React.useEffect(() => {
    if (isOpen) {
      if (mealToEdit) {
        setSearchQuery("");
        setSelectedFoods(
          mealToEdit.foods?.map((f: any) => ({
            ...f,
            localId: crypto.randomUUID(),
          })) || []
        );
        setMealType(mealToEdit.mealType);
        setMode(mealToEdit.name || mealToEdit.notes ? "detailed" : "quick");
        setMealName(mealToEdit.name || "");
        setNotes(mealToEdit.notes || "");
      } else {
        setSearchQuery("");
        setSelectedFoods([]);
        setMealType(defaultMealType);
        setMode("quick");
        setMealName("");
        setNotes("");
      }
    }
  }, [isOpen, defaultMealType, mealToEdit]);

  const searchResults = React.useMemo(() => {
    return FoodRepository.searchFoods(searchQuery, customFoods, recentFoods);
  }, [searchQuery, customFoods, recentFoods]);

  const handleAddFood = (food: Omit<FoodItem, "id" | "source">) => {
    setSelectedFoods(prev => [
      ...prev,
      {
        ...food,
        id: `food-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        localId: crypto.randomUUID(),
        source: "database",
      }
    ]);
    setSearchQuery("");
  };

  const handleRemoveFood = (localId: string) => {
    setSelectedFoods(prev => prev.filter(f => f.localId !== localId));
  };

  const handleUpdateServing = (localId: string, quantity: number, unit: string) => {
    setSelectedFoods(prev => prev.map(f => {
      if (f.localId === localId) {
        if (f.source === "database" && (f as any).predefinedServings) {
           const calc = calculateMacrosForServing(f as any, quantity, unit);
           return {
             ...f,
             ...calc,
             localId
           };
        }
        
        // Fallback for custom foods without predefined servings
        const ratio = quantity / ((f as any).baseServingQuantity || 1);
        return {
          ...f,
          quantity,
          servingSize: unit,
          calories: Math.round((f.calories / f.quantity) * quantity),
          protein: Number(((f.protein / f.quantity) * quantity).toFixed(1)),
          carbs: Number(((f.carbs / f.quantity) * quantity).toFixed(1)),
          fat: Number(((f.fat / f.quantity) * quantity).toFixed(1)),
        };
      }
      return f;
    }));
  };

  const handleSaveMeal = async () => {
    if (selectedFoods.length === 0) return;
    setIsSubmitting(true);
    
    const totalCalories = selectedFoods.reduce((sum, f) => sum + f.calories, 0);
    const totalProtein = selectedFoods.reduce((sum, f) => sum + f.protein, 0);
    const totalCarbs = selectedFoods.reduce((sum, f) => sum + f.carbs, 0);
    const totalFat = selectedFoods.reduce((sum, f) => sum + f.fat, 0);
    const totalSugar = selectedFoods.reduce((sum, f) => sum + (f.sugar || 0), 0);

    if (mealToEdit) {
      await updateMeal(mealToEdit.id, {
        mealType,
        name: mealName || undefined,
        foods: selectedFoods.map(({ localId, ...food }) => food),
        calories: totalCalories,
        protein: totalProtein,
        carbs: totalCarbs,
        fat: totalFat,
        sugar: totalSugar || undefined,
        notes: notes || undefined,
        updatedAt: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 } as any
      } as any);
    } else {
      const nowStr = new Date().toISOString().split("T")[0]; 
      
      await addMeal({
        mealType,
        name: mealName || undefined,
        foods: selectedFoods.map(({ localId, ...food }) => food),
        calories: totalCalories,
        protein: totalProtein,
        carbs: totalCarbs,
        fat: totalFat,
        sugar: totalSugar || undefined,
        notes: notes || undefined,
        date: nowStr,
        timestamp: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 } as any
      } as any);
    }
    
    setIsSubmitting(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center md:p-4 bg-base/60 backdrop-blur-sm">
      {/* Click outside to close (desktop) / Tap background (mobile) */}
      <div className="absolute inset-0" onClick={onClose} />
      <AnimatePresence>
        {isCustomFoodModalOpen && (
          <CustomFoodModal 
            isOpen={isCustomFoodModalOpen}
            onClose={() => setIsCustomFoodModalOpen(false)}
            initialQuery={searchQuery}
            onFoodCreated={(newFood) => {
              handleAddFood(newFood);
            }}
          />
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, y: "100%" }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.2}
        onDragEnd={(e, { offset, velocity }) => {
          if (offset.y > 150 || velocity.y > 500) {
            onClose();
          }
        }}
        className="relative w-full max-w-2xl h-[95vh] md:h-auto md:max-h-[90vh] flex flex-col mt-auto md:mt-0"
        ref={scrollRef}
      >
        <GlassCard className="flex flex-col flex-1 overflow-hidden border border-border-subtle bg-base/95 shadow-2xl rounded-t-[32px] md:rounded-[var(--radius-2xl)] rounded-b-none md:rounded-b-[var(--radius-2xl)]">
          {/* Drag Handle (Mobile Only) */}
          <div className="md:hidden w-full flex justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing">
            <div className="w-12 h-1.5 bg-border rounded-full" />
          </div>
          
          {/* Header */}
          <div className="p-4 border-b border-border-subtle flex items-center justify-between z-10">
            <div className="flex items-center gap-4">
              <Heading level="h3">Log Meal</Heading>
              <div className="flex bg-surface rounded-[var(--radius-full)] p-1">
                <button 
                  onClick={() => setMode("quick")}
                  className={`px-3 py-1 rounded-[var(--radius-full)] text-sm font-medium transition-colors ${mode === "quick" ? 'bg-[var(--color-accent-blue)] text-primary' : 'text-[var(--color-text-muted)] hover:text-primary'}`}
                >
                  Quick
                </button>
                <button 
                  onClick={() => setMode("detailed")}
                  className={`px-3 py-1 rounded-[var(--radius-full)] text-sm font-medium transition-colors ${mode === "detailed" ? 'bg-[var(--color-accent-blue)] text-primary' : 'text-[var(--color-text-muted)] hover:text-primary'}`}
                >
                  Detailed
                </button>
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-[var(--color-text-muted)] hover:text-primary rounded-full hover:bg-surface transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            
            {/* Meal Type Selection */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {(["breakfast", "morning_snack", "lunch", "evening_snack", "dinner", "drinks"] as MealType[]).map(t => (
                <button 
                  key={t}
                  onClick={() => setMealType(t)}
                  className={`px-4 py-2 rounded-[var(--radius-full)] whitespace-nowrap text-sm font-medium border transition-colors ${mealType === t ? 'bg-[var(--color-accent-green)]/10 border-[var(--color-accent-green)] text-[var(--color-accent-green)]' : 'border-border-subtle bg-surface text-secondary hover:border-[var(--color-text-muted)]'}`}
                >
                  {t.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
                </button>
              ))}
            </div>

            {/* Detailed Mode Extras */}
            {mode === "detailed" && (
              <div className="space-y-4 p-4 bg-surface rounded-[var(--radius-lg)] border border-border-subtle">
                <div>
                  <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1 uppercase tracking-wider">Meal Name (Optional)</label>
                  <input 
                    type="text" 
                    value={mealName}
                    onChange={(e) => setMealName(e.target.value)}
                    placeholder="e.g. Post-workout refuel"
                    className="w-full bg-base border border-border-subtle rounded-[var(--radius-md)] px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent-blue)] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1 uppercase tracking-wider">Notes</label>
                  <textarea 
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="How did you feel? Any substitutions?"
                    rows={2}
                    className="w-full bg-base border border-border-subtle rounded-[var(--radius-md)] px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent-blue)] transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Search Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-[var(--color-text-muted)]" />
              </div>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search foods or brands..."
                className="w-full bg-surface border border-border-subtle rounded-[var(--radius-lg)] pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-[var(--color-accent-blue)] transition-colors"
              />
            </div>

            {/* Selected Foods */}
            {selectedFoods.length > 0 && (
              <div className="space-y-2">
                <Heading level="h5" className="text-sm text-secondary">Selected Items</Heading>
                <div className="space-y-2">
                  {selectedFoods.map(food => (
                    <div key={food.localId} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-surface rounded-[var(--radius-md)] border border-[var(--color-accent-blue)]/30 gap-3">
                      <div className="flex-1">
                        <BodyText size="sm" className="font-medium">{food.name}</BodyText>
                        <div className="flex items-center gap-3 mt-1">
                          <Caption className="text-[var(--color-text-muted)]">{food.calories} kcal</Caption>
                          <Caption className="text-[var(--color-text-muted)]">P: {food.protein}g</Caption>
                          <Caption className="text-[var(--color-text-muted)]">C: {food.carbs}g</Caption>
                          <Caption className="text-[var(--color-text-muted)]">F: {food.fat}g</Caption>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2 sm:mt-0">
                        <input 
                          type="number"
                          value={food.quantity}
                          onChange={(e) => handleUpdateServing(food.localId, Number(e.target.value), food.servingSize)}
                          className="w-16 bg-base border border-border-subtle rounded px-2 py-1 text-sm text-center"
                          min="0.1"
                          step="0.1"
                        />
                        {(food as any).predefinedServings ? (
                          <select
                            value={food.servingSize}
                            onChange={(e) => handleUpdateServing(food.localId, food.quantity, e.target.value)}
                            className="bg-base border border-border-subtle rounded px-2 py-1 text-sm text-[var(--color-text-muted)] focus:outline-none"
                          >
                            {(food as any).predefinedServings.map((s: any) => (
                              <option key={s.unit} value={s.unit}>{s.label}</option>
                            ))}
                            <option value="Custom">Custom</option>
                          </select>
                        ) : (
                          <Caption className="text-[var(--color-text-muted)] w-10">{food.servingSize.split(" ")[0]}</Caption>
                        )}
                        <button onClick={() => handleRemoveFood(food.localId)} className="p-1.5 text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10 rounded-full transition-colors ml-1">
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Search Results */}
            <div className="space-y-2">
              <Heading level="h5" className="text-sm text-secondary">
                {searchQuery ? "Results" : "Suggested"}
              </Heading>
              
              {searchResults.length === 0 ? (
                <div className="p-6 text-center border border-dashed border-border-subtle rounded-[var(--radius-lg)]">
                  <BodyText className="text-[var(--color-text-muted)] mb-3">
                    {searchQuery ? `No foods matched "${searchQuery}".` : "No foods found."}
                  </BodyText>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    onClick={() => setIsCustomFoodModalOpen(true)}
                    leftIcon={<Plus size={16} />}
                  >
                    Create {searchQuery ? `"${searchQuery}"` : "Custom Food"}
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-2">
                  {searchResults.map((food, i) => (
                    <button 
                      key={i}
                      onClick={() => handleAddFood(food)}
                      className="flex items-center justify-between p-3 bg-base rounded-[var(--radius-md)] border border-border-subtle hover:border-[var(--color-accent-blue)] transition-colors text-left group"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <BodyText size="sm" className="font-medium group-hover:text-[var(--color-accent-blue)] transition-colors">{food.name}</BodyText>
                          {favoriteFoods.some(f => f.name === food.name) && <Star size={12} className="text-[var(--color-accent-gold)] fill-[var(--color-accent-gold)]" />}
                        </div>
                        <Caption className="text-[var(--color-text-muted)] mt-0.5">
                          {food.quantity}{food.servingSize} • {food.calories} kcal • {food.protein}g P
                        </Caption>
                      </div>
                      <Plus size={18} className="text-[var(--color-text-muted)] group-hover:text-[var(--color-accent-blue)] transition-colors" />
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border-subtle bg-surface/50 flex items-center justify-between">
            <div>
              {selectedFoods.length > 0 && (
                <div className="flex items-center gap-4">
                  <Heading level="h4" className="text-[var(--color-accent-green)]">
                    {selectedFoods.reduce((s,f) => s + f.calories, 0)} kcal
                  </Heading>
                  <Caption className="text-[var(--color-text-muted)]">
                    P: {selectedFoods.reduce((s,f) => s + f.protein, 0).toFixed(1)}g
                  </Caption>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" onClick={onClose}>Cancel</Button>
              <Button 
                variant="primary" 
                onClick={handleSaveMeal}
                disabled={selectedFoods.length === 0 || isSubmitting}
                leftIcon={<Check size={16} />}
              >
                {mealToEdit ? "Update Meal" : "Log Meal"}
              </Button>
            </div>
          </div>
          
        </GlassCard>
      </motion.div>
    </div>
  );
}
