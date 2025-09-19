enum METHOD {
	GET ='GET',
	PUT ='PUT',
	POST ='POST',
	DELETE ='DELETE',
};

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

/**
 * Функцию реализовывать здесь необязательно, но может помочь не плодить логику у GET-метода
 * На входе: объект. Пример: {a: 1, b: 2, c: {d: 123}, k: [1, 2, 3]}
 * На выходе: строка. Пример: ?a=1&b=2&c=[object Object]&k=1,2,3
 */
function queryStringify(data: Record<string, unknown>): string {
	// Можно делать трансформацию GET-параметров в отдельной функции
	if (typeof data === 'object') {
		const keys = Object.keys(data);
		if (keys.length !== 0) {
			let result = '';
			keys.forEach(
				(key, index) =>
					(result += `${index === 0 ? '?' : '&'}${key}=${data[key]}`)
			);
			return result;
		}
	}
	return '';
}

export class HTTPTransport {
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

	request = (url: string, options: Options, timeout = 5000) => {
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
