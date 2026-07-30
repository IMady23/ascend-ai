import { ReliabilityProfile, ReliabilityError } from './types';

export class RetryPolicy {
    static async execute<T>(
        operation: () => Promise<T>,
        profile: ReliabilityProfile,
        correlationId: string,
        onRetry: (attempt: number, error: ReliabilityError) => void
    ): Promise<T> {
        let attempt = 1;

        while (attempt <= profile.maxAttempts) {
            try {
                return await operation();
            } catch (error: any) {
                if (attempt === profile.maxAttempts || !error.retryable) {
                    throw error; 
                }

                onRetry(attempt, error);

                // Mock sleep based on backoff strategy
                const delay = this.calculateDelay(profile.backoffStrategy, attempt);
                await new Promise(resolve => setTimeout(resolve, delay));
                
                attempt++;
            }
        }
        throw new Error('Unreachable');
    }

    private static calculateDelay(strategy: string, attempt: number): number {
        if (strategy === 'linear') return 500 * attempt;
        if (strategy === 'exponential') return Math.pow(2, attempt) * 500;
        if (strategy === 'exponential_jitter') return (Math.pow(2, attempt) * 500) + Math.random() * 200;
        return 500;
    }
}
