import { db } from "@/lib/firebase";
import { collection, doc, getDocs, setDoc, query, orderBy, limit } from "firebase/firestore";

export interface ProviderState {
  providerId: string;
  isConnected: boolean;
  lastSync: string | null;
  permissions: string[];
}

export class IntegrationRepository {
  
  static async getConnectedProviders(userId: string): Promise<ProviderState[]> {
    const collRef = collection(db, "users", userId, "integrations");
    const snapshot = await getDocs(collRef);
    return snapshot.docs.map(doc => doc.data() as ProviderState);
  }

  static async saveProviderState(userId: string, state: ProviderState): Promise<void> {
    const docRef = doc(db, "users", userId, "integrations", state.providerId);
    await setDoc(docRef, state);
  }
}
