import { store } from '../store/Store.ts';
import type { AppState, StoredMessage } from '../store/types';

type RawHistoryMessage = {
	chat_id: number;
	time: string;
	type: string;
	user_id: number;
	content: string;
	file?: Record<string, unknown>;
};

type RawRealtimeMessage = {
	type: string;
	chat_id?: number;
	[key: string]: unknown;
};

export class Socket {
	socket: WebSocket;
	private intervalId: ReturnType<typeof setInterval> | null = null;

	constructor(userId: number, chatId: number, token: string) {
		const socket = new WebSocket(
			`wss://ya-praktikum.tech/ws/chats/${userId}/${chatId}/${token}`
		);

		socket.addEventListener('open', () => {
			this.intervalId = setInterval(() => {
				this.ping();
			}, 5000);

			this.getOld(0);
		});

		socket.addEventListener('close', () => {
			this.stopPinging();
		});

		socket.addEventListener('message', (event: MessageEvent<string>) => {
			this.getMessage(event.data);
		});

		socket.addEventListener('error', () => {
			store.set('socketError', 'connection issue');
		});

		this.socket = socket;
	}

	stopPinging() {
		if (this.intervalId) {
			clearInterval(this.intervalId);
			this.intervalId = null;
		}
	}

	ping() {
		this.socket.send(
			JSON.stringify({
				type: 'ping',
			})
		);
	}

	sendMessage(message: string) {
		this.socket.send(
			JSON.stringify({
				content: message,
				type: 'message',
			})
		);
	}

	getMessage(jsonData: string) {
		const parsed = JSON.parse(jsonData) as
			| RawHistoryMessage[]
			| RawRealtimeMessage;
		if (Array.isArray(parsed)) {
			if (parsed.length === 0) {
				return;
			}
			const chatId = parsed[0].chat_id;
			const normalized: StoredMessage[] = parsed.map((message) => ({
				chat_id: message.chat_id,
				content: message.content,
				time: message.time,
				user_id: message.user_id,
				type: message.type,
			}));
			store.set(`messages.${chatId}`, normalized);
			return;
		}

		if (typeof parsed === 'object' && parsed !== null && parsed.type === 'message') {
			const state = store.getState<AppState>();
			const chatId = state.selectedChatId;
			if (!chatId) {
				return;
			}
			const messages = (state.messages?.[chatId] ?? []) as StoredMessage[];
			const nextMessage: StoredMessage = {
				chat_id: chatId,
				content: (parsed as { content?: string }).content ?? '',
				time: (parsed as { time?: string }).time ?? new Date().toISOString(),
				user_id: (parsed as { user_id?: number }).user_id ?? 0,
				type: parsed.type,
			};
			store.set(`messages.${chatId}`, [nextMessage, ...messages]);
		}
	}

	getOld(offset: number) {
		this.socket.send(
			JSON.stringify({
				content: `${offset}`,
				type: 'get old',
			})
		);
	}
}
