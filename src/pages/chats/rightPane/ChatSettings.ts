import { Block } from '../../../framework/Block.ts';
import { Form, Button, AvatarForm } from '../../../components';
import css from '../index.module.css';
import { store } from '../../../store/Store.ts';
import { okayValidation } from '../../../validation';
import { connect } from '../../../store/connect.ts';
import { isEqual } from '../../../tools/isEqual.ts';
import { chatController } from '../../../controllers/chatController.ts';
import type { AppState, ParticipantsState } from '../../../store/types';
import type { AvatarData, ChatId } from '../../../types';

type ChatSettingsProps = {
	chatId?: ChatId;
	title?: string;
	participants?: string;
	avatarPath?: string;
};

export class ChatSettingsBase extends Block {
	private chatId?: ChatId;
	private readonly avatarForm: AvatarForm;

	constructor({
		chatId,
		title,
		participants,
		avatarPath,
	}: ChatSettingsProps) {
		const avatarForm = new AvatarForm({
			value: avatarPath,
			updateMethod: (data) => this.changeAvatar(data),
		});

		super({
			avatarPath,
			title,
			participants,
			deleteBtn: new Button({
				text: 'delete chat',
				onClick: () => this.deleteChat(),
			}),
			addParticipant: new Form({
				inputData: [
					{
						id: 'add-participant',
						label: "participant's login to add:",
						type: 'text',
						name: 'participant',
						validate: okayValidation,
					},
				],
				btnProps: { text: 'add' },
				submit: (data) => this.addParticipant(data),
				class: css.form,
				resetOnSubmit: true,
			}),
			deleteParticipant: new Form({
				inputData: [
					{
						id: 'delete-participant',
						label: "participant's login to remove:",
						type: 'text',
						name: 'participant',
						validate: okayValidation,
					},
				],
				btnProps: { text: 'remove' },
				submit: (data) => this.deleteParticipant(data),
				class: css.form,
				resetOnSubmit: true,
			}),
			avatarForm,
		});

		this.chatId = chatId;
		this.avatarForm = avatarForm;
	}

	deleteChat() {
		if (this.chatId) {
			chatController.deleteChat(this.chatId);
		}
	}

	protected override componentDidUpdate(
		oldProps: Record<string, unknown>,
		newProps: Record<string, unknown>
	): boolean {
		if (!isEqual(oldProps, newProps)) {
			if ('chatId' in newProps) {
				this.chatId = newProps.chatId as ChatId | undefined;
			}
			if ('avatarPath' in newProps) {
				this.avatarForm.updateProps({ value: newProps.avatarPath });
			}
			return true;
		}
		return false;
	}

	private changeAvatar(data: AvatarData) {
		if (this.chatId) {
			chatController.changeAvatar(this.chatId, data);
		}
	}

	private addParticipant({ participant }: Record<string, string>) {
		if (this.chatId) {
			chatController.addUserByLogin({
				login: participant,
				chatId: this.chatId,
			});
		}
	}

	private deleteParticipant({ participant }: Record<string, string>) {
		if (this.chatId) {
			chatController.deleteUserByLogin({
				login: participant,
				chatId: this.chatId,
			});
		}
	}

	override render() {
		if (this.chatId) {
			return `
				<div class="${css.header}">
					<div>
						title: {{{ title }}}
					</div>
					<div>
						participants: {{{ participants }}}
					</div>
					<div class="${css.forms}">
						{{{ addParticipant }}}
						{{{ deleteParticipant }}}
					</div>
					{{{ deleteBtn }}}
					{{{ avatarForm }}}
				</div>
			`;
		}
		return `<div></div>`;
	}
}

function buildChatSettingsProps(state: AppState): ChatSettingsProps {
	const chatId = state.selectedChatId;
	if (!chatId) {
		return {};
	}
	const chats = state.chats;
	const participants = state.participants as ParticipantsState | undefined;
	const chatData = chats?.[chatId];

	if (!chatData) {
		void chatController.setCurrentUserChatsToStore();
	}

	if (!participants?.[chatId]) {
		void chatController.getUsers({ id: chatId });
	}
	return {
		chatId,
		title: chatData?.title ?? '',
		participants: participants?.[chatId] ?? '',
		avatarPath: chatData?.avatar,
	};
}

export const ChatSettings = connect<ChatSettingsProps>(
	() => buildChatSettingsProps(store.getState<AppState>()),
	(state) => buildChatSettingsProps(state),
	ChatSettingsBase
);
