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
    async resolve(proposedMemory: MemoryItem): Promise<MemoryItem | null> {
        // Search for existing active memories in the same layer with the same tags
        const existingMemories = await this.store.search({
            layer: proposedMemory.metadata.layer,
            tags: proposedMemory.metadata.tags,
            activeOnly: true
        });

        if (existingMemories.length === 0) {
            return proposedMemory; // Safe to write
        }

        // A naive conflict resolution strategy for Phase 4:
        // If a highly confident explicit user preference contradicts an older preference,
        // we archive the older preference (by expiring it) and accept the new one.
        for (const existing of existingMemories) {
            if (
                proposedMemory.metadata.layer === 'preference' &&
                proposedMemory.metadata.confidence >= existing.metadata.confidence
            ) {
                // Expire the old memory instead of deleting it (preserves history)
                existing.metadata.expiresAt = Date.now();
                existing.metadata.updatedAt = Date.now();
                await this.store.update(existing);
                MemoryEventBus.emit('memory.expired', existing.id, existing);
            }
        }

        return proposedMemory;
    }
}
