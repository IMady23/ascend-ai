import { MemoryItem } from '../types';
import { IMemoryStore } from './MemoryStore';
import { MemoryEventBus } from './MemoryEventBus';

export class MemoryConflictResolver {
    private store: IMemoryStore;

    constructor(store: IMemoryStore) {
        this.store = store;
    }

    /**
     * Examines a proposed memory against the existing store.
     * Handles safe overrides and deduplication deterministically.
     */
    async resolve(userId: string, proposedMemory: MemoryItem): Promise<MemoryItem | null> {
        // Search for existing active memories in the same layer with the same tags
        const existingMemories = await this.store.search(userId, {
            layer: proposedMemory.metadata.layer,
            tags: proposedMemory.metadata.tags,
            activeOnly: true
        });

        if (existingMemories.length === 0) {
            return proposedMemory; // Safe to write
        }

        // A naive conflict resolution strategy for Phase 4:
        for (const existing of existingMemories) {
            // Duplicate Check
            if (existing.content.toLowerCase().trim() === proposedMemory.content.toLowerCase().trim()) {
                existing.metadata.lastReferencedAt = Date.now();
                existing.metadata.updatedAt = Date.now();
                await this.store.update(userId, existing);
                // Return null to indicate the proposed memory is redundant and shouldn't be saved
                return null;
            }

            // Conflict Check
            if (
                proposedMemory.metadata.layer === 'preference' &&
                proposedMemory.metadata.confidence >= existing.metadata.confidence
            ) {
                // Expire the old memory instead of deleting it (preserves history)
                existing.metadata.expiresAt = Date.now();
                existing.metadata.updatedAt = Date.now();
                await this.store.update(userId, existing);
                MemoryEventBus.emit('memory.expired', existing.id, existing);
            }
        }

        return proposedMemory;
    }
}
