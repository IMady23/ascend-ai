import { Entity } from '../types/RepositoryInterfaces';
import { DatabaseAdapter } from '../adapters/DatabaseAdapter';
import { CacheManager } from '../cache/CacheManager';
import { DatabaseMetrics } from '../DatabaseMetrics';

export abstract class BaseRepository<T extends Entity> {
    protected adapter: DatabaseAdapter<T>;
    protected cache: CacheManager<T>;
    protected collectionName: string;

    constructor(collectionName: string, adapter: DatabaseAdapter<T>) {
        this.collectionName = collectionName;
        this.adapter = adapter;
        this.cache = new CacheManager<T>();
    }

    async findById(id: string, correlationId: string): Promise<T | null> {
        const start = performance.now();
        
        // 1. Try Cache
        const cached = this.cache.get(id, correlationId);
        if (cached) return cached;

        // 2. Try DB
        const entity = await this.adapter.findById(id);
        if (entity) {
            this.cache.set(entity);
        }

        DatabaseMetrics.logEvent('repository.read', correlationId, Math.round(performance.now() - start), { collection: this.collectionName, id });
        return entity;
    }

    async save(entity: T, correlationId: string): Promise<void> {
        const start = performance.now();
        await this.adapter.save(entity);
        this.cache.set(entity);
        DatabaseMetrics.logEvent('repository.write', correlationId, Math.round(performance.now() - start), { collection: this.collectionName, id: entity.id });
    }
}
