import { Block } from '../../framework/Block';
import css from './index.module.css';
import { Form, Link } from '../../components';
import { loginValidation, passwordValidation } from '../../validation';
import { authController } from '../../controllers/authController';
import { Router } from '../../framework/Router.ts';
import { store, StoreEvents } from '../../store/Store.ts';
import { AuthApi } from '../../api/auth.ts';

export class LoginPage extends Block {
	isReady: boolean = false;

	constructor() {
		super({
			ready: false,
		});
		AuthApi.getCurrentUser()
			.then(() => {
				const router = new Router();
				router.go('/messenger');
			})
			.catch((error) => {
				if (error.code === 401) {
					this.isReady = true;
					store.set('loginReady', true);
					return;
				}
				throw error;
			});

		store.on(StoreEvents.Updated, () => {
			const loginReady = store.getState().loginReady;
			if (loginReady) {
				const form = new Form({
					header: 'Please sign in',
					inputData: [
						{
							id: 'login',
							label: 'login:',
							type: 'text',
							name: 'login',
							validate: loginValidation,
							autocomplete: 'username',
						},
						{
							id: 'password',
							label: 'password:',
							type: 'password',
							name: 'password',
							validate: passwordValidation,
							autocomplete: 'current-password',
						},
					],
					btnProps: { text: 'Sign in' },
					submit: authController.login,
				});

				const linkToRegistration = new Link({
					text: 'Register',
					url: '/sign-up',
				});

				this.children = {
					form,
					linkToRegistration,
				};
				this.updateProps({ ready: true });
			}
		});
	}

	override render() {
		return this.isReady
			? `
			<div class="${css.container}">
				{{{ form }}}
				<div>
				<span>Don't have an account?</span>
				{{{ linkToRegistration }}}
				</div>
			</div>
			`
			: '<div></div>';
	}
}
