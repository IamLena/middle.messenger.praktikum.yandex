import { ResourceApi } from '../api/resource.ts';
import { ErrorWithCode, handleError } from '../api/error.ts';
import { type ResourceUploadData } from '../types.ts';

export const resourceController = {
	getSrc(path: string) {
		return ResourceApi.getUrlForSrc(path);
	},

	async uploadResource(data: ResourceUploadData) {
		try {
			await ResourceApi.upload(data);
		} catch (error) {
			if (error instanceof ErrorWithCode) {
				handleError(error);
			} else {
				alert('Failed to upload resource. Please try again later.');
			}
		}
	},
};
