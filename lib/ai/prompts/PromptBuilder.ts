import { PromptTemplateDefinition, PromptFragment } from './types';
import { PromptValidator, PromptComposer } from './PromptComposer';
import { GlobalSystemIdentity } from './templates/system/SystemIdentity';
import { GlobalSafetyInvariants } from './templates/safety/SafetyInvariants';
import { OutputSchemaInjector } from './templates/schemas/OutputSchemaInjector';
import { WorkoutCoachPersona, IntelAnalystPersona, NutritionCoachPersona } from './templates/personas/Personas';

/**
 * The Central Registry for pre-approved templates
 */
export class PromptRegistry {
    static getTemplate(module: string): PromptTemplateDefinition {
        // Simplified router for Phase 5
        let persona = IntelAnalystPersona;
        let expectedSchema = 'insight.v1';

        if (module.toLowerCase().includes('training')) {
            persona = WorkoutCoachPersona;
            expectedSchema = 'workout.v1';
        } else if (module.toLowerCase().includes('nutrition') || module.toLowerCase().includes('diet')) {
            persona = NutritionCoachPersona;
            expectedSchema = 'suggest_meal.v1';
        }

        return {
            name: `${module} Prompt`,
            version: '2.0',
            owner: module,
            supportedModules: [module],
            expectedSchema,
            requiredMemoryLayers: ['preference', 'goal', 'session'],
            requiredTools: [],
            fragments: [
                GlobalSystemIdentity,
                persona,
                GlobalSafetyInvariants,
                OutputSchemaInjector.getFragment(expectedSchema)
            ]
        };
    }
}

export class PromptBuilder {
    /**
     * Entry point for orchestrating the entire Prompt Framework.
     * Replaces the Phase 3 monolithic string concatenation.
     */
    build(module: string, userRequest: string, memoryContextBlock: string): string {
        const start = performance.now();

        // 1. Fetch the approved template from the Registry
        const template = PromptRegistry.getTemplate(module);

        // 2. Clone fragments and inject dynamic Memory Context
        const fragments = [...template.fragments];
        fragments.push({
            id: 'dynamic_memory_context',
            type: 'memory',
            version: '1.0',
            maxTokenAllocationPct: 0.60, // Large allowance for budgeted context
            content: memoryContextBlock
        });

        // 3. Validate
        PromptValidator.validate(template, fragments);

        // 4. Compose
        const finalPrompt = PromptComposer.compose(fragments, userRequest);

        // 5. Telemetry
        const buildTime = performance.now() - start;
        console.log(`[PromptBuilder] Constructed ${template.name} v${template.version} in ${Math.round(buildTime)}ms`);

        return finalPrompt;
    }
}
