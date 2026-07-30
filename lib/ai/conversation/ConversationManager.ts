export interface Conversation {
    id: string;
    userId: string;
    sessionId: string;
    startedAt: number;
    lastUpdatedAt: number;
    metadata: Record<string, unknown>;
}

export class ConversationManager {
    /**
     * Initializes a new conversation session.
     */
    startConversation(userId: string, metadata: Record<string, unknown> = {}): Conversation {
        const timestamp = Date.now();
        return {
            id: `conv_${this.generateId()}`,
            userId,
            sessionId: `sess_${this.generateId()}`,
            startedAt: timestamp,
            lastUpdatedAt: timestamp,
            metadata
        };
    }

    /**
     * Generates a unique request ID for tracing and telemetry.
     */
    generateRequestId(): string {
        return `req_${this.generateId()}`;
    }

    private generateId(): string {
        // A simple random ID generator for demonstration.
        // In production, this would use a robust UUID/CUID generator.
        return Math.random().toString(36).substring(2, 10);
    }
}
