import { db } from "@/lib/firebase";
import { collection, doc, getDocs, setDoc, query, orderBy, limit, startAfter, QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import { TimelineEvent, timelineEventConverter } from "@/types/progression";

export class TimelineRepository {
  static async addEvent(userId: string, event: TimelineEvent): Promise<void> {
    const docRef = doc(db, "users", userId, "timeline_events", event.id).withConverter(timelineEventConverter);
    await setDoc(docRef, event);
  }

  static async getEvents(userId: string, count: number = 100, lastDoc?: QueryDocumentSnapshot<DocumentData>): Promise<{ events: TimelineEvent[], lastDoc: QueryDocumentSnapshot<DocumentData> | null }> {
    const eventsRef = collection(db, "users", userId, "timeline_events").withConverter(timelineEventConverter);
    
    let q = query(eventsRef, orderBy("timestamp", "desc"), limit(count));
    if (lastDoc) {
      q = query(eventsRef, orderBy("timestamp", "desc"), startAfter(lastDoc), limit(count));
    }

    const snapshot = await getDocs(q);
    const events = snapshot.docs.map(doc => doc.data());
    const newLastDoc = snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null;

    return { events, lastDoc: newLastDoc };
  }
}
