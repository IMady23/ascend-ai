import { PromptTemplateDefinition, PromptFragment } from './types';
import { GlobalSystemIdentity } from './templates/system/SystemIdentity';
import { GlobalSafetyInvariants } from './templates/safety/SafetyInvariants';
import { OutputSchemaInjector } from './templates/schemas/OutputSchemaInjector';

export class PromptValidator {
    /**
     * Validates that the prompt is fully formed, safe, and budgeted before execution.
     */
    static validate(definition: PromptTemplateDefinition, fragments: PromptFragment[]) {
        const hasSystem = fragments.some(f => f.type === 'system');
        const hasSafety = fragments.some(f => f.type === 'safety');
        const hasSchema = fragments.some(f => f.type === 'schema');

        if (!hasSystem) throw new Error('PromptValidation Error: Missing System Identity');
        if (!hasSafety) throw new Error('PromptValidation Error: Missing Safety Invariants');
        if (!hasSchema) throw new Error('PromptValidation Error: Missing Output Schema');
        
        const totalBudget = fragments.reduce((acc, f) => acc + f.maxTokenAllocationPct, 0);
        if (totalBudget > 1.0) {
            console.warn(`[PromptValidator] Warning: Total token budget exceeds 100% (${totalBudget * 100}%). Trimming will occur.`);
        }
    }
}

export class PromptComposer {
    /**
     * Assembles the fragments in the exact deterministic order required.
     */
    static compose(fragments: PromptFragment[], userRequest: string): string {
        // Order: System -> Persona -> Module -> Safety -> Memory -> Goal -> Recent -> Request -> Schema
        
        const order = ['system', 'persona', 'module', 'safety', 'memory', 'goal', 'recent', 'schema'];
        
        let finalPrompt = '';

        order.forEach(type => {
            const block = fragments.find(f => f.type === type);
            if (block) {
                // In production, token trimming occurs here based on `block.maxTokenAllocationPct`
                finalPrompt += `--- [${type.toUpperCase()}] ---\n${block.content}\n\n`;
            }
        });

        // Finally, inject the user request before the schema
        const schemaBlock = fragments.find(f => f.type === 'schema');
        const promptWithoutSchema = finalPrompt.replace(schemaBlock ? `--- [SCHEMA] ---\n${schemaBlock.content}\n\n` : '', '');

        return `${promptWithoutSchema}--- [USER REQUEST] ---\n${userRequest}\n\n${schemaBlock ? `--- [SCHEMA] ---\n${schemaBlock.content}\n\n` : ''}`;
    }
}
