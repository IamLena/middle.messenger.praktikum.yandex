import { Block } from '../../framework/Block';
import { messageValidation } from '../../validation';
import { Button } from '../Button';
import { InputLine } from '..';
import css from './index.module.css';

export type Props = {
	class?: string;
};

export class Compose extends Block {
	input: InputLine;

	constructor(props: Props) {
		const button = new Button({
			type: 'sumbit',
			text: 'send',
			onClick: (event) => {
				event.preventDefault();
				event.stopPropagation();
				this.send();
			},
			class: css.button,
		});

		const input = new InputLine({
			id: 'message',
			type: 'text',
			name: 'message',
			validate: messageValidation,
			class: css.input,
		});

		super({
			...props,
			button,
			input,
		});

		this.input = input;
	}

	validate() {
		return this.input.validate();
	}

	send() {
		const data = this.validate();
		console.log('message to send', data);
	}

	override render() {
		return `
			<form class="${css.compose} {{class}}">
				{{{ input }}}
				{{{ button }}}
			</form>
		`;
	}
}
