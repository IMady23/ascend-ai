import { AIRequest, AIResponse, StreamingEvent } from '../types';
import { ProviderFactory } from '../providers/ProviderFactory';
import { AIProvider } from '../providers/ProviderInterface';
import { ReliabilityManager } from '../../reliability/ReliabilityManager';
import { RELIABILITY_PROFILES } from '../../reliability/types';

export class AIGateway {
    private provider: AIProvider;

    constructor(providerId: string = 'openrouter') {
        this.provider = ProviderFactory.getProvider(providerId);
    }

    async execute(request: AIRequest): Promise<AIResponse> {
        return ReliabilityManager.execute(
            'AI_Gateway',
            'AI Generation',
            RELIABILITY_PROFILES.AI_REQUEST,
            request.correlationId || request.id,
            () => this.provider.execute(request),
            'fallback',
            {
                text: "I'm having trouble connecting to the intelligence core right now.",
                widgets: [],
                tool_calls: []
            }
        );
    }

    async *stream(request: AIRequest): AsyncIterable<StreamingEvent> {
        // Stream doesn't retry as easily, but we can still wrap the initial connection if needed.
        // For now, streaming remains direct.
        try {
            for await (const event of this.provider.stream(request)) {
                yield event;
            }
        } catch (error: any) {
            console.error('AIGateway Streaming Failed:', error.message);
            throw error;
        }
    }
}
