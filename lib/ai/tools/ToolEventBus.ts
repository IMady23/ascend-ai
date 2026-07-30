import { AITool, ToolLifecycleEvent } from '../types/Tool';

export class ToolEventBus {
    private static listeners: ((event: ToolLifecycleEvent, toolName: string, data?: any) => void)[] = [];

    static subscribe(callback: (event: ToolLifecycleEvent, toolName: string, data?: any) => void) {
        this.listeners.push(callback);
    }

    static emit(event: ToolLifecycleEvent, toolName: string, data?: any) {
        this.listeners.forEach(listener => {
            try {
                listener(event, toolName, data);
            } catch (e) {
                console.error('[ToolEventBus] Error:', e);
            }
        });
    }
}
