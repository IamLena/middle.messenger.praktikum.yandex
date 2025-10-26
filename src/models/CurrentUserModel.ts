import { authController } from '../controllers/authController';
import { store } from '../store/Store';

export function CurrentUserModel() {
	const currentUserFromStore = store.getState().currentUser;
	if (currentUserFromStore) {
		return currentUserFromStore;
	}
	authController.setCurrentUserToStore();
	return {}; // stub for first render, will be updated when store is updated
}
