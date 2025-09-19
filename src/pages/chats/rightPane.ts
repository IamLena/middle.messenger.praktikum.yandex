import { Block } from '../../framework/Block';
import { ChatHistory, Compose } from '../../components';
import css from './index.module.css';

export class RightPane extends Block {
	constructor() {
		super({
			chatHistory: new ChatHistory({}),
			compose: new Compose({}),
		});
	}

	override render() {
		return `
		<div class="${css.right} {{class}}">
			{{{ chatHistory }}}
			{{{ compose }}}
		</div>
	`;
	}
}
