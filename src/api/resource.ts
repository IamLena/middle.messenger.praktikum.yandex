import { HTTPTransport } from './HTTPTransport';
import { type Resource, type ResourceUploadData } from '../types.ts';

const RESOURCE_BASE_URL = 'https://ya-praktikum.tech/api/v2/resources';
const http = new HTTPTransport(RESOURCE_BASE_URL);

export const ResourceApi = {
	getUrlForSrc: (path: string) => {
		const pathNormalized = path.startsWith('/') ? path : `/${path}`;
		return `${RESOURCE_BASE_URL}${pathNormalized}`;
	},

	upload: (data: ResourceUploadData): Promise<Resource> => {
		return http
			.post(`/`, {
				data,
			})
			.then((response) => JSON.parse(response));
	},
};
