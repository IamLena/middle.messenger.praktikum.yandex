import { Block } from '../../framework/Block';
import { LoginPage, RegisterPage, ProfilePage, ChatsPage } from '../../pages';
import { Link, ErrorMessage } from '..';
import css from './index.module.css';

const pageIds = ['login', 'register', 'profile', 'chats', 'notFound', 'fatal'];

export class CurrentPage extends Block {
	constructor() {
		const pagesLinks = pageIds.map(
			(pageId) =>
				new Link({
					text: pageId,
					class: css.link,
					onClick: (event) => {
						event.preventDefault();
						this.changeCurrentPage(pageId);
						// this trigers rerender, not child change
						this.props.pageId = pageId;
					},
				})
		);
		super({
			pagesLinks,
			pageContent: new LoginPage(),
			pageId: 'login',
		});
	}

	changeCurrentPage(pageId: string) {
		let newContent: Block | null = null;

		switch (pageId) {
			case 'login':
				newContent = new LoginPage();
				break;
			case 'register':
				newContent = new RegisterPage();
				break;
			case 'profile':
				newContent = new ProfilePage();
				break;
			case 'notFound':
				newContent = new ErrorMessage({
					code: 404,
					message: 'page is not found',
					linkData: {
						text: 'back to chats',
						onClick: (event) => {
							event.preventDefault();
							event.stopPropagation();
						},
					},
				});
				break;
			case 'fatal':
				newContent = new ErrorMessage({
					code: 500,
					message: 'internal error',
				});
				break;
			case 'chats':
				newContent = new ChatsPage();
				break;
		}

		if (newContent) {
			this.children.pageContent = newContent;
		}
	}

	override render() {
		return `
        <div class="{{${css.content}}}">
          <nav class="${css.menu}">
              {{{ pagesLinks }}}
          </nav>
          {{{ pageContent }}}
        </div>
    `;
	}
}
