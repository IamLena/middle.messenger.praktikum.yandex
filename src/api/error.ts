import { Router } from '../framework/Router.ts';
import { store } from '../store/Store.ts';

export class ErrorWithCode extends Error {
	code: number;
	constructor(message: string, code: number) {
		super(message);
		this.code = code;
	}
}

export function handleError(error: ErrorWithCode) {
	const router = new Router();
	switch (error.code) {
		case 401:
			store.reset();
			router.go('/');
			return;
		case 500:
			router.go('/fatal');
			return;
		default:
			alert(error.message);
	}
}

export function throwError(result: XMLHttpRequest) {
	const status = result.status;
	if (status < 400) {
		return result.response;
	}
	const { reason } = parseResponse<{ reason: string }>(result.response);
	throw new ErrorWithCode(reason, status);
}

export const parseResponse = <T>(response: string): T => {
	try {
		return JSON.parse(response) as T;
	} catch (error) {
		throw new ErrorWithCode(`json parse error ${error}`, 500);
	}
};
