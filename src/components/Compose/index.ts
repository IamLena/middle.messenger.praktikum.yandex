import { Block } from '../../framework/Block';
import { messageValidation } from '../../validation';
import { Form } from '../../components';
import css from './index.module.css';

export type Props = {
	class?: string;
	sendMessage: (text: string) => void;
};

export class Compose extends Block {
	constructor(props: Props) {
		const form = new Form({
			inputData: [
				{
					id: 'message',
					type: 'text',
					name: 'message',
					validate: messageValidation,
					class: css.input,
				},
			],
			btnProps: { text: 'send', class: css.button },
			submit: ({ message }) => props.sendMessage(message),
			resetOnSubmit: true,
			class: css.compose,
		});

		super({
			...props,
			form,
		});
	}

	override render() {
		return `
		{{{form}}}
		`;
	}
}
