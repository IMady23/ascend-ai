import { DatabaseFoodItem, FoodItem } from "@/types/nutrition";

export const calculateMacrosForServing = (
  food: DatabaseFoodItem,
  quantity: number,
  unit: string
): FoodItem => {
  let multiplier = 1;

  if (unit === food.baseServingUnit) {
    multiplier = quantity / food.baseServingQuantity;
  } else {
    const predefined = food.predefinedServings.find(s => s.unit === unit);
    if (predefined) {
      // e.g., if a Bowl has multiplier 1.5, and quantity is 2 (2 Bowls) -> 3.0 total multiplier
      multiplier = predefined.multiplier * quantity;
    } else {
      // Fallback if custom unit doesn't match base and isn't predefined
      multiplier = quantity / food.baseServingQuantity;
    }
  }

  // Rounding helper (1 decimal place for macros, whole number for calories)
  const round = (val: number) => Math.round(val * 10) / 10;

  return {
    id: `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    databaseId: food.id,
    name: food.name,
    quantity,
    servingSize: unit,
    source: "database",
    calories: Math.round(food.calories * multiplier),
    protein: round(food.protein * multiplier),
    carbs: round(food.carbs * multiplier),
    fat: round(food.fat * multiplier),
    ...(food.fiber !== undefined && { fiber: round(food.fiber * multiplier) }),
    ...(food.sugar !== undefined && { sugar: round(food.sugar * multiplier) }),
    ...(food.sodium !== undefined && { sodium: round(food.sodium * multiplier) }),
    ...(food.potassium !== undefined && { potassium: round(food.potassium * multiplier) }),
    ...(food.cholesterol !== undefined && { cholesterol: round(food.cholesterol * multiplier) }),
    ...(food.addedSugar !== undefined && { addedSugar: round(food.addedSugar * multiplier) }),
  };
};
