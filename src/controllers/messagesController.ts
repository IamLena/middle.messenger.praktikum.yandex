import { AuthApi } from '../api/auth.ts';
import { ErrorWithCode } from '../api/error.ts';
import type { Socket } from '../api/socket.ts';
import { Router } from '../framework/Router.ts';
import { store } from '../store/Store.ts';
import { type LoginData, type RegisterData, type User } from '../types.ts';

export const messagesController = {
	getOld(socket: Socket): Promise<void> {},
};
