export class Socket {
	socket: WebSocket;

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
			setInterval(() => {
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

	getMessage(data) {
		if (JSON.parse(data).type !== 'pong') {
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
