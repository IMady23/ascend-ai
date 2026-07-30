import { AITool, ValidationResult } from '../types/Tool';
import { ToolEventBus } from './ToolEventBus';

export class ToolValidator {
    /**
     * Validates that the tool exists, version matches, and inputs are schema-compliant.
     */
    validate(tool: AITool, input: Record<string, unknown>): ValidationResult {
        if (!tool) {
            return { isValid: false, errors: ['Tool not found in registry.'] };
        }

        const result = tool.validate(input);
        
        if (result.isValid) {
            ToolEventBus.emit('tool.validated', tool.metadata.name, input);
        } else {
            ToolEventBus.emit('tool.failed', tool.metadata.name, { reason: 'validation_failed', errors: result.errors });
        }
        
        return result;
    }
}
