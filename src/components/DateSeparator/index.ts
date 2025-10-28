import { Block } from '../../framework/Block';
import css from './index.module.css';

export type Props = {
	date: string;
};

export class DateSeparator extends Block {
	constructor(props: Props) {
		super(props);
	}

	override render() {
		return `
			<div class="${css.date}">
				{{ date }}
			</div>
		`;
	}
}
