import { TraceContext } from './types';

export class PerformanceTracer {
    static startSpan(name: string, parentContext: TraceContext | null): TraceContext {
        const traceId = parentContext?.traceId || `trace_${Math.random().toString(36).substr(2, 9)}`;
        const spanId = `span_${Math.random().toString(36).substr(2, 9)}`;
        const correlationId = parentContext?.correlationId || `cor_${Math.random().toString(36).substr(2, 9)}`;

        return { traceId, spanId, parentSpanId: parentContext?.spanId, correlationId };
    }
}

export class PerformanceProfiler {
    static async profile<T>(name: string, context: TraceContext, operation: () => Promise<T>): Promise<{ result: T; durationMs: number }> {
        const start = performance.now();
        const result = await operation();
        const durationMs = performance.now() - start;
        
        return { result, durationMs };
    }
}
