import { AIProvider } from './ProviderInterface';
import { AIRequest, AIResponse, StreamingEvent } from '../types';

export class OpenRouterAdapter implements AIProvider {
    private apiKey: string;
    private defaultModel: string;

    constructor() {
        this.apiKey = process.env.OPENROUTER_API_KEY || '';
        this.defaultModel = process.env.NEXT_PUBLIC_DEFAULT_MODEL || 'openai/gpt-4o-mini';
        
        if (!this.apiKey) {
            console.warn('OpenRouter API Key is missing. AI features will fail.');
        }
    }

    async execute(request: AIRequest): Promise<AIResponse> {
        const start = performance.now();
        
        // This is a minimal implementation. 
        // In a real environment, the systemContext would be correctly formatted as a "system" role message.
        const messages: any[] = [
            { role: 'system', content: request.systemContext || 'You are Ascend AI.' }
        ];

        if (request.chatHistory && request.chatHistory.length > 0) {
            // Map previous chat history, ensuring only simple text is passed
            request.chatHistory.forEach(msg => {
                if (msg.role && msg.content) {
                    messages.push({ role: msg.role === 'user' ? 'user' : 'assistant', content: msg.content });
                }
            });
        }

        messages.push({ role: 'user', content: request.prompt });

        const payload = {
            model: this.defaultModel,
            messages,
            response_format: { type: 'json_object' } // Enforce structured output from models that support it
        };

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'HTTP-Referer': 'http://localhost:3000',
                'X-Title': 'Ascend AI',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`OpenRouter Error: ${response.statusText}`);
        }

        const data = await response.json();
        const latency = Math.round(performance.now() - start);

        let parsedContent;
        try {
            parsedContent = JSON.parse(data.choices[0].message.content);
        } catch {
            throw new Error('OpenRouter returned invalid JSON');
        }

        // Return the parsed response mapped roughly to our AIResponse schema.
        // The Validator step will ensure this conforms strictly to AIResponse.
        return {
            schema: parsedContent.schema || 'unknown',
            version: parsedContent.version || '1.0',
            confidence: parsedContent.confidence || 'medium',
            provider: 'openrouter',
            model: data.model || this.defaultModel,
            latency_ms: latency,
            reasoning: parsedContent.reasoning,
            tool_calls: parsedContent.tool_calls || [],
            widgets: parsedContent.widgets || [],
            rawText: data.choices[0].message.content
        };
    }

    async *stream(request: AIRequest): AsyncIterable<StreamingEvent> {
        // Placeholder for streaming implementation. 
        // In production, this would use fetch with ReadableStream to parse SSE events.
        yield { type: 'conversation.started', timestamp: Date.now() };
        
        // Mock a reasoning delay
        await new Promise(resolve => setTimeout(resolve, 500));
        yield { type: 'reasoning.started', timestamp: Date.now() };
        
        // Mock completion
        await new Promise(resolve => setTimeout(resolve, 500));
        yield { type: 'response.completed', timestamp: Date.now(), data: { status: 'mock_stream_complete' } };
    }
}
