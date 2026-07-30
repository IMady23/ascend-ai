import { AIProvider } from './ProviderInterface';
import { OpenRouterAdapter } from './OpenRouterAdapter';

export class ProviderFactory {
    static getProvider(providerId: string): AIProvider {
        switch (providerId.toLowerCase()) {
            case 'openrouter':
                return new OpenRouterAdapter();
            // Future providers (e.g., 'openai', 'anthropic') would be added here
            default:
                // Default to OpenRouter as it's our primary aggregator
                return new OpenRouterAdapter();
        }
    }
}
