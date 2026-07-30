import { MemoryItem, MemoryQuery } from '../types';
import { MemoryEventBus } from './MemoryEventBus';

export interface IMemoryStore {
    save(memory: MemoryItem): Promise<void>;
    search(query: MemoryQuery): Promise<MemoryItem[]>;
    update(memory: MemoryItem): Promise<void>;
    delete(id: string): Promise<void>;
}

export class MockMemoryStore implements IMemoryStore {
    private store: Map<string, MemoryItem> = new Map();

    async save(memory: MemoryItem): Promise<void> {
        this.store.set(memory.id, memory);
        MemoryEventBus.emit('memory.created', memory.id, memory);
    }

    async search(query: MemoryQuery): Promise<MemoryItem[]> {
        const results: MemoryItem[] = [];
        const now = Date.now();

        for (const memory of this.store.values()) {
            // Layer filter
            if (query.layer && memory.metadata.layer !== query.layer) continue;
            
            // Importance filter
            if (query.minImportance !== undefined && memory.metadata.importance < query.minImportance) continue;
            
            // Confidence filter
            if (query.minConfidence !== undefined && memory.metadata.confidence < query.minConfidence) continue;
            
            // Expiration filter
            if (query.activeOnly && memory.metadata.expiresAt && memory.metadata.expiresAt < now) continue;

            // Tag filter (must have at least one matching tag)
            if (query.tags && query.tags.length > 0) {
                const hasTag = query.tags.some(tag => memory.metadata.tags.includes(tag));
                if (!hasTag) continue;
            }

            results.push(memory);
        }

        return results;
    }

    async update(memory: MemoryItem): Promise<void> {
        if (!this.store.has(memory.id)) {
            throw new Error(`Memory with ID ${memory.id} not found.`);
        }
        this.store.set(memory.id, memory);
        MemoryEventBus.emit('memory.updated', memory.id, memory);
    }

    async delete(id: string): Promise<void> {
        const memory = this.store.get(id);
        if (memory) {
            this.store.delete(id);
            MemoryEventBus.emit('memory.deleted', id, memory);
        }
    }
}
