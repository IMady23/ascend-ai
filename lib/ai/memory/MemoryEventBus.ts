import { MemoryItem } from '../types';

export type MemoryEventType = 
    | 'memory.created' 
    | 'memory.updated' 
    | 'memory.expired' 
    | 'memory.merged' 
    | 'memory.summarized' 
    | 'memory.deleted';

export interface MemoryEvent {
    type: MemoryEventType;
    memoryId: string;
    timestamp: number;
    data?: Partial<MemoryItem>;
}

export class MemoryEventBus {
    private static listeners: ((event: MemoryEvent) => void)[] = [];

    static subscribe(callback: (event: MemoryEvent) => void) {
        this.listeners.push(callback);
    }

    static emit(type: MemoryEventType, memoryId: string, data?: Partial<MemoryItem>) {
        const event: MemoryEvent = {
            type,
            memoryId,
            timestamp: Date.now(),
            data
        };
        
        // In a real environment, this might use Node's EventEmitter or a browser CustomEvent
        this.listeners.forEach(listener => {
            try {
                listener(event);
            } catch (e) {
                console.error('[MemoryEventBus] Error in listener:', e);
            }
        });
    }
}
