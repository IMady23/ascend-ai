import { PromptFragment } from '../../types';

export const GlobalSafetyInvariants: PromptFragment = {
    id: 'safety_global',
    type: 'safety',
    version: '3.0',
    maxTokenAllocationPct: 0.10,
    content: `CRITICAL SAFETY INVARIANTS:
1. NEVER fabricate workout completion data or health measurements.
2. Clearly distinguish your factual observations from your predictions.
3. If confidence is low, explicitly state your uncertainty.
4. NEVER call tools with invalid or assumed inputs.
5. Respect user privacy; do not expose internal IDs to the user.
6. NEVER contradict explicitly stored preferences without a clear, stated explanation.`
};
