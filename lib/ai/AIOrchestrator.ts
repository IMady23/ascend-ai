import { AIRequest, AIResponse } from './types';
import { Timestamp } from 'firebase/firestore';
import { ConversationManager } from './conversation/ConversationManager';
import { MemoryRetrieval } from './memory/MemoryRetrieval';
import { MemoryContextBuilder } from './memory/MemoryContextBuilder';
import { MemoryMetrics } from './memory/MemoryMetrics';
import { FirebaseMemoryStore } from './memory/MemoryStore';
import { MemoryPolicyEngine } from './memory/MemoryPolicyEngine';
import { PromptBuilder } from './prompts/PromptBuilder';
import { AIGateway } from './gateway/AIGateway';
import { ResponseValidator } from './validation/ResponseValidator';
import { AiRepository } from '@/services/repositories/ai.repository';
import { AiMessage } from '@/types/ai';
import { ToolRegistry } from './tools/ToolRegistry';
import { ToolRouter } from './tools/ToolRouter';
import { CreateWorkoutTool } from './tools/actions/CreateWorkout';
import { LogMealTool } from './tools/actions/LogMeal';
import { UpdateWorkoutTool } from './tools/actions/UpdateWorkout';
import { UpdateGoalTool } from './tools/actions/UpdateGoal';
import { SavePreferenceTool } from './tools/actions/SavePreference';
import { GenerateMealPlanTool } from './tools/actions/GenerateMealPlan';
import { SuggestMealTool } from './tools/actions/SuggestMeal';
import { StreamingEngine } from './streaming/StreamingEngine';

/**
 * Top-Level AI Entry Point
 */
export class AIOrchestrator {
    private conversationManager = new ConversationManager();
    private memoryStore = new FirebaseMemoryStore();
    private memoryRetrieval = new MemoryRetrieval(this.memoryStore);
    private memoryPolicy = new MemoryPolicyEngine(this.memoryStore);
    private memoryContextBuilder = new MemoryContextBuilder();
    private promptBuilder = new PromptBuilder();
    private gateway = new AIGateway('openrouter');
    private validator = new ResponseValidator();
    private toolRegistry = new ToolRegistry();
    private toolRouter = new ToolRouter(this.toolRegistry);
    private streamingEngine = new StreamingEngine();

    constructor() {
        // Register production tools
        this.toolRegistry.register(new CreateWorkoutTool());
        this.toolRegistry.register(new LogMealTool());
        this.toolRegistry.register(new UpdateWorkoutTool());
        this.toolRegistry.register(new UpdateGoalTool());
        this.toolRegistry.register(new SavePreferenceTool());
        this.toolRegistry.register(new GenerateMealPlanTool());
        this.toolRegistry.register(new SuggestMealTool());
    }

    /**
     * Executes a full AI lifecycle request synchronously.
     */
    async executeAICommand(context: { correlationId: string; requestId: string; identity: { id: string } }, prompt: string, enrichedSnapshot: any, chatHistory?: any[]): Promise<AIResponse> {
        const currentModule = enrichedSnapshot?.coachingScenario || 'general';
        const start = performance.now();
        const convo = this.conversationManager.startConversation(context.identity.id);
        
        const request: AIRequest = {
            id: context.requestId,
            correlationId: context.correlationId,
            conversationId: convo.id,
            userId: context.identity.id,
            prompt,
            chatHistory,
            timestamp: Date.now()
        };

        this.streamingEngine.emit('conversation.started', { requestId: context.requestId });

        // Phase 4: Deterministic Memory Retrieval & Context Slicing
        const memoryStart = performance.now();
        const categorizedMemories = await this.memoryRetrieval.fetchRelevantContext(context.identity.id, currentModule);
        
        MemoryMetrics.logRetrieval({
            requestId: context.requestId,
            retrievalCount: Object.values(categorizedMemories).flat().length,
            retrievalLatencyMs: performance.now() - memoryStart,
            tokenUsageEstimated: 0, 
            conflictResolutions: 0
        });

        const budgetContext = this.memoryContextBuilder.buildBudgetedContext(categorizedMemories, enrichedSnapshot);

        // Phase 5: Modular Prompt Framework
        request.systemContext = this.promptBuilder.build(currentModule, prompt, budgetContext);

        this.streamingEngine.emit('reasoning.started', { requestId: context.requestId });

        // Gateway Execution
        const rawResponse = await this.gateway.execute(request);

        // Schema Validation
        const validResponse = this.validator.validate(rawResponse);

        // Phase 6: Deterministic Tool Execution via ToolRouter
        if (validResponse.tool_calls.length > 0) {
            this.streamingEngine.emit('tool.executing', { toolCount: validResponse.tool_calls.length });
            for (const call of validResponse.tool_calls) {
                // The AI only provides the intent. The router handles permissions and idempotency.
                const toolResult = await this.toolRouter.route(context.identity.id, context.requestId, call.tool, call.params as Record<string, unknown>);
                
                // If the tool failed validation or permission, we can safely log it.
                if (toolResult.status === 'error') {
                    console.warn(`[Orchestrator] Tool ${call.tool} failed: ${toolResult.message}`);
                } else if (toolResult.status === 'success' && call.tool === 'Suggest_Meal') {
                    // Map the suggest meal result directly to a widget payload for the frontend
                    validResponse.widgets = validResponse.widgets || [];
                    validResponse.widgets.push({
                        component: 'Suggest_Meal',
                        data: toolResult.result as Record<string, unknown>
                    });
                }
            }
        }

        // Phase 4: Write Memory via Policy Engine
        // Any inferred knowledge from the AI response should be evaluated and saved safely.
        await this.memoryPolicy.processAndStore(context.identity.id, {
            content: `User initiated conversation regarding: ${prompt}`,
            suggestedLayer: 'session',
            source: convo.id,
            createdBy: 'user',
            tags: [currentModule]
        });
        
        // Also evaluate the AI's response for long-term facts
        if (validResponse.reasoning || validResponse.rawText) {
            await this.memoryPolicy.processAndStore(context.identity.id, {
                content: `AI responded: ${validResponse.reasoning || validResponse.rawText}`,
                suggestedLayer: 'summary',
                source: convo.id,
                createdBy: 'ai_inference',
                tags: [currentModule]
            });
        }

        // Save Raw Chat History to aiChats collection
        const userAiMsg: AiMessage = {
            id: `msg-${Date.now()}-user`,
            content: prompt,
            role: "user",
            timestamp: Timestamp.now()
        };
        const aiAiMsg: AiMessage = {
            id: `msg-${Date.now()}-ai`,
            content: validResponse.reasoning || validResponse.rawText || "",
            role: "assistant",
            timestamp: Timestamp.now()
        };
        
        await AiRepository.createConversation(context.identity.id, {
            id: convo.id,
            userId: context.identity.id,
            title: prompt.substring(0, 30) + '...',
            startedAt: Timestamp.now(),
            lastMessageAt: Timestamp.now(),
            summary: validResponse.reasoning?.substring(0, 50) || "",
            model: "openrouter-default"
        });
        
        await AiRepository.createMessage(context.identity.id, convo.id, userAiMsg);
        await AiRepository.createMessage(context.identity.id, convo.id, aiAiMsg);

        // Widget Mounting Broadcast
        if (validResponse.widgets.length > 0) {
            this.streamingEngine.emit('widget.render', { widgets: validResponse.widgets.map(w => w.component) });
        }

        this.streamingEngine.emit('response.completed', { requestId: context.requestId });

        return validResponse;
    }
}
