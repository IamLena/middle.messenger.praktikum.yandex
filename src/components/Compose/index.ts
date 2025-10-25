import { Block } from '../../framework/Block';
import { messageValidation } from '../../validation';
import { Button } from '../Button';
import { InputLine } from '..';
import css from './index.module.css';
import { store, StoreEvents } from '../../store/Store';

export type Props = {
	class?: string;
	sendMessage: (text: string) => void;
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
				props.sendMessage('message from petya');
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

	override render() {
		return `
			<form class="${css.compose} {{class}}">
				{{{ input }}}
				{{{ button }}}
			</form>
		`;
	}
}
