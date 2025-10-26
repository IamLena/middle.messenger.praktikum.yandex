import { HTTPTransport } from './HTTPTransport';
import { type LoginData, type RegisterData, type User } from '../types.ts';

const http = new HTTPTransport('https://ya-praktikum.tech/api/v2/auth');

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
		return http.get('/user').then((response) => JSON.parse(response));
	},

	logout: () => {
		return http.post('/logout');
	},
};
