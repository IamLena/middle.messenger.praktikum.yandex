import { HTTPTransport } from './HTTPTransport';
import {
	type ProfileInfo,
	type PasswordData,
	type User,
	type AvatarData,
} from '../types.ts';
import { parseResponse } from './error.ts';

const http = new HTTPTransport('/user');

export const UserApi = {
	changeProfileInfo: (data: ProfileInfo): Promise<User> => {
		return http
			.put('/profile', {
				data: JSON.stringify(data),
				headers: { 'content-type': 'application/json' },
			})
			.then((response) => parseResponse<User>(response));
	},

	changeAvatar: (data: AvatarData): Promise<User> => {
		return http
			.put('/profile/avatar', {
				data,
			})
			.then((response) => parseResponse<User>(response));
	},

	changePassword: (data: PasswordData): Promise<void> => {
		return http.put('/password', {
			data: JSON.stringify(data),
			headers: { 'content-type': 'application/json' },
		});
	},

	searchByLogin: (login: string): Promise<User[]> => {
		return http
			.post('/search', {
				data: JSON.stringify({ login }),
				headers: { 'content-type': 'application/json' },
			})
			.then((response) => parseResponse<User[]>(response));
	},
};
