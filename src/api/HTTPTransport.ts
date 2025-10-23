import { queryStringify } from '../tools/queryStringify';

enum METHOD {
	GET = 'GET',
	PUT = 'PUT',
	POST = 'POST',
	DELETE = 'DELETE',
}

type Options = {
	timeout?: number;
	method?: METHOD;
	headers?: Record<string, string>;
	data?:
		| Record<string, unknown>
		| Document
		| XMLHttpRequestBodyInit
		| null
		| undefined;
};

export class HTTPTransport {
	urlBase: string;

	constructor(urlBase: string | undefined) {
		this.urlBase = urlBase || '';
	}

	get = (url: string, options: Options = {}) => {
		return this.request(
			url,
			{ ...options, method: METHOD.GET },
			options.timeout
		);
	};

	post = (url: string, options: Options = {}) => {
		return this.request(
			url,
			{ ...options, method: METHOD.POST },
			options.timeout
		);
	};

	put = (url: string, options: Options = {}) => {
		return this.request(
			url,
			{ ...options, method: METHOD.PUT },
			options.timeout
		);
	};

	delete = (url: string, options: Options = {}) => {
		return this.request(
			url,
			{ ...options, method: METHOD.DELETE },
			options.timeout
		);
	};

	request = (path: string, options: Options, timeout = 5000) => {
		const url = this.urlBase + path;

		const { method, headers = {}, data } = options;

		if (!method) {
			throw new Error('no method');
		}

		const urlForOpen =
			method === METHOD.GET && data
				? url + queryStringify(data as Record<string, unknown>)
				: url;

		return new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();

			xhr.open(method, urlForOpen);

			xhr.timeout = timeout;

			xhr.onload = function () {
				resolve(xhr);
			};

			xhr.onabort = reject;
			xhr.onerror = reject;
			xhr.ontimeout = () => {
				throw new Error('timeout');
			};

			Object.keys(headers).forEach((headerName) =>
				xhr.setRequestHeader(headerName, headers[headerName])
			);

			xhr.withCredentials = true;

			if (method === METHOD.GET || !data) {
				xhr.send();
			} else {
				xhr.send(
					data as Document | XMLHttpRequestBodyInit | null | undefined
				);
			}
		});
	};
}
