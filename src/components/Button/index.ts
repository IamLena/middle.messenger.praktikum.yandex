import { Block } from '../../framework/Block';
import css from './index.module.css';

export type Props = {
	text: string;
	onClick?: (event: Event) => void;
	type?: string;
	class?: string;
};

export class Button extends Block {
	constructor({ onClick, ...props }: Props) {
		super({
			...props,
			events: {
				click: onClick,
			},
		});
	}

	override render() {
		return `
			<button class="${css.button} {{class}}" type="{{type}}">
				{{text}}
			</button>
		`;
	}
}
