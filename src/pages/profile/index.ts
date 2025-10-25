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
import { Router } from '../../framework/Router.ts';
import { store, StoreEvents } from '../../store/Store.ts';
import { AuthApi } from '../../api/auth.ts';
import { UserApi } from '../../api/user.ts';
import { type User } from '../../types.ts';
import { isEqual } from '../../tools/isEqual.ts';
import { userController } from '../../controllers/userController.ts';

// disabled for not editable
// in form save/edit text for button
// cancel or logout button

// change avatar
// change password

function getAvatarInputData(user = {}, enabled) {
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
			disabled: !enabled,
			value: user.avatar,
		},
	];
}

function getInputData(user = {}, enabled) {
	return [
		{
			id: 'first_name',
			label: 'first name',
			type: 'text',
			name: 'first_name',
			value: user.first_name,
			validate: nameValidation,
			disabled: !enabled,
		},
		{
			id: 'second_name',
			label: 'second name',
			type: 'text',
			name: 'second_name',
			value: user.second_name,
			validate: nameValidation,
			disabled: !enabled,
		},
		{
			id: 'display_name',
			label: 'display name',
			type: 'text',
			name: 'display_name',
			value: user.display_name,
			validate: displayNameValidation,
			disabled: !enabled,
		},
		{
			id: 'email',
			label: 'email',
			type: 'email',
			name: 'email',
			value: user.email,
			validate: emailValidation,
			disabled: !enabled,
		},
		{
			id: 'phone',
			label: 'phone',
			type: 'phone',
			name: 'phone',
			value: user.phone,
			validate: phoneValidation,
			disabled: !enabled,
		},
		{
			id: 'login',
			label: 'login',
			type: 'text',
			name: 'login',
			value: user.login,
			validate: loginValidation,
			autocomplete: 'username',
			disabled: !enabled,
		},
	];
}

function getPasswordInputData() {
	return [
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
	];
}

export class ProfilePage extends Block {
	isReady: boolean = false;
	currentUser: User | {} = {};
	editInfoMode: boolean = false;
	editAvatarMode: boolean = false;
	editPasswordMode: boolean = false;
	avatarForm: Form | null = null;
	profileInfoForm: Form | null = null;
	passwordForm: Form | null = null;

	constructor() {
		super({
			ready: false,
			editInfoMode: false,
			editAvatarMode: false,
			editPasswordMode: false,
		});
		AuthApi.getCurrentUser()
			.then((user) => {
				store.set('currentUser', user);
			})
			.catch((error) => {
				if (error.code === 401) {
					const router = new Router();
					store.reset();
					router.go('/');
				}
			});

		store.on(StoreEvents.Updated, () => {
			const currentUser = store.getState().currentUser;
			if (currentUser && !isEqual(this.currentUser, currentUser)) {
				this.currentUser = currentUser;

				// avatar form
				const avatarForm = new Form({
					inputData: getAvatarInputData(
						currentUser,
						this.editAvatarMode
					),
					btnProps: {
						text: this.editAvatarMode
							? 'save avatar'
							: 'edit avatar',
					},
					submit: (data) => {
						this.submitAvatar(data);
					},
				});
				this.avatarForm = avatarForm;

				// profile form
				const inputData = getInputData(currentUser, this.editInfoMode);
				const profileInfoForm = new Form({
					inputData,
					btnProps: {
						text: this.editInfoMode
							? 'save profile information'
							: 'edit profile information',
					},
					submit: (data) => this.submit(data),
				});
				this.profileInfoForm = profileInfoForm;

				//password form
				const passwordForm = new Form({
					inputData: getPasswordInputData(),
					btnProps: {
						text: 'save password',
					},
					submit: (data) => this.submitPassword(data),
				});
				this.passwordForm = passwordForm;

				const changePasswordBtn = new Button({
					text: 'change password',
					onClick: () => {
						this.toggleEditPasswordMode();
					},
				});

				this.children = {
					avatarForm,
					profileInfoForm,
					passwordForm,
					changePasswordBtn,
					cancelEditButton: new Button({
						text: 'cancel',
						onClick: () => this.cancelEdit(),
					}),
					logoutButton: new Button({
						text: 'logout',
						onClick: authController.logout,
					}),
				};

				this.isReady = true;
				this.updateProps({ ready: true });
			}
		});
	}

	submitAvatar(data) {
		if (this.editAvatarMode) {
		}
		this.toggleEditAvatarMode();
	}

	submit(data) {
		if (this.editInfoMode) {
			userController.changeProfileInfo(data);
		}
		this.toggleEditInfoMode();
	}

	submitPassword(data) {
		UserApi.changePassword(data);
		this.toggleEditPasswordMode();
	}

	toggleEditPasswordMode() {
		this.editPasswordMode = !this.editPasswordMode;
		this.passwordForm.props.inputData = getPasswordInputData();
		this.updateProps({ editPasswordMode: this.editPasswordMode });
	}

	toggleEditAvatarMode() {
		this.editAvatarMode = !this.editAvatarMode;
		this.avatarForm.children.button.updateProps({
			text: this.editAvatarMode
				? 'save profile information'
				: 'edit profile information',
		});
		this.avatarForm.lists.inputs.forEach((input) => {
			input.children.input.updateProps({
				disabled: !this.editAvatarMode,
			});
		});
		this.updateProps({ editAvatarMode: this.editAvatarMode });
	}

	toggleEditInfoMode() {
		this.editInfoMode = !this.editInfoMode;
		this.profileInfoForm.children.button.updateProps({
			text: this.editInfoMode ? 'save' : 'edit',
		});
		this.profileInfoForm.lists.inputs.forEach((input) => {
			input.children.input.updateProps({ disabled: !this.editInfoMode });
		});
		this.updateProps({ editInfoMode: this.editInfoMode });
	}

	cancelEdit() {
		if (this.editAvatarMode) {
			this.avatarForm.props.inputData = getAvatarInputData(
				this.currentUser,
				false
			);
			this.toggleEditAvatarMode();
		}
		if (this.editInfoMode) {
			this.profileInfoForm.props.inputData = getInputData(
				this.currentUser,
				false
			);
			this.toggleEditInfoMode();
		}
		if (this.editPasswordMode) {
			this.toggleEditPasswordMode();
		}
	}

	override render() {
		const editMode =
			this.editAvatarMode || this.editInfoMode || this.editPasswordMode;
		return this.isReady
			? `
				<div class="${css.container}">
					{{{ avatarForm }}}
					{{{ profileInfoForm }}}
					 {{#if editPasswordMode}}
					 {{{passwordForm}}}
					 {{else}}
						{{{changePasswordBtn}}}
					{{/if}}
					{{#if ${editMode} }}
						{{{ cancelEditButton }}}
					{{else}}
						{{{ logoutButton }}}
					{{/if}}
				</div>
			`
			: '<div></div>';
	}
}
