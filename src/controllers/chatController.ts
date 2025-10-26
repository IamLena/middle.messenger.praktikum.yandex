import { ChatApi } from '../api/chat.ts';
import { ErrorWithCode, handleError } from '../api/error.ts';
import { store } from '../store/Store.ts';
import {
	type GetChatsOptions,
	type RawChat,
	type ChatId,
	type GetChatUsersOptions,
	type RawChatUser,
	type ChatUsersData,
	type AvatarData,
} from '../types.ts';
import { userController } from './userController.ts';
import type {
	AppState,
	UsersByLoginState,
	CertainUserState,
} from '../store/types';

export const chatController = {
	async setCurrentUserChatsToStore(options: GetChatsOptions = {}) {
		try {
			const chats: RawChat[] = await ChatApi.get(options);
			const result = chats.reduce(
				(res: Record<ChatId, RawChat>, chat) => {
					res[chat.id] = chat;
					return res;
				},
				{}
			);

			store.set('chatIds', Object.keys(result).join(','));
			store.set('chats', result);
		} catch (error) {
			if (error instanceof ErrorWithCode) {
				handleError(error);
			} else {
				alert('Failed to load chats. Please try again later.');
			}
		}
	},

	async createChat({ title }: { title: string }) {
		try {
			await ChatApi.create(title);
			await chatController.setCurrentUserChatsToStore();
		} catch (error) {
			if (error instanceof ErrorWithCode) {
				handleError(error);
			} else {
				alert('Failed to create chat. Please try again later.');
			}
		}
	},

	async deleteChat(chatId: ChatId) {
		try {
			await ChatApi.delete(chatId);
			store.invalidate(`chats.${chatId}`);
			await chatController.setCurrentUserChatsToStore();
			const state = store.getState<AppState>();
			if (state.selectedChatId === chatId) {
				store.set('selectedChatId', undefined);
			}
		} catch (error) {
			if (error instanceof ErrorWithCode) {
				handleError(error);
			} else {
				alert('Failed to delete chat. Please try again later.');
			}
		}
	},

	async getUsers(options: GetChatUsersOptions) {
		try {
			const RawChatUsers: RawChatUser[] = await ChatApi.getUsers(options);
			const userNames = RawChatUsers.map(
				(user) =>
					user.display_name ||
					`${user.first_name} ${user.second_name} (${user.login})`
			).join(', ');
			store.set(`participants.${options.id}`, userNames);
		} catch (error) {
			if (error instanceof ErrorWithCode) {
				handleError(error);
			} else {
				alert('Failed to load chat users. Please try again later.');
			}
		}
	},

	async addUser(data: ChatUsersData) {
		try {
			await ChatApi.addUser(data);
			await chatController.getUsers({ id: data.chatId });
		} catch (error) {
			if (error instanceof ErrorWithCode) {
				handleError(error);
			} else {
				alert('Failed to add user to chat. Please try again later.');
			}
		}
	},

	async addUserByLogin({
		login,
		chatId,
	}: {
		login: string;
		chatId: ChatId;
	}) {
		await userController.searchByLogin(login);
		const state = store.getState<AppState>();
		const usersByLogin = state.usersByLogin as UsersByLoginState | undefined;
		const certainUsers = state.certainUser as CertainUserState | undefined;
		const userIds = usersByLogin?.[login];
		const certainUser = certainUsers?.[login];
		if ((certainUser || userIds?.length) && chatId) {
			chatController.addUser({
				users: certainUser ? [certainUser.id] : userIds ?? [],
				chatId,
			});
		}
	},

	async deleteUser(data: ChatUsersData) {
		try {
			await ChatApi.deleteUser(data);
			await chatController.getUsers({ id: data.chatId });
		} catch (error) {
			if (error instanceof ErrorWithCode) {
				handleError(error);
			} else {
				alert('Failed to remove chat user. Please try again later.');
			}
		}
	},

	async deleteUserByLogin({
		login,
		chatId,
	}: {
		login: string;
		chatId: ChatId;
	}) {
		await userController.searchByLogin(login);
		const state = store.getState<AppState>();
		const usersByLogin = state.usersByLogin as UsersByLoginState | undefined;
		const userIds = usersByLogin?.[login];
		if (userIds?.length && chatId) {
			chatController.deleteUser({
				users: userIds,
				chatId,
			});
		}
	},

	async getToken(chatId: number) {
		try {
			const { token } = await ChatApi.getToken(chatId);
			store.set(`tokens.${chatId}`, token);
		} catch (error) {
			if (error instanceof ErrorWithCode) {
				handleError(error);
			} else {
				alert('Failed to fetch chat token. Please try again later.');
			}
		}
	},

	async changeAvatar(chatId: ChatId, avatarData: AvatarData) {
		await ChatApi.changeAvatar(chatId, avatarData).then((data) => {
			store.set(`chats.${chatId}`, JSON.parse(data));
		});
	},
};
