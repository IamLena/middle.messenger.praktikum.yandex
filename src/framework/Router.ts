import { Block, type BlockClass } from './Block';

const getPathname = (url: string) =>
	(url || '/')
		.replace(/^(https?:\/\/[^/]+)?/, '')
		.split(/[?#]/)[0]
		.replace(/^(?!\/)/, '/') || '/';

const render = (view: Block, rootSelector: string) => {
	const rootElement = document.querySelector(rootSelector);
	if (rootElement) {
		rootElement.replaceChildren(view.getContent());
	}
	return rootElement;
};

type Props = {
	rootSelector: string;
};

export class Route {
	_pathname: string;
	_blockClass: BlockClass;
	_block: Block | null;
	_props: Props;

	constructor(pathname: string, view: BlockClass, props: Props) {
		this._pathname = getPathname(pathname);
		this._blockClass = view;
		this._block = null;
		this._props = props;
	}

	navigate(pathname: string) {
		if (this.match(pathname)) {
			this._pathname = pathname;
			this.render();
		}
	}

	leave() {
		// some saving logic before leaving the page may be here
	}

	match(pathname: string) {
		return pathname === this._pathname;
	}

	render() {
		this._block = new this._blockClass();
		// loading?
		render(this._block, this._props.rootSelector);
		return;
	}
}

export class Router {
	private static __instance: Router;
	routes: Route[] = [];
	rootSelector: string = '';
	history!: History;
	_currentRoute: Route | null = null;

	constructor(rootSelector?: string) {
		if (Router.__instance) {
			return Router.__instance;
		}

		if (!rootSelector) {
			throw new Error('To initialize requires a selector');
		}

		this.routes = [];
		this.history = window.history;
		this._currentRoute = null;
		this.rootSelector = rootSelector;
		Router.__instance = this;
	}

	initPages(config: Record<string, BlockClass>): void {
		Object.entries(config).forEach(([path, view]) => {
			this.use(path, view);
		});
	}

	use(pathname: string, block: BlockClass) {
		const route = new Route(pathname, block, {
			rootSelector: this.rootSelector,
		});
		this.routes.push(route);
		return this;
	}

	start() {
		window.onpopstate = () => {
			this._onRoute(window.location.pathname);
		};
		this._onRoute(window.location.pathname);
	}

	async _onRoute(pathname: string) {
		const route = this.getRoute(pathname);
		if (!route) {
			this.go('/404');
			return;
		}

		if (this._currentRoute) {
			this._currentRoute.leave();
		}

		this._currentRoute = route;
		route.render();
	}

	go(pathname: string) {
		this.history.pushState({}, '', pathname);
		this._onRoute(getPathname(pathname));
	}

	back() {
		this.history.back();
	}

	forward() {
		this.history.forward();
	}

	getRoute(pathname: string) {
		return this.routes.find((route) => route.match(pathname));
	}
}
