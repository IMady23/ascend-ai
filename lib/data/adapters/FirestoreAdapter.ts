import { Entity } from '../types/RepositoryInterfaces';
import { DatabaseAdapter } from './DatabaseAdapter';

export class FirestoreAdapter<T extends Entity> extends DatabaseAdapter<T> {
    private collectionName: string;

    constructor(collectionName: string) {
        super();
        this.collectionName = collectionName;
    }

    async findById(id: string): Promise<T | null> {
        // Mocking real Firestore calls for the sake of the architecture skeleton
        console.log(`[Firestore] Fetching ${this.collectionName}/${id}`);
        return null; 
    }

    async save(entity: T): Promise<void> {
        console.log(`[Firestore] Saving to ${this.collectionName}/${entity.id}`);
    }

    async update(id: string, partial: Partial<T>): Promise<void> {
        console.log(`[Firestore] Updating ${this.collectionName}/${id}`);
    }

    async softDelete(id: string): Promise<void> {
        console.log(`[Firestore] Soft Deleting ${this.collectionName}/${id}`);
    }
}
