import { Block } from '../../framework/Block';
import css from './index.module.css';
import { Form } from '../../components';
import {
	emailValidation,
	loginValidation,
	nameValidation,
	passwordValidation,
	phoneValidation,
} from '../../validation';
import { authController } from '../../controllers/authController';
import { Router } from '../../framework/Router.ts';
import { store, StoreEvents } from '../../store/Store.ts';
import { AuthApi } from '../../api/auth.ts';

export class RegisterPage extends Block {
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
					store.set('registerReady', true);
					return;
				}
				throw error;
			});

		store.on(StoreEvents.Updated, () => {
			const registerReady = store.getState().registerReady;
			if (registerReady) {
				const form = new Form({
					header: 'Register',
					inputData: [
						{
							id: 'first_name',
							label: 'first name',
							type: 'text',
							name: 'first_name',
							validate: nameValidation,
						},
						{
							id: 'second_name',
							label: 'second name',
							type: 'text',
							name: 'second_name',
							validate: nameValidation,
						},
						{
							id: 'email',
							label: 'email',
							type: 'email',
							name: 'email',
							validate: emailValidation,
						},
						{
							id: 'phone',
							label: 'phone',
							type: 'phone',
							name: 'phone',
							validate: phoneValidation,
						},
						{
							id: 'login',
							label: 'login',
							type: 'text',
							name: 'login',
							validate: loginValidation,
							autocomplete: 'username',
						},
						{
							id: 'password',
							label: 'password',
							type: 'password',
							name: 'password',
							validate: passwordValidation,
							autocomplete: 'current-password',
						},
					],
					btnProps: {
						text: 'Sign up',
					},
					submit: authController.signup,
				});
				this.children = {
					form,
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
			</div>
			`
			: '<div></div>';
	}
}
