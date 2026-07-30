import { Entity } from '../types/RepositoryInterfaces';
import { DatabaseAdapter } from './DatabaseAdapter';

export class MockAdapter<T extends Entity> extends DatabaseAdapter<T> {
    private store = new Map<string, T>();

    async findById(id: string): Promise<T | null> {
        const entity = this.store.get(id);
        return entity && !entity.deletedAt ? entity : null;
    }

    async save(entity: T): Promise<void> {
        this.store.set(entity.id, entity);
    }

    async update(id: string, partial: Partial<T>): Promise<void> {
        const existing = this.store.get(id);
        if (existing) {
            this.store.set(id, { ...existing, ...partial, updatedAt: Date.now() });
        }
    }

    async softDelete(id: string): Promise<void> {
        const existing = this.store.get(id);
        if (existing) {
            this.store.set(id, { ...existing, deletedAt: Date.now() });
        }
    }
}
