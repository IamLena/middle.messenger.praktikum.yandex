import { Block } from '../../../framework/Block';
import { ChatHistory, Compose } from '../../../components';
import css from '../index.module.css';
import { ChatSettings } from './ChatSettings.ts';
import { store, StoreEvents } from '../../../store/Store.ts';
import { chatController } from '../../../controllers/chatController.ts';
import { authController } from '../../../controllers/authController.ts';
import { Socket } from '../../../api/socket.ts';

export class RightPane extends Block {
	chatId: undefined;
	userId: undefined;
	token: undefined;
	socket: undefined;

	constructor() {
		super({
			chatSettings: new ChatSettings({}),
			chatHistory: new ChatHistory({}),
			compose: new Compose({}),
		});

		authController.setCurrentUserToStore();

		store.on(StoreEvents.Updated, () => {
			console.log('store', store);
			const chatId = store.getState().selectedChatId;
			if (!chatId) return;
			const userId = store.getState().currentUser?.id;
			if (!userId) return;
			const token = store.getState().tokens?.[chatId];
			if (!token) {
				chatController.getToken(chatId);
				return;
			}
			if (this.socket && this.chatId !== chatId) {
				this.socket.stopPinging();
			}
			if (!this.socket) {
				console.log('creating socket');
				this.socket = new Socket(userId, chatId, token);
			}
			this.chatId = chatId;
			this.userId = userId;
		});
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
