import { AITool, StructuredResponse, ToolCapabilityMetadata, ValidationResult } from '../../types/Tool';

export class UpdateGoalTool implements AITool {
    metadata: ToolCapabilityMetadata = {
        name: 'Update_Goal',
        version: '1.0',
        module: 'Profile',
        permission: 'modify',
        inputSchema: 'update_goal_input.v1',
        outputSchema: 'update_goal_output.v1',
        timeoutMs: 5000,
        idempotent: false,
        supportsStreaming: false,
        requiresConfirmation: true // Destructive/modifying requires confirmation
    };

    validate(input: Record<string, unknown>): ValidationResult {
        if (!input.targetField || typeof input.targetField !== 'string') {
            return { isValid: false, errors: ['Missing required field: targetField (string)'] };
        }
        if (input.newValue === undefined) {
            return { isValid: false, errors: ['Missing required field: newValue'] };
        }
        return { isValid: true };
    }

    async execute(input: Record<string, unknown>): Promise<unknown> {
        console.log(`[UpdateGoalTool] Updating goal... ${input.targetField} to ${input.newValue}`);
        
        return {
            targetField: input.targetField,
            newValue: input.newValue,
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
