import { ExecutionContext } from '../shared/types';
import { WorkoutRepository } from '../../lib/data/repositories/WorkoutRepository';
import { FirestoreAdapter } from '../../lib/data/adapters/FirestoreAdapter';

export class WorkoutService {
    // In production, repositories would be injected
    private workoutRepo = new WorkoutRepository('workouts', new FirestoreAdapter('workouts'));

    async createWorkout(focus: string, context: ExecutionContext) {
        // Business logic orchestrated here
        console.log(`[WorkoutService] Creating workout for focus: ${focus} [${context.correlationId}]`);
        await this.workoutRepo.save({
            id: `wk_${Math.random().toString(36).substr(2, 9)}`,
            focus,
            duration: 60,
            schemaVersion: '1.0',
            createdAt: Date.now(),
            updatedAt: Date.now()
        }, context.correlationId);
    }
}
