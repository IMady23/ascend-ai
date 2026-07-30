import { ExecutionContext } from './types';

export class Metrics {
    static logLatency(event: string, context: ExecutionContext, durationMs: number) {
        console.log(`[Function Metric] [${context.correlationId}] ${event} took ${durationMs}ms`);
    }
}
