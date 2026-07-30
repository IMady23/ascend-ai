export class ReliabilityMetrics {
    static logEvent(event: string, correlationId: string, metadata?: any) {
        console.log(`[Reliability Metric] [${correlationId}] ${event}`, metadata || '');
    }
}
