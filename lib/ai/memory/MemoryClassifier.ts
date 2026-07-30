import { MemoryItem, MemoryMetadata, MemoryLayer, MemoryProvenance, RawMemoryInput } from '../types';

export class MemoryClassifier {
    /**
     * Categorizes a raw memory input, assigning confidence, importance, and exact layers.
     * In the future, this could use a lightweight LLM call to classify untagged data.
     * For now, we use deterministic rules based on the source and creator.
     */
    classify(input: RawMemoryInput): MemoryItem {
        let layer = input.suggestedLayer || 'session';
        let importance = 10;
        let confidence = 0.5;

        // Deterministic routing rules
        if (input.createdBy === 'user') {
            confidence = 1.0; // User explicitly stated this
            if (layer === 'preference') importance = 90;
            if (layer === 'goal') importance = 100;
        } else if (input.createdBy === 'tool') {
            confidence = 1.0; // System deterministic tool
            if (layer === 'knowledge') importance = 80;
        } else if (input.createdBy === 'ai_inference') {
            confidence = 0.6; // AI guessed this
            importance = 50; 
        }

        const now = Date.now();

        const metadata: MemoryMetadata = {
            id: `mem_${Math.random().toString(36).substring(2, 10)}`,
            layer,
            importance,
            confidence,
            createdBy: input.createdBy,
            source: input.source,
            tags: input.tags || [],
            createdAt: now,
            updatedAt: now,
            // Session memories expire after 24 hours by default
            expiresAt: layer === 'session' ? now + 86400000 : undefined
        };

        return {
            id: metadata.id,
            content: input.content,
            metadata
        };
    }
}
