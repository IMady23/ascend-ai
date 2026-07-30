import { MemoryItem } from '../types';

export interface ExplanationResponse {
    summary: string;
    bulletPoints: string[];
}

export class MemoryExplainer {
    /**
     * Translates backend memory context into a user-friendly transparency report.
     * This ensures users always understand *why* the AI said something.
     */
    explain(activeContext: Record<string, MemoryItem[]>): ExplanationResponse {
        const bulletPoints: string[] = [];

        if (activeContext.goals?.length) {
            bulletPoints.push(`Your goal is ${activeContext.goals[0].content}`);
        }
        if (activeContext.preferences?.length) {
            bulletPoints.push(`You prefer ${activeContext.preferences[0].content}`);
        }
        if (activeContext.knowledge?.length) {
            bulletPoints.push(`I noticed ${activeContext.knowledge[0].content}`);
        }

        return {
            summary: "Because:",
            bulletPoints
        };
    }
}
