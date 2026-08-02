import { AITool, StructuredResponse, ToolCapabilityMetadata, ValidationResult } from '../../types/Tool';
import { calculateMacrosForServing } from '@/lib/nutrition/calculator';
import { FOOD_DATABASE } from '@/lib/data/foods';
import { FoodItem } from '@/types/nutrition';

export class SuggestMealTool implements AITool {
    metadata: ToolCapabilityMetadata = {
        name: 'Suggest_Meal',
        version: '1.0',
        module: 'Nutrition',
        permission: 'read',
        inputSchema: 'suggest_meal_input.v1',
        outputSchema: 'suggest_meal_output.v1',
        timeoutMs: 5000,
        idempotent: true,
        supportsStreaming: false,
        requiresConfirmation: false 
    };

    validate(input: Record<string, unknown>): ValidationResult {
        if (!input.foods || !Array.isArray(input.foods)) {
            return { isValid: false, errors: ['Missing or invalid field: foods'] };
        }
        if (!input.reasoning || typeof input.reasoning !== 'string') {
            return { isValid: false, errors: ['Missing required field: reasoning'] };
        }
        return { isValid: true };
    }

    async execute(input: Record<string, unknown>): Promise<unknown> {
        const inputFoods = input.foods as any[];
        let totalCalories = 0;
        let totalProtein = 0;
        let totalCarbs = 0;
        let totalFat = 0;
        let totalFiber = 0;
        let totalSugar = 0;

        const resolvedFoods: FoodItem[] = inputFoods.map(f => {
            const dbFood = FOOD_DATABASE.find(db => 
                db.name.toLowerCase() === f.name.toLowerCase() || 
                (db.aliases && db.aliases.some(a => a.toLowerCase() === f.name.toLowerCase()))
            );

            let resolved: FoodItem;

            if (dbFood) {
                // Determine serving and quantity. The LLM might just say "1 Bowl". 
                // We'll trust the LLM passed a valid `unit` and `quantity`.
                resolved = calculateMacrosForServing(dbFood, f.quantity || 1, f.unit || dbFood.baseServingUnit);
            } else {
                // Unknown food. Use LLM estimates.
                resolved = {
                    id: `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                    name: f.name,
                    quantity: f.quantity || 1,
                    servingSize: f.unit || 'serving',
                    source: 'ai',
                    calories: f.calories || 0,
                    protein: f.protein || 0,
                    carbs: f.carbs || 0,
                    fat: f.fat || 0,
                };
            }

            totalCalories += resolved.calories;
            totalProtein += resolved.protein;
            totalCarbs += resolved.carbs;
            totalFat += resolved.fat;
            if (resolved.fiber) totalFiber += resolved.fiber;
            if (resolved.sugar) totalSugar += resolved.sugar;

            return resolved;
        });

        // The AI output contract fields
        const mealQualityScore = typeof input.mealQualityScore === 'number' ? input.mealQualityScore : 85;
        const goalAlignment = typeof input.goalAlignment === 'string' ? input.goalAlignment : "Aligns with current goals.";
        const reasoning = typeof input.reasoning === 'string' ? input.reasoning : "Recommended meal.";
        const alternatives = Array.isArray(input.alternatives) ? input.alternatives : [];
        const confidence = typeof input.confidence === 'string' ? input.confidence : (resolvedFoods.some(f => f.source === 'ai') ? 'Estimated' : 'Database');

        const result = {
            foods: resolvedFoods,
            nutritionalBreakdown: {
                calories: totalCalories,
                protein: Math.round(totalProtein * 10) / 10,
                carbs: Math.round(totalCarbs * 10) / 10,
                fat: Math.round(totalFat * 10) / 10,
                fiber: Math.round(totalFiber * 10) / 10,
                sugar: Math.round(totalSugar * 10) / 10,
            },
            mealQualityScore,
            goalAlignment,
            reasoning,
            confidence,
            alternatives
        };

        return result;
    }

    format(result: unknown): StructuredResponse {
        return {
            status: 'success',
            tool: this.metadata.name,
            result
        };
    }
}
