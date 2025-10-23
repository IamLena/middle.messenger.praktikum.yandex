import { chatController } from '../controllers/chatController';
import { store } from '../store/Store';

export function ChatListModel() {
	const chatsFromStore = store.getState().chats;
	if (chatsFromStore) {
		return chatsFromStore;
	}
	chatController.setCurrentUserChatsToStore();
	return {}; // stub for first render, will be updated when store is updated
}
