import { AuthApi } from '../api/auth.ts';
import { ErrorWithCode } from '../api/error.ts';
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
				if (error.code === 409) {
					// Login already exists
					alert(error.message);
				} else {
					console.log('error', error);
				}
			} else {
				console.log(error); // router.go('/fatal');
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
				if (error.code === 400 || error.code === 401) {
					alert(error.message);
					return;
				} else if (error.code === 500) {
					console.log(error); // router.go('/fatal');
				}
			} else {
				console.log(error); // router.go('/fatal');
			}
		}
	},

	async setCurrentUserToStore(): Promise<void> {
		try {
			const user: User = await AuthApi.getCurrentUser();
			store.set('currentUser', user);
		} catch (error) {
			if (error instanceof ErrorWithCode) {
				console.log(error, error.code, error.message);
				throw new ErrorWithCode(error.message, error.code);
			} else {
				console.log(error);
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
				console.log(error, error.code, error.message);
			} else {
				console.log(error); // router.go('/fatal');
			}
		}
	},
};
