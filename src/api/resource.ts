import { HTTPTransport, BASE_URL } from './HTTPTransport';
import { type Resource, type ResourceUploadData } from '../types.ts';
import { parseResponse } from './error.ts';

const RESOURCE_BASE_URL = `${BASE_URL}/resources`;
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
			.then((response) => parseResponse<Resource>(response));
	},
};
