import { Block, type BlockClass } from './Block';

const getPathname = (url: string) =>
	(url || '/')
		.replace(/^(https?:\/\/[^\/]+)?/, '')
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
		if (this._block) {
			this._block.hide();
		}
	}

	match(pathname: string) {
		// return isEqual(pathname, this._pathname);
		// parse it!
		return pathname === this._pathname;
	}

	render() {
		if (!this._block) {
			this._block = new this._blockClass();
			render(this._block, this._props.rootSelector);
			return;
		}

		this._block.show();
	}
}

export class Router {
	private static __instance: Router;
	routes: Route[] = [];
	rootSelector: string = '';
	history: History | null = null;
	_currentRoute: Route | null = null;

	constructor(rootSelector?: string) {
		if (Router.__instance) {
			return Router.__instance;
		}

		if (rootSelector) {
			this.routes = [];
			this.history = window.history;
			this._currentRoute = null;
			this.rootSelector = rootSelector;
			Router.__instance = this;
		} else {
			throw new Error('To initialize requires a selector');
		}
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
		// check for loged in?
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
		// here passing url with query
		this.history.pushState({}, '', pathname);
		// here should pass and add query logic
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
