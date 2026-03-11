import { EventEmitter } from "events";

class AsyncEventEmitter extends EventEmitter {
    async emitAsync(event: string | symbol, ...args: any) {
        const listeners = this.listeners(event);

        for (const listener of listeners) {
          const returnValue = listener(...args);
          
            if (returnValue instanceof Promise) {
                await returnValue;
            }
        }

        console.log(`Event emitted: ${String(event)}`, ...args);
    }
}

export const events = new AsyncEventEmitter();