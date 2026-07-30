export interface TelemetryData {
  requestId: string;
  correlationId: string;
  conversationId: string;
  model: string;
  latency_ms: number;
  tokensIn: number;
  tokensOut: number;
  cacheHit: boolean;
  retryCount: number;
  validationSuccess: boolean;
  toolUsage: string[];
}
