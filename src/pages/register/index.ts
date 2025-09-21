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

export class RegisterPage extends Block {
	constructor() {
		super({
			form: new Form({
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
				btnProps: { text: 'Sign up' },
			}),
		});
	}

	override render() {
		return `
			<div class="${css.container}">
				{{{ form }}}
			</div>
		`;
	}
}
