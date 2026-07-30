import { PerformanceBudget, TraceContext } from './types';

export class PerformanceMetrics {
    static logMetric(metric: string, durationMs: number, context: TraceContext) {
        console.log(`[Performance] ${metric} took ${durationMs}ms [Trace: ${context.traceId}]`);
    }

    static checkBudget(budget: PerformanceBudget, durationMs: number, context: TraceContext) {
        if (durationMs > budget.targetMaxMs) {
            console.warn(`[BUDGET VIOLATION] ${budget.metric} took ${durationMs}ms (Target: ${budget.targetMaxMs}ms) [Trace: ${context.traceId}]`);
        }
    }
}
