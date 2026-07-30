import { Identity, PolicyDecision, SecurityPermission } from './types';
import { PermissionResolver, OwnershipResolver, RateLimiter } from './AuthorizationManager';
import { SecurityAuditLogger, SecurityMetrics } from './SecurityAuditLogger';

export class SecurityPolicyEngine {
    /**
     * The absolute center of all security decisions.
     * Evaluates ownership, permissions, and rate limits in one pass.
     */
    static evaluate(
        identity: Identity, 
        operation: string, 
        resourceId: string | null,
        requiredPermission: SecurityPermission,
        correlationId: string
    ): PolicyDecision {
        const start = performance.now();

        // 1. Rate Limiting Check
        if (!RateLimiter.checkLimit(operation, identity.id)) {
            SecurityAuditLogger.logEvent('ratelimit.triggered', identity.id, correlationId, { operation });
            return this.decision(false, 'Rate limit exceeded.', false, 'warning', start, correlationId);
        }

        // 2. Ownership Check (If acting on a specific resource)
        if (resourceId && !OwnershipResolver.isOwner(identity, resourceId)) {
            SecurityAuditLogger.logEvent('authorization.denied', identity.id, correlationId, { reason: 'not_owner', resourceId });
            return this.decision(false, 'You do not own this resource.', false, 'critical', start, correlationId);
        }

        // 3. Permission Check
        if (!PermissionResolver.hasPermission(identity, requiredPermission)) {
            SecurityAuditLogger.logEvent('authorization.denied', identity.id, correlationId, { reason: 'missing_permission', requiredPermission });
            return this.decision(false, 'Missing required permissions.', false, 'critical', start, correlationId);
        }

        // 4. Confirmation Checks for Destructive Actions
        const requiresConfirmation = requiredPermission.includes('delete') || requiredPermission.includes('manage');

        SecurityAuditLogger.logEvent('permission.granted', identity.id, correlationId, { operation });
        return this.decision(true, 'Allowed', requiresConfirmation, 'info', start, correlationId);
    }

    private static decision(
        allowed: boolean, 
        reason: string, 
        requiresConfirmation: boolean, 
        auditLevel: 'info' | 'warning' | 'critical',
        start: number,
        correlationId: string
    ): PolicyDecision {
        const duration = Math.round(performance.now() - start);
        SecurityMetrics.logMetric('policy.evaluation', duration, correlationId, { allowed });
        return { allowed, reason, requiresConfirmation, auditLevel };
    }
}
