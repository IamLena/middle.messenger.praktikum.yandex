import { Block } from '../../framework/Block';
import css from './index.module.css';

export type Props = {
	text: string;
	mine?: boolean;
	class?: string;
};

export class Message extends Block {
	constructor(props: Props) {
		super(props);
	}

	override render() {
		return `
			<div class="{{class}} ${css.message} ${this.props.mine ? css.mine : ''}">
				{{ text }}
			</div>
		`;
	}
}
