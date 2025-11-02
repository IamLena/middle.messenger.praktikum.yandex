import { jest } from '@jest/globals';
import { Router } from './Router';
import { Block, type BlockClass } from './Block';

const createPage = (name: string): BlockClass =>
	class extends Block {
		render(): string {
			return `<div>${name}</div>`;
		}
	};

const defaultPages = () => ({
	'/': createPage('login'),
	'/profile': createPage('register'),
	'/messenger': createPage('chats'),
	'/404': createPage('notFound'),
	'/fatal': createPage('fatal'),
});

const routerSingleton = Router as unknown as { __instance?: Router };

const resetRouterSingleton = () => {
	delete routerSingleton.__instance;
};

const initRouter = (pages: Record<string, BlockClass> = defaultPages()) => {
	resetRouterSingleton();
	const router = new Router('#app');
	router.initPages(pages);
	return router;
};

const getPageName = () =>
	document.querySelector('#app')?.firstElementChild?.textContent;

describe('Router', () => {
	beforeEach(() => {
		document.body.innerHTML = '<div id="app"></div>';
		window.history.replaceState({}, '', '/');
		resetRouterSingleton();
	});

	afterEach(() => {
		jest.restoreAllMocks();
		window.onpopstate = null;
		resetRouterSingleton();
	});

	test('throws when root selector is missing', () => {
		expect(() => new Router()).toThrow('To initialize requires a selector');
	});

	test('initPages registers provided routes', () => {
		const router = initRouter({
			'/': createPage('login'),
			'/messenger': createPage('chats'),
			'/404': createPage('notFound'),
		});

		const paths = router.routes.map((route) => route._pathname);

		expect(paths).toEqual(['/', '/messenger', '/404']);
	});

	test('go method pushes history state and renders block-page', () => {
		const router = initRouter();
		const pushStateSpy = jest.spyOn(window.history, 'pushState');

		router.go('/messenger');

		expect(pushStateSpy).toHaveBeenCalledWith({}, '', '/messenger');

		const currentRoute = router._currentRoute;

		expect(currentRoute?._pathname).toBe('/messenger');
		expect(window.location.pathname).toBe('/messenger');
		expect(getPageName()).toBe('chats');
	});

	test('go method redirects to /404 when route is missing', () => {
		const router = initRouter();
		const pushStateSpy = jest.spyOn(window.history, 'pushState');

		router.go('/ololo');

		expect(pushStateSpy).toHaveBeenLastCalledWith({}, '', '/404');
		expect(window.location.pathname).toBe('/404');
		expect(getPageName()).toBe('notFound');
	});

	test('start registers popstate handler and renders current location', () => {
		window.history.replaceState({}, '', '/profile');
		const router = initRouter();
		const onRouteSpy = jest.spyOn(router, '_onRoute');

		router.start();

		expect(typeof window.onpopstate).toBe('function');
		expect(onRouteSpy).toHaveBeenCalledWith('/profile');
		expect(getPageName()).toBe('register');
	});
});
