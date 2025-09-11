type Handler = (...args: any[]) => void;
type EventName = string;
export type EventsToPass = Record<string, Handler>;
type listeners = Record<string, Handler[]>;

export class EventBus {
  listeners: listeners;

  constructor() {
    this.listeners = {};
  }

  on(event: EventName, callback: Handler) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }

    this.listeners[event].push(callback);
  }

  off(event: EventName, callback: Handler) {
		if (!this.listeners[event]) {
      throw new Error(`Нет события: ${event}`);
    }

    this.listeners[event] = this.listeners[event].filter(
      listener => listener !== callback
    );
  }

	emit(event: EventName, ...args: any) {
    if (!this.listeners[event]) {
      throw new Error(`Нет события: ${event}`);
    }
    
    this.listeners[event].forEach(function(listener) {
      listener(...args);
    });
  }
}
