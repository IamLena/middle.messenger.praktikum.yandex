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

		authController.setCurrentUserToStore();

		store.on(StoreEvents.Updated, () => {
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
				this.socket = new Socket(userId, chatId, token);
			}
			this.chatId = chatId;
			this.userId = userId;
			const messages = store.getState().messages?.[this.chatId];
			console.log('messages', messages);
			if (messages) {
				const messagesList = messages.map(
					(message) =>
						new Message({
							text: message.content,
							mine: message.user_id === this.userId,
						})
				);
				this.isReady = true;
				this.updateLists({
					messages: messagesList,
				});
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

// export type Props = {
// 	// perhapse here should be chatId to get data from inside
// 	class?: string;
// };

// export class ChatHistoryBase extends Block {
// 	token: string;
// 	userId: number;
// 	chatId: number;
// 	constructor(props: Props) {
// 		super({
// 			...props,
// 			messages: [
// 				new Message({
// 					text: 'hello there',
// 					mine: false,
// 				}),
// 				new Message({
// 					text: `
// 						some log long long long
// 						very very long very much looooooooong
// 						message some log long long long very
// 						very long very much looooooooong message
// 					`,
// 					mine: true,
// 				}),
// 			],
// 		});

// 		this.token = props.token;
// 		this.userId = props.userId;
// 		this.chatId = props.chatId;
// 	}

// 	protected override componentDidUpdate(
// 		oldProps: { [x: string]: unknown },
// 		newProps: { [x: string]: unknown }
// 	): boolean {
// 		if (
// 			('token' in newProps ||
// 				'chatId' in newProps ||
// 				'userId' in newProps) &&
// 			!isEqual(oldProps, newProps)
// 		) {
// 			this.token = newProps.token;
// 			this.chatId = newProps.chatId;
// 			this.userId = newProps.userId;

// 			// this.userId

// 			// console.log(
// 			// 	'this.userId, this.chatId, this.token',
// 			// 	this.userId,
// 			// 	this.chatId,
// 			// 	this.token
// 			// );
// 			if (this.userId && this.chatId && this.token) {
// 				// не тут, должен быть открытый, а он удаляется
// 				// кажется надо передать куки, не валидный токен сейчас
// 				// const socket = new Socket(this.userId, this.chatId, this.token);
// 				// console.log('new socket here', socket);
// 				// not ready yet
// 				// const result = socket.getOld(0);
// 				// console.log('get old messages', result);
// 			}

// 			// return true;
// 		}
// 	}

// 	override render() {
// 		return `
// 			<div class="${css.container} {{class}}">
// 				{{{ messages }}}
// 			</div>
// 		`;
// 	}
// }

// export const ChatHistory = connect(
// 	() => {
// 		const state = store.getState();
// 		const chatId = state.selectedChatId;
// 		if (!chatId) {
// 			return {};
// 		}
// 		let token = state.tokens?.[chatId];
// 		if (!token) {
// 			chatController.getToken(chatId);
// 		}
// 		if (!state.currentUser) {
// 			authController.setCurrentUserToStore();
// 		}
// 		const userId = state.currentUser?.id;
// 		return { chatId, token, userId };
// 	},
// 	(state) => {
// 		const chatId = state.selectedChatId;
// 		if (!chatId) {
// 			return {};
// 		}
// 		let token = state.tokens?.[chatId];
// 		if (!token) {
// 			chatController.getToken(chatId);
// 		}
// 		if (!state.currentUser) {
// 			authController.setCurrentUserToStore();
// 		}
// 		const userId = state.currentUser?.id;
// 		return { chatId, token, userId };
// 	},
// 	ChatHistoryBase
// );
