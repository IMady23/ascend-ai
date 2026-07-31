import { ToolRegistry } from './ToolRegistry';
import { ToolValidator } from './ToolValidator';
import { ToolPermissionManager } from './ToolPermissionManager';
import { ToolIdempotencyManager } from './ToolIdempotencyManager';
import { ToolExecutor } from './ToolExecutor';
import { ToolResultFormatter } from './ToolResultFormatter';
import { ToolAuditLogger } from './ToolAuditLogger';
import { StructuredResponse } from '../types/Tool';
import { ToolEventBus } from './ToolEventBus';

export class ToolRouter {
    private registry: ToolRegistry;
    private validator: ToolValidator;
    private permissionManager: ToolPermissionManager;
    private idempotencyManager: ToolIdempotencyManager;
    private executor: ToolExecutor;

    constructor(registry: ToolRegistry) {
        this.registry = registry;
        this.validator = new ToolValidator();
        this.permissionManager = new ToolPermissionManager();
        this.idempotencyManager = new ToolIdempotencyManager();
        this.executor = new ToolExecutor();
    }

    /**
     * The single entry point for all tool execution.
     * Guarantees safety, permissions, idempotency, and structured error boundaries.
     */
    async route(
        userId: string, 
        requestId: string, 
        toolName: string, 
        input: Record<string, unknown>
    ): Promise<StructuredResponse> {
        const start = performance.now();
        ToolEventBus.emit('tool.requested', toolName, input);

        // 1. Tool Existence
        const tool = this.registry.getTool(toolName);
        if (!tool) {
            return this.logAndFormatError(requestId, userId, toolName, 'NOT_FOUND', 'Tool is not registered in the platform.', start);
        }

        // 2. Idempotency Check
        // We use the combination of requestId and toolName as the operationId.
        const operationId = `${requestId}_${toolName}`;
        const cachedResult = this.idempotencyManager.checkOrCache(operationId, tool);
        if (cachedResult) {
            return cachedResult;
        }

        // 3. Validation Check
        const validationResult = this.validator.validate(tool, input);
        if (!validationResult.isValid) {
            return this.logAndFormatError(requestId, userId, toolName, 'VALIDATION_FAILED', validationResult.errors?.join(', ') || 'Invalid Schema', start);
        }

        // 4. Authorization Check
        const isAuthorized = this.permissionManager.authorize(tool, userId);
        if (!isAuthorized) {
            return this.logAndFormatError(requestId, userId, toolName, 'PERMISSION_DENIED', `User lacks '${tool.metadata.permission}' privileges for ${toolName}.`, start);
        }

        // 5. Execution
        let finalResponse: StructuredResponse;
        try {
            const enrichedInput = { ...input, _userId: userId };
            const rawResult = await this.executor.execute(tool, enrichedInput);
            finalResponse = ToolResultFormatter.formatSuccess(tool, rawResult);
            
            // Cache successful idempotent requests
            if (tool.metadata.idempotent) {
                this.idempotencyManager.cacheResult(operationId, finalResponse);
            }
        } catch (error: any) {
            finalResponse = ToolResultFormatter.formatError(toolName, 'EXECUTION_FAILED', error.message);
        }

        // 6. Audit Logging
        const duration = Math.round(performance.now() - start);
        ToolAuditLogger.log(requestId, userId, toolName, finalResponse, duration);

        return finalResponse;
    }

    private logAndFormatError(requestId: string, userId: string, toolName: string, code: string, message: string, start: number): StructuredResponse {
        const response = ToolResultFormatter.formatError(toolName, code, message);
        const duration = Math.round(performance.now() - start);
        ToolAuditLogger.log(requestId, userId, toolName, response, duration);
        return response;
    }
}
