import { resourceController } from '../../controllers/resourceController';
import { Block } from '../../framework/Block';
import css from './index.module.css';

export type Props = {
	class?: string;
	src?: string;
};

export class Avatar extends Block {
	constructor({ src, ...props }: Props) {
		super({
			src: src ? resourceController.getSrc(src) : undefined,
			...props,
		});
	}

	override render() {
		return `
			{{#if src}}
				<img alt="avatar" class="${css.avatar} {{class}}" src="{{src}}"/>
			{{else}}
				<div class="${css.avatar} {{class}}"/>
			{{/if}}
		`;
	}
}
