import { ChatApi } from '../api/chat.ts';
import { ErrorWithCode, handleError } from '../api/error.ts';
import { Router } from '../framework/Router.ts';
import { store } from '../store/Store.ts';
import {
	type GetChatsOptions,
	type RawChat,
	type ChatId,
	type Chat,
	type GetChatUsersOptions,
	type RawChatUser,
	type ChatUsersData,
} from '../types.ts';

export const chatController = {
	async setCurrentUserChatsToStore(options: GetChatsOptions = {}) {
		console.log('setCurrentUserChatsToStore');
		try {
			const chats: RawChat[] = await ChatApi.get(options);
			const result = chats.reduce(
				(res: Record<ChatId, RawChat>, chat) => {
					res[chat.id] = chat;
					return res;
				},
				{}
			);

			const chatIds = Object.keys(result).join(',');
			console.log('chatIds', chatIds);
			store.set('chatIds', chatIds);
			store.set('chats', result);
		} catch (error) {
			if (error instanceof ErrorWithCode) {
				handleError(error);
			} else {
				const router = new Router();
				console.log(error); // router.go('/fatal');
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
				const router = new Router();
				console.log(error); // router.go('/fatal');
			}
		}
	},

	async deleteChat(chatId: ChatId) {
		try {
			await ChatApi.delete(chatId);
			store.invalidate(`chats.${chatId}`);
			await chatController.setCurrentUserChatsToStore();
			if (store.getState().selectedChatId === chatId) {
				store.set('selectedChatId', undefined);
			}
		} catch (error) {
			if (error instanceof ErrorWithCode) {
				handleError(error);
			} else {
				const router = new Router();
				console.log(error); // router.go('/fatal');
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
				const router = new Router();
				console.log(error); // router.go('/fatal');
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
				const router = new Router();
				console.log(error); // router.go('/fatal');
			}
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
				const router = new Router();
				console.log(error); // router.go('/fatal');
			}
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
				const router = new Router();
				console.log(error); // router.go('/fatal');
			}
		}
	},
};
