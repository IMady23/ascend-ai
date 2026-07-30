export type MemoryLayer = 'session' | 'preference' | 'goal' | 'knowledge' | 'summary';
export type MemoryProvenance = 'user' | 'tool' | 'ai_inference' | 'system';

export interface MemoryMetadata {
    id: string;
    layer: MemoryLayer;
    importance: number; // 0-100
    confidence: number; // 0.0-1.0
    createdBy: MemoryProvenance;
    source: string; // The specific tool or conversation ID
    tags: string[];
    createdAt: number;
    updatedAt: number;
    expiresAt?: number;
}

export interface MemoryItem {
    id: string; // Same as metadata.id
    content: string;
    metadata: MemoryMetadata;
}

export interface MemoryQuery {
    layer?: MemoryLayer;
    minImportance?: number;
    minConfidence?: number;
    tags?: string[];
    activeOnly?: boolean; // Checks expiresAt
}

export interface RawMemoryInput {
    content: string;
    suggestedLayer?: MemoryLayer;
    source: string;
    createdBy: MemoryProvenance;
    tags?: string[];
}
