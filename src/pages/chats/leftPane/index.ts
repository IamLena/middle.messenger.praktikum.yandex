import { Block } from '../../../framework/Block.ts';
import { Chat } from '../../../components';
import css from '../index.module.css';
import { store } from '../../../store/Store.ts';
import { LeftPaneHeader } from './header.ts';
import { connect } from '../../../store/connect.ts';
import { ChatListModel } from '../../../models/ChatListModel.ts';
import type { ChatsState } from '../../../store/types';

type LeftPaneProps = {
	chatIds?: string;
};

function mapIdsToChatBlocks(
	chatIds: string,
	selectChat: (chatId: number) => void
) {
	const chatIdsArray = chatIds === '' ? [] : chatIds.split(',').map(Number);

	return chatIdsArray.map((chatId) =>
		new Chat({
			id: chatId,
			onClick: () => {
				selectChat(chatId);
			},
		})
	);
}

export class LeftPaneBase extends Block {
	constructor({ chatIds = '' }: LeftPaneProps) {
		super({
			header: new LeftPaneHeader(),
			chatIds,
			chats: mapIdsToChatBlocks(chatIds, (id) => {
				this.selectChat(id);
			}),
		});
	}

	private selectChat(id: number) {
		store.set('selectedChatId', id);
	}

	protected override componentDidUpdate(
		oldProps: Record<string, unknown>,
		newProps: Record<string, unknown>
	): boolean {
		if ('chatIds' in newProps && oldProps.chatIds !== newProps.chatIds) {
			const chats = mapIdsToChatBlocks(
				(newProps.chatIds as string) ?? '',
				(id) => {
					this.selectChat(id);
				}
			);
			this.updateLists({ chats });
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

export const LeftPane = connect<LeftPaneProps>(
	() => {
		const model = ChatListModel();
		return { chatIds: model.chatIds ?? '' };
	},
	(state) => {
		const chatIds = typeof state.chatIds === 'string' ? state.chatIds : '';
		const chats = state.chats as ChatsState | undefined;

		if (chatIds === '') {
			return { chatIds: '' };
		}

		const ids = chatIds.split(',').filter(Boolean);
		const allExist = ids.every((chatId) => Boolean(chats?.[Number(chatId)]));

		if (allExist) {
			return { chatIds: ids.join(',') };
		}
	},
	LeftPaneBase
);
