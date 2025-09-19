import { Block } from '../../framework/Block';
import css from './index.module.css';

export type Props = {
	class?: string;
	src?: string;
};

export class Avatar extends Block {
	constructor(props: Props) {
		super(props);
	}

	override render() {
		if (this.props.src) {
			return `<img class="${css.avatar} {{class}}" src="{{src}}"/>`;
		}
		return `<div class="${css.avatar} {{class}}"/>`;
	}
}
