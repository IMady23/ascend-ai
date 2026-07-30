export type ToolPermissionLevel = 'read' | 'write' | 'modify' | 'destructive';

export interface ToolCapabilityMetadata {
    name: string;
    version: string;
    module: string;
    permission: ToolPermissionLevel;
    inputSchema: string; // Zod schema reference
    outputSchema: string;
    timeoutMs: number;
    idempotent: boolean;
    supportsStreaming: boolean;
    requiresConfirmation: boolean;
}

export interface ValidationResult {
    isValid: boolean;
    errors?: string[];
}

export interface StructuredResponse {
    status: 'success' | 'error';
    tool: string;
    code?: string;
    message?: string;
    result?: unknown;
}

export interface ToolCall {
    tool: string;
    params: Record<string, unknown>;
}

export interface AITool {
    metadata: ToolCapabilityMetadata;
    
    validate(input: Record<string, unknown>): ValidationResult;
    execute(input: Record<string, unknown>): Promise<unknown>;
    format(result: unknown): StructuredResponse;
}

export type ToolLifecycleEvent = 
    | 'tool.requested'
    | 'tool.validated'
    | 'tool.executing'
    | 'tool.completed'
    | 'tool.failed';
