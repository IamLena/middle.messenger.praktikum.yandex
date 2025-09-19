import { Block } from '../../framework/Block';
import css from './index.module.css';

export type Props = {
	text: string;
	url?: string;
	onClick?: (event: Event) => void;
	class?: string;
};

export class Link extends Block {
	constructor({ onClick, ...props }: Props) {
		super({
			events: {
				click: onClick,
			},
			...props,
		});
	}

	override render() {
		return `<a href="{{url}}" class="${css.link} {{class}}">{{text}}</a>`;
	}
}
