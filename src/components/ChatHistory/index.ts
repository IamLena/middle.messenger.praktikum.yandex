import { Block } from '../../framework/Block';
import { Message } from '..';
import css from './index.module.css';
import { store } from '../../store/Store';
import { connect } from '../../store/connect.ts';
import { chatController } from '../../controllers/chatController.ts';
import { isEqual } from '../../tools/isEqual.ts';
import { Socket } from '../../api/socket.ts';
import { authController } from '../../controllers/authController.ts';

export type Props = {
	// perhapse here should be chatId to get data from inside
	class?: string;
};

export class ChatHistoryBase extends Block {
	token: string;
	userId: number;
	chatId: number;
	constructor(props: Props) {
		super({
			...props,
			messages: [
				new Message({
					text: 'hello there',
					mine: false,
				}),
				new Message({
					text: `
						some log long long long
						very very long very much looooooooong
						message some log long long long very
						very long very much looooooooong message
					`,
					mine: true,
				}),
			],
		});

		this.token = props.token;
		this.userId = props.userId;
		this.chatId = props.chatId;
	}

	protected override componentDidUpdate(
		oldProps: { [x: string]: unknown },
		newProps: { [x: string]: unknown }
	): boolean {
		if (
			('token' in newProps ||
				'chatId' in newProps ||
				'userId' in newProps) &&
			!isEqual(oldProps, newProps)
		) {
			this.token = newProps.token;
			this.chatId = newProps.chatId;
			this.userId = newProps.userId;

			// this.userId

			console.log(
				'this.userId, this.chatId, this.token',
				this.userId,
				this.chatId,
				this.token
			);
			if (this.userId && this.chatId && this.token) {
				// не тут, должен быть открытый, а он удаляется
				// кажется надо передать куки, не валидный токен сейчас
				const socket = new Socket(this.userId, this.chatId, this.token);
				console.log('new socket here', socket);

				// not ready yet
				// const result = socket.getOld(0);
				// console.log('get old messages', result);
			}

			// return true;
		}
	}

	override render() {
		return `
			<div class="${css.container} {{class}}">
				{{{ messages }}}
			</div>
		`;
	}
}

export const ChatHistory = connect(
	() => {
		const state = store.getState();
		const chatId = state.selectedChatId;
		if (!chatId) {
			return {};
		}
		let token = state.tokens?.[chatId];
		if (!token) {
			chatController.getToken(chatId);
		}
		if (!state.currentUser) {
			authController.setCurrentUserToStore();
		}
		const userId = state.currentUser?.id;
		return { chatId, token, userId };
	},
	(state) => {
		const chatId = state.selectedChatId;
		if (!chatId) {
			return {};
		}
		let token = state.tokens?.[chatId];
		if (!token) {
			chatController.getToken(chatId);
		}
		if (!state.currentUser) {
			authController.setCurrentUserToStore();
		}
		const userId = state.currentUser?.id;
		return { chatId, token, userId };
	},
	ChatHistoryBase
);
