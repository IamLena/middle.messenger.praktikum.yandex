import { ResourceApi } from '../api/resource.ts';
import { FatalError, UnauthorizedError } from '../error.ts';
import { Router } from '../framework/Router.ts';
import { store } from '../store/Store.ts';
import { type ResourceUploadData } from '../types.ts';

export const resourceController = {
	async getResourceByPath(path: string) {
		try {
			await ResourceApi.get(path);
		} catch (error) {
			const router = new Router();
			if (error instanceof FatalError) {
				router.go('/fatal');
			} else if (error instanceof UnauthorizedError) {
				store.invalidate('chats');
				router.go('/');
			} else {
				//alert(`${error} ${(error as Error).cause}`);
			}
		}
	},

	async uploadResource(data: ResourceUploadData) {
		try {
			// data: new FormData(document.getById('avatar form')),
			await ResourceApi.upload(data);
		} catch (error) {
			const router = new Router();
			if (error instanceof FatalError) {
				router.go('/fatal');
			} else if (error instanceof UnauthorizedError) {
				store.invalidate('chats');
				router.go('/');
			} else {
				//alert(`${error} ${(error as Error).cause}`);
			}
		}
	},
};
