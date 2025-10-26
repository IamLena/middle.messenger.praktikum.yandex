import { EventBus } from '../framework/EventBus';
import { set } from '../tools/set';
import type { AppState } from './types';

export enum StoreEvents {
	Updated = 'updated',
}

export class Store extends EventBus {
	private static __instance: Store;
	state: AppState = {};

	constructor() {
		if (Store.__instance) {
			return Store.__instance;
		}

		super();

		Store.__instance = this;
		this.state = {};
	}

	public set(path: string, value: unknown) {
		set(this.state, path, value);
		this.emit(StoreEvents.Updated);
	}

	// public forceSet(path: string, value: unknown) {
	// 	this.state, path, value);
	// 	this.emit(StoreEvents.Updated);
	// }

	public getState<T extends AppState = AppState>() {
		return { ...this.state } as T;
	}

	public invalidate(path: string) {
		const keys = path.split('.');
		if (keys.length === 0) {
			return;
		}

		let current: unknown = this.state;

		for (let index = 0; index < keys.length - 1; index += 1) {
			const key = keys[index];
			if (
				typeof current === 'object' &&
				current !== null &&
				key in (current as Record<string, unknown>)
			) {
				current = (current as Record<string, unknown>)[key];
			} else {
				return;
			}
		}

		const lastKey = keys[keys.length - 1];
		if (
			typeof current === 'object' &&
			current !== null &&
			lastKey in (current as Record<string, unknown>)
		) {
			delete (current as Record<string, unknown>)[lastKey];
			this.emit(StoreEvents.Updated);
		}
	}

	public reset() {
		this.state = {} as AppState;
	}
}

export const store = new Store();
