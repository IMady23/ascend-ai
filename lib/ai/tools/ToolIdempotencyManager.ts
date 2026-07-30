import { AITool, StructuredResponse } from '../types/Tool';

export class ToolIdempotencyManager {
    // In production, this would use Redis or Firestore with a TTL (e.g. 1 hour)
    private cache: Map<string, StructuredResponse> = new Map();

    /**
     * Prevents duplicate execution. 
     * Returns a cached StructuredResponse if this exact operation ID was already executed.
     */
    checkOrCache(operationId: string, tool: AITool): StructuredResponse | null {
        if (!tool.metadata.idempotent) return null;
        
        if (this.cache.has(operationId)) {
            console.log(`[IdempotencyManager] Duplicate request prevented for ${operationId}. Returning cached result.`);
            return this.cache.get(operationId) || null;
        }
        return null;
    }

    cacheResult(operationId: string, result: StructuredResponse) {
        this.cache.set(operationId, result);
    }
}
