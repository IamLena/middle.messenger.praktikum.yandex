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
	setValidationError?: (error: string) => void;
};

export class InputLine extends Block {
	constructor(props: Props) {
		super({
			...props,
			events: {
				blur: () => this.validate(),
			},
			isInvalid: false,
		});
	}

	validate() {
		const { value, isValid, error } = this.props.validate(this.getValue());
		this.props.value = value;
		this.props.isInvalid = !isValid;
		if (this.props.setValidationError) {
			this.props.setValidationError(error);
		}
		return isValid ? value : null;
	}

	getValue() {
		return (this.getContent() as HTMLInputElement).value;
	}

	override render() {
		return `
			<input
				class="${css.input} {{class}} ${this.props.isInvalid ? css.invalid : ''}"
				type="{{type}}"
				id="{{id}}"
				name="{{name}}"
				value="{{value}}"
				${this.props.autocomplete ? 'autocomplete="{{autocomplete}}"' : ''}
			>
		`;
	}
}
