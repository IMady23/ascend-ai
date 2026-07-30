import { Identity } from '../../lib/security/types';

export interface ExecutionContext {
    correlationId: string;
    requestId: string;
    identity: Identity;
    timeoutBudgetMs: number;
    traceId: string;
    timestamp: number;
}

export interface StandardError {
    status: 'error';
    code: string;
    message: string;
    correlationId: string;
    retryable: boolean;
    timestamp: number;
}

export type FunctionLifecycleEvent = 
    | 'function.started'
    | 'function.completed'
    | 'function.failed'
    | 'retry.started'
    | 'retry.completed'
    | 'background.job.started'
    | 'background.job.completed';
