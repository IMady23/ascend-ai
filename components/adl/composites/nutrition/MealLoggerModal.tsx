"use client";

import * as React from "react";
import { X, Search, Plus, Star, Check } from "lucide-react";
import { Heading, BodyText, Caption } from "@/components/adl/typography";
import { Button } from "@/components/adl/primitives/Button";
import { useNutritionStore } from "@/stores/nutrition.store";

import type { FoodItem, MealType } from "@/types/nutrition";
import { motion, AnimatePresence } from "framer-motion";
import { FoodRepository } from "@/services/repositories/food.repository";
import { CustomFoodModal } from "./CustomFoodModal";
import { calculateMacrosForServing } from "@/lib/nutrition/calculator";

interface MealLoggerModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMealType?: MealType;
  mealToEdit?: any;
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
          return { ...f, ...calc, localId };
        }
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
    const totalProtein  = selectedFoods.reduce((sum, f) => sum + f.protein, 0);
    const totalCarbs    = selectedFoods.reduce((sum, f) => sum + f.carbs, 0);
    const totalFat      = selectedFoods.reduce((sum, f) => sum + f.fat, 0);
    const totalSugar    = selectedFoods.reduce((sum, f) => sum + (f.sugar || 0), 0);

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
        updatedAt: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 } as any,
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
        timestamp: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 } as any,
      } as any);
    }

    setIsSubmitting(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center md:p-4 bg-black/60 backdrop-blur-sm">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Custom Food sub-modal */}
      <AnimatePresence>
        {isCustomFoodModalOpen && (
          <CustomFoodModal
            isOpen={isCustomFoodModalOpen}
            onClose={() => setIsCustomFoodModalOpen(false)}
            initialQuery={searchQuery}
            onFoodCreated={(newFood) => { handleAddFood(newFood); }}
          />
        )}
      </AnimatePresence>

      {/*
       * ARCHITECTURE NOTE — why a plain div, not GlassCard:
       * GlassCard has `overflow-hidden` hardcoded in its `glass-premium` base
       * class. That clips every child including the footer, so the Save button
       * is always hidden regardless of flex/height tricks on the children.
       * Solution: use a plain div shell with identical visual styling but
       * without overflow-hidden, so we control overflow ourselves.
       *
       * Layout is three independent layers via inline flex-column:
       *   1. shrink-0  header  — never scrolls
       *   2. flex:1    body    — scrolls, has a visible thin scrollbar
       *   3. shrink-0  footer  — never scrolls, Save button always visible
       */}
      <motion.div
        initial={{ opacity: 0, y: "100%" }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.2}
        onDragEnd={(_, { offset, velocity }) => {
          if (offset.y > 150 || velocity.y > 500) onClose();
        }}
        className="relative z-10 w-full max-w-2xl mt-auto md:mt-0 rounded-t-[32px] md:rounded-[var(--radius-2xl)] rounded-b-none md:rounded-b-[var(--radius-2xl)] border border-white/10 shadow-2xl"
        style={{
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          background: "rgba(10, 13, 20, 0.97)",
          backdropFilter: "blur(24px)",
        }}
      >
        {/* ── Drag Handle (mobile only) ── */}
        <div style={{ flexShrink: 0 }} className="md:hidden w-full flex justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing">
          <div className="w-12 h-1.5 rounded-full bg-white/20" />
        </div>

        {/* ── HEADER — fixed, never scrolls ── */}
        <div style={{ flexShrink: 0 }} className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Heading level="h3">Log Meal</Heading>
            <div className="flex bg-white/5 border border-white/10 rounded-full p-1">
              <button
                onClick={() => setMode("quick")}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${mode === "quick" ? "bg-[var(--color-accent-blue)] text-white" : "text-[var(--color-text-muted)] hover:text-white"}`}
              >Quick</button>
              <button
                onClick={() => setMode("detailed")}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${mode === "detailed" ? "bg-[var(--color-accent-blue)] text-white" : "text-[var(--color-text-muted)] hover:text-white"}`}
              >Detailed</button>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-[var(--color-text-muted)] hover:text-white rounded-full hover:bg-white/10 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* ── SCROLLABLE BODY — takes all remaining space ── */}
        <div
          style={{
            flex: "1 1 0%",
            overflowY: "auto",
            /* Visible thin scrollbar track */
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(255,255,255,0.2) rgba(255,255,255,0.05)",
          }}
          className="p-4 space-y-5"
        >
          {/* Meal Type Pills */}
          <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
            {(["breakfast", "morning_snack", "lunch", "evening_snack", "dinner", "drinks"] as MealType[]).map(t => (
              <button
                key={t}
                onClick={() => setMealType(t)}
                className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium border transition-colors ${mealType === t
                  ? "bg-[var(--color-accent-green)]/10 border-[var(--color-accent-green)] text-[var(--color-accent-green)]"
                  : "border-white/10 bg-white/5 text-[var(--color-text-muted)] hover:border-white/25"}`}
              >
                {t.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
              </button>
            ))}
          </div>

          {/* Detailed Mode */}
          {mode === "detailed" && (
            <div className="space-y-4 p-4 bg-white/5 rounded-[var(--radius-lg)] border border-white/10">
              <div>
                <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1 uppercase tracking-wider">Meal Name (Optional)</label>
                <input
                  type="text" value={mealName}
                  onChange={(e) => setMealName(e.target.value)}
                  placeholder="e.g. Post-workout refuel"
                  className="w-full bg-black/30 border border-white/10 rounded-[var(--radius-md)] px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent-blue)] transition-colors text-white placeholder:text-white/30"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1 uppercase tracking-wider">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="How did you feel? Any substitutions?"
                  rows={2}
                  className="w-full bg-black/30 border border-white/10 rounded-[var(--radius-md)] px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-accent-blue)] transition-colors text-white placeholder:text-white/30"
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
              type="text" value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search foods or brands..."
              className="w-full bg-white/5 border border-white/10 rounded-[var(--radius-lg)] pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-[var(--color-accent-blue)] transition-colors text-white placeholder:text-white/30"
            />
          </div>

          {/* Selected Foods */}
          {selectedFoods.length > 0 && (
            <div className="space-y-2">
              <Heading level="h5" className="text-sm text-[var(--color-text-muted)]">Selected Items</Heading>
              <div className="space-y-2">
                {selectedFoods.map(food => (
                  <div key={food.localId} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-white/5 rounded-[var(--radius-md)] border border-[var(--color-accent-blue)]/30 gap-3">
                    <div className="flex-1">
                      <BodyText size="sm" className="font-medium text-white">{food.name}</BodyText>
                      <div className="flex items-center gap-3 mt-1">
                        <Caption className="text-[var(--color-text-muted)]">{food.calories} kcal</Caption>
                        <Caption className="text-[var(--color-text-muted)]">P: {food.protein}g</Caption>
                        <Caption className="text-[var(--color-text-muted)]">C: {food.carbs}g</Caption>
                        <Caption className="text-[var(--color-text-muted)]">F: {food.fat}g</Caption>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2 sm:mt-0">
                      <input
                        type="number" value={food.quantity}
                        onChange={(e) => handleUpdateServing(food.localId, Number(e.target.value), food.servingSize)}
                        className="w-16 bg-black/40 border border-white/10 rounded px-2 py-1 text-sm text-center text-white"
                        min="0.1" step="0.1"
                      />
                      {(food as any).predefinedServings ? (
                        <select
                          value={food.servingSize}
                          onChange={(e) => handleUpdateServing(food.localId, food.quantity, e.target.value)}
                          className="bg-black/40 border border-white/10 rounded px-2 py-1 text-sm text-[var(--color-text-muted)] focus:outline-none"
                        >
                          {(food as any).predefinedServings.map((s: any) => (
                            <option key={s.unit} value={s.unit}>{s.label}</option>
                          ))}
                          <option value="Custom">Custom</option>
                        </select>
                      ) : (
                        <Caption className="text-[var(--color-text-muted)] w-10">{food.servingSize.split(" ")[0]}</Caption>
                      )}
                      <button onClick={() => handleRemoveFood(food.localId)} className="p-1.5 text-red-400 hover:bg-red-400/10 rounded-full transition-colors ml-1">
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Search Results / Suggestions */}
          <div className="space-y-2">
            <Heading level="h5" className="text-sm text-[var(--color-text-muted)]">
              {searchQuery ? "Results" : "Suggested"}
            </Heading>
            {searchResults.length === 0 ? (
              <div className="p-6 text-center border border-dashed border-white/10 rounded-[var(--radius-lg)]">
                <BodyText className="text-[var(--color-text-muted)] mb-3">
                  {searchQuery ? `No foods matched "${searchQuery}".` : "No foods found."}
                </BodyText>
                <Button variant="secondary" size="sm" onClick={() => setIsCustomFoodModalOpen(true)} leftIcon={<Plus size={16} />}>
                  Create {searchQuery ? `"${searchQuery}"` : "Custom Food"}
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2">
                {searchResults.map((food, i) => (
                  <button
                    key={i} onClick={() => handleAddFood(food)}
                    className="flex items-center justify-between p-3 bg-white/3 rounded-[var(--radius-md)] border border-white/10 hover:border-[var(--color-accent-blue)] hover:bg-[var(--color-accent-blue)]/5 transition-colors text-left group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <BodyText size="sm" className="font-medium text-white group-hover:text-[var(--color-accent-blue)] transition-colors">{food.name}</BodyText>
                        {favoriteFoods.some(f => f.name === food.name) && <Star size={12} className="text-yellow-400 fill-yellow-400" />}
                      </div>
                      <Caption className="text-[var(--color-text-muted)] mt-0.5">
                        {food.quantity}{food.servingSize} • {food.calories} kcal • {food.protein}g P
                      </Caption>
                    </div>
                    <Plus size={18} className="text-[var(--color-text-muted)] group-hover:text-[var(--color-accent-blue)] transition-colors shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Spacer so last item isn't flush against the footer */}
          <div className="h-2" />
        </div>

        {/* ── FOOTER — ALWAYS VISIBLE, lives outside the scroll container ── */}
        <div
          style={{ flexShrink: 0, borderTop: "1px solid rgba(255,255,255,0.1)", background: "rgba(10,13,20,0.98)" }}
          className="px-4 py-3 flex items-center justify-between gap-3"
        >
          <div>
            {selectedFoods.length > 0 && (
              <div className="flex items-center gap-4">
                <Heading level="h4" className="text-[var(--color-accent-green)]">
                  {selectedFoods.reduce((s, f) => s + f.calories, 0)} kcal
                </Heading>
                <Caption className="text-[var(--color-text-muted)]">
                  P: {selectedFoods.reduce((s, f) => s + f.protein, 0).toFixed(1)}g
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
              {isSubmitting ? "Saving..." : mealToEdit ? "Update Meal" : "Log Meal"}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
