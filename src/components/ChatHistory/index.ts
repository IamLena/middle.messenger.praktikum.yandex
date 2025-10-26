import { Block } from '../../framework/Block';
import { Message } from '..';
import css from './index.module.css';
import { store, StoreEvents } from '../../store/Store';
import { DateSeparator } from '../DateSeparator/index.ts';
import type { AppState, StoredMessage } from '../../store/types';

export type Props = {
	class?: string;
};

export class ChatHistory extends Block {
	isReady = false;
	private chatId?: number;

	constructor() {
		super({
			isReady: false,
		});

		store.on(StoreEvents.Updated, () => {
			const state = store.getState<AppState>();
			const chatId = state.selectedChatId;
			const userId = state.currentUser?.id;
			this.chatId = chatId ?? undefined;
			if (!chatId || !userId) {
				this.isReady = false;
				this.updateLists({ messages: [] });
				return;
			}

			const messages = state.messages?.[chatId];
			if (!Array.isArray(messages) || messages.length === 0) {
				this.isReady = false;
				this.updateLists({ messages: [] });
				return;
			}

			const typedMessages = messages as StoredMessage[];
			const messagesList: Block[] = [];
			let lastDate: string | null = null;
			typedMessages.forEach((message) => {
				const datetime = new Date(message.time);
				const time = datetime.toLocaleTimeString(undefined, {
					hour: '2-digit',
					minute: '2-digit',
					hour12: false,
				});
				const date = datetime.toLocaleDateString(undefined, {
					day: '2-digit',
					month: '2-digit',
					year: 'numeric',
				});
				if (lastDate !== date) {
					if (lastDate) {
						messagesList.push(
							new DateSeparator({
								date: lastDate,
							})
						);
					}
					lastDate = date;
				}
				messagesList.push(
					new Message({
						text: message.content,
						mine: message.user_id === userId,
						time,
					})
				);
			});
			if (lastDate) {
				messagesList.push(
					new DateSeparator({
						date: lastDate,
					})
				);
			}
			this.isReady = true;
			this.updateLists({
				messages: messagesList,
			});
		});
	}

	override render(): string {
		return this.isReady
			? `
				<div class="${css.container} {{class}}">
					{{{messages}}}
				</div>
			`
			: `
				<div class="${css.container} ${css.stub} {{class}}">
					${this.chatId ? 'no messages yet' : 'select chat'}
				</div>
			`;
	}
}
