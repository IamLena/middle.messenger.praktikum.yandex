import { EventBus } from '../framework/EventBus';
import { set } from '../tools/set';

export enum StoreEvents {
	Updated = 'updated',
}

export class Store extends EventBus {
	private static __instance: Store;
	state: Record<string, unknown> = {};

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

	public getState() {
		return { ...this.state };
	}

	public invalidate(path: string) {
		const keys = path.split('.');
		keys.reduce((res, key) => {
			if (typeof res === 'object') {
				return res[key];
			}
			delete res[key];
		}, this.state);
	}

	public reset() {
		this.state = {};
	}
}

export const store = new Store();
