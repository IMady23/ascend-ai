"use client";

import * as React from "react";
import { GlassCard } from "../cards/Cards";
import { Heading, BodyText, Caption } from "../../typography";
import { Button } from "../../primitives/Button";
import { 
  Check, 
  Flame, 
  Utensils, 
  Activity, 
  Plus, 
  Edit3, 
  RefreshCw, 
  Info,
  Droplet
} from "lucide-react";
import { FoodItem } from "@/types/nutrition";
import { InteractiveWidgetWrapper } from "./InteractiveWidgetWrapper";

export interface NutritionSuggestionCardProps {
  data: {
    foods: FoodItem[];
    nutritionalBreakdown: {
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
      fiber: number;
      sugar: number;
    };
    mealQualityScore: number;
    goalAlignment: string;
    reasoning: string;
    confidence: string;
  };
  onLogMeal?: (mealType: string) => void;
  onEdit?: () => void;
  onRegenerate?: () => void;
}

export function NutritionSuggestionCard({ data, onLogMeal, onEdit, onRegenerate }: NutritionSuggestionCardProps) {
  const [showLogOptions, setShowLogOptions] = React.useState(false);

  const scoreColor = data.mealQualityScore >= 80 ? "text-success border-success/30" : 
                     data.mealQualityScore >= 60 ? "text-warning border-warning/30" : 
                     "text-destructive border-destructive/30";

  return (
    <InteractiveWidgetWrapper>
      <GlassCard className="p-0 overflow-hidden border-accent-ai/20 shadow-lg shadow-accent-ai/5 bg-bg-surface">
        {/* Header - Quality Score and Goal Alignment */}
        <div className="p-4 border-b border-border/50 bg-accent-ai/5 flex items-start gap-4">
          <div className={`flex flex-col items-center justify-center w-14 h-14 rounded-full border-2 bg-bg-base shrink-0 ${scoreColor}`}>
            <span className="text-lg font-bold">{data.mealQualityScore}</span>
          </div>
          <div className="flex-1">
            <Heading level="h4" className="text-base flex items-center gap-2">
              <Activity size={16} className="text-accent-ai" />
              Meal Suggestion
            </Heading>
            <Caption className="text-text-secondary mt-1">{data.goalAlignment}</Caption>
          </div>
        </div>

        {/* Food List */}
        <div className="p-4 space-y-3">
          <Caption className="text-text-disabled uppercase tracking-wider font-semibold">Suggested Foods</Caption>
          <div className="space-y-2">
            {data.foods.map((food, idx) => (
              <div key={idx} className="flex justify-between items-center bg-bg-base/50 p-2 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-md bg-accent-ai/10 text-accent-ai">
                    <Utensils size={14} />
                  </div>
                  <div>
                    <BodyText size="sm" className="font-semibold">{food.name}</BodyText>
                    <Caption className="text-text-tertiary text-xs">
                      {food.quantity} {food.servingSize}
                      {food.source === "ai" && <span className="ml-2 text-warning italic">(Estimated)</span>}
                    </Caption>
                  </div>
                </div>
                <div className="text-right">
                  <BodyText size="sm" className="font-semibold">{food.calories} kcal</BodyText>
                  <Caption className="text-text-tertiary text-[10px]">
                    {food.protein}g P
                  </Caption>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Macros Breakdown */}
        <div className="px-4 pb-4">
           <div className="bg-bg-base rounded-xl p-3 grid grid-cols-4 gap-2">
              <div className="text-center">
                 <div className="flex justify-center mb-1"><Flame size={14} className="text-orange-500"/></div>
                 <BodyText size="sm" className="font-bold">{data.nutritionalBreakdown.calories}</BodyText>
                 <Caption className="text-[9px] text-text-tertiary uppercase">Kcal</Caption>
              </div>
              <div className="text-center border-l border-border/50">
                 <div className="flex justify-center mb-1"><div className="w-3 h-3 rounded-sm bg-blue-500/20 border border-blue-500/50" /></div>
                 <BodyText size="sm" className="font-bold">{data.nutritionalBreakdown.protein}g</BodyText>
                 <Caption className="text-[9px] text-text-tertiary uppercase">Protein</Caption>
              </div>
              <div className="text-center border-l border-border/50">
                 <div className="flex justify-center mb-1"><div className="w-3 h-3 rounded-sm bg-green-500/20 border border-green-500/50" /></div>
                 <BodyText size="sm" className="font-bold">{data.nutritionalBreakdown.carbs}g</BodyText>
                 <Caption className="text-[9px] text-text-tertiary uppercase">Carbs</Caption>
              </div>
              <div className="text-center border-l border-border/50">
                 <div className="flex justify-center mb-1"><Droplet size={14} className="text-yellow-500"/></div>
                 <BodyText size="sm" className="font-bold">{data.nutritionalBreakdown.fat}g</BodyText>
                 <Caption className="text-[9px] text-text-tertiary uppercase">Fat</Caption>
              </div>
           </div>
        </div>

        {/* Reasoning (AI Explanation) */}
        <div className="px-4 pb-4">
           <div className="bg-accent-ai/5 rounded-lg p-3 flex gap-2 items-start border border-accent-ai/10">
              <Info size={14} className="text-accent-ai shrink-0 mt-0.5" />
              <Caption className="text-text-secondary leading-snug">{data.reasoning}</Caption>
           </div>
        </div>

        {/* Actions Footer */}
        <div className="p-3 border-t border-border/50 bg-bg-surface-elevated flex flex-col gap-2">
          {showLogOptions ? (
             <div className="animate-in slide-in-from-bottom-2 duration-200">
               <Caption className="text-text-secondary text-center mb-2">Log to which meal?</Caption>
               <div className="grid grid-cols-2 gap-2">
                  <Button variant="secondary" size="sm" onClick={() => onLogMeal?.("breakfast")}>Breakfast</Button>
                  <Button variant="secondary" size="sm" onClick={() => onLogMeal?.("lunch")}>Lunch</Button>
                  <Button variant="secondary" size="sm" onClick={() => onLogMeal?.("dinner")}>Dinner</Button>
                  <Button variant="secondary" size="sm" onClick={() => onLogMeal?.("snack")}>Snack</Button>
                  <Button variant="ghost" size="sm" className="col-span-2 text-text-tertiary" onClick={() => setShowLogOptions(false)}>Cancel</Button>
               </div>
             </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="primary" 
                size="sm" 
                className="col-span-2 bg-accent-ai hover:bg-accent-ai/90 text-primary font-semibold flex gap-2 items-center justify-center"
                onClick={() => setShowLogOptions(true)}
              >
                <Check size={16} /> Log Meal
              </Button>
              <Button variant="secondary" size="sm" className="col-span-1 flex gap-1.5 text-xs h-9 px-0" onClick={onEdit}>
                <Edit3 size={14} /> Adjust Portions
              </Button>
              <Button variant="secondary" size="sm" className="col-span-1 flex gap-1.5 text-xs h-9 px-0" onClick={onRegenerate}>
                <RefreshCw size={14} /> Suggest Another
              </Button>
            </div>
          )}
        </div>
      </GlassCard>
    </InteractiveWidgetWrapper>
  );
}
