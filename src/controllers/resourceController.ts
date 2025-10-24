import { ResourceApi } from '../api/resource.ts';
import { ErrorWithCode, handleError } from '../api/error.ts';
import { Router } from '../framework/Router.ts';
// import { store } from '../store/Store.ts';
import { type ResourceUploadData } from '../types.ts';

export const resourceController = {
	async getResourceByPath(path: string) {
		try {
			await ResourceApi.get(path);
			// store.set?
		} catch (error) {
			if (error instanceof ErrorWithCode) {
				handleError(error);
			} else {
				const router = new Router();
				console.log(error); // router.go('/fatal');
			}
		}
	},

	async uploadResource(data: ResourceUploadData) {
		try {
			// data: new FormData(document.getById('avatar form')),
			await ResourceApi.upload(data);
		} catch (error) {
			if (error instanceof ErrorWithCode) {
				handleError(error);
			} else {
				const router = new Router();
				console.log(error); // router.go('/fatal');
			}
		}
	},
};
