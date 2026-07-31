import { MemoryItem, MemoryQuery } from '../types';
import { IMemoryStore } from './MemoryStore';

export class MemoryRetrieval {
    private store: IMemoryStore;

    constructor(store: IMemoryStore) {
        this.store = store;
    }

    /**
     * Intelligent, deterministic retrieval of relevant context.
     * Hierarchy priority: Goal -> Preferences -> Session -> Knowledge -> Summary -> History
     */
    async fetchRelevantContext(userId: string, activeModule: string): Promise<Record<string, MemoryItem[]>> {
        const activeOnly = true;

        // Note: In a production DB, this would be heavily optimized or batched.
        // For Phase 4, the clean architecture allows us to orchestrate it modularly.
        
        const goals = await this.store.search(userId, { layer: 'goal', activeOnly });
        const preferences = await this.store.search(userId, { layer: 'preference', activeOnly });
        const session = await this.store.search(userId, { layer: 'session', tags: [activeModule], activeOnly });
        const knowledge = await this.store.search(userId, { layer: 'knowledge', activeOnly });
        const summary = await this.store.search(userId, { layer: 'summary', activeOnly });

        // Sorting by importance ensures deterministic retrieval within a layer
        const sortByImportance = (memories: MemoryItem[]) => 
            memories.sort((a, b) => b.metadata.importance - a.metadata.importance);

        return {
            goals: sortByImportance(goals),
            preferences: sortByImportance(preferences),
            session: sortByImportance(session),
            knowledge: sortByImportance(knowledge),
            summary: sortByImportance(summary)
        };
    }
}
