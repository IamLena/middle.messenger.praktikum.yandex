import { Block } from '../../framework/Block';
import css from './index.module.css';
import { Form, Link } from '../../components';
import { loginValidation, passwordValidation } from '../../validation';
import { authController } from '../../controllers/authController';

export class LoginPage extends Block {
	constructor() {
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

		super({
			form,
			linkToRegistration,
		});
	}

	override render() {
		return `
			<div class="${css.container}">
				{{{ form }}}
				<div>
				<span>Don't have an account?</span>
				{{{ linkToRegistration }}}
				</div>
			</div>
			`;
	}
}
