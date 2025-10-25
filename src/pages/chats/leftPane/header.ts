import { Block } from '../../../framework/Block.ts';
import { Link, Form, Button } from '../../../components';
import css from '../index.module.css';
import { chatController } from '../../../controllers/chatController.ts';
import { store, StoreEvents } from '../../../store/Store.ts';
import { okayValidation } from '../../../validation';

export class LeftPaneHeader extends Block {
	selectedChatId: string | undefined;

	constructor() {
		super({
			profileLink: new Link({
				text: 'profile',
				url: '/settings',
			}),
			createChat: new Form({
				inputData: [
					{
						id: 'new title',
						label: 'new chat title:',
						type: 'text',
						name: 'title',
						validate: okayValidation,
					},
				],
				btnProps: { text: 'create chat' },
				submit: chatController.createChat,
				class: css.form,
			}),
			search: new Form({
				inputData: [
					{
						id: 'search',
						label: 'title to look for:',
						type: 'text',
						name: 'title',
						validate: okayValidation,
					},
				],
				btnProps: { text: 'search' },
				submit: (data) => this.search(data),
				class: css.form,
			}),
		});
	}

	selectChat(id: number) {
		store.set('selectedChatId', id);
	}

	search(data) {
		console.log(data);
		chatController.setCurrentUserChatsToStore(data);
	}

	override render() {
		return `
			<div class="${css.header}">
				{{{ profileLink }}}
				{{{ createChat }}}
				{{{ search }}}
			</div>
		`;
	}
}
