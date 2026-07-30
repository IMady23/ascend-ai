import { AscendEvent, EventType } from "@/types/events";

export type EventHandler = (event: AscendEvent) => Promise<void> | void;

class EventBus {
  private handlers: Map<EventType | '*', EventHandler[]> = new Map();

  subscribe(eventType: EventType | '*', handler: EventHandler) {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, []);
    }
    this.handlers.get(eventType)!.push(handler);
  }

  unsubscribe(eventType: EventType | '*', handler: EventHandler) {
    if (!this.handlers.has(eventType)) return;
    const currentHandlers = this.handlers.get(eventType)!;
    this.handlers.set(
      eventType,
      currentHandlers.filter((h) => h !== handler)
    );
  }

  async dispatch(event: AscendEvent) {
    // Call specific handlers
    const specificHandlers = this.handlers.get(event.type) || [];
    // Call wildcard handlers
    const wildcardHandlers = this.handlers.get('*') || [];

    const allHandlers = [...specificHandlers, ...wildcardHandlers];
    
    // Execute handlers sequentially (can be changed to parallel if needed)
    for (const handler of allHandlers) {
      try {
        await handler(event);
      } catch (error) {
        console.error(`Error in event handler for ${event.type}:`, error);
      }
    }
  }
}

export const eventBus = new EventBus();
