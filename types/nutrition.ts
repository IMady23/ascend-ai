import { Timestamp, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions, DocumentData } from "firebase/firestore";

export type MealType = "breakfast" | "morning_snack" | "lunch" | "evening_snack" | "dinner" | "drinks" | "snack";

export interface PredefinedServing {
  label: string; // e.g., "1 Roti", "100 g", "Small Bowl"
  quantity: number;
  unit: string;
  multiplier: number; // Multiplier against base macros
}

export type FoodCategory = "Breakfast" | "Lunch" | "Dinner" | "Snacks" | "Fruits" | "Vegetables" | "Dairy" | "Protein" | "Drinks" | "Desserts" | "Grains";
export type FoodRegion = "South Indian" | "North Indian" | "Generic" | "International";
export type FoodDiet = "Vegetarian" | "Non-Vegetarian" | "Vegan" | "Eggetarian";

export interface DatabaseFoodItem {
  id: string;
  name: string;
  aliases: string[];
  category: FoodCategory;
  cuisine: FoodRegion;
  searchKeywords: string[];
  diet: FoodDiet;
  
  baseServingUnit: string;
  baseServingQuantity: number;
  
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  potassium?: number;
  cholesterol?: number;
  addedSugar?: number;

  predefinedServings: PredefinedServing[];
  
  image?: string;
  recipe?: any[];
  barcodeHash?: string;
}

export interface FoodItem {
  id: string; // e.g. "food-123"
  databaseId?: string; // Link to master DatabaseFoodItem
  name: string;
  quantity: number; // e.g. 100
  servingSize: string; // e.g. "g" or "oz" or "large"
  // Frozen historical snapshots of the calculated values
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  sugar?: number;
  fiber?: number;
  sodium?: number;
  cholesterol?: number;
  potassium?: number;
  addedSugar?: number;
  source: "manual" | "ai" | "database" | "barcode";
}

export interface NutritionLog {
  id: string;
  userId: string;
  mealType: MealType;
  name?: string; // Optional custom name like "Post-workout shake"
  foods: FoodItem[];
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  sugar?: number;
  fiber?: number;
  sodium?: number;
  cholesterol?: number;
  potassium?: number;
  addedSugar?: number;
  notes?: string;
  date: string; // ISO date string (YYYY-MM-DD) for grouping
  timestamp: Timestamp; // Exact time of logging
  createdAt: Timestamp;
}

export interface HydrationLog {
  id: string;
  userId: string;
  amountMl: number;
  date: string; // YYYY-MM-DD
  timestamp: Timestamp;
}

export interface GroceryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  checked: boolean;
}

export interface MealPlanMeal {
  mealType: MealType;
  name: string;
  foods: FoodItem[];
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  sugar?: number;
  explanation: string; // AI's reasoning for why this fits
}

export type MealPlanStatus = "saved" | "active" | "completed" | "archived";

export interface MealPlan {
  id: string;
  userId: string;
  title: string;
  status: MealPlanStatus;
  meals: MealPlanMeal[];
  groceryList: GroceryItem[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// CONVERTERS
export const nutritionLogConverter: FirestoreDataConverter<NutritionLog> = {
  toFirestore(log: NutritionLog): DocumentData {
    const { id, ...data } = log;
    return data;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): NutritionLog {
    const data = snapshot.data(options);
    return { ...data, id: snapshot.id } as NutritionLog;
  }
};

export const hydrationLogConverter: FirestoreDataConverter<HydrationLog> = {
  toFirestore(log: HydrationLog): DocumentData {
    const { id, ...data } = log;
    return data;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): HydrationLog {
    const data = snapshot.data(options);
    return { ...data, id: snapshot.id } as HydrationLog;
  }
};

export const mealPlanConverter: FirestoreDataConverter<MealPlan> = {
  toFirestore(plan: MealPlan): DocumentData {
    const { id, ...data } = plan;
    return data;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): MealPlan {
    const data = snapshot.data(options);
    return { ...data, id: snapshot.id } as MealPlan;
  }
};
