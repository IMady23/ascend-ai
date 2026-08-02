import { ToolCall } from './Tool';

export interface AIResponse {
  schema: string;
  version: string;
  confidence: 'high' | 'medium' | 'low';
  provider: string;
  model: string;
  latency_ms: number;
  reasoning?: string;
  tool_calls: ToolCall[];
  widgets: WidgetData[];
  rawText?: string;
  summary?: string; // Human-readable summary of the AI response, displayed in the UI
}

export interface WidgetData {
  component: string;
  data: Record<string, unknown>;
}
