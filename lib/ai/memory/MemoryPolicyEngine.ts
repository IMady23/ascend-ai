import { MemoryItem, RawMemoryInput } from '../types';
import { IMemoryStore } from './MemoryStore';
import { MemoryClassifier } from './MemoryClassifier';
import { MemoryConflictResolver } from './MemoryConflictResolver';

export class MemoryPolicyEngine {
    private classifier: MemoryClassifier;
    private conflictResolver: MemoryConflictResolver;
    private store: IMemoryStore;

    constructor(store: IMemoryStore) {
        this.store = store;
        this.classifier = new MemoryClassifier();
        this.conflictResolver = new MemoryConflictResolver(store);
    }

    /**
     * The absolute gatekeeper for all memory writes.
     * No module is permitted to bypass this and write directly to the MemoryStore.
     */
    async processAndStore(userId: string, input: RawMemoryInput): Promise<MemoryItem | null> {
        // 1. Classify the raw input
        const proposedMemory = this.classifier.classify(input);
        proposedMemory.metadata.userId = userId;

        // 2. Reject low-confidence inference immediately to save DB costs
        if (proposedMemory.metadata.confidence < 0.2) {
            console.log(`[MemoryPolicyEngine] Rejected memory due to low confidence: ${proposedMemory.content}`);
            return null;
        }

        // 3. Check for conflicts (e.g. changing preferred workout time)
        const resolvedMemory = await this.conflictResolver.resolve(userId, proposedMemory);
        
        // If conflict resolver returns null, it means the memory was a pure duplicate or safely merged into an existing record
        if (!resolvedMemory) {
            return null; 
        }

        // 4. Save to Store
        await this.store.save(userId, resolvedMemory);
        return resolvedMemory;
    }
}
