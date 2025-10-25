import { chatController } from '../controllers/chatController';
import { store } from '../store/Store';

export function ChatListModel() {
	const chatIds = store.getState().chatIds;
	if (chatIds) {
		return { chatIds };
	}
	chatController.setCurrentUserChatsToStore();
	return {}; // stub for first render, will be updated when store is updated
}
