import { store } from '../store/Store.ts';

export class Socket {
	socket: WebSocket;
	intervalId: number;

	constructor(userId, chatId, token) {
		// тут userId и chatId и токет достать
		const socket = new WebSocket(
			`wss://ya-praktikum.tech/ws/chats/${userId}/${chatId}/${token}`
		);

		socket.addEventListener('open', () => {
			console.log('Соединение установлено');

			// this.send('Моё первое сообщение миру!');
			// socket.send(
			// 	JSON.stringify({
			// 		type: 'ping',
			// 	})
			// );
			this.intervalId = setInterval(() => {
				this.ping();
			}, 5000);

			this.getOld(0);
		});

		socket.addEventListener('close', (event) => {
			if (event.wasClean) {
				console.log('Соединение закрыто чисто');
			} else {
				console.log('Обрыв соединения');
			}

			console.log(`Код: ${event.code} | Причина: ${event.reason}`);
		});

		socket.addEventListener('message', (event) => {
			console.log('Получены данные', event.data);
			this.getMessage(event.data);
		});

		socket.addEventListener('error', (event) => {
			console.log('Ошибка', event.message);
		});

		this.socket = socket;
	}

	stopPinging() {
		clearInterval(this.intervalId);
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

	getMessage(jsonData) {
		const data = JSON.parse(jsonData);
		if (Array.isArray(data)) {
			console.log('messages', data);
			const chatId = data[0].chat_id;
			store.set(`messages.${chatId}`, data);
			console.log('getMessage store', store);
			// {
			//     chat_id: "number",
			//     time: "string",
			//     type: "string",
			//     user_id: "string",
			//     content: "string",
			//     file?: {
			//         id: "number",
			//         user_id: "number",
			//         path: "string",
			//         filename: "string",
			//         content_type: "string",
			//         content_size: "number",
			//         upload_date: "string",
			//     }
			// }
		} else if (data.type === 'message') {
			const chatId = store.getState().selectedChatId;
			store.set(`messages.${chatId}`, [data]);
		} else if (data.type !== 'pong') {
			console.log('getMessage data', data);
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
