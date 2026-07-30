import { Entity } from '../types/RepositoryInterfaces';
import { DatabaseMetrics } from '../DatabaseMetrics';

export class CacheManager<T extends Entity> {
    private cache = new Map<string, { entity: T; expiresAt: number }>();
    private defaultTTL = 60000; // 60 seconds

    get(id: string, correlationId: string): T | null {
        const start = performance.now();
        const cached = this.cache.get(id);
        
        if (cached && cached.expiresAt > Date.now()) {
            DatabaseMetrics.logEvent('repository.cache.hit', correlationId, Math.round(performance.now() - start));
            return cached.entity;
        }

        DatabaseMetrics.logEvent('repository.cache.miss', correlationId, Math.round(performance.now() - start));
        return null;
    }

    set(entity: T, ttl: number = this.defaultTTL) {
        this.cache.set(entity.id, {
            entity,
            expiresAt: Date.now() + ttl
        });
    }

    invalidate(id: string) {
        this.cache.delete(id);
    }
}
