import { AuthApi } from '../api/auth.ts';
import { FatalError } from '../error.ts';
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
			if (error instanceof FatalError) {
				router.go('/fatal');
			} else {
				//alert(`${error} ${(error as Error).cause}`);
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
			if (error instanceof FatalError) {
				router.go('/fatal');
			} else {
				//alert(`${error} ${(error as Error).cause}`);
			}
		}
	},

	async setCurrentUserToStore(): Promise<void> {
		try {
			const user: User = await AuthApi.getCurrentUser();
			store.set('currentUser', user);
			store.set(`users.${user.id}`, user);
		} catch (error) {
			if (error instanceof FatalError) {
				const router = new Router();
				router.go('/fatal');
			} else {
				//alert(`${error} ${(error as Error).cause}`);
			}
		}
	},

	async logout(): Promise<void> {
		const router = new Router();
		try {
			await AuthApi.logout();
			store.invalidate('currentUser');
			// invalidate all store
			router.go('/');
		} catch (error) {
			if (error instanceof FatalError) {
				router.go('/fatal');
			} else {
				//alert(`${error} ${(error as Error).cause}`);
			}
		}
	},
};
