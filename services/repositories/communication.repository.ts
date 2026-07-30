import { db } from "@/lib/firebase";
import { collection, doc, getDocs, setDoc, query, orderBy, limit, startAfter, QueryDocumentSnapshot, DocumentData, updateDoc, where } from "firebase/firestore";
import { CommunicationItem, communicationItemConverter } from "@/types/communication";

export class CommunicationRepository {
  static async addItem(userId: string, item: CommunicationItem): Promise<void> {
    const docRef = doc(db, "users", userId, "communication", item.id).withConverter(communicationItemConverter);
    await setDoc(docRef, item);
  }

  static async getItems(userId: string, count: number = 50, lastDoc?: QueryDocumentSnapshot<DocumentData>): Promise<{ items: CommunicationItem[], lastDoc: QueryDocumentSnapshot<DocumentData> | null }> {
    const commsRef = collection(db, "users", userId, "communication").withConverter(communicationItemConverter);
    
    let q = query(commsRef, orderBy("timestamp", "desc"), limit(count));
    if (lastDoc) {
      q = query(commsRef, orderBy("timestamp", "desc"), startAfter(lastDoc), limit(count));
    }

    const snapshot = await getDocs(q);
    const items = snapshot.docs.map(doc => doc.data());
    const newLastDoc = snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null;

    return { items, lastDoc: newLastDoc };
  }

  static async getUnreadCount(userId: string): Promise<number> {
    const commsRef = collection(db, "users", userId, "communication").withConverter(communicationItemConverter);
    const q = query(commsRef, where("isRead", "==", false));
    const snapshot = await getDocs(q);
    return snapshot.size; // Note: For large collections, use count() query in production
  }

  static async markAsRead(userId: string, itemId: string): Promise<void> {
    const docRef = doc(db, "users", userId, "communication", itemId);
    await updateDoc(docRef, { isRead: true });
  }

  static async markAllAsRead(userId: string): Promise<void> {
    // In a real app, this should be done via a cloud function or batch write.
    // Simplifying here for V1 scope.
    const commsRef = collection(db, "users", userId, "communication").withConverter(communicationItemConverter);
    const q = query(commsRef, where("isRead", "==", false));
    const snapshot = await getDocs(q);
    
    const promises = snapshot.docs.map(d => updateDoc(d.ref, { isRead: true }));
    await Promise.all(promises);
  }
}
