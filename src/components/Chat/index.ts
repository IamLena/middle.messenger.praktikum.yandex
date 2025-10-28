import { Block } from '../../framework/Block';
import { Avatar } from '../Avatar';
import css from './index.module.css';
import { store, StoreEvents } from '../../store/Store.ts';
import { resourceController } from '../../controllers/resourceController';
import type { AppState } from '../../store/types';
import type { RawChat } from '../../types';

export type Props = {
	id: number;
	firstLine?: string;
	time?: string;
	isSelected?: boolean;
	isUnread?: boolean;
	onClick?: (event: Event) => void;
	class?: string;
};

export class Chat extends Block {
	constructor({ id, onClick, isSelected, ...props }: Props) {
		const state = store.getState<AppState>();
		const chatData = state.chats?.[id];
		const selectedChatId = state.selectedChatId;
		const initialSelected =
			typeof isSelected === 'boolean' ? isSelected : selectedChatId === id;

		super({
			...props,
			displayName: chatData?.title ?? '',
			isUnread: Boolean(chatData?.unread_count),
			avatar: new Avatar({ src: chatData?.avatar }),
			events: {
				click: (event: Event) => {
					onClick?.(event);
					store.set('selectedChatId', id);
				},
			},
			isSelected: initialSelected,
		});

		store.on(StoreEvents.Updated, () => {
			const nextState = store.getState<AppState>();
			const selectedId = nextState.selectedChatId;
			this.updateProps({ isSelected: selectedId === id });

			const updatedChat = nextState.chats?.[id] as RawChat | undefined;
			if (updatedChat) {
				this.updateProps({
					displayName: updatedChat.title,
					isUnread: updatedChat.unread_count > 0,
				});
				this.children.avatar.updateProps({
					src: updatedChat.avatar
						? resourceController.getSrc(updatedChat.avatar)
						: undefined,
				});
			}
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
