export type StreamingEventType = 
  | 'conversation.started'
  | 'reasoning.started'
  | 'tool.executing'
  | 'widget.render'
  | 'response.completed';

export interface StreamingEvent {
  type: StreamingEventType;
  timestamp: number;
  data?: unknown;
}
