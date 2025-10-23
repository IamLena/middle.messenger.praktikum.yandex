import { Block } from '../../../framework/Block.ts';
import { Link, Chat, Button } from '../../../components';
import css from '../index.module.css';
import { store, StoreEvents } from '../../../store/Store.ts';
import { LeftPaneHeader } from './header.ts';
import { connect } from '../../../store/connect.ts';
import { ChatListModel } from '../../../models/ChatListModel.ts';
// import { chatController } from '../../../controllers/chatController.ts';

function mapIdsToChatBlocks(chatIds, selectChat) {
	const chatIdsArray = chatIds === '' ? [] : chatIds.split(',').map(Number);

	return chatIdsArray.map((chatId) => {
		return new Chat({
			id: chatId,
			onClick: () => {
				selectChat(chatId);
			},
		});
	});
}

export class LeftPaneBase extends Block {
	selectedChatId: string | undefined;

	constructor({ chatIds = '' }) {
		super({
			header: new LeftPaneHeader(),
			chatIds,
			chats: mapIdsToChatBlocks(chatIds, (id) => {
				this.selectChat(id);
			}),
		});
	}

	selectChat(id: number) {
		store.set('selectedChatId', id);
	}

	protected override componentDidUpdate(
		oldProps: { [x: string]: unknown },
		newProps: { [x: string]: unknown }
	): boolean {
		if ('chatIds' in newProps && oldProps.chatIds !== newProps.chatIds) {
			this.updateLists({
				chats: mapIdsToChatBlocks(newProps.chatIds, (id) => {
					this.selectChat(id);
				}),
			});
		}
		return true;
	}

	override render() {
		return `
			<div class="${css.left}">
				{{{header}}}
				{{{ chats }}}
			</div>
		`;
	}
}

export const LeftPane = connect(
	() => ({ chatIds: Object.keys(ChatListModel()).join(',') }),
	(state) => {
		const chatIds = Object.keys(state.chats).join(',');
		return { chatIds };
	},
	LeftPaneBase
);
