import { Block } from '../../framework/Block';
import css from './index.module.css';
import {
	Button,
	Form,
	AvatarForm,
	Link,
	type InputProps,
} from '../../components';
import { authController } from '../../controllers/authController';
import {
	emailValidation,
	loginValidation,
	nameValidation,
	passwordValidation,
	phoneValidation,
	displayNameValidation,
} from '../../validation/index.ts';
import { Router } from '../../framework/Router.ts';
import { store, StoreEvents } from '../../store/Store.ts';
import { AuthApi } from '../../api/auth.ts';
import { UserApi } from '../../api/user.ts';
import { type User, type ProfileInfo } from '../../types.ts';
import { isEqual } from '../../tools/isEqual.ts';
import { userController } from '../../controllers/userController.ts';
import { ErrorWithCode } from '../../api/error.ts';
import type { AppState } from '../../store/types';

type EditableUser = Partial<User>;

function getInputData(user: EditableUser = {}, enabled: boolean): InputProps[] {
	return [
		{
			id: 'first_name',
			label: 'first name',
			type: 'text',
			name: 'first_name',
			value: user.first_name ?? '',
			validate: nameValidation,
			disabled: !enabled,
		},
		{
			id: 'second_name',
			label: 'second name',
			type: 'text',
			name: 'second_name',
			value: user.second_name ?? '',
			validate: nameValidation,
			disabled: !enabled,
		},
		{
			id: 'display_name',
			label: 'display name',
			type: 'text',
			name: 'display_name',
			value: user.display_name ?? '',
			validate: displayNameValidation,
			disabled: !enabled,
		},
		{
			id: 'email',
			label: 'email',
			type: 'email',
			name: 'email',
			value: user.email ?? '',
			validate: emailValidation,
			disabled: !enabled,
		},
		{
			id: 'phone',
			label: 'phone',
			type: 'phone',
			name: 'phone',
			value: user.phone ?? '',
			validate: phoneValidation,
			disabled: !enabled,
		},
		{
			id: 'login',
			label: 'login',
			type: 'text',
			name: 'login',
			value: user.login ?? '',
			validate: loginValidation,
			autocomplete: 'username',
			disabled: !enabled,
		},
	];
}

function getPasswordInputData(): InputProps[] {
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
	private isReady = false;
	private currentUser?: User;
	private editInfoMode = false;
	private editPasswordMode = false;
	private profileInfoForm?: Form;
	private passwordForm?: Form;

	constructor() {
		super({
			ready: false,
			editInfoMode: false,
			editPasswordMode: false,
		});
		AuthApi.getCurrentUser()
			.then((user) => {
				store.set('currentUser', user);
			})
			.catch((error: unknown) => this.handleAuthError(error));

		store.on(StoreEvents.Updated, () => {
			const state = store.getState<AppState>();
			const currentUser = state.currentUser;
			if (currentUser && !isEqual(this.currentUser ?? {}, currentUser)) {
				this.currentUser = currentUser;
				this.setupForms(currentUser);
			}
		});
	}

	private handleAuthError(error: unknown) {
		if (error instanceof ErrorWithCode && error.code === 401) {
			const router = new Router();
			store.reset();
			router.go('/');
		}
	}

	private setupForms(user: User) {
		const avatarForm = new AvatarForm({
			value: user.avatar,
			updateMethod: userController.changeAvatar,
		});

		const profileInfoForm = new Form({
			inputData: getInputData(user, this.editInfoMode),
			btnProps: {
				text: this.editInfoMode
					? 'save profile information'
					: 'edit profile information',
			},
			submit: (data) => this.submit(data),
		});

		const passwordForm = new Form({
			inputData: getPasswordInputData(),
			btnProps: {
				text: 'save password',
			},
			submit: (data) => this.submitPassword(data),
		});

		const changePasswordBtn = new Button({
			text: 'change password',
			onClick: () => {
				this.toggleEditPasswordMode();
			},
		});

		const backToMessagesLink = new Link({
			text: 'back to chats',
			url: '/messenger',
		});

		this.profileInfoForm = profileInfoForm;
		this.passwordForm = passwordForm;

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
			backToMessagesLink,
		};

		this.isReady = true;
		this.updateProps({ ready: true });
	}

	private submit(data: Record<string, string>) {
		if (this.editInfoMode) {
			userController
				.changeProfileInfo(data as ProfileInfo)
				.then(() => this.toggleEditInfoMode());
		} else {
			this.toggleEditInfoMode();
		}
	}

	private submitPassword(data: Record<string, string>) {
		const payload = {
			oldPassword: data.oldPassword ?? '',
			newPassword: data.newPassword ?? '',
		};
		void UserApi.changePassword(payload);
		this.toggleEditPasswordMode();
	}

	private toggleEditPasswordMode() {
		if (!this.passwordForm) {
			return;
		}
		this.editPasswordMode = !this.editPasswordMode;
		this.passwordForm.setInputData(getPasswordInputData());
		this.updateProps({ editPasswordMode: this.editPasswordMode });
	}

	private toggleEditInfoMode() {
		if (!this.profileInfoForm) {
			return;
		}
		this.editInfoMode = !this.editInfoMode;
		const user = this.currentUser ?? ({} as User);
		const inputData = getInputData(user, this.editInfoMode);
		this.profileInfoForm.setInputData(inputData);
		this.profileInfoForm.setButtonText(
			this.editInfoMode
				? 'save profile information'
				: 'edit profile information'
		);
		this.profileInfoForm.setInputsDisabled(!this.editInfoMode);
		this.updateProps({ editInfoMode: this.editInfoMode });
	}

	private cancelEdit() {
		if (this.profileInfoForm && this.editInfoMode) {
			this.toggleEditInfoMode();
		}
		if (this.editPasswordMode) {
			this.toggleEditPasswordMode();
		}
	}

	override render() {
		const editMode = this.editInfoMode || this.editPasswordMode;
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
					{{{backToMessagesLink}}}
				</div>
			`
			: '<div></div>';
	}
}
