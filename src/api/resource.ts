import { HTTPTransport } from './HTTPTransport';
import { type Resource, type ResourceUploadData } from '../types.ts';

const http = new HTTPTransport('https://ya-praktikum.tech/api/v2/resources');

export const ResourceApi = {
	get: (path: string): Promise<Resource> => {
		return http.get(`/${path}`).then((response) => JSON.parse(response));
	},

	upload: (data: ResourceUploadData): Promise<Resource> => {
		return http
			.post(`/`, {
				data,
			})
			.then((response) => JSON.parse(response));
	},
};
