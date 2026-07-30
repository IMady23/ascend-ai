import { PromptFragment } from '../../types';

export class OutputSchemaInjector {
    /**
     * Forcibly injects the exact expected schema into the prompt, ensuring
     * the AI does not rely on its "memory" of a schema or drift into free-form text.
     */
    static getFragment(schemaName: string): PromptFragment {
        // In a real environment, this would import the actual Zod schema from Phase 3,
        // serialize it to a JSON schema, and inject it.
        // For now, we mock the stringified output requirement.
        
        const schemaInstructions = `
OUTPUT FORMAT:
You must return ONLY a valid JSON object matching the "${schemaName}" schema.
Do not include markdown blocks, explanation text, or any characters outside the JSON object.

Example Structure for ${schemaName}:
{
  "schema": "${schemaName}",
  "version": "1.0",
  "confidence": "high",
  "reasoning": "...",
  "tool_calls": [],
  "widgets": []
}
`;

        return {
            id: `schema_${schemaName}`,
            type: 'schema',
            version: '1.0',
            maxTokenAllocationPct: 0.10, // Small footprint
            content: schemaInstructions
        };
    }
}
