// somewhere/in/types/file.ts
import { AuthApi } from '../../api/auth';
import { FatalError } from '../../error.ts';
import { Router } from '../../framework/Router';
import { type LoginData } from '../../types.ts';
import { store } from '../../store/Store.ts';

export const LoginController = {
	async login(data: LoginData) {
		const router = new Router();

		try {
			// returns OK not id or user
			await AuthApi.signin(data);
			const user = await AuthApi.getCurrentUser();
			store.set('currentUser', user);
			router.go('/messenger');
		} catch (error) {
			if (error instanceof FatalError) {
				router.go('/fatal');
			} else {
				alert((error as Error).cause);
			}
		}
	},
};
