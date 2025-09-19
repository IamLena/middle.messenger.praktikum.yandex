import { Block } from '../../framework/Block';
import { type EventsToPass } from '../../framework/EventBus';
import css from './index.module.css';

export type Props = {
	id: string;
	type: string;
	name: string;
	value?: string;
	events?: EventsToPass;
	class?: string;
	validate: (value: string) => string | null;
	autocomplete?: string;
};

export class InputLine extends Block {
	validate: () => string | null;

	constructor(props: Props) {
		super({
			...props,
			events: {
				blur: () => this.validate(),
			},
		});

		this.validate = () => props.validate(this.getValue());
	}

	getValue() {
		return (this.getContent() as HTMLInputElement).value;
	}

	override render() {
		return `
			<input
				class="${css.input} {{class}}"
				type="{{type}}"
				id="{{id}}"
				name="{{name}}"
				value="{{value}}"
				${this.props.autocomplete ? 'autocomplete="{{autocomplete}}"' : ''}
			>
		`;
	}
}
