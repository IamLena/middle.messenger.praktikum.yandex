import { AuthApi } from '../api/auth.ts';
import { ErrorWithCode, handleError } from '../api/error.ts';
import { Router } from '../framework/Router.ts';
import { store } from '../store/Store.ts';
import { type LoginData, type RegisterData, type User } from '../types.ts';

function isLoginData(data: Record<string, string>): data is LoginData {
	return 'password' in data && 'login' in data;
}

function isRegisterData(data: Record<string, string>): data is RegisterData {
	return (
		'first_name' in data &&
		'second_name' in data &&
		'login' in data &&
		'email' in data &&
		'password' in data &&
		'phone' in data
	);
}

export const authController = {
	async signup(data: Record<string, string>): Promise<void> {
		if (!isRegisterData(data)) {
			return;
		}
		const router = new Router();

		try {
			await AuthApi.signup(data);
			await authController.setCurrentUserToStore();
			router.go('/messenger');
		} catch (error) {
			if (error instanceof ErrorWithCode) {
				handleError(error);
			} else {
				alert(
					'Unexpected error during signup. Please try again later.'
				);
			}
		}
	},

	async login(data: Record<string, string>): Promise<void> {
		if (!isLoginData(data)) {
			return;
		}
		const router = new Router();

		try {
			await AuthApi.signin(data);
			await authController.setCurrentUserToStore();
			router.go('/messenger');
		} catch (error) {
			if (error instanceof ErrorWithCode) {
				handleError(error);
			} else {
				alert('Unexpected error during login. Please try again later.');
			}
		}
	},

	async setCurrentUserToStore(): Promise<void> {
		try {
			const user: User = await AuthApi.getCurrentUser();
			store.set('currentUser', user);
		} catch (error) {
			if (error instanceof ErrorWithCode) {
				handleError(error);
			} else {
				alert('Failed to fetch current user. Please try again later.');
			}
		}
	},

	async logout(): Promise<void> {
		const router = new Router();
		try {
			await AuthApi.logout();
			store.reset();
			router.go('/');
		} catch (error) {
			if (error instanceof ErrorWithCode) {
				handleError(error);
			} else {
				alert('Failed to logout. Please try again later.');
			}
		}
	},
};
