import { Block } from '../../framework/Block';
import { Avatar } from '../Avatar';
import css from './index.module.css';

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
};

export class Chat extends Block {
	constructor({ avatarSrc, onClick, ...props }: Props) {
		super({
			...props,
			events: {
				click: onClick,
			},
			avatar: new Avatar({ src: avatarSrc }),
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
