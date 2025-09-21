import { Block } from '../../framework/Block';
import css from './index.module.css';
import { Form } from '../../components';
import {
	emailValidation,
	loginValidation,
	nameValidation,
	passwordValidation,
	phoneValidation,
	displayNameValidation,
} from '../../validation';

export class ProfilePage extends Block {
	constructor() {
		super({
			form: new Form({
				header: 'Profile',
				inputData: [
					{
						id: 'avatar',
						label: 'upload avatar image',
						type: 'file',
						name: 'avatar',
						validate: (value) => ({
							value,
							isValid: true,
						}),
					},
					{
						id: 'first_name',
						label: 'first name',
						type: 'text',
						name: 'first_name',
						value: 'my first name',
						validate: nameValidation,
					},
					{
						id: 'second_name',
						label: 'second name',
						type: 'text',
						name: 'second_name',
						value: 'my second name',
						validate: nameValidation,
					},
					{
						id: 'display_name',
						label: 'display name',
						type: 'text',
						name: 'display_name',
						value: 'my display name',
						validate: displayNameValidation,
					},
					{
						id: 'email',
						label: 'email',
						type: 'email',
						name: 'email',
						value: 'my@email.com',
						validate: emailValidation,
					},
					{
						id: 'phone',
						label: 'phone',
						type: 'phone',
						name: 'phone',
						value: '+7(777)777-77-77',
						validate: phoneValidation,
					},
					{
						id: 'login',
						label: 'login',
						type: 'text',
						name: 'login',
						value: 'login',
						validate: loginValidation,
						autocomplete: 'username',
					},
					{
						id: 'oldPassword',
						label: 'old password',
						type: 'password',
						name: 'oldPassword',
						validate: passwordValidation,
						autocomplete: 'current-password',
					},
					{
						id: 'newPassword',
						label: 'new password',
						type: 'password',
						name: 'newPassword',
						validate: passwordValidation,
						autocomplete: 'new-password',
					},
				],
				btnProps: { text: 'Save' },
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
