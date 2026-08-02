import { AIProvider } from './ProviderInterface';
import { AIRequest, AIResponse, StreamingEvent } from '../types';

export class GeminiAdapter implements AIProvider {
    private apiKey: string;
    private defaultModel: string;

    constructor() {
        this.apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';
        this.defaultModel = 'gemini-1.5-flash';
        
        if (!this.apiKey) {
            console.warn('Gemini API Key is missing. AI features will fail.');
        }
    }

    async execute(request: AIRequest): Promise<AIResponse> {
        const start = performance.now();
        
        const contents: any[] = [];
        
        // System context isn't natively supported exactly like OpenAI, but we can prepend it to history
        // Gemini API v1beta system_instruction
        const systemInstruction = {
            parts: [{ text: request.systemContext || 'You are Ascend AI.' }]
        };

        if (request.chatHistory && request.chatHistory.length > 0) {
            request.chatHistory.forEach(msg => {
                if (msg.role && msg.content) {
                    contents.push({
                        role: msg.role === 'user' ? 'user' : 'model',
                        parts: [{ text: msg.content }]
                    });
                }
            });
        }

        contents.push({
            role: 'user',
            parts: [{ text: request.prompt }]
        });

        const payload = {
            system_instruction: systemInstruction,
            contents,
            generationConfig: {
                response_mime_type: "application/json"
            }
        };

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${this.defaultModel}:generateContent?key=${this.apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errText = await response.text().catch(() => 'Unknown Error');
            throw new Error(`Gemini Error: ${response.status} - ${errText}`);
        }

        const data = await response.json();
        const latency = Math.round(performance.now() - start);

        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
        let parsedContent;
        try {
            parsedContent = JSON.parse(rawText);
        } catch {
            // fallback structure if model failed to return strict json
            parsedContent = { reasoning: rawText, summary: rawText };
        }

        return {
            schema: parsedContent.schema || 'unknown',
            version: parsedContent.version || '1.0',
            confidence: parsedContent.confidence || 'medium',
            provider: 'gemini',
            model: this.defaultModel,
            latency_ms: latency,
            reasoning: parsedContent.reasoning,
            tool_calls: parsedContent.tool_calls || [],
            widgets: parsedContent.widgets || [],
            rawText: rawText,
            summary: parsedContent.summary
        };
    }

    async *stream(request: AIRequest): AsyncIterable<StreamingEvent> {
        // Placeholder for streaming implementation
        yield { type: 'conversation.started', timestamp: Date.now() };
        await new Promise(resolve => setTimeout(resolve, 500));
        yield { type: 'response.completed', timestamp: Date.now(), data: { status: 'mock_stream_complete' } };
    }
}
