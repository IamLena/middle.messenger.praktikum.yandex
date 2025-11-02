import { jest } from '@jest/globals';
import type { SpiedClass } from 'jest-mock';
import { HTTPTransport, BASE_URL } from './HTTPTransport';
import { ErrorWithCode } from './error';

type MockXhr = Partial<XMLHttpRequest> & {
	open: jest.MockedFunction<XMLHttpRequest['open']>;
	setRequestHeader: jest.MockedFunction<XMLHttpRequest['setRequestHeader']>;
	send: jest.MockedFunction<XMLHttpRequest['send']>;
	timeout: number;
	status: number;
	response: unknown;
	withCredentials: boolean;
	onabort:
		| ((this: XMLHttpRequest, ev: ProgressEvent<EventTarget>) => unknown)
		| null;
	onerror:
		| ((this: XMLHttpRequest, ev: ProgressEvent<EventTarget>) => unknown)
		| null;
	onload:
		| ((this: XMLHttpRequest, ev: ProgressEvent<EventTarget>) => unknown)
		| null;
	ontimeout:
		| ((this: XMLHttpRequest, ev: ProgressEvent<EventTarget>) => unknown)
		| null;
	sentBody: Document | XMLHttpRequestBodyInit | null;
	headers: Record<string, string>;
};

const createMockXhr = (): MockXhr => {
	const xhr: MockXhr = {
		open: jest.fn() as unknown as jest.MockedFunction<
			XMLHttpRequest['open']
		>,
		setRequestHeader: jest.fn() as unknown as jest.MockedFunction<
			XMLHttpRequest['setRequestHeader']
		>,
		send: jest.fn() as unknown as jest.MockedFunction<
			XMLHttpRequest['send']
		>,
		timeout: 0,
		status: 200,
		response: 'ok',
		withCredentials: false,
		onabort: null,
		onerror: null,
		onload: null,
		ontimeout: null,
		sentBody: null,
		headers: {},
	};

	xhr.setRequestHeader.mockImplementation((name: string, value: string) => {
		xhr.headers[name] = value;
	});

	xhr.send.mockImplementation(
		(body?: Document | XMLHttpRequestBodyInit | null) => {
			xhr.sentBody = body ?? null;
			const handler = xhr.onload;
			if (handler) {
				handler.call(
					xhr as unknown as XMLHttpRequest,
					new ProgressEvent('load')
				);
			}
		}
	);

	return xhr;
};

describe('HTTPTransport', () => {
	let activeXhr: MockXhr | undefined;
	let xhrSpy: SpiedClass<typeof XMLHttpRequest>;
	let nextXhrSetup: ((xhr: MockXhr) => void) | undefined;

	const prepareNextXhr = (setup: (xhr: MockXhr) => void) => {
		nextXhrSetup = setup;
	};

	beforeEach(() => {
		activeXhr = undefined;
		nextXhrSetup = undefined;
		xhrSpy = jest
			.spyOn(
				globalThis as { XMLHttpRequest: typeof XMLHttpRequest },
				'XMLHttpRequest'
			)
			.mockImplementation(() => {
				const xhr = createMockXhr();
				if (nextXhrSetup) {
					nextXhrSetup(xhr);
					nextXhrSetup = undefined;
				}
				activeXhr = xhr;
				return xhr as unknown as XMLHttpRequest;
			});
	});

	afterEach(() => {
		xhrSpy.mockRestore();
		jest.clearAllMocks();
	});

	test('builds base url with passed endpoint', () => {
		const transport = new HTTPTransport('/auth');
		expect(transport.urlBase).toBe(`${BASE_URL}/auth`);
	});

	test('creates empty base url when no endpoint passed', () => {
		const transport = new HTTPTransport(undefined);
		expect(transport.urlBase).toBe('');
	});

	test('makes GET request with query string', async () => {
		const transport = new HTTPTransport('/auth');

		const promise = transport.get('/user', { data: { login: 'vasya' } });

		expect(xhrSpy).toHaveBeenCalledTimes(1);
		expect(activeXhr).toBeTruthy();
		expect(activeXhr!.open).toHaveBeenCalledWith(
			'GET',
			`${BASE_URL}/auth/user?login=vasya`
		);
		expect(activeXhr!.send).toHaveBeenCalledWith();
		expect(activeXhr!.timeout).toBe(5000);
		expect(activeXhr!.withCredentials).toBe(true);

		await expect(promise).resolves.toBe('ok');
	});

	test('makes POST request with body and headers', async () => {
		const transport = new HTTPTransport('/auth');
		const payload = JSON.stringify({ id: 7, name: 'bob' });

		const promise = transport.post('/user', {
			data: payload,
			headers: { 'Content-Type': 'application/json' },
		});

		expect(activeXhr).toBeTruthy();
		expect(activeXhr!.open).toHaveBeenCalledWith(
			'POST',
			`${BASE_URL}/auth/user`
		);
		expect(activeXhr!.setRequestHeader).toHaveBeenCalledWith(
			'Content-Type',
			'application/json'
		);
		expect(activeXhr!.send).toHaveBeenCalledWith(payload);
		expect(activeXhr!.timeout).toBe(5000);

		await expect(promise).resolves.toBe('ok');
	});

	test('performs PUT request with body', async () => {
		const transport = new HTTPTransport('/auth');
		const payload = JSON.stringify({ name: 'Tom' });

		const promise = transport.put('/user/7', {
			data: payload,
			headers: { 'Content-Type': 'application/json' },
		});

		expect(activeXhr).toBeTruthy();
		expect(activeXhr!.open).toHaveBeenCalledWith(
			'PUT',
			`${BASE_URL}/auth/user/7`
		);
		expect(activeXhr!.setRequestHeader).toHaveBeenCalledWith(
			'Content-Type',
			'application/json'
		);
		expect(activeXhr!.send).toHaveBeenCalledWith(payload);

		await expect(promise).resolves.toBe('ok');
	});

	test('makes DELETE request without body', async () => {
		const transport = new HTTPTransport('/auth');

		const promise = transport.delete('/user/7');

		expect(activeXhr).toBeTruthy();
		expect(activeXhr!.open).toHaveBeenCalledWith(
			'DELETE',
			`${BASE_URL}/auth/user/7`
		);
		expect(activeXhr!.send).toHaveBeenCalledWith();

		await expect(promise).resolves.toBe('ok');
	});

	test('throws error when method is missing', () => {
		const transport = new HTTPTransport('/auth');
		expect(() => transport.request('/user', {} as never)).toThrow(
			'no method'
		);
	});

	test('resolves with raw response when status is success', async () => {
		const transport = new HTTPTransport('/auth');
		const customResponse = JSON.stringify({
			users: [{ id: 7, name: 'Bob' }],
		});

		prepareNextXhr((xhr) => {
			xhr.response = customResponse;
		});

		await expect(transport.get('/users')).resolves.toBe(customResponse);
	});

	test('throws ErrorWithCode when status is not success', async () => {
		const transport = new HTTPTransport('/auth');

		prepareNextXhr((xhr) => {
			xhr.status = 500;
			xhr.response = JSON.stringify({ reason: 'internal error' });
		});

		try {
			await transport.get('/users');
		} catch (error) {
			expect(error).toBeInstanceOf(ErrorWithCode);
			expect(error).toMatchObject({
				message: 'internal error',
				code: 500,
			});
		}
	});
});
