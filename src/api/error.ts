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
	console.log(error, error.code, error.message);
	switch (error.code) {
		case 401:
			store.reset();
			router.go('/');
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
	throw new ErrorWithCode(JSON.parse(result.response).reason, status);
}
