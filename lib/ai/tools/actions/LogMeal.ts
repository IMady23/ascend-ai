import { AITool, StructuredResponse, ToolCapabilityMetadata, ValidationResult } from '../../types/Tool';
import { useUserStore } from '@/stores/user.store';
import { useNutritionStore } from '@/stores/nutrition.store';
import type { NutritionLog } from '@/types/nutrition';

export class LogMealTool implements AITool {
    metadata: ToolCapabilityMetadata = {
        name: 'Log_Meal',
        version: '1.0',
        module: 'Nutrition',
        permission: 'write',
        inputSchema: 'log_meal_input.v1',
        outputSchema: 'log_meal_output.v1',
        timeoutMs: 5000,
        idempotent: false,
        supportsStreaming: false,
        requiresConfirmation: false
    };

    validate(input: Record<string, unknown>): ValidationResult {
        if (!input.calories || typeof input.calories !== 'number') {
            return { isValid: false, errors: ['Missing required field: calories (number)'] };
        }
        return { isValid: true };
    }

    async execute(input: Record<string, unknown>, isConfirmed?: boolean): Promise<unknown> {
        // We get userId from input if provided (passed from orchestrator), else fallback to store
        const userId = (input.userId as string) || useUserStore.getState().userId;
        if (!userId) {
            throw new Error("User not authenticated");
        }
        
        // Automatically execute since it is now agentic
        const mealId = crypto.randomUUID();
        
        const now = Date.now();
        const dateStr = new Date(now).toISOString().split("T")[0];
        const mealType = (input.mealType as string) || "snack";

        const newMealData = {
            id: mealId,
            date: dateStr,
            timestamp: { seconds: Math.floor(now / 1000), nanoseconds: 0 } as any,
            mealType: mealType as any,
            calories: input.calories as number,
            protein: (input.protein as number) || 0,
            carbs: (input.carbs as number) || 0,
            fat: (input.fat as number) || 0,
            fiber: (input.fiber as number) || 0,
            sugar: (input.sugar as number) || 0,
            foods: [
                {
                    id: crypto.randomUUID(),
                    name: (input.description as string) || "Quick log",
                    quantity: 1,
                    servingSize: "serving",
                    calories: input.calories as number,
                    protein: (input.protein as number) || 0,
                    carbs: (input.carbs as number) || 0,
                    fat: (input.fat as number) || 0,
                    fiber: (input.fiber as number) || 0,
                    sugar: (input.sugar as number) || 0,
                    source: "ai" as const
                }
            ],
            source: "ai" as const,
            userId,
            createdAt: { seconds: Math.floor(now / 1000), nanoseconds: 0 } as any,
            updatedAt: { seconds: Math.floor(now / 1000), nanoseconds: 0 } as any
        } as any;

        const { NutritionRepository } = await import('@/services/repositories/nutrition.repository');
        await NutritionRepository.createNutritionLog(userId, newMealData);

        return {
            mealId,
            status: "logged",
            summary: `${input.calories} kcal logged for ${mealType}.`
        };
    }

    format(result: unknown): StructuredResponse {
        return {
            status: 'success',
            tool: this.metadata.name,
            result
        };
    }
}
