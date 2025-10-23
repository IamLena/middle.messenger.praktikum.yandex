import { Block } from '../../framework/Block';
import { Avatar } from '../Avatar';
import css from './index.module.css';
import { store, StoreEvents } from '../../store/Store.ts';

export type Props = {
	displayName: string;
	firstLine: string;
	time: string;
	avatarSrc?: string;
	isSelected?: boolean;
	isUnread?: boolean;
	// todo - select chat on click
	onClick?: (event: Event) => void;
	class?: string;
	id: number;
};

export class Chat extends Block {
	id: number;

	constructor({ id, avatarSrc, onClick, isSelected, ...props }: Props) {
		const data = store.getState().chats[id];
		const selectedChatId = store.getState().selectedChatId;
		// avatar: null;
		// created_by: 4937;
		// id: 86556;
		// last_message: null; <- tut infa
		// title: 'новый чат';
		// unread_count: 0;
		super({
			...props,
			displayName: data.title,
			isUnread: data.unread_count > 0,
			avatar: new Avatar({ src: data.avatar }),
			events: {
				click: () => {
					store.set('selectedChatId', id);
				},
			},
			isSelected: selectedChatId === id,
		});

		this.id = id;

		store.on(StoreEvents.Updated, () => {
			const chatData = store.getState().chats[id];
			const requiredProps = {
				displayName: chatData.title,
				isUnread: chatData.unread_count > 0,
				// avatar: new Avatar({ src: data.avatar }), ?? update child
				// lastmessage
			};
			this.updateProps(requiredProps);
		});

		store.on(StoreEvents.Updated, () => {
			const selectedChatId = store.getState().selectedChatId;
			this.updateProps({ isSelected: selectedChatId === id });
		});
	}

	override render() {
		return `
			<div class="${css.container} ${this.props.isSelected ? css.selected : ''}">
				{{{ avatar }}}
				<div class="${css.info}">
				<div class="${css.center}">
					<span class="${css.name}">{{ displayName }}</span>
					<span class="${css.message}">{{ firstLine }}</span>
				</div>
				<div class="${css.meta}">
					<span>{{ time }}</span>
					{{#if isUnread}}
						<div class="${css.dot}"></div>
					{{/if}}
				</div>
				</div>
			</div>
		`;
	}
}
