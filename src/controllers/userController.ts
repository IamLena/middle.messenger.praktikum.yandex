import { UserApi } from '../api/user.ts';
import { ErrorWithCode, handleError } from '../api/error.ts';
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
				alert('Failed to change profile info. Please try again later.');
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
				alert('Failed to change avatar. Please try again later.');
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
				alert('Failed to change password. Please try again later.');
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
				alert('Failed to search user by login. Please try again later.');
			}
		}
	},
};
