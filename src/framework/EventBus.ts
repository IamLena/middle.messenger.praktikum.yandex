type Handler = (...args: any[]) => void;
type EventName = string;
export type EventsToPass = Record<string, Handler>;
type Listeners = Record<string, Handler[]>;

const NO_HANDLER_ERROR = (eventName: EventName) => `There is no handler for event: ${eventName}`;

export class EventBus {
  listeners: Listeners;

  constructor() {
    this.listeners = {};
  }

  // register handlers that will be called when event is emited
  on(event: EventName, callback: Handler) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }

    this.listeners[event].push(callback);
  }

  // remove certain handler
  off(event: EventName, callback: Handler) {
		if (!this.listeners[event]) {
      throw new Error(NO_HANDLER_ERROR(event));
    }

    this.listeners[event] = this.listeners[event].filter(
      listener => listener !== callback
    );
  }

  // emit an event = call all the handlers registered for it
	emit(event: EventName, ...args: any) {
    if (!this.listeners[event]) {
      throw new Error(NO_HANDLER_ERROR(event));
    }
    
    this.listeners[event].forEach(function(listener) {
      listener(...args);
    });
  }
}
