import { HTTPTransport } from './HTTPTransport';
import {
	type ProfileInfo,
	type PasswordData,
	type User,
	type AvatarData,
} from '../types.ts';
import { handleApiJsonResponse, handleApiResponse } from '../error.ts';

const http = new HTTPTransport('https://ya-praktikum.tech/api/user');

export const UserApi = {
	changeProfileInfo: (data: ProfileInfo): Promise<User> => {
		return http
			.put('/profile', {
				data: JSON.stringify(data),
				headers: { 'content-type': 'application/json' },
			})
			.then((data) => handleApiJsonResponse(data));
	},

	// data: new FormData(document.getById('avatar form')),
	// form data here
	changeAvatar: (data: AvatarData): Promise<User> => {
		return http
			.put('/profile/avatar', {
				data,
			})
			.then((data) => handleApiJsonResponse(data));
	},

	changePassword: (data: PasswordData): Promise<void> => {
		return http
			.put('/password', {
				data: JSON.stringify(data),
				headers: { 'content-type': 'application/json' },
			})
			.then((data) => handleApiResponse(data));
	},

	searchByLogin: (login: string): Promise<User[]> => {
		return http
			.post('/search', {
				data: JSON.stringify({ login }),
				headers: { 'content-type': 'application/json' },
			})
			.then((data) => handleApiJsonResponse(data));
	},
};
