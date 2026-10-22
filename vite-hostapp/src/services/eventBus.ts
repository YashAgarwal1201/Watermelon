// File: src/services/eventBus.ts

export type EventHandler<T = any> = (payload: T) => void;

export interface EventBus {
  on<T = any>(event: string, handler: EventHandler<T>): () => void;
  off<T = any>(event: string, handler: EventHandler<T>): void;
  emit<T = any>(event: string, payload?: T): void;
  clear(): void;
}

class WatermelonEventBus implements EventBus {
  private handlers = new Map<string, Set<EventHandler>>();

  on<T = any>(event: string, handler: EventHandler<T>): () => void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)!.add(handler as EventHandler);

    return () => this.off(event, handler);
  }

  off<T = any>(event: string, handler: EventHandler<T>): void {
    const set = this.handlers.get(event);
    if (set) {
      set.delete(handler as EventHandler);
      if (set.size === 0) {
        this.handlers.delete(event);
      }
    }
  }

  emit<T = any>(event: string, payload?: T): void {
    const set = this.handlers.get(event);
    if (set) {
      set.forEach((handler) => {
        try {
          handler(payload);
        } catch (err) {
          console.error(`[EventBus] Error in handler for event "${event}":`, err);
        }
      });
    }

    // Also dispatch on window as a CustomEvent for browser-level interoperability
    if (typeof window !== "undefined") {
      try {
        window.dispatchEvent(new CustomEvent(event, { detail: payload }));
      } catch {}
    }
  }

  clear(): void {
    this.handlers.clear();
  }
}

export const eventBus: EventBus = new WatermelonEventBus();
