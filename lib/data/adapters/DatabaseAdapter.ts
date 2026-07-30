import { Entity, IRepository } from '../types/RepositoryInterfaces';

/**
 * Base abstract class handling common Provider operations
 */
export abstract class DatabaseAdapter<T extends Entity> implements IRepository<T> {
    abstract findById(id: string): Promise<T | null>;
    abstract save(entity: T): Promise<void>;
    abstract update(id: string, partial: Partial<T>): Promise<void>;
    abstract softDelete(id: string): Promise<void>;
}
