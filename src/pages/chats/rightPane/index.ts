import { Block } from '../../../framework/Block';
import { ChatHistory, Compose } from '../../../components';
import css from '../index.module.css';
import { ChatSettings } from './ChatSettings.ts';
import { store, StoreEvents } from '../../../store/Store.ts';
import { chatController } from '../../../controllers/chatController.ts';
import { authController } from '../../../controllers/authController.ts';
import { Socket } from '../../../api/socket.ts';
import type { AppState } from '../../../store/types';

export class RightPane extends Block {
	private chatId?: number;
	private socket: Socket | null = null;

	constructor() {
		super({
			chatSettings: new ChatSettings({}),
			chatHistory: new ChatHistory(),
			compose: new Compose({
				sendMessage: (data) => this.sendMessage(data),
			}),
		});

		authController.setCurrentUserToStore();

		store.on(StoreEvents.Updated, () => {
			const state = store.getState<AppState>();
			const chatId = state.selectedChatId;
			const userId = state.currentUser?.id;
			if (!chatId || !userId) {
				return;
			}
			const token = state.tokens?.[chatId];
			if (!token) {
				chatController.getToken(chatId);
				return;
			}
			if (this.socket && this.chatId !== chatId) {
				this.socket.stopPinging();
				this.socket = null;
			}
			if (!this.socket) {
				this.socket = new Socket(userId, chatId, token);
			}
			this.chatId = chatId;
		});
	}

	sendMessage(text: string) {
		const trimmedText = text?.trim();
		if (trimmedText && this.socket) {
			this.socket.sendMessage(trimmedText);
		}
	}

	override render() {
		return `
		<div class="${css.right} {{class}}">
			{{{ chatSettings }}}
			{{{ chatHistory }}}
			{{{ compose }}}
		</div>
	`;
	}
}
