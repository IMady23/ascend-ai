import { ExecutionContext } from './types';
import { Metrics } from './Metrics';

export class RetryManager {
    static async withRetry<T>(
        operation: () => Promise<T>, 
        context: ExecutionContext, 
        maxAttempts: number = 3
    ): Promise<T> {
        let attempt = 1;
        while (attempt <= maxAttempts) {
            try {
                return await operation();
            } catch (error: any) {
                if (attempt === maxAttempts || !error.retryable) {
                    throw error; // Let ErrorFramework catch it upstream
                }
                Metrics.logLatency('retry.started', context, 0); // Mock metric
                // Exponential backoff logic would go here
                attempt++;
            }
        }
        throw new Error('Unreachable');
    }
}

export class BackgroundJobManager {
    static dispatchImmediate(jobName: string, operation: () => Promise<void>, context: ExecutionContext) {
        console.log(`[JobManager] Dispatching IMMEDIATE job: ${jobName} [${context.correlationId}]`);
        // Fire and forget
        operation().catch(e => console.error(`[JobManager] Immediate job failed: ${jobName}`, e));
    }

    static dispatchScheduled(jobName: string, schedule: string, operation: () => Promise<void>) {
        console.log(`[JobManager] Registering SCHEDULED job: ${jobName} on ${schedule}`);
    }
}
