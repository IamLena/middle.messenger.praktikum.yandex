import { HTTPTransport } from './HTTPTransport';
import { type LoginData, type RegisterData, type User } from '../types.ts';
import { parseResponse } from '../api/error.ts';

const http = new HTTPTransport('/auth');

export const AuthApi = {
	signup: (data: RegisterData) => {
		return http.post('/signup', {
			data: JSON.stringify(data),
			headers: { 'content-type': 'application/json' },
		});
	},

	signin: (data: LoginData) => {
		return http.post('/signin', {
			data: JSON.stringify(data),
			headers: { 'content-type': 'application/json' },
		});
	},

	getCurrentUser: (): Promise<User> => {
		return http.get('/user').then((response) => parseResponse(response));
	},

	logout: () => {
		return http.post('/logout');
	},
};
