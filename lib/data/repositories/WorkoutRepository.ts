import { Entity } from '../types/RepositoryInterfaces';
import { BaseRepository } from './BaseRepository';

export interface WorkoutEntity extends Entity {
    focus: string;
    duration: number;
}

export class WorkoutRepository extends BaseRepository<WorkoutEntity> {
    // Workout specific business queries
    async findRecentWorkouts(userId: string, correlationId: string): Promise<WorkoutEntity[]> {
        // Mock query logic
        return [];
    }
}
