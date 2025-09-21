import { Block } from '../../framework/Block';
import { Link, Chat } from '../../components';
import css from './index.module.css';

export class LeftPane extends Block {
	constructor() {
		super({
			profileLink: new Link({
				text: 'profile',
				url: '#',
			}),
			chats: [
				new Chat({
					displayName: 'Display name',
					firstLine:
						'here is some text a lot of text here hello hello!',
					time: '11:30',
				}),
				new Chat({
					displayName: 'Marina',
					firstLine: 'pupupu :)',
					time: '13:00',
					isUnread: true,
				}),
				new Chat({
					displayName: 'Vasya Pupkin',
					firstLine: 'firstline text',
					time: '20.05.2020',
					isSelected: true,
				}),
			],
		});
	}

	override render() {
		return `
			<div class="${css.left}">
				<div class="${css.header}">
					{{{ profileLink }}}
				</div>
				{{{ chats }}}
			</div>
		`;
	}
}
