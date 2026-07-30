import { AITool, StructuredResponse, ToolCapabilityMetadata, ValidationResult } from '../../types/Tool';

export class UpdateWorkoutTool implements AITool {
    metadata: ToolCapabilityMetadata = {
        name: 'Update_Workout',
        version: '1.0',
        module: 'Training',
        permission: 'write',
        inputSchema: 'update_workout_input.v1',
        outputSchema: 'update_workout_output.v1',
        timeoutMs: 5000,
        idempotent: false,
        supportsStreaming: false,
        requiresConfirmation: false // Immediate execution
    };

    validate(input: Record<string, unknown>): ValidationResult {
        if (!input.action || typeof input.action !== 'string') {
            return { isValid: false, errors: ['Missing required field: action (string)'] };
        }
        return { isValid: true };
    }

    async execute(input: Record<string, unknown>): Promise<unknown> {
        console.log(`[UpdateWorkoutTool] Updating workout... Action: ${input.action}`);
        
        return {
            action: input.action,
            updatedAt: new Date().toISOString()
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
