import { Block } from '../../../framework/Block.ts';
import { Link, Form } from '../../../components';
import css from '../index.module.css';
import { chatController } from '../../../controllers/chatController.ts';
import { okayValidation } from '../../../validation';

export class LeftPaneHeader extends Block {
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
				submit: (data) => this.createChat(data),
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

	private createChat(data: Record<string, string>) {
		const title = (data.title ?? '').trim();
		if (title) {
			void chatController.createChat({ title });
		}
	}

	private search(data: Record<string, string>) {
		const title = (data.title ?? '').trim();
		chatController.setCurrentUserChatsToStore({
			title: title || undefined,
		});
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
