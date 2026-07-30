import { MemoryItem } from '../types';

export class MemoryContextBuilder {
    private MAX_TOKENS = 4000;
    
    // Budget Allocations (Target 4000 total)
    // We assume 1 character roughly equals 0.25 tokens for this estimation
    private BUDGETS = {
        goal: 0.20,       // 800 tokens
        preference: 0.15, // 600 tokens
        session: 0.20,    // 800 tokens
        knowledge: 0.15,  // 600 tokens
        summary: 0.10,    // 400 tokens
        request: 0.20     // 800 tokens (Reserved for User Prompt & System Message)
    };

    /**
     * Enforces the token budget across the fetched layers, ensuring the 
     * context window is never breached while prioritizing the most important memories.
     */
    buildBudgetedContext(categorizedMemories: Record<string, MemoryItem[]>): string {
        let compiledContext = `<context>\n`;

        compiledContext += this.packLayer('GOALS', categorizedMemories.goals, this.BUDGETS.goal);
        compiledContext += this.packLayer('PREFERENCES', categorizedMemories.preferences, this.BUDGETS.preference);
        compiledContext += this.packLayer('SESSION', categorizedMemories.session, this.BUDGETS.session);
        compiledContext += this.packLayer('KNOWLEDGE', categorizedMemories.knowledge, this.BUDGETS.knowledge);
        compiledContext += this.packLayer('SUMMARY', categorizedMemories.summary, this.BUDGETS.summary);

        compiledContext += `</context>\n\n`;
        return compiledContext;
    }

    private packLayer(layerName: string, items: MemoryItem[], budgetPct: number): string {
        if (!items || items.length === 0) return '';

        const maxLayerChars = (this.MAX_TOKENS * budgetPct) * 4; 
        let layerContent = `  <${layerName.toLowerCase()}>\n`;
        let currentCharCount = 0;

        for (const item of items) {
            const itemString = `    - ${item.content}\n`;
            if (currentCharCount + itemString.length > maxLayerChars) {
                break; // Stop packing this layer to respect the budget limit
            }
            layerContent += itemString;
            currentCharCount += itemString.length;
        }

        layerContent += `  </${layerName.toLowerCase()}>\n`;
        return layerContent;
    }
}
