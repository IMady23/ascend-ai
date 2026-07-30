export interface Identity {
    id: string;
    provider: string; // 'firebase', 'mock'
    roles: string[];
    permissions: string[];
    sessionId: string;
    deviceId?: string;
    createdAt: number;
    expiresAt: number;
}

export type SecurityRole = 'user' | 'premium' | 'administrator' | 'system';

export type SecurityPermission = 
    | 'goal.read'
    | 'goal.write'
    | 'meal.write'
    | 'workout.modify'
    | 'admin.analytics'
    | 'memory.manage';

export interface PolicyDecision {
    allowed: boolean;
    reason: string;
    requiresConfirmation: boolean;
    auditLevel: 'info' | 'warning' | 'critical';
}
