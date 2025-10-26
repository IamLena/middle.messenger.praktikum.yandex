import { HTTPTransport } from './HTTPTransport';
import {
	type GetChatsOptions,
	type RawChat,
	type ChatId,
	type GetChatUsersOptions,
	type RawDeleteResult,
	type RawChatUser,
	type ChatUsersData,
	type AvatarData,
} from '../types.ts';

const http = new HTTPTransport('https://ya-praktikum.tech/api/v2/chats');

export const ChatApi = {
	get: (options: GetChatsOptions): Promise<RawChat[]> => {
		return http
			.get('/', { data: options })
			.then((response) => JSON.parse(response));
	},

	create: (title: string): Promise<ChatId> => {
		return http
			.post('/', {
				data: JSON.stringify({ title }),
				headers: { 'content-type': 'application/json' },
			})
			.then((response) => JSON.parse(response));
	},

	delete: (chatId: ChatId): Promise<RawDeleteResult> => {
		return http
			.delete('/', {
				data: JSON.stringify({ chatId }),
				headers: { 'content-type': 'application/json' },
			})
			.then((response) => JSON.parse(response));
	},

	getUsers: ({
		id,
		...options
	}: GetChatUsersOptions): Promise<RawChatUser[]> => {
		return http
			.get(`/${id}/users`, { data: options })
			.then((response) => JSON.parse(response));
	},

	addUser: (data: ChatUsersData) => {
		return http.put(`/users`, {
			data: JSON.stringify(data),
			headers: { 'content-type': 'application/json' },
		});
	},

	deleteUser: (data: ChatUsersData) => {
		return http.delete(`/users`, {
			data: JSON.stringify(data),
			headers: { 'content-type': 'application/json' },
		});
	},

	getToken: (id: number) => {
		return http
			.post(`/token/${id}`)
			.then((response) => JSON.parse(response));
	},

	changeAvatar: (chatId: ChatId, data: AvatarData) => {
		data.append('chatId', String(chatId));
		return http.put('/avatar', { data });
	},
};
