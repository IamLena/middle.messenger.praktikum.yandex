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
			console.log('update chatIds', newProps.chatIds);
			const chats = mapIdsToChatBlocks(newProps.chatIds, (id) => {
				this.selectChat(id);
			});
			console.log('chats', chats);
			this.updateLists({
				chats,
			});
			return true;
		}
		return false;
	}

	override render() {
		return `
			<div class="${css.left}">
				{{{header}}}
				<div class="${css.scroll}">
					{{{ chats }}}
				</div>
			</div>
		`;
	}
}

export const LeftPane = connect(
	() => ({ chatIds: Object.keys(ChatListModel()).join(',') }),
	(state) => {
		const chatIds = typeof state.chatIds === 'string' ? state.chatIds : '';
		const chats = (state.chats ?? {}) as Record<string, unknown>;

		if (chatIds === '') {
			return { chatIds: '' };
		}

		const ids = chatIds.split(',').filter(Boolean);
		const allExist = ids.every((chatId) => Boolean(chats[chatId]));

		if (allExist) {
			return { chatIds: ids.join(',') };
		}
	},
	LeftPaneBase
);
