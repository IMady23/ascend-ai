import { StructuredResponse } from '../types/Tool';

export class ToolAuditLogger {
    /**
     * Writes deterministic audit logs for observability and telemetry.
     */
    static log(requestId: string, userId: string, toolName: string, response: StructuredResponse, durationMs: number) {
        // In Phase 23, this feeds to the Analytics Engine.
        console.log(`[Audit] [${requestId}] User ${userId} invoked ${toolName} -> ${response.status.toUpperCase()} in ${durationMs}ms`);
    }
}
