import { NO_HANDLER_ERROR } from '../errorConsts';

export type Handler = (...args: unknown[]) => void;
export type EventName = string;
export type EventsToPass = Record<string, Handler>;
type Listeners = Record<string, Handler[]>;
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
			(listener) => listener !== callback
		);
	}

	// emit an event = call all the handlers registered for it
	emit(event: EventName, ...args: unknown[]) {
		if (!this.listeners[event]) {
			throw new Error(NO_HANDLER_ERROR(event));
		}

		this.listeners[event].forEach(function (listener) {
			listener(...args);
		});
	}
}
