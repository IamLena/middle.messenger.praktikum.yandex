import { Block } from '../../framework/Block';
import css from './index.module.css';
import { LeftPane } from './leftPane/index.ts';
import { RightPane } from './rightPane/index.ts';

export class ChatsPage extends Block {
	constructor() {
		super({
			leftPane: new LeftPane(),
			rightPane: new RightPane(),
		});
	}

	override render() {
		return `
			<div class="${css.container}">
				{{{ leftPane }}}
				{{{ rightPane }}}
			</div>
		`;
	}
}
