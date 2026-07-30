import { AIRequest, AIResponse, StreamingEvent } from '../types';

export interface AIProvider {
    /**
     * Executes a synchronous AI request and returns a fully constructed AIResponse.
     */
    execute(request: AIRequest): Promise<AIResponse>;

    /**
     * Executes a streaming request and yields discrete StreamingEvents.
     */
    stream(request: AIRequest): AsyncIterable<StreamingEvent>;
}
