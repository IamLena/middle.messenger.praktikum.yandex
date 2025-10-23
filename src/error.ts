export class UnauthorizedError extends Error {
	// when catching need to redirect to login
	// Login or password is incorrect
	code: number;
	constructor(message, options) {
		super(message, options);
		this.name = 'UnauthorizedError';
		this.code = options.code;
	}
}

export class FatalError extends Error {
	// when catching need to redirect to fatal 500 page
	code: number;
	constructor(message, options) {
		super(message, options);
		this.name = 'FatalError';
		this.code = options.code;
	}
}

export class BadRequestError extends Error {
	// ?? just alert the reason - cant be wrong format, already in system for login
	// login is empty, but required
	code: number;
	constructor(message, options) {
		super(message, options);
		this.name = 'BadRequestError';
		this.code = options.code;
	}
}

export class ForbiddenError extends Error {
	code: number;
	constructor(message, options) {
		super(message, options);
		this.name = 'Forbidden';
		this.code = options.code;
	}
}

export function handleApiJsonResponse(result) {
	const status = result.status;
	switch (status) {
		case 200:
			return JSON.parse(result.response);
		case 400:
			throw new BadRequestError(`bad request`, {
				code: 400,
				cause: JSON.parse(result.response).reason,
			});
		case 401:
			throw new UnauthorizedError(`unauthorized`, {
				code: 401,
				cause: JSON.parse(result.response).reason,
			});
		case 403:
			throw new ForbiddenError(`forbidden`, {
				code: 403,
			});
		default:
			throw new FatalError(`Unexpected error`, {
				code: status,
				cause: JSON.parse(result.response).reason,
			});
	}
}

export function handleApiResponse(result) {
	const status = result.status;
	switch (status) {
		case 200:
			return result.response;
		case 400:
			throw new BadRequestError(`bad request`, {
				code: 400,
				cause: JSON.parse(result.response).reason,
			});
		case 401:
			throw new UnauthorizedError(`unauthorized`, {
				code: 401,
				cause: JSON.parse(result.response).reason,
			});
		default:
			throw new FatalError(`Unexpected error`, {
				code: status,
				cause: JSON.parse(result.response).reason,
			});
	}
}

// 409 conflict - Email already exists
// 401 incorrect login/password
