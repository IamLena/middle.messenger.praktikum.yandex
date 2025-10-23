import { HTTPTransport } from './HTTPTransport';
import { handleApiJsonResponse, handleApiResponse } from '../error.ts';
import {
	type GetChatsOptions,
	type RawChat,
	type ChatId,
	type GetChatUsersOptions,
	type RawDeleteResult,
	type RawChatUser,
	type ChatUsersData,
} from '../types.ts';

const http = new HTTPTransport('https://ya-praktikum.tech/api/v2/chats');

export const ChatApi = {
	get: (options: GetChatsOptions): Promise<RawChat[]> => {
		return http
			.get('/', { data: options })
			.then((data) => handleApiJsonResponse(data));
	},

	create: (title: string): Promise<ChatId> => {
		return http
			.post('/', {
				data: JSON.stringify({ title }),
				headers: { 'content-type': 'application/json' },
			})
			.then((data) => handleApiJsonResponse(data).id);
	},

	delete: (chatId: ChatId): Promise<RawDeleteResult> => {
		return http
			.delete('/', {
				data: JSON.stringify({ chatId }),
				headers: { 'content-type': 'application/json' },
			})
			.then((data) => handleApiJsonResponse(data));
	},

	getUsers: ({
		id,
		...options
	}: GetChatUsersOptions): Promise<RawChatUser[]> => {
		return http
			.get(`/${id}/users`, { data: options })
			.then((data) => handleApiJsonResponse(data));
	},

	addUser: (data: ChatUsersData) => {
		return http
			.put(`/users`, {
				data: JSON.stringify(data),
				headers: { 'content-type': 'application/json' },
			})
			.then((data) => handleApiResponse(data));
	},

	deleteUser: (data: ChatUsersData) => {
		return http
			.delete(`/users`, {
				data: JSON.stringify(data),
				headers: { 'content-type': 'application/json' },
			})
			.then((data) => handleApiResponse(data));
	},

	getToken: (id: number) => {
		return http
			.post(`/token/${id}`)
			.then((data) => handleApiJsonResponse(data));
	},
};
