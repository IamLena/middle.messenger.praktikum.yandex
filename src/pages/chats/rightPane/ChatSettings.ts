import { Block } from '../../../framework/Block.ts';
import { Link, Form, Button } from '../../../components';
import css from '../index.module.css';
import { store, StoreEvents } from '../../../store/Store.ts';
import { okayValidation } from '../../../validation';
import { connect } from '../../../store/connect.ts';
import { isEqual } from '../../../tools/isEqual.ts';
import { chatController } from '../../../controllers/chatController.ts';

const deleteSelectedChatBtn = connect(
	() => {
		const chatId = store.getState().selectedChatId;
		if (chatId) {
			return {
				onClick: () => chatController.deleteChat(chatId),
			};
		}
		return {};
	},
	(state) => {
		const chatId = state.selectedChatId;
		// events - not props, not lists - so no update!
		if (chatId) {
			return {
				onClick: () => {
					chatController.deleteChat(chatId);
				},
			};
		}
		return {};
	},
	Button
);

export class ChatSettingsBase extends Block {
	isInited: boolean;
	chatId: number;

	constructor({ chatId, title, participants }) {
		super({
			title,
			participants,
			// id inside is not set after selection, need connection
			deleteBtn: new deleteSelectedChatBtn({
				text: 'delete chat',
				onClick: () => this.deleteChat(),
			}),
			addParticipant: new Form({
				inputData: [
					{
						id: 'add-participant',
						label: 'participant to add',
						type: 'text',
						name: 'participant',
						validate: okayValidation,
					},
				],
				btnProps: { text: 'add participant' },
				submit: (data) => this.addParticipant(data),
				class: css.form,
			}),
			deleteParticipant: new Form({
				inputData: [
					{
						id: 'delete-participant',
						label: 'participant to remove',
						type: 'text',
						name: 'participant',
						validate: okayValidation,
					},
				],
				btnProps: { text: 'remove participant' },
				submit: (data) => this.deleteParticipant(data),
				class: css.form,
			}),
		});

		this.isInited = Boolean(chatId);
		this.chatId = chatId;
	}

	protected override componentDidUpdate(
		oldProps: { [x: string]: unknown },
		newProps: { [x: string]: unknown }
	): boolean {
		console.log('oldProps', oldProps, 'newProps', newProps);
		if (
			'chatId' in newProps &&
			Boolean(newProps.chatId) &&
			!oldProps.chatId
		) {
			this.isInited = true;
			this.chatId = newProps.chatId;
			return true;
		}
		if (
			('title' in newProps || 'participants' in newProps) &&
			!isEqual(newProps, oldProps)
		) {
			this.chatId = newProps.chatId;
			this.isInited = Boolean(newProps.chatId);
			return true;
		}
	}

	deleteChat() {
		console.log('chat to delete', this.chatId);
		chatController.deleteChat(this.chatId);
	}

	addParticipant({ participant }) {
		chatController.addUserByLogin({
			login: participant,
			chatId: this.chatId,
		});
	}

	deleteParticipant({ participant }) {
		chatController.deleteUserByLogin({
			login: participant,
			chatId: this.chatId,
		});
	}

	selectChat(id: number) {
		store.set('selectedChatId', id);
	}

	override render() {
		console.log('this.chatId', this.chatId);
		if (this.chatId) {
			return `
				<div class="${css.header}">
					<div>
						title: {{{ title }}}
					</div>
					<div>
						participants: {{{ participants }}}
					</div>
					{{{ addParticipant }}}
					{{{ deleteParticipant }}}
					{{{ deleteBtn }}}
				</div>
			`;
		}
		return `<div></div>`;
	}
}

export const ChatSettings = connect(
	() => {
		const state = store.getState();
		const chatId = state.selectedChatId;
		let title = '';
		let participants = '';
		if (chatId) {
			if (!state.chats?.[chatId]) {
				chatController.setCurrentUserChatsToStore();
			} else if (!state.participants?.[chatId]) {
				chatController.getUsers({ id: chatId });
			}
			title = state.chats?.[chatId].title;
			participants = state.participants?.[chatId];
		}
		return { chatId, title, participants };
	},
	(state) => {
		const chatId = state.selectedChatId;
		let title = '';
		let participants = '';
		// check for chat in store but no users there
		if (chatId) {
			if (!state.chats?.[chatId]) {
				chatController.setCurrentUserChatsToStore();
			} else if (!state.participants?.[chatId]) {
				chatController.getUsers({ id: chatId });
			}
			title = state.chats?.[chatId].title;
			participants = state.participants?.[chatId];
		}
		return { chatId, title, participants };
	},
	ChatSettingsBase
);
