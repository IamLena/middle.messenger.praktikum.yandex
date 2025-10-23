import { ChatApi } from '../api/chat.ts';
import { FatalError, UnauthorizedError } from '../error.ts';
import { Router } from '../framework/Router.ts';
import { store } from '../store/Store.ts';
import {
	type GetChatsOptions,
	type RawChat,
	type ChatId,
	type GetChatUsersOptions,
	type RawChatUser,
	type ChatUsersData,
} from '../types.ts';

export const chatController = {
	async setCurrentUserChatsToStore(options: GetChatsOptions = {}) {
		try {
			const chats: RawChat[] = await ChatApi.get(options);
			const result = chats.reduce((res, chat) => {
				res[chat.id] = chat;
				return res;
			}, {});
			store.set(`chats`, result);
		} catch (error) {
			const router = new Router();
			if (error instanceof FatalError) {
				router.go('/fatal');
			} else if (error instanceof UnauthorizedError) {
				store.invalidate('chats');
				// invalidate all store??
				router.go('/');
			} else {
				//alert(`${error} ${(error as Error).cause}`);
			}
		}
	},

	async createChat({ title }: { title: string }) {
		try {
			await ChatApi.create(title);
			await chatController.setCurrentUserChatsToStore({ title });
		} catch (error) {
			const router = new Router();
			if (error instanceof FatalError) {
				router.go('/fatal');
			} else if (error instanceof UnauthorizedError) {
				store.invalidate('chats');
				// invalidate all store??
				router.go('/');
			} else {
				//alert(`${error} ${(error as Error).cause}`);
			}
		}
	},

	async deleteChat(chatId: ChatId) {
		try {
			await ChatApi.delete(chatId);
			store.invalidate(`chats.${chatId}`);
		} catch (error) {
			const router = new Router();
			if (error instanceof FatalError) {
				router.go('/fatal');
			} else if (error instanceof UnauthorizedError) {
				store.invalidate('chats');
				// invalidate all store??
				router.go('/');
			} else {
				//alert(`${error} ${(error as Error).cause}`);
			}
		}
	},

	async getUsers(options: GetChatUsersOptions) {
		try {
			const RawChatUsers: RawChatUser[] = await ChatApi.getUsers(options);
			const userNames = RawChatUsers.map(
				(user) =>
					user.display_name ||
					`${user.first_name} ${user.second_name}`
			).join(', ');
			store.set(`participants.${options.id}`, userNames);
			// forEach - error
			// RawChatUsers.forEach((rawUser) => {
			// 	const { role, ...user } = rawUser;
			// 	store.set(`users.${user.id}`, user);
			// 	// store.set(`chats.${options.id}.users.${user.id}`, role);
			// });
		} catch (error) {
			const router = new Router();
			if (error instanceof FatalError) {
				router.go('/fatal');
			} else if (error instanceof UnauthorizedError) {
				store.invalidate('chats');
				// invalidate all store??
				router.go('/');
			} else {
				//alert(`${error} ${(error as Error).cause}`);
			}
		}
	},

	async addUser(data: ChatUsersData) {
		try {
			await ChatApi.addUser(data);
			await chatController.getUsers({ id: data.chatId });
		} catch (error) {
			const router = new Router();
			if (error instanceof FatalError) {
				router.go('/fatal');
			} else if (error instanceof UnauthorizedError) {
				store.invalidate('chats');
				// invalidate all store??
				router.go('/');
			} else {
				//alert(`${error} ${(error as Error).cause}`);
			}
		}
	},

	async deleteUser(data: ChatUsersData) {
		try {
			await ChatApi.deleteUser(data);
			await chatController.getUsers({ id: data.chatId });
		} catch (error) {
			const router = new Router();
			if (error instanceof FatalError) {
				router.go('/fatal');
			} else if (error instanceof UnauthorizedError) {
				store.invalidate('chats');
				// invalidate all store??
				router.go('/');
			} else {
				//alert(`${error} ${(error as Error).cause}`);
			}
		}
	},

	async getToken(chatId: number) {
		const { token } = await ChatApi.getToken(chatId);
		store.set(`tokens.${chatId}`, token);
	},
};
