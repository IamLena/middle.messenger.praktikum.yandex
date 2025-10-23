import {
	LoginPage,
	RegisterPage,
	ProfilePage,
	ChatsPage,
	notFoundPage,
	fatalPage,
} from './pages';
import { Router } from './framework/Router';

// to consts
const routingConfig = {
	'/': LoginPage,
	'/sign-up': RegisterPage,
	'/settings': ProfilePage,
	'/messenger': ChatsPage,
	'/404': notFoundPage,
	'/fatal': fatalPage,
};

document.addEventListener('DOMContentLoaded', () => {
	const router = new Router('#app');
	router.initPages(routingConfig);
	router.start();
	// check for loged in?
});
