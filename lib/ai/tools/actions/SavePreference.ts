import { AITool, StructuredResponse, ToolCapabilityMetadata, ValidationResult } from '../../types/Tool';

export class SavePreferenceTool implements AITool {
    metadata: ToolCapabilityMetadata = {
        name: 'Save_Preference',
        version: '1.0',
        module: 'Memory',
        permission: 'write',
        inputSchema: 'save_preference_input.v1',
        outputSchema: 'save_preference_output.v1',
        timeoutMs: 5000,
        idempotent: true,
        supportsStreaming: false,
        requiresConfirmation: false
    };

    validate(input: Record<string, unknown>): ValidationResult {
        if (!input.category || typeof input.category !== 'string') {
            return { isValid: false, errors: ['Missing required field: category (string, e.g. "food_allergy")'] };
        }
        if (!input.preference || typeof input.preference !== 'string') {
            return { isValid: false, errors: ['Missing required field: preference (string, e.g. "peanuts")'] };
        }
        return { isValid: true };
    }

    async execute(input: Record<string, unknown>): Promise<unknown> {
        console.log(`[SavePreferenceTool] Saving Long-Term Memory... ${input.category}: ${input.preference}`);
        
        return {
            category: input.category,
            preference: input.preference,
            savedAt: new Date().toISOString()
        };
    }

    format(result: unknown): StructuredResponse {
        return {
            status: 'success',
            tool: this.metadata.name,
            result
        };
    }
}
