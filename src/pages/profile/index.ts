import { Block } from '../../framework/Block';
import css from './index.module.css';
import { Button, Form } from '../../components';
import { authController } from '../../controllers/authController';
import { CurrentUserModel } from '../../models/CurrentUserModel';
import {
	emailValidation,
	loginValidation,
	nameValidation,
	passwordValidation,
	phoneValidation,
	displayNameValidation,
} from '../../validation/index.ts';
import { connect } from '../../store/connect.ts';

// disabled for not editable
// in form save/edit text for button
// cancel or logout button

// change avatar
// change password

function getInputData(user = {}) {
	return [
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
			value: user.first_name,
			validate: nameValidation,
		},
		{
			id: 'second_name',
			label: 'second name',
			type: 'text',
			name: 'second_name',
			value: user.second_name,
			validate: nameValidation,
		},
		{
			id: 'display_name',
			label: 'display name',
			type: 'text',
			name: 'display_name',
			value: user.display_name,
			validate: displayNameValidation,
		},
		{
			id: 'email',
			label: 'email',
			type: 'email',
			name: 'email',
			value: user.email,
			validate: emailValidation,
		},
		{
			id: 'phone',
			label: 'phone',
			type: 'phone',
			name: 'phone',
			value: user.phone,
			validate: phoneValidation,
		},
		{
			id: 'login',
			label: 'login',
			type: 'text',
			name: 'login',
			value: user.login,
			validate: loginValidation,
			autocomplete: 'username',
		},
		// {
		// 	id: 'oldPassword',
		// 	label: 'old password',
		// 	type: 'password',
		// 	name: 'oldPassword',
		// 	validate: passwordValidation,
		// 	autocomplete: 'current-password',
		// },
		// {
		// 	id: 'newPassword',
		// 	label: 'new password',
		// 	type: 'password',
		// 	name: 'newPassword',
		// 	validate: passwordValidation,
		// 	autocomplete: 'new-password',
		// },
	];
}

const ProfileForm = connect(
	(user) => ({ inputData: getInputData(user) }),
	(state) => ({ inputData: getInputData(state.currentUser) }),
	Form
);

class ProfilePageBase extends Block {
	editMode: boolean;

	constructor(user) {
		const profileInfoForm = new ProfileForm(
			{ user },
			{
				btnProps: {
					text: 'edit',
				},
				submit: () => this.toggleEditMode(),
			}
		);

		super({
			profileInfoForm,
			cancelEditButton: new Button({
				text: 'cancel',
				onClick: () => this.toggleEditMode(),
			}),
			logoutButton: new Button({
				text: 'logout',
				onClick: authController.logout,
			}),
		});
		this.editMode = false;
	}

	toggleEditMode() {
		this.editMode = !this.editMode;
	}

	override render() {
		return `
			<div class="${css.container}">
				{{{ profileInfoForm }}}
				{{#if this.editMode}}
					{{{ cancelEditButton }}}
				{{else}}
					{{{ logoutButton }}}
				{{/if}}
			</div>
		`;
	}
}

export const ProfilePage = connect(
	CurrentUserModel,
	(state) => state.currentUser,
	ProfilePageBase
);
