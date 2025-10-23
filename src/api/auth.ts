import { HTTPTransport } from './HTTPTransport';
import { handleApiJsonResponse, handleApiResponse } from '../error.ts';
import { type LoginData, type RegisterData, type User } from '../types.ts';

const http = new HTTPTransport('https://ya-praktikum.tech/api/v2/auth');

export const AuthApi = {
	signup: (data: RegisterData) => {
		return http
			.post('/signup', {
				data: JSON.stringify(data),
				headers: { 'content-type': 'application/json' },
			})
			.then((data) => handleApiResponse(data));
	},

	signin: (data: LoginData) => {
		return http
			.post('/signin', {
				data: JSON.stringify(data),
				headers: { 'content-type': 'application/json' },
			})
			.then((data) => handleApiResponse(data));
	},

	getCurrentUser: (): Promise<User> => {
		return http.get('/user').then((data) => handleApiJsonResponse(data));
	},

	logout: () => {
		return http.post('/logout').then((data) => handleApiResponse(data));
	},
};
