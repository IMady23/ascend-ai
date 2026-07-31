import { MemoryItem, MemoryQuery } from '../types';
import { MemoryEventBus } from './MemoryEventBus';
import { AiMemoryRepository } from '@/services/repositories/ai-memory.repository';

export interface IMemoryStore {
    save(userId: string, memory: MemoryItem): Promise<void>;
    search(userId: string, query: MemoryQuery): Promise<MemoryItem[]>;
    update(userId: string, memory: MemoryItem): Promise<void>;
    delete(userId: string, id: string): Promise<void>;
}

export class FirebaseMemoryStore implements IMemoryStore {
    async save(userId: string, memory: MemoryItem): Promise<void> {
        await AiMemoryRepository.saveMemory(userId, memory);
        MemoryEventBus.emit('memory.created', memory.id, memory);
    }

    async search(userId: string, query: MemoryQuery): Promise<MemoryItem[]> {
        const memories = await AiMemoryRepository.getMemories(userId);
        const results: MemoryItem[] = [];
        const now = Date.now();

        for (const memory of memories) {
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

    async update(userId: string, memory: MemoryItem): Promise<void> {
        await AiMemoryRepository.updateMemory(userId, memory.id, memory);
        MemoryEventBus.emit('memory.updated', memory.id, memory);
    }

    async delete(userId: string, id: string): Promise<void> {
        await AiMemoryRepository.deleteMemory(userId, id);
        MemoryEventBus.emit('memory.deleted', id, undefined);
    }
}
