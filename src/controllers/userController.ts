import { UserApi } from '../api/user.ts';
import { FatalError, UnauthorizedError } from '../error.ts';
import { Router } from '../framework/Router.ts';
import { store } from '../store/Store.ts';
import {
	type ProfileInfo,
	type AvatarData,
	type PasswordData,
	type UserId,
} from '../types.ts';

export const userController = {
	async changeProfileInfo(data: ProfileInfo) {
		try {
			const updatedUser = await UserApi.changeProfileInfo(data);
			store.set('currentUser', updatedUser);
			store.set(`users.${updatedUser.id}`, updatedUser);
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

	async changeAvatar(data: AvatarData) {
		try {
			const updatedUser = await UserApi.changeAvatar(data);
			store.set('currentUser', updatedUser);
			store.set(`users.${updatedUser.id}`, updatedUser);
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

	async changePassword(data: PasswordData) {
		try {
			await UserApi.changePassword(data);
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

	async searchByLogin(login: string): Promise<UserId[]> {
		try {
			const users = await UserApi.searchByLogin(login);
			const userIds = users.map((user) => {
				store.set(`users.${user.id}`, user);
				return user.id;
			});
			store.set('usersByLogin', userIds);
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
			return [];
		}
	},
};
