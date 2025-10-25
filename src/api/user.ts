import { HTTPTransport } from './HTTPTransport';
import {
	type ProfileInfo,
	type PasswordData,
	type User,
	type AvatarData,
} from '../types.ts';

const http = new HTTPTransport('https://ya-praktikum.tech/api/v2/user');

export const UserApi = {
	changeProfileInfo: (data: ProfileInfo): Promise<User> => {
		return http
			.put('/profile', {
				data: JSON.stringify(data),
				headers: { 'content-type': 'application/json' },
			})
			.then((response) => JSON.parse(response));
	},

	// data: new FormData(document.getById('avatar form')),
	// form data here
	changeAvatar: (data: AvatarData): Promise<User> => {
		return http
			.put('/profile/avatar', {
				data,
			})
			.then((response) => JSON.parse(response));
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
			.then((response) => JSON.parse(response));
	},
};
