import { AITool } from '../types/Tool';
import { ToolEventBus } from './ToolEventBus';

export class ToolExecutor {
    /**
     * The secure sandbox where tool execution actually happens.
     */
    async execute(tool: AITool, input: Record<string, unknown>): Promise<unknown> {
        ToolEventBus.emit('tool.executing', tool.metadata.name, input);

        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Tool Execution Timeout')), tool.metadata.timeoutMs)
        );

        try {
            // Race the tool execution against its declared timeout limit
            const result = await Promise.race([
                tool.execute(input),
                timeoutPromise
            ]);
            
            ToolEventBus.emit('tool.completed', tool.metadata.name, result);
            return result;
        } catch (error: any) {
            ToolEventBus.emit('tool.failed', tool.metadata.name, { error: error.message });
            throw error;
        }
    }
}
