import { AITool, StructuredResponse, ToolCapabilityMetadata, ValidationResult } from '../../types/Tool';
import { z } from "zod";
import { useNutritionStore } from "@/stores/nutrition.store";
import { useUserStore } from "@/stores/user.store";
import type { MealPlan } from "@/types/nutrition";

export const GenerateMealPlanSchema = z.object({
  title: z.string(),
  meals: z.array(z.object({
    mealType: z.enum(["breakfast", "morning_snack", "lunch", "evening_snack", "dinner", "drinks", "snack"]),
    name: z.string(),
    foods: z.array(z.object({
      name: z.string(),
      quantity: z.number(),
      servingSize: z.string(),
      calories: z.number(),
      protein: z.number(),
      carbs: z.number(),
      fat: z.number()
    })),
    calories: z.number(),
    protein: z.number(),
    carbs: z.number(),
    fat: z.number(),
    explanation: z.string()
  })),
  groceryList: z.array(z.object({
    name: z.string(),
    quantity: z.number(),
    unit: z.string()
  }))
});

export class GenerateMealPlanTool implements AITool {
    metadata: ToolCapabilityMetadata = {
        name: 'Generate_Meal_Plan',
        version: '1.0',
        module: 'Nutrition',
        permission: 'write',
        inputSchema: 'generate_meal_plan.v1',
        outputSchema: 'generate_meal_plan_output.v1',
        timeoutMs: 8000,
        idempotent: false,
        supportsStreaming: false,
        requiresConfirmation: false
    };

    validate(input: Record<string, unknown>): ValidationResult {
        const result = GenerateMealPlanSchema.safeParse(input);
        if (!result.success) {
            return { isValid: false, errors: result.error.issues.map((e: any) => e.message) };
        }
        return { isValid: true };
    }

    async execute(input: Record<string, unknown>): Promise<unknown> {
        const args = GenerateMealPlanSchema.parse(input);
        const userId = useUserStore.getState().userId;
        if (!userId) {
            throw new Error("User not authenticated");
        }

        const { addMealPlan } = useNutritionStore.getState();
        const planId = crypto.randomUUID();
        
        let totalCalories = 0;
        let totalProtein = 0;
        let totalCarbs = 0;
        let totalFat = 0;

        const formattedMeals = args.meals.map(m => {
          totalCalories += m.calories;
          totalProtein += m.protein;
          totalCarbs += m.carbs;
          totalFat += m.fat;

          return {
            ...m,
            foods: m.foods.map(f => ({
              ...f,
              id: crypto.randomUUID(),
              source: "ai" as const
            }))
          };
        });

        const formattedGroceryList = args.groceryList.map(g => ({
          ...g,
          id: crypto.randomUUID(),
          checked: false
        }));

        const newPlan: MealPlan = {
          id: planId,
          userId,
          title: args.title,
          status: "saved",
          meals: formattedMeals,
          groceryList: formattedGroceryList,
          totalCalories,
          totalProtein,
          totalCarbs,
          totalFat,
          createdAt: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 } as any,
          updatedAt: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 } as any
        };

        await addMealPlan(newPlan);

        return {
            planId,
            message: `Meal plan '${args.title}' generated and saved successfully.`
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
