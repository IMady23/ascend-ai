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
  ): any[] {
    const q = searchQuery.toLowerCase().trim();
    
    // Map database items so they have a consistent interface for the UI, 
    // but preserve their predefinedServings and base properties
    const dbPool = FOOD_DATABASE.map(dbf => ({
      ...dbf,
      quantity: dbf.baseServingQuantity,
      servingSize: dbf.baseServingUnit,
      source: "database"
    }));

    if (!q) {
      // Default ranking: Custom -> Recent -> Common DB
      const combined = [...customFoods, ...recentFoods, ...dbPool];
      const seen = new Set();
      return combined.filter((f: any) => {
        const normalized = f.name.toLowerCase().trim();
        if (seen.has(normalized)) return false;
        seen.add(normalized);
        return true;
      }).slice(0, 20);
    }

    const pool = [...customFoods, ...recentFoods, ...dbPool];
    const uniquePool = new Map<string, any>();
    
    for (const f of pool) {
      const normalized = f.name.toLowerCase().trim();
      if (!uniquePool.has(normalized)) {
        uniquePool.set(normalized, f);
      }
    }

    const results = Array.from(uniquePool.values());
    const exactMatches: any[] = [];
    const partialMatches: any[] = [];
    const similarMatches: any[] = [];

    // Fuzzy matcher helper
    const isFuzzyMatch = (target: string, query: string) => {
      // simple substring or subsequence
      return target.includes(query) || target.replace(/[^a-z0-9]/g, '').includes(query.replace(/[^a-z0-9]/g, ''));
    };

    results.forEach(f => {
      const name = f.name.toLowerCase().trim();
      const aliases = f.aliases ? f.aliases.map((a: string) => a.toLowerCase().trim()) : [];
      const keywords = f.searchKeywords ? f.searchKeywords.map((k: string) => k.toLowerCase().trim()) : [];
      
      const allText = [name, ...aliases, ...keywords].join(" ");
      
      if (name === q || aliases.includes(q)) {
        exactMatches.push(f);
      } else if (name.startsWith(q) || name.includes(` ${q}`) || aliases.some((a:string) => a.startsWith(q))) {
        partialMatches.push(f);
      } else if (isFuzzyMatch(allText, q)) {
        similarMatches.push(f);
      }
    });

    return [...exactMatches, ...partialMatches, ...similarMatches].slice(0, 30);
  }
};
