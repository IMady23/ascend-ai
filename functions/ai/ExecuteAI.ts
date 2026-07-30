import { FunctionRouter } from '../shared/FunctionRouter';
import { ExecutionContext } from '../shared/types';
import { AIOrchestrator } from '../../lib/ai/AIOrchestrator';

export const executeAI = async (req: { token: string; prompt: string; currentModule: string }) => {
    return FunctionRouter.route(
        {
            token: req.token,
            operation: 'ai.chat', // Mock permission
            resourceId: null,
            payload: req
        },
        async (context: ExecutionContext, payload: any) => {
            // The Cloud Function acts as thin orchestration
            const orchestrator = new AIOrchestrator();
            
            // In a real environment, the Orchestrator would receive the `context`
            // In a real environment, the Orchestrator would receive the `context`
            // and pass the `correlationId` and `userId` all the way down.
            await orchestrator.executeAICommand(context, payload.prompt, payload.currentModule);
            
            return { status: 'success' };
        }
    );
};
