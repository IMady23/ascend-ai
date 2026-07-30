import { collection, doc, getDocs, setDoc, query, onSnapshot } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { FoodItem } from "@/types/nutrition";
import { handleFirestoreError } from "./error-handler";
import { FOOD_DATABASE } from "@/lib/data/foods";

export interface CustomFood extends FoodItem {
  normalizedName: string;
  createdAt?: any;
  updatedAt?: any;
}

export const FoodRepository = {
  getCollectionRef(userId: string) {
    return collection(firestore, `users/${userId}/custom_foods`);
  },

  async getCustomFoods(userId: string): Promise<CustomFood[]> {
    try {
      const q = query(this.getCollectionRef(userId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id } as CustomFood));
    } catch (error) {
      handleFirestoreError(error, `fetching custom foods for user ${userId}`);
      return [];
    }
  },

  subscribeToCustomFoods(userId: string, onUpdate: (foods: CustomFood[]) => void, onError: (error: Error) => void): () => void {
    const q = query(this.getCollectionRef(userId));
    return onSnapshot(
      q,
      (snapshot) => {
        onUpdate(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id } as CustomFood)));
      },
      (error) => onError(error)
    );
  },

  async createCustomFood(userId: string, food: Omit<CustomFood, "normalizedName" | "id">): Promise<CustomFood> {
    const id = `custom-${Date.now()}`;
    const normalizedName = food.name.toLowerCase().trim();
    const customFood: CustomFood = {
      ...food,
      id,
      normalizedName,
      createdAt: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 },
      updatedAt: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 },
    };

    try {
      const docRef = doc(this.getCollectionRef(userId), id);
      await setDoc(docRef, customFood);
      return customFood;
    } catch (error) {
      handleFirestoreError(error, `creating custom food ${id} for user ${userId}`);
      throw error;
    }
  },

  searchFoods(
    searchQuery: string,
    customFoods: FoodItem[],
    recentFoods: FoodItem[]
  ): FoodItem[] {
    const q = searchQuery.toLowerCase().trim();
    if (!q) {
      // Default ranking: Custom -> Recent -> Common
      const combined = [...customFoods, ...recentFoods, ...FOOD_DATABASE];
      const seen = new Set();
      return combined.filter(f => {
        const normalized = f.name.toLowerCase().trim();
        if (seen.has(normalized)) return false;
        seen.add(normalized);
        return true;
      }).slice(0, 15);
    }

    // Merged pool
    const pool = [...customFoods, ...recentFoods, ...FOOD_DATABASE];
    
    // Deduplicate by normalized name
    const uniquePool = new Map<string, FoodItem>();
    for (const f of pool) {
      const normalized = f.name.toLowerCase().trim();
      if (!uniquePool.has(normalized)) {
        uniquePool.set(normalized, f);
      } else {
        // If it's already there, prefer Custom > Recent > DB by not overwriting since we inserted in that order
      }
    }

    const results = Array.from(uniquePool.values());

    const exactMatches: FoodItem[] = [];
    const partialMatches: FoodItem[] = [];
    const similarMatches: FoodItem[] = [];

    results.forEach(f => {
      const name = f.name.toLowerCase().trim();
      if (name === q) {
        exactMatches.push(f);
      } else if (name.startsWith(q) || name.includes(` ${q}`)) {
        // Starts with or distinct word match
        partialMatches.push(f);
      } else if (name.includes(q)) {
        // General partial match
        similarMatches.push(f);
      }
    });

    // Custom foods boost is naturally handled if we inserted them first in the pool and didn't deduplicate-overwrite
    return [...exactMatches, ...partialMatches, ...similarMatches];
  }
};
