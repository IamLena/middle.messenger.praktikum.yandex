import { Block } from '../../framework/Block';
import { Message } from '..';
import css from './index.module.css';
import { store, StoreEvents } from '../../store/Store';
import { connect } from '../../store/connect.ts';
import { chatController } from '../../controllers/chatController.ts';
import { isEqual } from '../../tools/isEqual.ts';
import { Socket } from '../../api/socket.ts';
import { authController } from '../../controllers/authController.ts';
import { messagesController } from '../../controllers/messagesController.ts';

export class ChatHistory extends Block {
	isReady: boolean = false;
	chatId: undefined;
	userId: undefined;
	token: undefined;
	socket: undefined;

	constructor() {
		super({
			isReady: false,
		});

		store.on(StoreEvents.Updated, () => {
			const chatId = store.getState().selectedChatId;
			const userId = store.getState().currentUser?.id;
			if (chatId && userId) {
				const messages = store.getState().messages?.[chatId];
				console.log('ChatHistory messages', messages);
				if (messages) {
					const messagesList = messages.map(
						(message) =>
							new Message({
								text: message.content,
								mine: message.user_id === userId,
							})
					);
					this.isReady = true;
					this.updateLists({
						messages: messagesList,
					});
				}
			}
		});
	}

	override render(): string {
		console.log(' this.isReady', this.isReady);
		return this.isReady
			? `
				<div class="${css.container} {{class}}">
					{{{messages}}}
				</div>
			`
			: `<div class="${css.container} {{class}}"></div>`;
	}
}
