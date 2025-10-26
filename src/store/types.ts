import type { RawChat, ChatId, User, UserId } from '../types';

export type StoredMessage = {
	id?: number;
	user_id: number;
	time: string;
	content: string;
	type?: string;
	chat_id?: ChatId;
};

export type TokensState = Record<ChatId, string>;
export type ChatsState = Record<ChatId, RawChat>;
export type ParticipantsState = Record<ChatId, string | undefined>;
export type UsersByLoginState = Record<string, UserId[] | undefined>;
export type CertainUserState = Record<string, User | undefined>;
export type MessagesState = Record<ChatId, StoredMessage[]>;

export type AppState = {
	currentUser?: User;
	chatIds?: string;
	selectedChatId?: ChatId;
	chats?: ChatsState;
	participants?: ParticipantsState;
	tokens?: TokensState;
	messages?: MessagesState;
	users?: User[];
	usersByLogin?: UsersByLoginState;
	certainUser?: CertainUserState;
	socketError?: string;
	loginReady?: boolean;
	registerReady?: boolean;
};
