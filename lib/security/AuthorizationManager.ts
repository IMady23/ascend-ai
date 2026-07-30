import { Identity, SecurityRole, SecurityPermission } from './types';

export class RateLimiter {
    static checkLimit(bucket: string, identityId: string): boolean {
        // e.g. bucket = 'ai_chat', 'ai_tools', 'login'
        // Simplified mock: always allow
        return true;
    }
}

export class RoleManager {
    static hasRole(identity: Identity, requiredRole: SecurityRole): boolean {
        return identity.roles.includes(requiredRole);
    }
}

export class PermissionResolver {
    static hasPermission(identity: Identity, requiredPermission: SecurityPermission): boolean {
        // System/Admin bypass or explicit permission check
        if (identity.roles.includes('system') || identity.roles.includes('administrator')) return true;
        return identity.permissions.includes(requiredPermission);
    }
}

export class OwnershipResolver {
    static isOwner(identity: Identity, resourceId: string): boolean {
        // Mock: Does this resource belong to the user?
        // e.g. "Does Workout #123 belong to User #123?"
        return true; 
    }
}
