import { Block } from '../../framework/Block';
import { Message } from '..';
import css from './index.module.css';

export type Props = {
	// perhapse here should be chatId to get data from inside
	class?: string;
};

export class ChatHistory extends Block {
	constructor(props: Props) {
		super({
			...props,
			messages: [
				new Message({
					text: 'hello there',
					mine: false,
				}),
				new Message({
					text: `
						some log long long long
						very very long very much looooooooong
						message some log long long long very
						very long very much looooooooong message
					`,
					mine: true,
				}),
			],
		});
	}

	override render() {
		return `
			<div class="${css.container} {{class}}">
				{{{ messages }}}
			</div>
		`;
	}
}
