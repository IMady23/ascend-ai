import { AITool, StructuredResponse } from '../types/Tool';

export class ToolResultFormatter {
    /**
     * Translates raw executor results into strict structured JSON.
     */
    static formatSuccess(tool: AITool, rawResult: unknown): StructuredResponse {
        return tool.format(rawResult);
    }

    /**
     * Translates validation/permission/execution errors into strict structured JSON.
     */
    static formatError(toolName: string, code: string, message: string): StructuredResponse {
        return {
            status: 'error',
            tool: toolName,
            code,
            message
        };
    }
}
