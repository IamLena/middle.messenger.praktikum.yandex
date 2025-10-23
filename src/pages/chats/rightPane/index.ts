import { Block } from '../../../framework/Block';
import { ChatHistory, Compose } from '../../../components';
import css from '../index.module.css';
import { ChatSettings } from './ChatSettings.ts';

export class RightPane extends Block {
	constructor() {
		super({
			chatSettings: new ChatSettings({}),
			chatHistory: new ChatHistory({}),
			compose: new Compose({}),
		});
	}

	override render() {
		return `
		<div class="${css.right} {{class}}">
			{{{ chatSettings }}}
			{{{ chatHistory }}}
			{{{ compose }}}
		</div>
	`;
	}
}
