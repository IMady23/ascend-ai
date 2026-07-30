import { AIResponse } from '../types';

export class ResponseValidator {
    /**
     * Validates that the provider output perfectly matches the AIResponse schema.
     * In a production environment, this would use `zod` to deeply validate the payload structure.
     */
    validate(rawPayload: unknown): AIResponse {
        if (!rawPayload || typeof rawPayload !== 'object') {
            throw new Error('Validation Failed: AI Response is not a JSON object.');
        }

        const payload = rawPayload as Record<string, unknown>;

        if (!payload.schema || typeof payload.schema !== 'string') {
            throw new Error('Validation Failed: Missing required field "schema".');
        }

        if (!payload.version || typeof payload.version !== 'string') {
            throw new Error('Validation Failed: Missing required field "version".');
        }

        if (!Array.isArray(payload.tool_calls)) {
            throw new Error('Validation Failed: "tool_calls" must be an array.');
        }

        if (!Array.isArray(payload.widgets)) {
            throw new Error('Validation Failed: "widgets" must be an array.');
        }

        // Cast to AIResponse if it passes the basic sanity checks.
        return payload as unknown as AIResponse;
    }
}
