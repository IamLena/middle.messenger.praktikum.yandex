import { HTTPTransport } from './HTTPTransport';
import { type Resource, type ResourceUploadData } from '../types.ts';
import { handleApiJsonResponse } from '../error.ts';

const http = new HTTPTransport('https://ya-praktikum.tech/api/v2/resources');

export const ResourceApi = {
	get: (path: string): Promise<Resource> => {
		return http.get(`/${path}`).then((data) => handleApiJsonResponse(data));
	},

	upload: (data: ResourceUploadData): Promise<Resource> => {
		return http
			.post(`/`, {
				data,
			})
			.then((data) => handleApiJsonResponse(data));
	},
};
