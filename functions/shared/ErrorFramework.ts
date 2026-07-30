import { StandardError } from './types';

export class ErrorFramework {
    static createError(code: string, message: string, correlationId: string, retryable: boolean): StandardError {
        return {
            status: 'error',
            code,
            message,
            correlationId,
            retryable,
            timestamp: Date.now()
        };
    }
}
