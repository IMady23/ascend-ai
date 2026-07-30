export type DependencyName = 'AI_Gateway' | 'Firestore' | 'AppleHealth' | 'CloudFunctions';

export interface ReliabilityError {
    status: 'error';
    code: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    retryable: boolean;
    dependency: DependencyName;
    operation: string;
    correlationId: string;
    occurredAt: number;
    message: string;
}

export type RecoveryStrategy = 'retry' | 'resume' | 'fallback' | 'compensate' | 'abort';

export interface ReliabilityProfile {
    timeoutMs: number;
    maxAttempts: number;
    backoffStrategy: 'linear' | 'exponential' | 'exponential_jitter';
    circuitBreakerThreshold: number;
    circuitBreakerCooldownMs: number;
}

export const RELIABILITY_PROFILES: Record<string, ReliabilityProfile> = {
    FAST_READ: { timeoutMs: 2000, maxAttempts: 3, backoffStrategy: 'linear', circuitBreakerThreshold: 10, circuitBreakerCooldownMs: 30000 },
    DATABASE_WRITE: { timeoutMs: 5000, maxAttempts: 5, backoffStrategy: 'exponential', circuitBreakerThreshold: 5, circuitBreakerCooldownMs: 60000 },
    AI_REQUEST: { timeoutMs: 15000, maxAttempts: 3, backoffStrategy: 'exponential_jitter', circuitBreakerThreshold: 3, circuitBreakerCooldownMs: 120000 },
    HEALTH_SYNC: { timeoutMs: 30000, maxAttempts: 2, backoffStrategy: 'exponential', circuitBreakerThreshold: 5, circuitBreakerCooldownMs: 300000 }
};
