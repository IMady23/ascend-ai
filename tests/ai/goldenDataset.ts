import { AIRequest } from '../../lib/ai/types/AIRequest';

export interface AIEvaluationCase {
    id: string;
    description: string;
    prompt: string;
    expectedToolCalls: string[];
    expectedJsonKeys?: string[];
}

export const GOLDEN_DATASET: AIEvaluationCase[] = [
    {
        id: 'eval_001',
        description: 'Should extract workout intent and route to CreateWorkout tool',
        prompt: 'I want to do a 30 minute chest workout',
        expectedToolCalls: ['CreateWorkoutAction']
    },
    {
        id: 'eval_002',
        description: 'Should parse a complex meal and extract macros',
        prompt: 'I just ate 2 eggs and a slice of toast',
        expectedToolCalls: ['LogNutritionAction']
    }
];
