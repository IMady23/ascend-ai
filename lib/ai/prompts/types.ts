export type PromptSectionType = 'system' | 'persona' | 'module' | 'safety' | 'memory' | 'goal' | 'recent' | 'request' | 'schema';

export interface PromptFragment {
    id: string;
    type: PromptSectionType;
    version: string;
    content: string;
    maxTokenAllocationPct: number; // e.g., 0.15 for 15%
}

export interface PromptTemplateDefinition {
    name: string;
    version: string;
    owner: string; // The subsystem owner
    supportedModules: string[];
    expectedSchema: string; // e.g., 'workout.v1'
    requiredMemoryLayers: string[];
    requiredTools: string[];
    fragments: PromptFragment[];
}
