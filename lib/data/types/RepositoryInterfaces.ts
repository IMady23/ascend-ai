export interface Entity {
    id: string;
    schemaVersion: string;
    createdAt: number;
    updatedAt: number;
    deletedAt?: number;
}

export interface IRepository<T extends Entity> {
    findById(id: string): Promise<T | null>;
    save(entity: T): Promise<void>;
    update(id: string, partial: Partial<T>): Promise<void>;
    softDelete(id: string): Promise<void>;
}

export type RepositoryEvent = 
    | 'repository.read'
    | 'repository.write'
    | 'repository.update'
    | 'repository.delete'
    | 'repository.cache.hit'
    | 'repository.cache.miss'
    | 'repository.transaction.commit'
    | 'repository.transaction.rollback';
