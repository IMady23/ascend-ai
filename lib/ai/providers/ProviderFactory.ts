import { AIProvider } from './ProviderInterface';
import { OpenRouterAdapter } from './OpenRouterAdapter';
import { GeminiAdapter } from './GeminiAdapter';

export class ProviderFactory {
    static getProvider(providerId?: string): AIProvider {
        const openRouterKey = process.env.OPENROUTER_API_KEY;
        const geminiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

        const requested = providerId?.toLowerCase() || '';

        // Health check: Deterministic Provider Selection
        if (requested === 'gemini' || (!openRouterKey && geminiKey)) {
            console.log('[AI Provider] Selected Gemini (Deterministic Fallback/Selection)');
            return new GeminiAdapter();
        }

        if (openRouterKey) {
            console.log('[AI Provider] Selected OpenRouter');
            return new OpenRouterAdapter();
        }

        console.error('[AI Provider] FATAL: No API keys found for any AI provider. AI features will fail.');
        throw new Error('No AI Provider available. Please set OPENROUTER_API_KEY or NEXT_PUBLIC_GEMINI_API_KEY in the environment.');
    }
}
