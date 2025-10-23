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
	constructor({ chatId, title, participants }) {
		super({
			title,
			participants,
			// id inside is not set after selection, need connection
			deleteBtn: new deleteSelectedChatBtn({
				text: 'delete chat',
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
				submit: ({ participant }) =>
					chatController.addParticipant({
						login: participant,
						chatId,
					}),
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
				btnProps: { text: 'add participant' },
				submit: chatController.deleteParticipant,
				class: css.form,
			}),
		});

		this.isInited = Boolean(chatId);
	}

	protected override componentDidUpdate(
		oldProps: { [x: string]: unknown },
		newProps: { [x: string]: unknown }
	): boolean {
		if (
			'chatId' in newProps &&
			Boolean(newProps.chatId) &&
			!oldProps.chatId
		) {
			this.isInited = true;
			return true;
		}
		if (
			('title' in newProps || 'participants' in newProps) &&
			!isEqual(newProps, oldProps)
		) {
			return true;
		}
	}

	selectChat(id: number) {
		store.set('selectedChatId', id);
	}

	override render() {
		if (this.isInited) {
			return `
				<div class="${css.header}">
					{{{ title }}}
					{{{ participants }}}
					{{{ deleteBtn }}}
					{{{ addParticipant }}}
					{{{ deleteParticipant }}}
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
