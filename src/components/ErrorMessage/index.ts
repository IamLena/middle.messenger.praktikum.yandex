import { Block } from '../../framework/Block';
import { Link, type LinkProps } from '..';
import css from './index.module.css';

export type Props = {
	message: string;
	code: number;
	linkData?: LinkProps;
	class?: string;
};

export class ErrorMessage extends Block {
	constructor({ linkData, ...props }: Props) {
		super({
			...props,
			link: linkData ? new Link(linkData) : undefined,
		});
	}

	override render() {
		return `
			<div class="${css.container} {{class}}">
			<div class="${css.error}">
				<span class="${css.code}">{{code}}</span>
				<span class="${css.message}">{{message}}</span>
				{{{ link }}}
			</div>
			</div>
		`;
	}
}
