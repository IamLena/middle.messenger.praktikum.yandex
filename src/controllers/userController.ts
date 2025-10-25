import { UserApi } from '../api/user.ts';
import { ErrorWithCode, handleError } from '../api/error.ts';
import { Router } from '../framework/Router.ts';
import { store } from '../store/Store.ts';
import {
	type ProfileInfo,
	type AvatarData,
	type PasswordData,
	type UserId,
	type User,
} from '../types.ts';

export const userController = {
	async changeProfileInfo(data: ProfileInfo) {
		try {
			const updatedUser = await UserApi.changeProfileInfo(data);
			store.set('currentUser', updatedUser);
		} catch (error) {
			if (error instanceof ErrorWithCode) {
				handleError(error);
			} else {
				const router = new Router();
				console.log(error); // router.go('/fatal');
			}
		}
	},

	async changeAvatar(data: AvatarData) {
		try {
			const updatedUser = await UserApi.changeAvatar(data);
			store.set('currentUser', updatedUser);
		} catch (error) {
			if (error instanceof ErrorWithCode) {
				handleError(error);
			} else {
				const router = new Router();
				console.log(error); // router.go('/fatal');
			}
		}
	},

	async changePassword(data: PasswordData) {
		try {
			await UserApi.changePassword(data);
		} catch (error) {
			if (error instanceof ErrorWithCode) {
				handleError(error);
			} else {
				const router = new Router();
				console.log(error); // router.go('/fatal');
			}
		}
	},

	async searchByLogin(login: string) {
		try {
			const rawUsers = await UserApi.searchByLogin(login);
			const users: User[] = [];
			const userIds: UserId[] = [];
			let certainUser;
			rawUsers.forEach((user) => {
				users.push(user);
				userIds.push(user.id);
				if (user.login === login) {
					certainUser = user;
				}
			});
			store.set(`users`, users);
			store.set(`usersByLogin.${login}`, userIds);
			store.set(`certainUser.${login}`, certainUser);
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
