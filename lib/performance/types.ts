export type PerformanceCategory = 'frontend' | 'repository' | 'ai_network' | 'ai_compute' | 'cloud_function';

export interface PerformanceBudget {
    category: PerformanceCategory;
    metric: string;
    targetMaxMs: number;
    description: string;
}

export const PERFORMANCE_BUDGETS: Record<string, PerformanceBudget> = {
    AI_FIRST_TOKEN: { category: 'ai_network', metric: 'first_token_latency', targetMaxMs: 1500, description: 'AI first token generation' },
    REPOSITORY_QUERY: { category: 'repository', metric: 'query_latency', targetMaxMs: 150, description: 'Average Firestore query time' },
    CLOUD_FUNCTION_LIGHT: { category: 'cloud_function', metric: 'execution_latency', targetMaxMs: 500, description: 'Lightweight CF execution' },
    HEALTH_SYNC_STARTUP: { category: 'cloud_function', metric: 'startup_overhead', targetMaxMs: 1000, description: 'Overhead before health provider fetch' }
};

export interface TraceContext {
    traceId: string;
    spanId: string;
    parentSpanId?: string;
    correlationId: string;
}
