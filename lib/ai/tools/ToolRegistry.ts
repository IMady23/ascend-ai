import { AITool } from '../types/Tool';

export class ToolRegistry {
    private tools: Map<string, AITool> = new Map();

    register(tool: AITool) {
        this.tools.set(tool.metadata.name, tool);
    }

    getTool(name: string): AITool | undefined {
        return this.tools.get(name);
    }

    getAllTools(): AITool[] {
        return Array.from(this.tools.values());
    }
}
