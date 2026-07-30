import { TraceContext, PerformanceBudget } from './types';
import { PerformanceProfiler, PerformanceTracer } from './PerformanceProfiler';
import { PerformanceMetrics } from './PerformanceMetrics';

export class PerformanceManager {
    static async measure<T>(
        operationName: string, 
        parentContext: TraceContext | null,
        budget: PerformanceBudget | null,
        operation: (context: TraceContext) => Promise<T>
    ): Promise<T> {
        const spanContext = PerformanceTracer.startSpan(operationName, parentContext);
        
        const { result, durationMs } = await PerformanceProfiler.profile(operationName, spanContext, () => operation(spanContext));

        PerformanceMetrics.logMetric(operationName, durationMs, spanContext);
        
        if (budget) {
            PerformanceMetrics.checkBudget(budget, durationMs, spanContext);
        }

        return result;
    }
}
