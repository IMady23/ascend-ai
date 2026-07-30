import { ExecutionContext, StandardError } from './types';
import { AuthenticationManager } from '../../lib/security/AuthenticationManager';
import { SecurityPolicyEngine } from '../../lib/security/SecurityPolicyEngine';
import { Metrics } from './Metrics';
import { ErrorFramework } from './ErrorFramework';

export class FunctionRouter {
    /**
     * The unified entry point for EVERY Cloud Function.
     * Guarantees Authentication, Authorization, and Context generation.
     */
    static async route<T>(
        req: { token: string; operation: string; resourceId: string | null; payload: any },
        serviceLogic: (context: ExecutionContext, payload: any) => Promise<T>
    ): Promise<T | StandardError> {
        const start = performance.now();
        const correlationId = `cor_${Math.random().toString(36).substr(2, 9)}`;

        try {
            // 1. Authentication
            const identity = AuthenticationManager.authenticate(req.token, correlationId);
            if (!identity) {
                return ErrorFramework.createError('UNAUTHORIZED', 'Invalid or missing token.', correlationId, false);
            }

            // 2. Authorization (Policy Engine)
            // For simplicity in Phase 9, we map the operation directly to a permission
            const decision = SecurityPolicyEngine.evaluate(identity, req.operation, req.resourceId, req.operation as any, correlationId);
            if (!decision.allowed) {
                return ErrorFramework.createError('FORBIDDEN', decision.reason, correlationId, false);
            }

            // 3. Context Creation
            const context: ExecutionContext = {
                correlationId,
                requestId: `req_${Math.random().toString(36).substr(2, 9)}`,
                identity,
                timeoutBudgetMs: 10000,
                traceId: `trace_${Date.now()}`,
                timestamp: Date.now()
            };

            // 4. Execution
            const result = await serviceLogic(context, req.payload);
            
            Metrics.logLatency('function.completed', context, Math.round(performance.now() - start));
            return result;

        } catch (error: any) {
            console.error(`[FunctionRouter] Error [${correlationId}]`, error);
            return ErrorFramework.createError('INTERNAL_ERROR', error.message, correlationId, true);
        }
    }
}
